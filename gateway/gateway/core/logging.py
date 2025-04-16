import logging
import sys
import json
import datetime


class JSONFormatter(logging.Formatter):
    def __init__(self, *args, **kwargs):
        self.include_request_id = kwargs.pop('include_request_id', True)
        super().__init__(*args, **kwargs)

    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.datetime.now(datetime.UTC).isoformat(),
            "level": record.levelname,
            "name": record.name,
            "message": record.getMessage(),
        }

        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        if self.include_request_id and hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id

        for key, value in record.__dict__.items():
            if key not in {
                "args", "asctime", "created", "exc_info", "exc_text", "filename",
                "funcName", "id", "levelname", "levelno", "lineno", "module",
                "msecs", "message", "msg", "name", "pathname", "process",
                "processName", "relativeCreated", "stack_info", "thread", "threadName",
                "request_id"
            }:
                log_data[key] = value

        return json.dumps(log_data)


class RequestIDFilter(logging.Filter):
    def __init__(self, request_id: str | None = None):
        super().__init__()
        self.request_id = request_id

    def filter(self, record: logging.LogRecord) -> bool:
        if self.request_id:
            record.request_id = self.request_id
        return True


def configure_logging(
    level: int = logging.INFO,
    json_format: bool = False,
    include_request_id: bool = True
) -> None:
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    handler = logging.StreamHandler(sys.stdout)

    if json_format:
        formatter = JSONFormatter(include_request_id=include_request_id)
    else:
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

    handler.setFormatter(formatter)

    root_logger.addHandler(handler)

    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.WARNING)


def get_request_logger(request_id: str, logger_name: str = "api_gateway") -> logging.Logger:
    logger = logging.getLogger(logger_name)

    for filter in logger.filters[:]:
        if isinstance(filter, RequestIDFilter):
            logger.removeFilter(filter)

    logger.addFilter(RequestIDFilter(request_id))

    return logger
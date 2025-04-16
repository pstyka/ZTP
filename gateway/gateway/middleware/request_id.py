import time
import uuid
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from gateway.core.logging import get_request_logger
from fastapi import Request, Response

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id

        req_logger = get_request_logger(request_id)

        start_time = time.time()
        req_logger.info(f"Request started: {request.method} {request.url.path}")

        try:
            response = await call_next(request)

            process_time = time.time() - start_time

            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.4f}"

            req_logger.info(
                f"Request completed: {request.method} {request.url.path} "
                f"{response.status_code} {process_time:.4f}s"
            )

            return response

        except Exception as e:
            process_time = time.time() - start_time

            req_logger.exception(
                f"Request failed: {request.method} {request.url.path} "
                f"Error: {str(e)} {process_time:.4f}s"
            )
            raise
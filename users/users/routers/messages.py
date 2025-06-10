from fastapi import Depends, APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Request
import json
import logging
from sqlalchemy.orm import Session
from users.database import get_db
from users.models import User, Message
from users.schemas import MessageResponse, MessageCreate
from users.utils.connection_manager import manager
from uuid import UUID

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, db: Session = Depends(get_db)):
    logger.info(f"=== WEBSOCKET START dla user_id: {user_id} ===")

    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            logger.info(f"Otrzymano: {message_data}")

            user_count = db.query(User).count()
            logger.info(f"Liczba userow w bazie: {user_count}")

            sender = db.query(User).filter(User.id == UUID(user_id)).first()
            logger.info(f"Sender znaleziony: {sender is not None}")

            if sender:
                logger.info(f"Sender: {sender.first_name} {sender.last_name}")
            else:
                logger.error(f"SENDER NIE ZNALEZIONY dla UUID: {user_id}")
                sample_users = db.query(User).limit(5).all()
                logger.info(f"Przykladowi userzy: {[(str(u.id), u.first_name) for u in sample_users]}")

            receiver = db.query(User).filter(User.id == UUID(message_data['receiver_id'])).first()
            logger.info(f"Receiver znaleziony: {receiver is not None}")

            if not sender:
                await websocket.send_text(json.dumps({"error": f"Sender not found: {user_id}"}))
                continue

            if not receiver:
                await websocket.send_text(json.dumps({"error": f"Receiver not found: {message_data['receiver_id']}"}))
                continue

            db_message = Message(
                sender_id=UUID(user_id),
                receiver_id=UUID(message_data['receiver_id']),
                content=message_data['content']
            )
            db.add(db_message)
            db.commit()
            db.refresh(db_message)

            response_data = {
                "id": str(db_message.id),
                "sender_id": str(db_message.sender_id),
                "receiver_id": str(db_message.receiver_id),
                "sender_name": f"{sender.first_name} {sender.last_name}",
                "receiver_name": f"{receiver.first_name} {receiver.last_name}",
                "content": db_message.content,
                "created_at": db_message.created_at.isoformat()
            }

            await manager.send_message(response_data, str(message_data['receiver_id']))
            await websocket.send_text(json.dumps(response_data))

    except WebSocketDisconnect:
        manager.disconnect(user_id)
        logger.info(f"WebSocket disconnected for user: {user_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        await websocket.send_text(json.dumps({"error": str(e)}))


@router.get("/messages/{user_id}", response_model=list[MessageResponse])
async def get_conversation(
        user_id: str,
        request: Request,
        db: Session = Depends(get_db),
):
    current_user_id = request.headers.get("X-User-ID")
    messages = db.query(Message).filter(
        ((Message.sender_id == UUID(current_user_id)) & (Message.receiver_id == UUID(user_id))) |
        ((Message.sender_id == UUID(user_id)) & (Message.receiver_id == UUID(current_user_id)))
    ).order_by(Message.created_at).all()

    message_responses = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        receiver = db.query(User).filter(User.id == msg.receiver_id).first()

        if sender and receiver:
            message_responses.append(MessageResponse(
                id=msg.id,
                sender_id=msg.sender_id,
                receiver_id=msg.receiver_id,
                sender_name=f"{sender.first_name} {sender.last_name}",
                receiver_name=f"{receiver.first_name} {receiver.last_name}",
                content=msg.content,
                created_at=msg.created_at
            ))

    return message_responses


@router.get("/conversations", response_model=list[dict])
async def get_conversations(
        request: Request,
        db: Session = Depends(get_db),
):
    current_user_id = request.headers.get("X-User-ID")
    conversations = db.query(Message).filter(
        (Message.sender_id == UUID(current_user_id)) | (Message.receiver_id == UUID(current_user_id))
    ).distinct().all()

    conversation_partners = set()
    for msg in conversations:
        if str(msg.sender_id) == current_user_id:
            conversation_partners.add(msg.receiver_id)
        else:
            conversation_partners.add(msg.sender_id)

    conversation_list = []
    for partner_id in conversation_partners:
        partner = db.query(User).filter(User.id == partner_id).first()
        if partner:
            last_message = db.query(Message).filter(
                ((Message.sender_id == UUID(current_user_id)) & (Message.receiver_id == partner_id)) |
                ((Message.sender_id == partner_id) & (Message.receiver_id == UUID(current_user_id)))
            ).order_by(Message.created_at.desc()).first()

            conversation_list.append({
                "user_id": str(partner.id),
                "user_name": f"{partner.first_name} {partner.last_name}",
                "last_message": last_message.content if last_message else "",
                "last_message_time": last_message.created_at.isoformat() if last_message else "",
            })

    conversation_list.sort(key=lambda x: x["last_message_time"], reverse=True)

    return conversation_list
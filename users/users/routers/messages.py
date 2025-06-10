from fastapi import Depends, APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Request
import json
from sqlalchemy.orm import Session
from users.database import get_db
from users.models import User, Message
from users.schemas import MessageResponse, MessageCreate
from users.utils.connection_manager import manager
from uuid import UUID

router = APIRouter(prefix="/chat", tags=["chat"])


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, db: Session = Depends(get_db)):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            print(f"Raw user_id: '{user_id}' (type: {type(user_id)})")
            print(f"Raw receiver_id: '{message_data['receiver_id']}' (type: {type(message_data['receiver_id'])})")

            all_users = db.query(User).all()
            print(f"All users in DB: {[(str(u.id), u.first_name, u.last_name) for u in all_users]}")

            sender_by_string = db.query(User).filter(User.id == user_id).first()
            print(f"Sender found by string: {sender_by_string}")

            try:
                sender_uuid = UUID(user_id)
                sender_by_uuid = db.query(User).filter(User.id == sender_uuid).first()
                print(f"Sender found by UUID: {sender_by_uuid}")
            except ValueError as e:
                print(f"UUID conversion error: {e}")
                sender_by_uuid = None

            try:
                receiver_uuid = UUID(message_data['receiver_id'])
                receiver_by_uuid = db.query(User).filter(User.id == receiver_uuid).first()
                print(f"Receiver found by UUID: {receiver_by_uuid}")
            except ValueError as e:
                print(f"Receiver UUID conversion error: {e}")
                receiver_by_uuid = None

            sender = sender_by_uuid or sender_by_string
            receiver = receiver_by_uuid

            if not sender:
                await websocket.send_text(json.dumps({"error": f"Sender not found: {user_id}"}))
                continue

            if not receiver:
                await websocket.send_text(json.dumps({"error": f"Receiver not found: {message_data['receiver_id']}"}))
                continue

            db_message = Message(
                sender_id=user_id,
                receiver_id=message_data['receiver_id'],
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
    except json.JSONDecodeError:
        await websocket.send_text(json.dumps({"error": "Invalid JSON"}))
    except Exception as e:
        await websocket.send_text(json.dumps({"error": str(e)}))
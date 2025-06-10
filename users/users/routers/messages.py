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
            print(user_id)
            sender = db.query(User).filter(User.id == user_id).first()
            receiver = db.query(User).filter(User.id == message_data['receiver_id']).first()

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
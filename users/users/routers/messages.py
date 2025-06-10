from fastapi import Depends, APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Request
from sqlalchemy.orm import Session
from users.database import get_db
from users.models import User, Message
from users.schemas import MessageResponse, MessageCreate
from users.utils.connection_manager import manager


router = APIRouter(prefix="/chat", tags=["chat"])


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    print(f"WebSocket connection established for user: {user_id}")
    await manager.connect(websocket, user_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id)


@router.post("/messages", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    current_user_id = request.headers.get("X-User-ID")
    sender = db.query(User).filter(User.id == current_user_id).first()
    receiver = db.query(User).filter(User.id == message.receiver_id).first()

    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")

    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    db_message = Message(
        sender_id=current_user_id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    message_response = MessageResponse(
        id=db_message.id,
        sender_id=db_message.sender_id,
        receiver_id=db_message.receiver_id,
        sender_name=f"{sender.first_name} {sender.last_name}",
        receiver_name=f"{receiver.first_name} {receiver.last_name}",
        content=db_message.content,
        created_at=db_message.created_at
    )

    message_data = {
        "id": str(db_message.id),
        "sender_id": str(db_message.sender_id),
        "receiver_id": str(db_message.receiver_id),
        "sender_name": f"{sender.first_name} {sender.last_name}",
        "receiver_name": f"{receiver.first_name} {receiver.last_name}",
        "content": db_message.content,
        "created_at": db_message.created_at.isoformat()
    }

    await manager.send_message(message_data, str(message.receiver_id))

    return message_response


@router.get("/messages/{user_id}", response_model=list[MessageResponse])
async def get_conversation(
    user_id: str,
    request: Request,
    db: Session = Depends(get_db),
):
    current_user_id = request.headers.get("X-User-ID")
    messages = db.query(Message).filter(
        ((Message.sender_id == current_user_id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user_id))
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
        (Message.sender_id == current_user_id) | (Message.receiver_id == current_user_id)
    ).distinct().all()

    conversation_partners = set()
    for msg in conversations:
        if msg.sender_id == current_user_id:
            conversation_partners.add(msg.receiver_id)
        else:
            conversation_partners.add(msg.sender_id)

    conversation_list = []
    for partner_id in conversation_partners:
        partner = db.query(User).filter(User.id == partner_id).first()
        if partner:
            last_message = db.query(Message).filter(
                ((Message.sender_id == current_user_id) & (Message.receiver_id == partner_id)) |
                ((Message.sender_id == partner_id) & (Message.receiver_id == current_user_id))
            ).order_by(Message.created_at.desc()).first()

            conversation_list.append({
                "user_id": str(partner.id),
                "user_name": f"{partner.first_name} {partner.last_name}",
                "last_message": last_message.content if last_message else "",
                "last_message_time": last_message.created_at.isoformat() if last_message else "",
            })

    conversation_list.sort(key=lambda x: x["last_message_time"], reverse=True)

    return conversation_list
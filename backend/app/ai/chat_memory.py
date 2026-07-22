from app.models.chat_history import ChatHistory


def load_chat_history(db, user_id, application_id, role, limit=10):
    history = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.user_id == user_id,
            ChatHistory.application_id == application_id,
            ChatHistory.role == role,
        )
        .order_by(ChatHistory.created_at.desc())
        .limit(limit)
        .all()
    )

    history.reverse()

    return history


def save_chat_history(
    db,
    user_id,
    role,
    application_id,
    message,
    response,
):
    chat = ChatHistory(
        user_id=user_id,
        role=role,
        application_id=application_id,
        message=message,
        response=response,
    )

    db.add(chat)
    db.commit()

    return chat

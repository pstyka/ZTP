from sqlalchemy.orm import Session
from sqlalchemy import select, update
from users.models import User
from users.schemas import UserCreate, UserUpdate
from users.core.security import get_password_hash, verify_password
from users.repository.base import BaseRepository


class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        return db.execute(select(User).where(User.email == email)).scalars().first()

    def create(self, db: Session, user_in: UserCreate) -> None:
        user_in = UserCreate(
            email=user_in.email,
            password_hash=get_password_hash(user_in.password_hash),
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            phone=user_in.phone
        )

        super().create(db=db, obj_in=user_in)

    def authenticate_user_by_email(self, db: Session, email: str, password: str) -> User | None:
        db_user = self.get_by_email(db, email)
        if not db_user:
            return None
        if not verify_password(password, db_user.password_hash):
            return None
        return db_user

    @staticmethod
    def update_password(db: Session, id: int, new_password: str) -> None:
        hashed_password = get_password_hash(new_password)
        db.execute(
            update(User).where(User.id == id).values({"password": hashed_password})
        )
        db.commit()


user = UserRepository(User)

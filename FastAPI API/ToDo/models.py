from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime
from pydantic import BaseModel


class Base(DeclarativeBase):
    pass

class Tasks(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True)
    task: Mapped[str]
    created: Mapped[datetime] = mapped_column(default = datetime.now)
    status: Mapped[bool]

class ToDoCreate(BaseModel):
    task: str
    created: datetime
    status: bool

class ToDo(ToDoCreate):
    id: int
    
    class Config:
        orm_mode = True

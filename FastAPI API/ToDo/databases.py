from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session, sessionmaker
from datetime import datetime
from pydantic import BaseModel


engine = create_engine('sqlite:///ToDoDB.sqlite')
engine.connect()


SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

class Base(DeclarativeBase):
    pass

class Tasks(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True)
    task: Mapped[str]
    created: Mapped[datetime] = mapped_column(default = datetime.now)
    status: Mapped[bool]



if __name__ == '__main__':
    Base.metadata.create_all(bind=engine)
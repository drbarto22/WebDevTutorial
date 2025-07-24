from pydantic import BaseModel
from datetime import datetime

class TaskUpdate(BaseModel):
    id: int
    task: str
    status: bool
    created: datetime
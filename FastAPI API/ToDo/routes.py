from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, databases


router = APIRouter()


def get_db():
    db = databases.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/todos/')
def create_todos(todo: models.ToDoCreate, db: Session = Depends(get_db)):
    db_todo = models.Tasks(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.get('/todos/all')
def get_all_tasks(db: Session = Depends(get_db)):
    all_todos = db.query(models.Tasks).all()
    if all_todos == None:
        raise HTTPException(status_code=404, detail="Todos Not Found")
    return all_todos

@router.get('/todos/{todo_id}')
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Tasks).filter(models.Tasks.id == todo_id).first()
    if todo == None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.patch('/todos/{todo_id}')
def update_todo(todo_id:int, updated_info: models.ToDoCreate, db: Session = Depends(get_db)):


    from_database = db.query(models.Tasks).filter(models.Tasks.id == todo_id).first()
    if from_database == None:
      raise HTTPException(status_code=404, detail="Todo not found")

    imported_data = updated_info.model_dump(exclude_unset=True)

    for field, value in imported_data.items():
        setattr(from_database, field, value)

    db.add(from_database)
    db.commit()
    db.refresh(from_database)

    return from_database



@router.delete('/todos/{todo_id}')
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Tasks).filter(models.Tasks.id == todo_id).first()
    if todo == None:
        raise HTTPException(status_code=404, detail='Todo not found')
    else:
        db.delete(todo)
        db.commit()
    return todo
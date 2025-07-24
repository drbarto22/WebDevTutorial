from fastapi import FastAPI

from enum import Enum

class ModelName(str, Enum):
    nameone = 'NameOne'
    nametwo = 'NameTwo'
    namethree = "NameThree"

app = FastAPI()

@app.get('/')
async def root():
    return {"message": "hello world"}

@app.get('/{item_id: int}')
async def get_item_id(item_id):
    return {'item_id': item_id}

@app.get('/{model_name}')
async def get_name(model_name: ModelName):
    if model_name is ModelName.nameone:
        return {"model_name": model_name, 'message': "This is option one"}
    elif model_name is ModelName.nametwo:
        return {"model_name": model_name, 'message': "This is option two"}
    else:
        return {"model_name": 'Name DNE', 'message': "This is not an option"}
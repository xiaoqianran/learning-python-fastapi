"""
FastAPI 学习配套示例
运行：uvicorn main:app --reload
文档：http://127.0.0.1:8000/docs
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(
    title="Learning FastAPI Demo",
    description="配套 learning-python-fastapi 的示例 API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Models ----------
class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    tax: Optional[float] = None


class Item(ItemCreate):
    id: int


class ItemOut(BaseModel):
    id: int
    name: str
    price: float
    price_with_tax: Optional[float] = None


# ---------- Fake DB ----------
db: dict[int, Item] = {}
_counter = 0


def get_next_id() -> int:
    global _counter
    _counter += 1
    return _counter


# ---------- Routes ----------
@app.get("/")
def root():
    return {
        "message": "Welcome to Learning FastAPI Demo",
        "docs": "/docs",
        "lessons": "https://github.com/xiaoqianran/learning-python-fastapi",
    }


@app.get("/items/", response_model=list[ItemOut])
def list_items(skip: int = 0, limit: int = 10, q: Optional[str] = None):
    items = list(db.values())
    if q:
        items = [i for i in items if q.lower() in i.name.lower()]
    return [
        ItemOut(
            id=i.id,
            name=i.name,
            price=i.price,
            price_with_tax=(i.price + i.tax) if i.tax else None,
        )
        for i in items[skip : skip + limit]
    ]


@app.post("/items/", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
def create_item(item: ItemCreate):
    item_id = get_next_id()
    new_item = Item(id=item_id, **item.model_dump())
    db[item_id] = new_item
    return ItemOut(
        id=new_item.id,
        name=new_item.name,
        price=new_item.price,
        price_with_tax=(new_item.price + new_item.tax) if new_item.tax else None,
    )


@app.get("/items/{item_id}", response_model=ItemOut)
def read_item(item_id: int):
    if item_id not in db:
        raise HTTPException(status_code=404, detail="Item not found")
    i = db[item_id]
    return ItemOut(
        id=i.id,
        name=i.name,
        price=i.price,
        price_with_tax=(i.price + i.tax) if i.tax else None,
    )


@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int):
    if item_id not in db:
        raise HTTPException(status_code=404, detail="Item not found")
    del db[item_id]


# ---------- Simple auth demo ----------
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.post("/token")
def login():
    """演示用：任何用户名密码都返回固定 token"""
    return {"access_token": "demo-secret-token", "token_type": "bearer"}


async def get_current_user(token: str = Depends(oauth2_scheme)):
    if token != "demo-secret-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": "demo"}


@app.get("/users/me")
async def read_me(user: dict = Depends(get_current_user)):
    return user

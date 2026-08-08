export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number; // index
  explanation?: string;
};

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track: "基础" | "进阶" | "数据验证" | "依赖注入" | "实战" | "工程化";
  minutes: number;
  official?: string;
  blocks: LessonBlock[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "FastAPI 是什么",
    summary: "高性能、现代、易用的 Python Web 框架，基于标准类型提示。",
    level: "入门",
    track: "基础",
    minutes: 8,
    official: "https://fastapi.tiangolo.com/zh/",
    blocks: [
      {
        type: "text",
        title: "为什么选择 FastAPI",
        body: "FastAPI 是一个用于构建 API 的现代、快速（高性能）的 web 框架，基于标准 Python 类型提示。\n\n核心优势：\n- 极速：与 NodeJS 和 Go 相当的性能（基于 Starlette + Pydantic）\n- 快速编码：开发速度提升约 200%~300%\n- 更少 bug：减少约 40% 的人为错误\n- 直观：优秀的编辑器支持，自动补全无处不在\n- 基于标准：完全兼容 OpenAPI（Swagger）和 JSON Schema\n- 自动文档：交互式 API 文档开箱即用",
      },
      {
        type: "code",
        title: "最简单的 FastAPI 应用",
        lang: "python",
        code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}`,
      },
      {
        type: "tip",
        body: "运行：uvicorn main:app --reload。然后访问 http://127.0.0.1:8000/docs 查看自动生成的交互式文档。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "FastAPI 的自动文档默认路径是？",
            options: ["/docs", "/swagger", "/api-docs", "/redoc"],
            answer: 0,
            explanation: "默认 /docs 是 Swagger UI，/redoc 是 ReDoc。",
          },
          {
            id: "q2",
            question: "FastAPI 主要依赖哪两个核心库？",
            options: ["Django + DRF", "Flask + Marshmallow", "Starlette + Pydantic", "Tornado + Cerberus"],
            answer: 2,
            explanation: "Starlette 负责 ASGI web 部分，Pydantic 负责数据验证。",
          },
        ],
      },
    ],
  },
  {
    slug: "path-params",
    title: "路径参数与查询参数",
    summary: "用类型提示声明路径参数和查询参数，自动验证与转换。",
    level: "入门",
    track: "基础",
    minutes: 10,
    official: "https://fastapi.tiangolo.com/zh/tutorial/path-params/",
    blocks: [
      {
        type: "text",
        title: "路径参数",
        body: "路径参数用花括号声明，并在函数参数中用相同名字 + 类型注解接收。FastAPI 会自动解析、验证并转换成对应类型。",
      },
      {
        type: "code",
        title: "路径参数示例",
        lang: "python",
        code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def read_user(user_id: int):
    return {"user_id": user_id}

# 访问 /users/42 → {"user_id": 42}
# 访问 /users/foo → 422 Validation Error`,
      },
      {
        type: "text",
        title: "查询参数",
        body: "函数中未在路径声明的参数会自动成为查询参数。可以设置默认值、可选（None）、必填。",
      },
      {
        type: "code",
        title: "查询参数示例",
        lang: "python",
        code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10, q: str | None = None):
    return {"skip": skip, "limit": limit, "q": q}

# /items/?skip=20&limit=5&q=python`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "路径参数 user_id: int 如果传入非数字，会返回什么状态码？",
            options: ["400", "404", "422", "500"],
            answer: 2,
            explanation: "Pydantic 验证失败返回 422 Unprocessable Entity。",
          },
        ],
      },
    ],
  },
  {
    slug: "request-body",
    title: "请求体与 Pydantic 模型",
    summary: "用 Pydantic BaseModel 定义请求体，自动验证、文档、序列化。",
    level: "入门",
    track: "数据验证",
    minutes: 12,
    official: "https://fastapi.tiangolo.com/zh/tutorial/body/",
    blocks: [
      {
        type: "text",
        title: "Pydantic 模型",
        body: "声明一个继承自 BaseModel 的类，把字段和类型写清楚。FastAPI 会用它：\n1. 读取请求体 JSON\n2. 转换为模型实例\n3. 验证数据\n4. 生成 JSON Schema 文档\n5. 在编辑器中提供自动补全",
      },
      {
        type: "code",
        title: "完整示例",
        lang: "python",
        code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item):
    item_dict = item.model_dump()
    if item.tax is not None:
        price_with_tax = item.price + item.tax
        item_dict.update({"price_with_tax": price_with_tax})
    return item_dict`,
      },
      {
        type: "tip",
        body: "Pydantic v2 使用 model_dump() 而不是 dict()。推荐使用 Python 3.10+ 的 | 联合类型语法。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "下面哪个是正确的可选字段声明？",
            options: [
              "description: str = None",
              "description: Optional[str]",
              "description: str | None = None",
              "以上都可以（推荐最后一种）",
            ],
            answer: 3,
            explanation: "三种都能工作，但 str | None = None 是现代推荐写法。",
          },
        ],
      },
    ],
  },
  {
    slug: "response-model",
    title: "响应模型与状态码",
    summary: "用 response_model 控制返回数据结构，设置状态码。",
    level: "入门",
    track: "数据验证",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "response_model 的作用",
        body: "即使函数返回了更多字段，response_model 会过滤只输出声明的字段。还可以用于：\n- 文档中显示正确的响应 Schema\n- 转换输出数据\n- 添加响应示例",
      },
      {
        type: "code",
        title: "响应模型示例",
        lang: "python",
        code: `from fastapi import FastAPI, status
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    description: str | None = None

class ItemOut(BaseModel):
    name: str
    price: float

@app.post("/items/", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
async def create_item(item: Item):
    return item  # 即使有 description，响应也不会包含它`,
      },
    ],
  },
  {
    slug: "dependency-injection",
    title: "依赖注入系统",
    summary: "FastAPI 最强大的特性之一：可复用、可组合的依赖。",
    level: "进阶",
    track: "依赖注入",
    minutes: 15,
    official: "https://fastapi.tiangolo.com/zh/tutorial/dependencies/",
    blocks: [
      {
        type: "text",
        title: "什么是依赖注入",
        body: "依赖是一个函数（或可调用对象），FastAPI 会在处理请求前执行它，把返回值注入到路径操作函数的参数中。\n\n常见用途：\n- 共享数据库连接\n- 强制用户认证\n- 共享业务逻辑\n- 限流、日志等横切关注点",
      },
      {
        type: "code",
        title: "简单依赖",
        lang: "python",
        code: `from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    return commons`,
      },
      {
        type: "code",
        title: "类作为依赖 + 认证示例",
        lang: "python",
        code: `from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    if token != "secrettoken":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": "demo"}

@app.get("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "Depends 的主要作用是？",
            options: [
              "声明路径参数",
              "把依赖的返回值注入到函数参数",
              "生成 OpenAPI 文档",
              "处理 CORS",
            ],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    slug: "router",
    title: "APIRouter 组织大型项目",
    summary: "用 APIRouter 把路由拆分到多个模块，保持代码整洁。",
    level: "进阶",
    track: "工程化",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "为什么用 APIRouter",
        body: "当应用变大时，把所有路径写在一个文件里会很难维护。APIRouter 允许你把相关端点分组，并统一添加前缀、标签、依赖。",
      },
      {
        type: "code",
        title: "routers/items.py",
        lang: "python",
        code: `from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Not found"}},
)

class Item(BaseModel):
    name: str
    price: float

@router.get("/")
async def list_items():
    return [{"name": "Foo", "price": 42}]

@router.post("/")
async def create_item(item: Item):
    return item

@router.get("/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}`,
      },
      {
        type: "code",
        title: "main.py 挂载",
        lang: "python",
        code: `from fastapi import FastAPI
from routers import items

app = FastAPI()
app.include_router(items.router)

# 也可以加全局前缀
# app.include_router(items.router, prefix="/api/v1")`,
      },
    ],
  },
  {
    slug: "async",
    title: "异步与并发",
    summary: "正确使用 async/await，以及何时该用 def。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "async def vs def",
        body: "FastAPI 对两种路径操作函数都支持：\n\n- async def：适合 I/O 密集型（数据库、HTTP 请求、文件）。FastAPI 会在事件循环中运行。\n- def：适合 CPU 密集型或阻塞库。FastAPI 会放到线程池中运行，避免阻塞事件循环。\n\n规则：如果里面用了 await，就必须用 async def；如果调用的是同步阻塞代码，用普通 def。",
      },
      {
        type: "code",
        title: "异步示例",
        lang: "python",
        code: `import httpx
from fastapi import FastAPI

app = FastAPI()

@app.get("/async-data")
async def get_async_data():
    async with httpx.AsyncClient() as client:
        r = await client.get("https://httpbin.org/get")
        return r.json()

@app.get("/sync-cpu")
def heavy_computation():
    # 模拟 CPU 密集
    total = sum(i * i for i in range(10_000_00))
    return {"result": total}`,
      },
      {
        type: "tip",
        body: "不要在 async def 里调用同步阻塞函数（如 time.sleep、同步 requests），会阻塞整个服务。用 await asyncio.sleep 或 httpx 等异步库。",
      },
    ],
  },
  {
    slug: "middleware-cors",
    title: "中间件与 CORS",
    summary: "添加 CORS、自定义中间件处理请求/响应。",
    level: "进阶",
    track: "工程化",
    minutes: 10,
    blocks: [
      {
        type: "code",
        title: "CORS 中间件（最常用）",
        lang: "python",
        code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`,
      },
      {
        type: "code",
        title: "自定义中间件",
        lang: "python",
        code: `from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    process_time = time.time() - start
    response.headers["X-Process-Time"] = str(process_time)
    return response`,
      },
    ],
  },
  {
    slug: "testing",
    title: "测试 FastAPI 应用",
    summary: "使用 TestClient / httpx 写单元测试与集成测试。",
    level: "实战",
    track: "工程化",
    minutes: 12,
    blocks: [
      {
        type: "code",
        title: "使用 TestClient",
        lang: "python",
        code: `from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/")
async def read_main():
    return {"msg": "Hello World"}

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}`,
      },
      {
        type: "tip",
        body: "TestClient 基于 httpx，支持同步写法。对于需要真实 ASGI 生命周期的场景，可用 httpx.AsyncClient + ASGITransport。",
      },
    ],
  },
  {
    slug: "deploy",
    title: "生产部署入门",
    summary: "Uvicorn + Gunicorn、Docker、环境变量。",
    level: "实战",
    track: "工程化",
    minutes: 15,
    blocks: [
      {
        type: "text",
        title: "推荐生产组合",
        body: "Uvicorn 是 ASGI 服务器。生产环境常用 Gunicorn 作为进程管理器 + UvicornWorker。\n\n命令示例：\ngunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000",
      },
      {
        type: "code",
        title: "简单 Dockerfile",
        lang: "dockerfile",
        code: `FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      },
      {
        type: "tip",
        body: "永远不要在生产使用 --reload。用环境变量管理密钥，用 HTTPS（反向代理如 Caddy / Nginx / Traefik）。",
      },
    ],
  },
];

export const TRACKS = ["基础", "进阶", "数据验证", "依赖注入", "实战", "工程化"] as const;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonsByTrack(track: string): Lesson[] {
  return LESSONS.filter((l) => l.track === track);
}

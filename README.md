# FastAPI 实战学习

交互式中文 **Python FastAPI** 教程：课程 + 测验 + 进度 + 代码示例。

**在线访问（GitHub Pages）：** [https://xiaoqianran.github.io/learning-python-fastapi/](https://xiaoqianran.github.io/learning-python-fastapi/)  
**仓库：** [https://github.com/xiaoqianran/learning-python-fastapi](https://github.com/xiaoqianran/learning-python-fastapi)

参考姊妹项目：[learning-vue3](https://github.com/xiaoqianran/learning-vue3)

---

## 这是什么

面向想系统学习 **FastAPI** 并构建现代 Python API 的同学。内容以「读一点、动手一点、测一点」组织。

你可以：

- 按路径学完核心课程（**讲解 + 对应源码 + 小测验**）
- 用浏览器 **localStorage** 跟踪学习进度
- 复制代码到本地 `uvicorn` 立即运行验证
- 对照官方文档加深理解

---

## 学习路径

| 路径 | 你学到什么 |
|------|------------|
| **基础** | FastAPI 是什么、路径参数、查询参数 |
| **数据验证** | Pydantic 模型、请求体、响应模型 |
| **依赖注入** | Depends、认证、可复用逻辑 |
| **进阶** | 异步、并发、async vs def |
| **工程化** | APIRouter、中间件、CORS、测试、部署 |

建议顺序：基础 → 数据验证 → 依赖注入 → 进阶 → 工程化

---

## 本地运行（前端学习站）

环境：Node 20+ 推荐。

```bash
git clone https://github.com/xiaoqianran/learning-python-fastapi.git
cd learning-python-fastapi
npm install
npm run dev
```

开发服务默认：`http://127.0.0.1:8080`

---

## 配套后端示例

`backend/` 目录提供可直接运行的最小 FastAPI 项目：

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

然后打开 http://127.0.0.1:8000/docs 体验自动文档。

---

## 部署（GitHub Pages + Actions）

推送到 `main` 后，工作流 **Deploy to GitHub Pages** 自动构建并发布。

- Pages 源：**GitHub Actions**
- 站点：https://xiaoqianran.github.io/learning-python-fastapi/
- 也可在 Actions 页手动 **Run workflow**

---

## 技术栈

- **界面：** React 19 + Vite + Tailwind CSS v4
- **路由：** React Router
- **状态：** Zustand（进度持久化）
- **图标：** Lucide

---

## 进度与隐私

- 学习进度、测验得分保存在 **浏览器 localStorage**
- 不上传到服务器；清站点数据会丢失进度

---

## 许可证与声明

- 教程内容用于学习与演示
- FastAPI 相关商标归各自所有者
- 欢迎提 Issue / PR 纠错与补充

---

## 相关链接

- 在线课站：[learning-python-fastapi](https://xiaoqianran.github.io/learning-python-fastapi/)
- 仓库：[xiaoqianran/learning-python-fastapi](https://github.com/xiaoqianran/learning-python-fastapi)
- 姊妹项目：[learning-vue3](https://github.com/xiaoqianran/learning-vue3)
- FastAPI 官方文档：[https://fastapi.tiangolo.com/zh/](https://fastapi.tiangolo.com/zh/)

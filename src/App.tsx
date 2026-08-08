import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { LESSONS, getLesson, TRACKS } from './data/lessons'
import { useProgress } from './store/progress'
import { CodeBlock } from './components/CodeBlock'
import { Quiz } from './components/Quiz'
import { BookOpen, CheckCircle2, Home, RotateCcw, ChevronRight, Code2 } from 'lucide-react'

function Header() {
  const percent = useProgress((s) => s.percent())
  const completedCount = useProgress((s) => s.completedCount())
  const total = useProgress((s) => s.totalCount())

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Code2 className="text-indigo-600" size={22} />
          <span>FastAPI 实战学习</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden sm:flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span>
              {completedCount}/{total}
            </span>
          </div>
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="首页"
          >
            <Home size={18} />
          </Link>
        </div>
      </div>
    </header>
  )
}

function HomePage() {
  const completed = useProgress((s) => s.completed)
  const percent = useProgress((s) => s.percent())
  const reset = useProgress((s) => s.reset)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <section className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Python FastAPI 交互式教程
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          从零掌握现代高性能 Python API 框架。课程 + 代码 + 小测验 + 进度追踪。
          参考{' '}
          <a
            href="https://github.com/xiaoqianran/learning-vue3"
            className="text-indigo-600 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            learning-vue3
          </a>{' '}
          风格打造。
        </p>
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-sm">
          <BookOpen size={16} />
          进度 {percent}% · 已完成 {Object.values(completed).filter(Boolean).length} 课
        </div>
      </section>

      {TRACKS.map((track) => {
        const lessons = LESSONS.filter((l) => l.track === track)
        if (lessons.length === 0) return null
        return (
          <section key={track} className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-indigo-500" />
              {track}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {lessons.map((lesson) => {
                const done = completed[lesson.slug]
                return (
                  <Link
                    key={lesson.slug}
                    to={`/lesson/${lesson.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
                  >
                    <div
                      className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        done
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/40'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}
                    >
                      {done ? <CheckCircle2 size={14} /> : <span className="text-xs">{lessons.indexOf(lesson) + 1}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium group-hover:text-indigo-600 transition-colors truncate">
                          {lesson.title}
                        </h3>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                          {lesson.level}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {lesson.summary}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{lesson.minutes} 分钟</p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0 mt-1"
                    />
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}

      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
        <button
          onClick={() => {
            if (confirm('确定重置所有学习进度？')) reset()
          }}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors"
        >
          <RotateCcw size={14} /> 重置进度
        </button>
      </div>
    </div>
  )
}

function LessonPage() {
  const { slug } = useParams<{ slug: string }>()
  const lesson = getLesson(slug || '')
  const navigate = useNavigate()
  const markComplete = useProgress((s) => s.markComplete)
  const completed = useProgress((s) => s.completed)
  const setLastVisited = useProgress((s) => s.setLastVisited)

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-xl mb-4">课程不存在</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          返回首页
        </Link>
      </div>
    )
  }

  // mark last visited
  if (slug) setLastVisited(slug)

  const idx = LESSONS.findIndex((l) => l.slug === slug)
  const prev = idx > 0 ? LESSONS[idx - 1] : null
  const next = idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link to="/" className="hover:text-indigo-600">
            首页
          </Link>
          <ChevronRight size={14} />
          <span>{lesson.track}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{lesson.summary}</p>
        <div className="flex items-center gap-3 mt-3 text-sm">
          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
            {lesson.level}
          </span>
          <span className="text-slate-500">{lesson.minutes} 分钟</span>
          {completed[lesson.slug] && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 size={14} /> 已完成
            </span>
          )}
        </div>
      </div>

      <article className="prose dark:prose-invert max-w-none space-y-4">
        {lesson.blocks.map((block, i) => {
          if (block.type === 'text') {
            return (
              <div key={i}>
                {block.title && <h2 className="text-xl font-semibold mt-6 mb-2">{block.title}</h2>}
                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                  {block.body}
                </div>
              </div>
            )
          }
          if (block.type === 'code') {
            return <CodeBlock key={i} code={block.code} lang={block.lang} title={block.title} />
          }
          if (block.type === 'tip') {
            return (
              <div
                key={i}
                className="my-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm"
              >
                💡 {block.body}
              </div>
            )
          }
          if (block.type === 'quiz') {
            return <Quiz key={i} questions={block.questions} lessonSlug={lesson.slug} />
          }
          return null
        })}
      </article>

      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          {prev && (
            <button
              onClick={() => navigate(`/lesson/${prev.slug}`)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
            >
              ← {prev.title}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {!completed[lesson.slug] && (
            <button
              onClick={() => markComplete(lesson.slug)}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
            >
              标记完成
            </button>
          )}
          {next && (
            <button
              onClick={() => navigate(`/lesson/${next.slug}`)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              下一课：{next.title} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  // For GitHub Pages, need basename
  const basename = import.meta.env.BASE_URL

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
        </Routes>
        <footer className="max-w-5xl mx-auto px-4 py-8 mt-12 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
          <p>
            参考{' '}
            <a
              href="https://github.com/xiaoqianran/learning-vue3"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              learning-vue3
            </a>{' '}
            · 基于 FastAPI 官方文档 ·{' '}
            <a
              href="https://github.com/xiaoqianran/learning-python-fastapi"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

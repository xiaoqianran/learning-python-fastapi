import { useState } from 'react'
import type { QuizQuestion } from '../data/lessons'
import { useProgress } from '../store/progress'
import { CheckCircle2, XCircle } from 'lucide-react'

type Props = {
  questions: QuizQuestion[]
  lessonSlug: string
}

export function Quiz({ questions, lessonSlug }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const setQuizScore = useProgress((s) => s.setQuizScore)
  const markComplete = useProgress((s) => s.markComplete)

  const handleSelect = (qid: string, idx: number) => {
    if (submitted) return
    setAnswers((a) => ({ ...a, [qid]: idx }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++
    })
    setQuizScore(lessonSlug, correct)
    if (correct === questions.length) {
      markComplete(lessonSlug)
    }
  }

  const score = questions.filter((q) => answers[q.id] === q.answer).length

  return (
    <div className="my-6 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 p-5">
      <h3 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-200">小测验</h3>
      <div className="space-y-6">
        {questions.map((q, qi) => {
          const selected = answers[q.id]
          const isCorrect = selected === q.answer
          return (
            <div key={q.id} className="space-y-2">
              <p className="font-medium">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  let cls =
                    'w-full text-left px-3 py-2 rounded-lg border transition-colors text-sm '
                  if (!submitted) {
                    cls +=
                      selected === oi
                        ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/50'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  } else {
                    if (oi === q.answer) {
                      cls += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    } else if (selected === oi) {
                      cls += 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700'
                    } else {
                      cls += 'border-slate-200 dark:border-slate-700 opacity-60'
                    }
                  }
                  return (
                    <button key={oi} className={cls} onClick={() => handleSelect(q.id, oi)}>
                      {opt}
                    </button>
                  )
                })}
              </div>
              {submitted && q.explanation && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-start gap-1.5">
                  {isCorrect ? (
                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                  )}
                  {q.explanation}
                </p>
              )}
            </div>
          )
        })}
      </div>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="mt-5 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          提交答案
        </button>
      ) : (
        <div className="mt-5 p-3 rounded-lg bg-white dark:bg-slate-800 border">
          <p className="font-medium">
            得分：{score} / {questions.length}
            {score === questions.length && ' 🎉 全部正确！已标记完成'}
          </p>
        </div>
      )}
    </div>
  )
}

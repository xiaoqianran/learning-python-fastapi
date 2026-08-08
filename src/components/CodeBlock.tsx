import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Props = {
  code: string
  lang?: string
  title?: string
}

export function CodeBlock({ code, lang = 'python', title }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{lang}</span>
          {title && <span className="text-sm text-slate-300">· {title}</span>}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}

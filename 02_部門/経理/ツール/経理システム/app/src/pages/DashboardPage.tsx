import { useEffect, useState } from 'react'
import { formatCurrency } from '../lib/format'
import { supabase } from '../lib/supabase'
import type { JournalEntry } from '../types/database'

const ACCOUNT_NAMES: Record<string, string> = {
  '100': '普通預金', '120': '売掛金', '130': '事業主貸', '200': '事業主借',
  '400': '売上高', '500': '外注費', '510': '通信費', '520': '旅費交通費',
  '530': '消耗品費', '540': '新聞図書費', '545': '会議費', '550': '接待交際費',
  '560': '地代家賃', '570': '水道光熱費', '580': '租税公課', '900': '雑費',
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`
    const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`

    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .gte('date', startOfMonth)
      .lte('date', endOfMonth)
      .order('date', { ascending: false })

    setEntries(data || [])
    setLoading(false)
  }

  const sales = entries
    .filter((e) => e.credit_account === '400')
    .reduce((sum, e) => sum + e.credit_amount, 0)

  const expenses = entries
    .filter((e) => {
      const code = parseInt(e.debit_account)
      return code >= 500 && code <= 999
    })
    .reduce((sum, e) => sum + e.debit_amount, 0)

  const unpaid = entries
    .filter((e) => e.debit_account === '120')
    .reduce((sum, e) => sum + e.debit_amount, 0)

  const stats = [
    { label: '今月の売上', value: sales, color: 'text-green-600' },
    { label: '今月の経費', value: expenses, color: 'text-red-600' },
    { label: '差引利益', value: sales - expenses, color: 'text-blue-600' },
    { label: '未入金', value: unpaid, color: 'text-orange-600' },
  ]

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">ダッシュボード</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-2 ${s.color}`}>
              {loading ? '...' : formatCurrency(s.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">最近の取引</h3>
        {loading ? (
          <p className="text-gray-400 text-sm">読み込み中...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-400 text-sm">今月の取引はまだありません。</p>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="md:hidden space-y-3">
              {entries.slice(0, 10).map((e) => (
                <div key={e.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-400">{e.date}</span>
                    <span className="font-mono font-bold text-sm">{formatCurrency(e.debit_amount)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-[10px]">
                      {ACCOUNT_NAMES[e.debit_account] || e.debit_account}
                    </span>
                    <span className="text-gray-300 text-xs">/</span>
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">
                      {ACCOUNT_NAMES[e.credit_account] || e.credit_account}
                    </span>
                  </div>
                  {e.description && (
                    <p className="text-xs text-gray-500 truncate">{e.description}</p>
                  )}
                </div>
              ))}
            </div>
            {/* Desktop: table */}
            <table className="hidden md:table w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-2 font-medium">日付</th>
                  <th className="pb-2 font-medium">借方</th>
                  <th className="pb-2 font-medium text-right">金額</th>
                  <th className="pb-2 font-medium">貸方</th>
                  <th className="pb-2 font-medium">摘要</th>
                </tr>
              </thead>
              <tbody>
                {entries.slice(0, 10).map((e) => (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="py-2 text-sm">{e.date}</td>
                    <td className="py-2 text-sm">
                      <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs">
                        {ACCOUNT_NAMES[e.debit_account] || e.debit_account}
                      </span>
                    </td>
                    <td className="py-2 text-sm text-right font-mono">{formatCurrency(e.debit_amount)}</td>
                    <td className="py-2 text-sm">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                        {ACCOUNT_NAMES[e.credit_account] || e.credit_account}
                      </span>
                    </td>
                    <td className="py-2 text-sm text-gray-600 truncate max-w-[200px]">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}

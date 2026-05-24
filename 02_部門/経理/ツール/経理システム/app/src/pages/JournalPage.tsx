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

const SOURCE_LABELS: Record<string, string> = {
  receipt: '領収書',
  bank: '銀行',
  invoice: '請求書',
  manual: '手動',
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .order('date', { ascending: false })

    setEntries(data || [])
    setLoading(false)
  }

  const debitTotal = entries.reduce((sum, e) => sum + e.debit_amount, 0)
  const creditTotal = entries.reduce((sum, e) => sum + e.credit_amount, 0)

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">仕訳帳</h2>
        <div className="flex gap-3 text-xs md:text-sm">
          <span className="text-gray-500">
            借方: <span className="font-mono font-bold text-gray-800">{formatCurrency(debitTotal)}</span>
          </span>
          <span className="text-gray-500">
            貸方: <span className="font-mono font-bold text-gray-800">{formatCurrency(creditTotal)}</span>
          </span>
          <span className={`font-bold ${debitTotal === creditTotal ? 'text-green-600' : 'text-red-600'}`}>
            {debitTotal === creditTotal ? '一致' : '不一致'}
          </span>
        </div>
      </div>

      {/* Mobile: card layout */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">読み込み中...</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">仕訳データがありません。</p>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500">{e.date}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                  {SOURCE_LABELS[e.source] || e.source}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs">
                  {ACCOUNT_NAMES[e.debit_account] || e.debit_account}
                </span>
                <span className="text-gray-400 text-xs">/</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                  {ACCOUNT_NAMES[e.credit_account] || e.credit_account}
                </span>
                <span className="ml-auto font-mono font-bold text-sm">{formatCurrency(e.debit_amount)}</span>
              </div>
              {e.description && (
                <p className="text-xs text-gray-500 truncate">{e.description}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="px-4 py-3 font-medium">日付</th>
              <th className="px-4 py-3 font-medium">借方</th>
              <th className="px-4 py-3 font-medium text-right">借方金額</th>
              <th className="px-4 py-3 font-medium">貸方</th>
              <th className="px-4 py-3 font-medium text-right">貸方金額</th>
              <th className="px-4 py-3 font-medium">摘要</th>
              <th className="px-4 py-3 font-medium">ソース</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">読み込み中...</td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">仕訳データがありません。</td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{e.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs">
                      {ACCOUNT_NAMES[e.debit_account] || e.debit_account}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">{formatCurrency(e.debit_amount)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                      {ACCOUNT_NAMES[e.credit_account] || e.credit_account}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">{formatCurrency(e.credit_amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{e.description}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                      {SOURCE_LABELS[e.source] || e.source}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

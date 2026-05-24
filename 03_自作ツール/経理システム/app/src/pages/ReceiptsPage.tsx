import { useState, useEffect } from 'react'
import { Camera, Keyboard, Loader2 } from 'lucide-react'
import { formatCurrency, generateReceiptId, toISODate } from '../lib/format'
import { supabase } from '../lib/supabase'
import type { Receipt, AutoRule } from '../types/database'

const ACCOUNTS = [
  { code: '510', name: '通信費' },
  { code: '520', name: '旅費交通費' },
  { code: '530', name: '消耗品費' },
  { code: '540', name: '新聞図書費' },
  { code: '545', name: '会議費' },
  { code: '550', name: '接待交際費' },
  { code: '560', name: '地代家賃' },
  { code: '570', name: '水道光熱費' },
  { code: '500', name: '外注費' },
  { code: '580', name: '租税公課' },
  { code: '900', name: '雑費' },
]

type Confidence = 'high' | 'medium' | 'low'

interface OcrResult {
  date: string | null
  store: string | null
  amount: number | null
  tax: number | null
  items: string | null
  item_count: number | null
  confidence: {
    date: Confidence
    store: Confidence
    amount: Confidence
    items: Confidence
  }
}

function matchAutoRule(store: string, items: string, itemCount: number, rules: AutoRule[]): string | null {
  for (const rule of rules) {
    const patterns = rule.match_pattern.split('|')
    const text = `${store} ${items}`
    const matched = patterns.some((p) => text.includes(p))
    if (!matched) continue

    if (rule.account_rule === 'cafe') {
      return itemCount >= 2 ? '550' : '545'
    }
    if (rule.account_code) {
      return rule.account_code
    }
  }
  return null
}

function confidenceStyle(level: Confidence) {
  if (level === 'low') return 'ring-2 ring-red-300 bg-red-50'
  if (level === 'medium') return 'ring-2 ring-yellow-300 bg-yellow-50'
  return ''
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [rules, setRules] = useState<AutoRule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [confidence, setConfidence] = useState<OcrResult['confidence'] | null>(null)
  const [form, setForm] = useState({
    date: toISODate(new Date()),
    store: '',
    amount: '',
    tax: '',
    items: '',
    account_code: '530',
    memo: '',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchReceipts()
    fetchRules()
  }, [])

  const fetchReceipts = async () => {
    const { data } = await supabase
      .from('receipts')
      .select('*')
      .order('date', { ascending: false })
    setReceipts(data || [])
    setLoading(false)
  }

  const fetchRules = async () => {
    const { data } = await supabase.from('auto_rules').select('*')
    setRules(data || [])
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = async () => {
      const dataUrl = reader.result as string
      setImagePreview(dataUrl)
      setScanning(true)
      setShowForm(true)
      setConfidence(null)

      // Extract base64 and media_type
      const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/)
      if (!match) {
        setScanning(false)
        return
      }
      const media_type = match[1]
      const image = match[2]

      try {
        const res = await fetch('/api/ocr-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image, media_type }),
        })

        if (!res.ok) {
          const err = await res.json()
          console.error('OCR error:', err)
          setScanning(false)
          return
        }

        const ocr: OcrResult = await res.json()

        // Auto-categorize using rules
        const store = ocr.store || ''
        const items = ocr.items || ''
        const itemCount = ocr.item_count || 1
        const matchedAccount = matchAutoRule(store, items, itemCount, rules)

        setForm({
          date: ocr.date || toISODate(new Date()),
          store,
          amount: ocr.amount != null ? String(ocr.amount) : '',
          tax: ocr.tax != null ? String(ocr.tax) : '',
          items,
          account_code: matchedAccount || '530',
          memo: '',
        })
        setConfidence(ocr.confidence)
      } catch (err) {
        console.error('OCR failed:', err)
      } finally {
        setScanning(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleManualEntry = () => {
    setShowForm(true)
    setImagePreview(null)
    setConfidence(null)
    setForm({
      date: toISODate(new Date()),
      store: '',
      amount: '',
      tax: '',
      items: '',
      account_code: '530',
      memo: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const amount = parseInt(form.amount)
    const tax = form.tax ? parseInt(form.tax) : Math.floor(amount - amount / 1.1)
    const receiptId = generateReceiptId(form.date)

    const receipt: Omit<Receipt, 'created_at'> = {
      id: receiptId,
      date: form.date,
      store: form.store,
      amount,
      tax,
      items: form.items,
      item_count: 1,
      memo: form.memo,
      account_code: form.account_code,
      payment_method: '普通預金',
      status: 'confirmed',
      image_path: null,
    }

    const { error: receiptError } = await supabase.from('receipts').insert(receipt)
    if (receiptError) {
      alert('領収書の保存に失敗しました: ' + receiptError.message)
      setSaving(false)
      return
    }

    const { error: journalError } = await supabase.from('journal_entries').insert({
      date: form.date,
      debit_account: form.account_code,
      debit_amount: amount,
      credit_account: '100',
      credit_amount: amount,
      description: `${form.store}${form.items ? ' ' + form.items : ''}`,
      source: 'receipt',
      receipt_id: receiptId,
    })
    if (journalError) {
      alert('仕訳の保存に失敗しました: ' + journalError.message)
    }

    setForm({ date: toISODate(new Date()), store: '', amount: '', tax: '', items: '', account_code: '530', memo: '' })
    setImagePreview(null)
    setConfidence(null)
    setShowForm(false)
    setSaving(false)
    fetchReceipts()
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">領収書</h2>
      </div>

      {!showForm && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <label className="flex flex-col items-center justify-center gap-2 bg-blue-600 text-white rounded-xl py-6 px-4 cursor-pointer hover:bg-blue-700 transition-colors active:bg-blue-800">
            <Camera size={28} />
            <span className="text-sm font-medium">画像から読取</span>
            <span className="text-xs opacity-75">撮影 / 選択</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={handleManualEntry}
            className="flex flex-col items-center justify-center gap-2 bg-white text-gray-700 rounded-xl py-6 px-4 border-2 border-gray-200 hover:border-blue-300 transition-colors"
          >
            <Keyboard size={28} />
            <span className="text-sm font-medium">手動入力</span>
            <span className="text-xs text-gray-400">直接入力</span>
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
          {scanning && (
            <div className="flex items-center justify-center gap-3 py-8 text-blue-600">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm font-medium">領収書を読み取り中...</span>
            </div>
          )}

          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="領収書" className="max-h-40 rounded-lg border mx-auto" />
            </div>
          )}

          {!scanning && (
            <>
              {confidence && (
                <p className="text-xs text-gray-500 mb-3">
                  * 赤枠 = 読取不確実（要確認）/ 黄枠 = やや不確実
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm ${confidence ? confidenceStyle(confidence.date) : ''}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">店名</label>
                  <input
                    type="text"
                    value={form.store}
                    onChange={(e) => setForm({ ...form, store: e.target.value })}
                    placeholder="例: タリーズコーヒー"
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm ${confidence ? confidenceStyle(confidence.store) : ''}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">金額（税込）</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="1100"
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm ${confidence ? confidenceStyle(confidence.amount) : ''}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">税額（空欄で自動計算）</label>
                  <input
                    type="number"
                    value={form.tax}
                    onChange={(e) => setForm({ ...form, tax: e.target.value })}
                    placeholder="自動計算"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">勘定科目</label>
                  <select
                    value={form.account_code}
                    onChange={(e) => setForm({ ...form, account_code: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {ACCOUNTS.map((a) => (
                      <option key={a.code} value={a.code}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">品目</label>
                  <input
                    type="text"
                    value={form.items}
                    onChange={(e) => setForm({ ...form, items: e.target.value })}
                    placeholder="例: アイスコーヒー"
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm ${confidence ? confidenceStyle(confidence.items) : ''}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
                  <input
                    type="text"
                    value={form.memo}
                    onChange={(e) => setForm({ ...form, memo: e.target.value })}
                    placeholder="例: クライアント打ち合わせ"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  {saving ? '保存中...' : '登録'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setImagePreview(null); setConfidence(null) }}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm"
                >
                  戻る
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* Mobile: card layout */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">読み込み中...</p>
        ) : receipts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">領収書がありません。</p>
        ) : (
          receipts.map((r) => (
            <div key={r.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">{r.store}</p>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
                <p className="font-mono font-bold text-gray-800">{formatCurrency(r.amount)}</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                  {ACCOUNTS.find((a) => a.code === r.account_code)?.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  r.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {r.status === 'confirmed' ? '確定' : '要確認'}
                </span>
                {r.items && <span className="text-xs text-gray-400">{r.items}</span>}
              </div>
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
              <th className="px-4 py-3 font-medium">店名</th>
              <th className="px-4 py-3 font-medium">品目</th>
              <th className="px-4 py-3 font-medium text-right">金額</th>
              <th className="px-4 py-3 font-medium">科目</th>
              <th className="px-4 py-3 font-medium">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">読み込み中...</td>
              </tr>
            ) : receipts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                  領収書がありません。
                </td>
              </tr>
            ) : (
              receipts.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{r.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.store}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{r.items}</td>
                  <td className="px-4 py-3 text-sm text-right font-mono">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                      {ACCOUNTS.find((a) => a.code === r.account_code)?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      r.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {r.status === 'confirmed' ? '確定' : '要確認'}
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

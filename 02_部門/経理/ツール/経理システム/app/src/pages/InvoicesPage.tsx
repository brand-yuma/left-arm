import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Download, ChevronDown } from 'lucide-react'
import { formatCurrency, generateInvoiceId, toISODate } from '../lib/format'
import { supabase } from '../lib/supabase'
import type { Invoice, InvoiceItem } from '../types/database'

const ISSUER = {
  name: '宮崎 裕真',
  trade_name: '左腕',
  postal_code: '〒556-0003',
  address: '大阪府大阪市浪速区恵比寿町西２丁目14-21 サザンパークス505',
  tel: '090-2898-1630',
  email: 'myuma@left-arm.com',
  invoice_registration_number: 'T8810048893339',
  bank: {
    bank_name: '三菱UFJ銀行',
    branch_name: '城東支店(066)',
    account_type: '普通',
    account_number: '0386328',
    account_holder: 'ミヤザキ ユウマ',
  },
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function calcDueDate(issueDate: string): string {
  const d = new Date(issueDate)
  const nextMonth = new Date(d.getFullYear(), d.getMonth() + 2, 0)
  return toISODate(nextMonth)
}

function InvoicePreview({ invoice }: { invoice: Invoice }) {
  return (
    <div className="bg-white p-12" style={{ fontFamily: '"Hiragino Kaku Gothic ProN", sans-serif', width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      <h2 className="text-3xl font-bold text-center tracking-[0.5em] mb-8 border-b-2 border-gray-800 pb-4">請 求 書</h2>
      <div className="text-right text-sm mb-2">請求書番号: {invoice.id}</div>
      <div className="flex justify-between mb-8">
        <div>
          <p className="text-lg font-bold">{invoice.client_name} <span className="font-normal text-base">御中</span></p>
        </div>
        <div className="text-right text-sm">
          <p className="font-bold text-base">{ISSUER.trade_name}</p>
          <p className="font-bold">{ISSUER.name}</p>
          <p>{ISSUER.postal_code}</p>
          <p>{ISSUER.address}</p>
          <p>TEL: {ISSUER.tel}</p>
          <p>Email: {ISSUER.email}</p>
          <p>登録番号: {ISSUER.invoice_registration_number}</p>
        </div>
      </div>
      <div className="flex gap-8 text-sm mb-6">
        <p>発行日: {formatDisplayDate(invoice.issue_date)}</p>
        <p>お支払期限: {formatDisplayDate(invoice.due_date)}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="text-sm text-gray-600">ご請求金額（税込）</p>
        <p className="text-3xl font-bold">{formatCurrency(invoice.total)}</p>
      </div>
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b-2 border-gray-800">
            <th className="text-left py-2">No.</th>
            <th className="text-left py-2">品目・内容</th>
            <th className="text-right py-2">数量</th>
            <th className="text-right py-2">単位</th>
            <th className="text-right py-2">単価</th>
            <th className="text-right py-2">金額</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{i + 1}</td>
              <td className="py-2">{item.description}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">{item.unit}</td>
              <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
              <td className="text-right py-2">{formatCurrency(item.quantity * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td colSpan={5} className="text-right py-2 font-medium">小計</td><td className="text-right py-2">{formatCurrency(invoice.subtotal)}</td></tr>
          <tr><td colSpan={5} className="text-right py-2 font-medium">消費税（10%）</td><td className="text-right py-2">{formatCurrency(invoice.tax)}</td></tr>
          <tr className="border-t-2 border-gray-800"><td colSpan={5} className="text-right py-2 font-bold">合計</td><td className="text-right py-2 font-bold">{formatCurrency(invoice.total)}</td></tr>
        </tfoot>
      </table>
      <div className="border p-4 rounded text-sm">
        <p className="font-bold mb-2">お振込先</p>
        <p>{ISSUER.bank.bank_name} {ISSUER.bank.branch_name}</p>
        <p>{ISSUER.bank.account_type} {ISSUER.bank.account_number}</p>
        <p>口座名義: {ISSUER.bank.account_holder}</p>
      </div>
    </div>
  )
}

function ScaledPreview({ invoice, previewRef }: { invoice: Invoice; previewRef: React.RefObject<HTMLDivElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 32 // padding
      const a4Width = 793.7
      setScale(Math.min(containerWidth / a4Width, 1))
    }
  }, [])

  useEffect(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [updateScale])

  return (
    <div ref={containerRef} className="bg-gray-100 rounded-lg p-4 overflow-hidden">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          height: `${1123 * scale}px`,
        }}
      >
        <div ref={previewRef}>
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </div>
  )
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newInvoiceId, setNewInvoiceId] = useState<string | null>(null)
  const [form, setForm] = useState({
    client_name: '',
    issue_date: toISODate(new Date()),
    due_date: '',
    items: [{ description: '', quantity: 1, unit: '式', unit_price: '' }] as { description: string; quantity: number; unit: string; unit_price: string }[],
  })
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('issue_date', { ascending: false })
    setInvoices(data || [])
    setLoading(false)
  }

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unit: '式', unit_price: '' }] })
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const items = [...form.items]
    items[index] = { ...items[index], [field]: value }
    setForm({ ...form, items })
  }

  const removeItem = (index: number) => {
    if (form.items.length > 1) {
      setForm({ ...form, items: form.items.filter((_, i) => i !== index) })
    }
  }

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const items: InvoiceItem[] = form.items.map((i) => ({
      description: i.description,
      quantity: i.quantity,
      unit: i.unit,
      unit_price: parseInt(i.unit_price),
    }))
    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
    const tax = Math.floor(subtotal * 0.1)
    const dueDate = form.due_date || calcDueDate(form.issue_date)
    const invoiceId = generateInvoiceId(form.issue_date)

    const invoice: Omit<Invoice, 'created_at'> = {
      id: invoiceId,
      client_name: form.client_name,
      issue_date: form.issue_date,
      due_date: dueDate,
      subtotal,
      tax,
      total: subtotal + tax,
      status: 'unpaid',
      items,
      pdf_path: null,
    }

    const { error: invoiceError } = await supabase.from('invoices').insert(invoice)
    if (invoiceError) {
      alert('請求書の保存に失敗しました: ' + invoiceError.message)
      setSaving(false)
      return
    }

    const { error: journalError } = await supabase.from('journal_entries').insert({
      date: form.issue_date,
      debit_account: '120',
      debit_amount: subtotal + tax,
      credit_account: '400',
      credit_amount: subtotal + tax,
      description: `請求書発行 ${form.client_name} ${invoiceId}`,
      source: 'invoice',
      invoice_id: invoiceId,
    })
    if (journalError) {
      alert('仕訳の保存に失敗しました: ' + journalError.message)
    }

    const fullInvoice: Invoice = { ...invoice, created_at: new Date().toISOString() }
    setInvoices([fullInvoice, ...invoices])
    setExpandedId(invoiceId)
    setNewInvoiceId(invoiceId)
    setShowForm(false)
    setSaving(false)
    setForm({ client_name: '', issue_date: toISODate(new Date()), due_date: '', items: [{ description: '', quantity: 1, unit: '式', unit_price: '' }] })
  }

  const handleDownloadPdf = (inv: Invoice) => {
    if (!previewRef.current) return
    const printContent = previewRef.current.innerHTML
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('ポップアップがブロックされました。ブラウザの設定を確認してください。')
      return
    }
    printWindow.document.write(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>請求書 - ${inv.client_name}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    body { font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif; }
    @media print {
      body { margin: 0; padding: 0; }
      @page { size: A4; margin: 10mm; }
    }
  </style>
</head>
<body class="bg-white">${printContent}</body>
<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 300);
  };
<\/script>
</html>`)
    printWindow.document.close()
  }

  const renderInvoiceCard = (inv: Invoice) => {
    const isExpanded = expandedId === inv.id
    const isNew = newInvoiceId === inv.id
    return (
      <div key={inv.id} className="bg-white rounded-lg shadow overflow-hidden">
        <div
          className="p-4 cursor-pointer active:bg-gray-50"
          onClick={() => toggleAccordion(inv.id)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-800">{inv.client_name}</p>
              <p className="text-xs text-gray-500 font-mono">{inv.id}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <p className="font-mono font-bold text-gray-800">{formatCurrency(inv.total)}</p>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">{formatDisplayDate(inv.issue_date)}</span>
            <span className={`px-2 py-0.5 rounded ${
              inv.status === 'paid' ? 'bg-green-50 text-green-700' :
              inv.status === 'overdue' ? 'bg-red-50 text-red-700' :
              'bg-yellow-50 text-yellow-700'
            }`}>
              {inv.status === 'paid' ? '入金済' : inv.status === 'overdue' ? '期限超過' : '未入金'}
            </span>
            {isNew && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">NEW</span>}
          </div>
        </div>
        {isExpanded && (
          <div className="border-t">
            <div className="p-3 flex justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownloadPdf(inv) }}
                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-xs"
              >
                <Download size={14} />
                PDFダウンロード
              </button>
            </div>
            <ScaledPreview invoice={inv} previewRef={previewRef} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">請求書</h2>
        <button
          onClick={() => { setShowForm(!showForm); setExpandedId(null) }}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">請求書を</span>作成
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">クライアント名</label>
              <input
                type="text"
                value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                placeholder="例: 株式会社サンプル"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">発行日</label>
              <input
                type="date"
                value={form.issue_date}
                onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">支払期日（空欄で翌月末）</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">明細</label>
            {form.items.map((item, i) => (
              <div key={i} className="flex flex-wrap gap-2 mb-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  placeholder="品目"
                  className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-16 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  min={1}
                />
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) => updateItem(i, 'unit', e.target.value)}
                  className="w-14 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) => updateItem(i, 'unit_price', e.target.value)}
                  placeholder="単価"
                  className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
                {form.items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 px-2">x</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-blue-600 text-sm hover:underline mt-1">+ 明細を追加</button>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
            >
              {saving ? '保存中...' : '作成'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 md:px-6 py-2 rounded-lg hover:bg-gray-300 text-sm">
              キャンセル
            </button>
          </div>
        </form>
      )}

      {/* Mobile: accordion cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">読み込み中...</p>
        ) : invoices.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">請求書がありません。「作成」から追加してください。</p>
        ) : (
          invoices.map(renderInvoiceCard)
        )}
      </div>

      {/* Desktop: table + accordion preview */}
      <div className="hidden md:block bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="px-4 py-3 font-medium">番号</th>
              <th className="px-4 py-3 font-medium">クライアント</th>
              <th className="px-4 py-3 font-medium">発行日</th>
              <th className="px-4 py-3 font-medium">支払期日</th>
              <th className="px-4 py-3 font-medium text-right">金額</th>
              <th className="px-4 py-3 font-medium">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">読み込み中...</td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                  請求書がありません。「請求書を作成」から追加してください。
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id}>
                  <td colSpan={6} className="p-0">
                    <div
                      className="grid grid-cols-6 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer items-center"
                      onClick={() => toggleAccordion(inv.id)}
                    >
                      <span className="text-sm font-mono">{inv.id}</span>
                      <span className="text-sm font-medium text-gray-800">{inv.client_name}</span>
                      <span className="text-sm">{formatDisplayDate(inv.issue_date)}</span>
                      <span className="text-sm">{formatDisplayDate(inv.due_date)}</span>
                      <span className="text-sm text-right font-mono">{formatCurrency(inv.total)}</span>
                      <span className="text-sm flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          inv.status === 'paid' ? 'bg-green-50 text-green-700' :
                          inv.status === 'overdue' ? 'bg-red-50 text-red-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>
                          {inv.status === 'paid' ? '入金済' : inv.status === 'overdue' ? '期限超過' : '未入金'}
                        </span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${expandedId === inv.id ? 'rotate-180' : ''}`} />
                      </span>
                    </div>
                    {expandedId === inv.id && (
                      <div className="border-b bg-gray-50 p-4">
                        <div className="flex justify-end mb-3">
                          <button
                            onClick={() => handleDownloadPdf(inv)}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                          >
                            <Download size={16} />
                            PDFダウンロード
                          </button>
                        </div>
                        <ScaledPreview invoice={inv} previewRef={previewRef} />
                      </div>
                    )}
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

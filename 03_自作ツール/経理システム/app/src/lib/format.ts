export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    month: '2-digit',
    day: '2-digit',
  });
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateReceiptId(date: string): string {
  const d = date.replace(/-/g, '');
  const rand = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `rcpt-${d}-${rand}`;
}

export function generateInvoiceId(date: string): string {
  const d = new Date(date);
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const rand = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `INV-${ym}-${rand}`;
}

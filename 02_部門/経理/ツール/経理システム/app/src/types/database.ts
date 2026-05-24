export interface Account {
  code: string;
  name: string;
  category: '資産' | '負債' | '収益' | '経費';
}

export interface AutoRule {
  id: string;
  match_pattern: string;
  account_code: string | null;
  account_rule: string | null;
  confirm: boolean;
}

export interface Receipt {
  id: string;
  date: string;
  store: string;
  amount: number;
  tax: number;
  items: string;
  item_count: number;
  memo: string;
  account_code: string;
  payment_method: string;
  status: 'confirmed' | 'pending_review';
  image_path: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  client_name: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'unpaid' | 'paid' | 'overdue';
  items: InvoiceItem[];
  pdf_path: string | null;
  created_at: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  debit_account: string;
  debit_amount: number;
  credit_account: string;
  credit_amount: number;
  description: string;
  source: 'receipt' | 'bank' | 'invoice' | 'manual';
  receipt_id: string | null;
  invoice_id: string | null;
  created_at: string;
}

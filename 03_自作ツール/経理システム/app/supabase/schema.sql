-- 経理Webアプリ: Supabase スキーマ

-- 勘定科目マスタ
create table accounts (
  code text primary key,
  name text not null,
  category text not null check (category in ('資産', '負債', '収益', '経費'))
);

-- 自動仕訳ルール
create table auto_rules (
  id uuid default gen_random_uuid() primary key,
  match_pattern text not null,
  account_code text references accounts(code),
  account_rule text,
  confirm boolean default false,
  created_at timestamptz default now()
);

-- 領収書
create table receipts (
  id text primary key,
  date date not null,
  store text not null,
  amount integer not null,
  tax integer default 0,
  items text,
  item_count integer default 1,
  memo text,
  account_code text references accounts(code),
  payment_method text default '普通預金',
  status text default 'confirmed' check (status in ('confirmed', 'pending_review')),
  image_path text,
  created_at timestamptz default now()
);

-- 請求書
create table invoices (
  id text primary key,
  client_name text not null,
  issue_date date not null,
  due_date date not null,
  subtotal integer not null,
  tax integer not null,
  total integer not null,
  status text default 'unpaid' check (status in ('unpaid', 'paid', 'overdue')),
  items jsonb not null default '[]',
  pdf_path text,
  created_at timestamptz default now()
);

-- 仕訳帳
create table journal_entries (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  debit_account text not null references accounts(code),
  debit_amount integer not null,
  credit_account text not null references accounts(code),
  credit_amount integer not null,
  description text,
  source text check (source in ('receipt', 'bank', 'invoice', 'manual')),
  receipt_id text references receipts(id),
  invoice_id text references invoices(id),
  created_at timestamptz default now()
);

-- 初期データ: 勘定科目
insert into accounts (code, name, category) values
  ('100', '普通預金', '資産'),
  ('120', '売掛金', '資産'),
  ('130', '事業主貸', '資産'),
  ('200', '事業主借', '負債'),
  ('400', '売上高', '収益'),
  ('500', '外注費', '経費'),
  ('510', '通信費', '経費'),
  ('520', '旅費交通費', '経費'),
  ('530', '消耗品費', '経費'),
  ('540', '新聞図書費', '経費'),
  ('545', '会議費', '経費'),
  ('550', '接待交際費', '経費'),
  ('560', '地代家賃', '経費'),
  ('570', '水道光熱費', '経費'),
  ('580', '租税公課', '経費'),
  ('900', '雑費', '経費');

-- 初期データ: 自動仕訳ルール
insert into auto_rules (match_pattern, account_code, confirm) values
  ('AMAZON|アマゾン|amazon', '530', false),
  ('JR|ＪＲ|SUICA|スイカ|Suica|PASMO|パスモ', '520', false),
  ('タクシー|UBER|uber|DiDi|ＧＯタクシー', '520', false),
  ('NOTION|Notion|FIGMA|Figma|ADOBE|Adobe|SLACK|Slack|CANVA|Canva|GitHub|GITHUB', '510', false),
  ('Google|GOOGLE|ｸﾞｰｸﾞﾙ', '510', false),
  ('書店|BOOK|ブック|紀伊國屋|丸善|Amazon Kindle|Kindle', '540', false),
  ('ヨドバシ|ビック|BIC|ヤマダ', '530', false),
  ('東京電力|TEPCO|東京ガス|水道', '570', false),
  ('ランサーズ|Lancers|クラウドワークス|CrowdWorks', '500', false);

insert into auto_rules (match_pattern, account_rule, confirm) values
  ('スターバックス|STARBUCKS|カフェ|CAFE|ドトール|DOUTOR|タリーズ|TULLY', 'cafe', false);

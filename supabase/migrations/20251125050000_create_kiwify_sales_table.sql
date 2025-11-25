CREATE TABLE IF NOT EXISTS kiwify_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kiwify_transaction_id TEXT UNIQUE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE kiwify_sales ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users (admins) to view sales
CREATE POLICY "Authenticated users can view sales"
  ON kiwify_sales FOR SELECT
  USING (auth.role() = 'authenticated');

-- No insert policy needed for public/anon as the edge function uses service role

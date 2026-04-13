ALTER TABLE public.contact_messages ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.contact_messages ADD COLUMN phone text;
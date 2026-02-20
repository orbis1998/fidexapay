
-- ============================================================
-- FidexaPay Full Schema Migration
-- ============================================================

-- -------------------------------------------------------
-- 1. ENUMS
-- -------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('provider', 'admin');

CREATE TYPE public.plan_tier AS ENUM ('basic', 'essentiel', 'standard', 'premium');

CREATE TYPE public.deal_status AS ENUM (
  'pending_payment',
  'funds_secured',
  'in_progress',
  'delivered',
  'awaiting_validation',
  'completed',
  'dispute'
);

CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'past_due');

CREATE TYPE public.dispute_status AS ENUM ('open', 'under_review', 'resolved', 'closed');

CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- -------------------------------------------------------
-- 2. PROFILES TABLE
-- -------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 3. USER ROLES TABLE (separate, critical for security)
-- -------------------------------------------------------
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 4. SUBSCRIPTIONS TABLE
-- -------------------------------------------------------
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan public.plan_tier NOT NULL DEFAULT 'basic',
  status public.subscription_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  max_active_deals INTEGER NOT NULL DEFAULT 3,
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 15.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 5. DEALS TABLE
-- -------------------------------------------------------
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  delivery_deadline TIMESTAMPTZ,
  validation_deadline TIMESTAMPTZ,
  custom_conditions TEXT,
  status public.deal_status NOT NULL DEFAULT 'pending_payment',
  secure_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 6. DEAL STATUS HISTORY TABLE
-- -------------------------------------------------------
CREATE TABLE public.deal_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  old_status public.deal_status,
  new_status public.deal_status NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.deal_status_history ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 7. TRANSACTIONS TABLE
-- -------------------------------------------------------
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status public.transaction_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 8. DISPUTES TABLE
-- -------------------------------------------------------
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL UNIQUE,
  opened_by UUID REFERENCES auth.users(id),
  status public.dispute_status NOT NULL DEFAULT 'open',
  reason TEXT NOT NULL,
  resolution_note TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 9. DISPUTE MESSAGES TABLE
-- -------------------------------------------------------
CREATE TABLE public.dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id),
  sender_label TEXT, -- 'provider', 'client', 'admin' for display
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-- -------------------------------------------------------
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 11. HELPER FUNCTIONS (Security Definer to avoid RLS recursion)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_provider()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'provider');
$$;

CREATE OR REPLACE FUNCTION public.is_deal_owner(_deal_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.deals
    WHERE id = _deal_id AND provider_id = auth.uid()
  );
$$;

-- -------------------------------------------------------
-- 12. TRIGGERS: updated_at auto-update
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------
-- 13. TRIGGER: Auto-create profile + default provider role on signup
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'provider');

  INSERT INTO public.subscriptions (user_id, plan, commission_rate, max_active_deals)
  VALUES (NEW.id, 'basic', 15.00, 3);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------
-- 14. RLS POLICIES
-- -------------------------------------------------------

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin());

-- USER ROLES
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.is_admin());

-- SUBSCRIPTIONS
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "System can insert subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (public.is_admin());

-- DEALS
CREATE POLICY "Providers can view own deals"
  ON public.deals FOR SELECT
  USING (provider_id = auth.uid() OR public.is_admin());

CREATE POLICY "Public can view deals by token"
  ON public.deals FOR SELECT
  USING (secure_token IS NOT NULL); -- open for token-based access; app filters by token client-side

CREATE POLICY "Providers can create deals"
  ON public.deals FOR INSERT
  WITH CHECK (provider_id = auth.uid() AND public.is_provider());

CREATE POLICY "Providers can update own deals"
  ON public.deals FOR UPDATE
  USING (provider_id = auth.uid() OR public.is_admin());

CREATE POLICY "Providers can delete own deals"
  ON public.deals FOR DELETE
  USING (provider_id = auth.uid() OR public.is_admin());

-- DEAL STATUS HISTORY
CREATE POLICY "Providers and admins can view status history"
  ON public.deal_status_history FOR SELECT
  USING (public.is_deal_owner(deal_id) OR public.is_admin());

CREATE POLICY "Anyone can insert status history for deal they own"
  ON public.deal_status_history FOR INSERT
  WITH CHECK (public.is_deal_owner(deal_id) OR public.is_admin());

-- TRANSACTIONS
CREATE POLICY "Providers and admins can view transactions"
  ON public.transactions FOR SELECT
  USING (public.is_deal_owner(deal_id) OR public.is_admin());

CREATE POLICY "System can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (public.is_deal_owner(deal_id) OR public.is_admin());

CREATE POLICY "Admins can update transactions"
  ON public.transactions FOR UPDATE
  USING (public.is_admin());

-- DISPUTES
CREATE POLICY "Providers and admins can view disputes"
  ON public.disputes FOR SELECT
  USING (public.is_deal_owner(deal_id) OR public.is_admin());

CREATE POLICY "Providers can open disputes on own deals"
  ON public.disputes FOR INSERT
  WITH CHECK (public.is_deal_owner(deal_id));

CREATE POLICY "Admins and deal owners can update disputes"
  ON public.disputes FOR UPDATE
  USING (public.is_deal_owner(deal_id) OR public.is_admin());

-- DISPUTE MESSAGES
CREATE POLICY "Deal owners and admins can view messages"
  ON public.dispute_messages FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.disputes d
      WHERE d.id = dispute_id AND public.is_deal_owner(d.deal_id)
    )
  );

CREATE POLICY "Authenticated users can send messages in their disputes"
  ON public.dispute_messages FOR INSERT
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.disputes d
      WHERE d.id = dispute_id AND public.is_deal_owner(d.deal_id)
    )
  );

-- NOTIFICATIONS
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin());

-- -------------------------------------------------------
-- 15. STORAGE BUCKETS
-- -------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('deal-documents', 'deal-documents', false, 20971520, ARRAY['image/jpeg','image/png','image/pdf','application/pdf']);

-- Avatars policies (public read, owner write)
CREATE POLICY "Public can read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Deal documents policies
CREATE POLICY "Deal owners can read their documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'deal-documents' AND (
      public.is_admin() OR
      auth.uid()::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Deal owners can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'deal-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Deal owners can delete own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'deal-documents' AND (
      public.is_admin() OR
      auth.uid()::text = (storage.foldername(name))[1]
    )
  );

-- -------------------------------------------------------
-- 16. INDEXES for performance
-- -------------------------------------------------------
CREATE INDEX idx_deals_provider_id ON public.deals(provider_id);
CREATE INDEX idx_deals_secure_token ON public.deals(secure_token);
CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_deal_status_history_deal_id ON public.deal_status_history(deal_id);
CREATE INDEX idx_transactions_deal_id ON public.transactions(deal_id);
CREATE INDEX idx_disputes_deal_id ON public.disputes(deal_id);
CREATE INDEX idx_dispute_messages_dispute_id ON public.dispute_messages(dispute_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

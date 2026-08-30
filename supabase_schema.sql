-- ==============================================================================
-- ✦ ESQUEMA DE BASE DE DATOS SUPABASE — COMUNIDAD TEQUIO (PUBLICACIONES DE LA TRIBU) ✦
-- Copia y ejecuta este script en el SQL Editor de tu consola de Supabase.
-- ==============================================================================

-- 1. LIMPIEZA INICIAL (RESET LIMPIO)
DROP VIEW IF EXISTS public.member_event_history;
DROP TRIGGER IF EXISTS trigger_increment_route_interest ON public.route_interests;
DROP TRIGGER IF EXISTS trigger_link_member_registration ON public.event_registrations;
DROP TRIGGER IF EXISTS trigger_increment_registration ON public.event_registrations;

DROP FUNCTION IF EXISTS public.increment_route_interest_count();
DROP FUNCTION IF EXISTS public.link_registration_to_member();
DROP FUNCTION IF EXISTS public.increment_event_registration_count();

DROP TABLE IF EXISTS public.route_interests CASCADE;
DROP TABLE IF EXISTS public.external_routes CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.community_members CASCADE;
DROP TABLE IF EXISTS public.completed_works_gallery CASCADE;

-- 2. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLA 1: COMMUNITY_MEMBERS (Códice de la Tribu)
-- ==============================================================================
CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role_interest TEXT NOT NULL DEFAULT 'Estudiante con hambre de aprender',
  primary_guardian_interest TEXT CHECK (primary_guardian_interest IN ('tochtli', 'tlacu', 'kuku', 'general')),
  faenas_completed_count INT NOT NULL DEFAULT 0,
  motivation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 2: EVENTS (Agenda de Faenas Internas, Tequio Talks y Workshops)
-- ==============================================================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type_badge TEXT NOT NULL,
  guardian TEXT NOT NULL CHECK (guardian IN ('tochtli', 'tlacu', 'kuku')),
  guardian_tag TEXT NOT NULL,
  type_category TEXT NOT NULL CHECK (type_category IN ('tequio_talks', 'hackathon', 'caravana', 'taller', 'jornada', 'meetup')),
  
  date_display TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_at TIMESTAMPTZ,
  time_display TEXT NOT NULL,
  location TEXT NOT NULL,
  meeting_link TEXT DEFAULT 'https://meet.google.com/abc-defg-hij',
  
  speaker TEXT,
  speaker_social TEXT,
  image_url TEXT DEFAULT '/jpg/moment2.jpg',
  dynamic_desc TEXT,
  access_info TEXT,
  description TEXT NOT NULL,
  
  capacity_limit INT NOT NULL DEFAULT 60,
  registered_count INT NOT NULL DEFAULT 0,
  
  dev_supplies JSONB DEFAULT '[]'::jsonb,
  cause_supplies JSONB DEFAULT '[]'::jsonb,
  
  status TEXT NOT NULL DEFAULT 'abierto' CHECK (status IN ('abierto', 'lista_espera', 'cerrado', 'finalizado')),
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 3: EVENT_REGISTRATIONS (Inscripciones a Faenas Tequio)
-- ==============================================================================
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.community_members(id) ON DELETE SET NULL,
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role_type TEXT DEFAULT 'Estudiante',
  modality TEXT DEFAULT 'Virtual',
  speaker_question TEXT,
  supply_contribution TEXT,
  
  attendance_status TEXT NOT NULL DEFAULT 'registrado' CHECK (attendance_status IN ('registrado', 'asistio', 'no_asistio', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_registrations_email ON public.event_registrations(email);

-- ==============================================================================
-- TABLA 4: EXTERNAL_ROUTES (Rutas del Vuelo — Eventos de Comunidades Externas)
-- ==============================================================================
CREATE TABLE public.external_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  external_link TEXT NOT NULL,
  date_display TEXT NOT NULL,
  time_display TEXT NOT NULL,
  location TEXT NOT NULL,
  interested_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 5: ROUTE_INTERESTS (Personas que irán en grupo con Tequio a eventos externos)
-- ==============================================================================
CREATE TABLE public.route_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES public.external_routes(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_route_interests_route ON public.route_interests(route_id);

-- ==============================================================================
-- TABLA 6: COMPLETED_WORKS_GALLERY (Memoria Colectiva — Post de Integrantes)
-- ==============================================================================
CREATE TABLE public.completed_works_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  author_email TEXT, -- Correo del integrante verificado en la comunidad
  author_name TEXT,  -- Nombre del autor
  title TEXT NOT NULL,
  event_date TEXT NOT NULL DEFAULT 'Agosto 2026',
  guardian_tag TEXT NOT NULL DEFAULT '🦝 Tlacu · Comunidad',
  seal_stamp TEXT DEFAULT '✦ SELLO DE MAYORDOMÍA ✦',
  image_url TEXT DEFAULT '/jpg/moment1.jpg',
  linkedin_post_url TEXT NOT NULL, -- Soporta urls cortas (lnkd.in) y urls completas
  description TEXT,
  impact_metrics JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TRIGGERS DE CONTROL AUTOMÁTICO
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.link_registration_to_member()
RETURNS TRIGGER AS $$
DECLARE
  found_member_id UUID;
BEGIN
  SELECT id INTO found_member_id 
  FROM public.community_members 
  WHERE LOWER(email) = LOWER(NEW.email);

  IF found_member_id IS NULL THEN
    INSERT INTO public.community_members (full_name, email, role_interest)
    VALUES (NEW.full_name, LOWER(NEW.email), COALESCE(NEW.role_type, 'Estudiante'))
    RETURNING id INTO found_member_id;
  END IF;

  NEW.member_id := found_member_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_link_member_registration
BEFORE INSERT ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.link_registration_to_member();

CREATE OR REPLACE FUNCTION public.increment_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events
  SET registered_count = registered_count + 1,
      updated_at = NOW()
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_increment_registration
AFTER INSERT ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.increment_event_registration_count();

CREATE OR REPLACE FUNCTION public.increment_route_interest_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.external_routes
  SET interested_count = interested_count + 1
  WHERE id = NEW.route_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_increment_route_interest
AFTER INSERT ON public.route_interests
FOR EACH ROW
EXECUTE FUNCTION public.increment_route_interest_count();

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ==============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_works_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de eventos" ON public.events FOR SELECT TO public USING (true);
CREATE POLICY "Escritura de eventos" ON public.events FOR ALL TO public USING (true);

CREATE POLICY "Lectura pública de rutas externas" ON public.external_routes FOR SELECT TO public USING (true);
CREATE POLICY "Escritura de rutas externas" ON public.external_routes FOR ALL TO public USING (true);

CREATE POLICY "Permitir inscripciones públicas a eventos" ON public.event_registrations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Permitir lectura de inscripciones" ON public.event_registrations FOR SELECT TO public USING (true);

CREATE POLICY "Permitir sumarse a rutas externas" ON public.route_interests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Permitir lectura de intereses en rutas" ON public.route_interests FOR SELECT TO public USING (true);

CREATE POLICY "Permitir registro público a la comunidad" ON public.community_members FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Permitir lectura de comunidad" ON public.community_members FOR SELECT TO public USING (true);

CREATE POLICY "Lectura pública de memoria colectiva" ON public.completed_works_gallery FOR SELECT TO public USING (true);
CREATE POLICY "Escritura de memoria colectiva" ON public.completed_works_gallery FOR ALL TO public USING (true);

-- ==============================================================================
-- DATOS INICIALES (SEED DATA CON EMBED DE LINKEDIN Y SELLO CEREMONIAL)
-- ==============================================================================

INSERT INTO public.events (
  slug, title, type_badge, guardian, guardian_tag, type_category,
  date_display, start_at, time_display, location, meeting_link, speaker, speaker_social, image_url, dynamic_desc, access_info,
  description, capacity_limit, registered_count, is_featured, status
) VALUES (
  'tequio-talks-01',
  '"De Estudiante a Tech Lead: El Camino Sin Secretos"',
  '🎙️ TEQUIO TALKS #01',
  'tochtli',
  '✦ FAENA ACTIVA · 🐰 TOCHTLI (Mentoría e Inspiración)',
  'tequio_talks',
  'Jueves 17 de Septiembre, 2026',
  NOW() + INTERVAL '4 days 12 hours',
  '07:00 PM — 08:30 PM (CDMX)',
  'Google Meet / YouTube Live',
  'https://meet.google.com/abc-defg-hij',
  'Senior Dev & Tech Lead Mentor',
  'https://www.linkedin.com/in/tequio-mentor',
  '/jpg/moment2.jpg',
  'Q&A Abierto + Revisión de CV en Vivo',
  'Acceso libre · Registro previo necesario',
  'Charla directa e inspiradora sobre cómo navegar la transición académica a liderazgo técnico.',
  60,
  0,
  true,
  'abierto'
);

INSERT INTO public.external_routes (
  title, organizer_name, description, image_url, external_link, date_display, time_display, location, interested_count
) VALUES (
  'Caravana al DevFest CDMX 2026 (Comunidad Google)',
  'Google Developer Group CDMX',
  'Asistiremos en bloque como tribu Tequio al gran encuentro anual de desarrolladores. Nos organizamos para compartir transporte, sentarnos juntos en las conferencias y networking.',
  '/jpg/moment3.jpg',
  'https://devfest.gdg.community/',
  'Sábado 24 de Octubre, 2026',
  '09:00 AM — 06:00 PM',
  'Telmex Hub / WTC CDMX',
  14
);

INSERT INTO public.completed_works_gallery (title, event_date, guardian_tag, seal_stamp, linkedin_post_url, image_url, description, author_name, impact_metrics) VALUES
(
  'Experiencia en Faena Tequio — Publicación de Integrante',
  '29 de Agosto, 2026',
  '🦝 Tlacu · Forja Comunitaria',
  '✦ PUBLICACIÓN DE LA TRIBU ✦',
  'https://lnkd.in/p/g4_eGX8s',
  '/jpg/moment1.jpg',
  'Experiencia compartida por integrante de la comunidad Tequio en LinkedIn.',
  'Sofía Morales · Integrante Tequio',
  '["🌟 Publicación de Integrante", "👥 Comunidad Tequio"]'::jsonb
),
(
  'Impulso a la Comunidad — Faena Tequio en LinkedIn',
  '28 de Agosto, 2026',
  '🦝 Tlacu · Forja Comunitaria',
  '✦ FAENA OFICIAL CUMPLIDA ✦',
  'https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/',
  '/jpg/moment1.jpg',
  'Publicación oficial en LinkedIn sobre la iniciativa y el impacto de la faena colectiva en la comunidad.',
  NULL,
  '["📊 +1,200 Impresiones en LinkedIn", "🚀 42 Desarrolladores sumados"]'::jsonb
),
(
  'Caravana y Encuentro Tech — Registro de Miembro',
  '20 de Agosto, 2026',
  '🪶 Kuku · Caravana del Vuelo',
  '✦ PUBLICACIÓN DE LA TRIBU ✦',
  'https://lnkd.in/p/g-Dc7yaS',
  '/jpg/moment3.jpg',
  'Testimonio publicado por integrante de la comunidad Tequio sobre la experiencia en la Caravana del Vuelo.',
  NULL,
  '["🌟 Testimonio de la Tribu", "👥 Asistencia en Grupo"]'::jsonb
);

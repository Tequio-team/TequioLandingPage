-- ==============================================================================
-- ✦ ESQUEMA DE BASE DE DATOS SUPABASE — COMUNIDAD TEQUIO (MODELO RELACIONAL) ✦
-- Copia y ejecuta este script en el SQL Editor de tu consola de Supabase.
-- ==============================================================================

-- 1. LIMPIEZA INICIAL (RESET LIMPIO)
DROP VIEW IF EXISTS public.member_event_history;
DROP TRIGGER IF EXISTS trigger_link_member_registration ON public.event_registrations;
DROP TRIGGER IF EXISTS trigger_increment_registration ON public.event_registrations;
DROP FUNCTION IF EXISTS public.link_registration_to_member();
DROP FUNCTION IF EXISTS public.increment_event_registration_count();
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.community_members CASCADE;
DROP TABLE IF EXISTS public.completed_works_gallery CASCADE;

-- 2. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLA 1: COMMUNITY_MEMBERS (Códice de la Tribu / Miembros Registraros)
-- ==============================================================================
CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role_interest TEXT NOT NULL, -- 'Estudiante', 'Mentor', 'Diseñador', 'Voluntario'
  primary_guardian_interest TEXT CHECK (primary_guardian_interest IN ('tochtli', 'tlacu', 'kuku', 'general')),
  faenas_completed_count INT NOT NULL DEFAULT 0, -- Historial de faenas cumplidas por el miembro
  motivation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 2: EVENTS (Agenda de Faenas y Convocatorias)
-- ==============================================================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type_badge TEXT NOT NULL, -- ej. '🎙️ TEQUIO TALKS #01'
  guardian TEXT NOT NULL CHECK (guardian IN ('tochtli', 'tlacu', 'kuku')),
  guardian_tag TEXT NOT NULL, -- ej. '🐰 TOCHTLI (Mentoría e Inspiración)'
  type_category TEXT NOT NULL CHECK (type_category IN ('tequio_talks', 'hackathon', 'caravana', 'taller', 'jornada', 'meetup')),
  
  date_display TEXT NOT NULL, -- ej. 'Jueves 17 de Septiembre, 2026'
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  time_display TEXT NOT NULL,
  location TEXT NOT NULL,
  
  speaker TEXT,
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
-- TABLA 3: EVENT_REGISTRATIONS (Relación Miembro <-> Evento)
-- ==============================================================================
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.community_members(id) ON DELETE SET NULL, -- RELACIÓN DIRECTA AL MIEMBRO
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role_type TEXT DEFAULT 'Estudiante',
  modality TEXT DEFAULT 'Virtual',
  speaker_question TEXT,
  supply_contribution TEXT,
  
  attendance_status TEXT NOT NULL DEFAULT 'registrado' CHECK (attendance_status IN ('registrado', 'asistio', 'no_asistio', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_registrations_member_id ON public.event_registrations(member_id);
CREATE INDEX idx_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_registrations_email ON public.event_registrations(email);

-- ==============================================================================
-- TABLA 4: COMPLETED_WORKS_GALLERY (Memoria Colectiva)
-- ==============================================================================
CREATE TABLE public.completed_works_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  guardian_tag TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_metrics JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- VISTA RELACIONAL: VISTA DE HISTORIAL DE ASISTENCIA POR MIEMBRO
-- Permite consultar fácilmente los eventos a los que ha asistido cada miembro
-- ==============================================================================
CREATE OR REPLACE VIEW public.member_event_history AS
SELECT 
  m.id AS member_id,
  m.full_name AS member_name,
  m.email AS member_email,
  m.role_interest,
  e.id AS event_id,
  e.title AS event_title,
  e.type_badge,
  e.guardian,
  e.date_display,
  r.attendance_status,
  r.speaker_question,
  r.created_at AS registered_at
FROM public.community_members m
JOIN public.event_registrations r ON r.email = m.email
JOIN public.events e ON e.id = r.event_id;

-- ==============================================================================
-- TRIGGER 1: Vincula automáticamente el miembro si el email coincide
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.link_registration_to_member()
RETURNS TRIGGER AS $$
DECLARE
  found_member_id UUID;
BEGIN
  -- Buscar si el email ya existe en el códice de miembros
  SELECT id INTO found_member_id 
  FROM public.community_members 
  WHERE LOWER(email) = LOWER(NEW.email);

  -- Si el miembro no existe aún, se registra automáticamente en el códice
  IF found_member_id IS NULL THEN
    INSERT INTO public.community_members (full_name, email, role_interest)
    VALUES (NEW.full_name, LOWER(NEW.email), COALESCE(NEW.role_type, 'Estudiante'))
    RETURNING id INTO found_member_id;
  END IF;

  -- Asignar el member_id a la inscripción
  NEW.member_id := found_member_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_link_member_registration
BEFORE INSERT ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.link_registration_to_member();

-- ==============================================================================
-- TRIGGER 2: Incrementar el contador de registrados en la tabla de eventos
-- ==============================================================================
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

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ==============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_works_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de eventos" ON public.events FOR SELECT TO public USING (true);
CREATE POLICY "Lectura pública de memoria colectiva" ON public.completed_works_gallery FOR SELECT TO public USING (true);
CREATE POLICY "Permitir inscripciones públicas a eventos" ON public.event_registrations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Permitir consulta de mi propio historial por email" ON public.event_registrations FOR SELECT TO public USING (true);
CREATE POLICY "Permitir registro público a la comunidad" ON public.community_members FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Permitir lectura de perfil público de miembros" ON public.community_members FOR SELECT TO public USING (true);

-- ==============================================================================
-- DATOS INICIALES DE PRUEBA (SEED DATA)
-- ==============================================================================

INSERT INTO public.events (
  slug, title, type_badge, guardian, guardian_tag, type_category,
  date_display, start_at, time_display, location, speaker, dynamic_desc, access_info,
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
  'Senior Dev & Tech Lead Mentor',
  'Q&A Abierto + Revisión de CV en Vivo',
  'Acceso libre · Registro previo necesario',
  'Charla directa e inspiradora sobre cómo navegar la transición académica a liderazgo técnico.',
  60,
  0,
  true,
  'abierto'
);

INSERT INTO public.completed_works_gallery (title, event_date, guardian_tag, image_url, description, impact_metrics) VALUES
(
  'Forja Comunitaria — Huellitas de la Esperanza',
  '15 de Agosto, 2026',
  '🦝 Tlacu · Hackathon',
  '/jpg/moment1.jpg',
  'Construimos una plataforma de adopción para el refugio Huellitas de la Esperanza en un hackathon de 48 horas.',
  '["📊 +120 perritos catalogados", "🚀 1 plataforma en producción"]'::jsonb
),
(
  'Círculo de la Luna — Noche de Código y Carrera',
  '02 de Julio, 2026',
  '🐰 Tochtli · Mentoría',
  '/jpg/moment2.jpg',
  'Sesiones de mentoría 1:1 donde estudiantes recibieron feedback directo de portafolios y orientación técnica.',
  '["📊 35 portafolios revisados", "👥 12 mentores activos"]'::jsonb
),
(
  'Caravana del Vuelo — Encuentro Tech CDMX',
  '20 de Mayo, 2026',
  '🪶 Kuku · Caravana',
  '/jpg/moment3.jpg',
  'La tribu asistió en bloque a la conferencia nacional de tecnología, creando espacios seguros para principiantes.',
  '["📊 40 asistentes en bloque", "🌟 15 primerizos en eventos tech"]'::jsonb
);

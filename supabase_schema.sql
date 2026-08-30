-- ==============================================================================
-- ✦ ESQUEMA DE BASE DE DATOS SUPABASE — COMUNIDAD TEQUIO (EVENTOS & MEMORIA VIVA) ✦
-- Copia y ejecuta este script en el SQL Editor de tu consola de Supabase.
-- ==============================================================================

-- 1. LIMPIEZA INICIAL TOTAL (RESET LIMPIO)
DROP VIEW IF EXISTS public.member_event_history CASCADE;
DROP TRIGGER IF EXISTS trigger_increment_route_interest ON public.route_interests CASCADE;
DROP TRIGGER IF EXISTS trigger_link_member_registration ON public.event_registrations CASCADE;
DROP TRIGGER IF EXISTS trigger_increment_registration ON public.event_registrations CASCADE;

DROP FUNCTION IF EXISTS public.increment_route_interest_count() CASCADE;
DROP FUNCTION IF EXISTS public.link_registration_to_member() CASCADE;
DROP FUNCTION IF EXISTS public.increment_event_registration_count() CASCADE;

DROP TABLE IF EXISTS public.route_interests CASCADE;
DROP TABLE IF EXISTS public.external_routes CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.community_members CASCADE;
DROP TABLE IF EXISTS public.completed_works_gallery CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- 2. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLA 1: EVENTS
-- Guarda todas las faenas pasadas y activas de Tequio.
-- Puede haber múltiples eventos con status = 'activa' simultáneamente.
-- event_type define la naturaleza del evento (Talk, Hackathon, etc.)
-- ==============================================================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contenido principal
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  time_display TEXT NOT NULL DEFAULT '07:00 PM — 08:30 PM (CDMX)',

  -- Modalidad
  is_online BOOLEAN NOT NULL DEFAULT true,
  location TEXT NOT NULL DEFAULT 'Google Meet',

  -- Tipo de evento (determina colores y guardián en la UI)
  -- tequio_talks    → Círculo de la Luna     → 🐰 Tochtli (ámbar)
  -- forja           → Forja Comunitaria       → 🦝 Tlacu (terracota)
  -- aprender        → Jornada de la Faena     → 🐰🦝 Tochtli+Tlacu (teal)
  -- caravana        → Caravana del Vuelo      → 🪶 Kuku (esmeralda)
  event_type TEXT NOT NULL DEFAULT 'tequio_talks'
    CHECK (event_type IN ('tequio_talks', 'forja', 'aprender', 'caravana')),

  -- Luma
  luma_url TEXT NOT NULL,

  -- Ponente / Invitado
  speaker_name TEXT,
  speaker_linkedin TEXT,

  -- Guardián visual (puede diferir del event_type para personalización extra)
  guardian TEXT NOT NULL DEFAULT 'tochtli'
    CHECK (guardian IN ('tochtli', 'tlacu', 'kuku', 'tochtli_tlacu')),

  -- Estado: activa = en puerta (puede haber varias) | pasada = historial
  status TEXT NOT NULL DEFAULT 'activa'
    CHECK (status IN ('activa', 'pasada')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 2: COMPLETED_WORKS_GALLERY (Memoria Viva de la Tribu)
-- Vinculada opcionalmente a un evento para el futuro "Museo de Faenas"
-- ==============================================================================
CREATE TABLE public.completed_works_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  linkedin_post_url TEXT NOT NULL,
  quote TEXT NOT NULL,
  event_title TEXT NOT NULL,
  -- FK opcional al evento (NULL si el evento aún no está en la BD)
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  guardian TEXT NOT NULL DEFAULT 'tlacu'
    CHECK (guardian IN ('tochtli', 'tlacu', 'kuku', 'tochtli_tlacu')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ÍNDICES para consultas frecuentes
-- ==============================================================================
CREATE INDEX idx_events_status     ON public.events(status);
CREATE INDEX idx_events_event_type ON public.events(event_type);
CREATE INDEX idx_gallery_event_id  ON public.completed_works_gallery(event_id);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ==============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_works_gallery ENABLE ROW LEVEL SECURITY;

-- Events
CREATE POLICY "Lectura pública de eventos"
  ON public.events FOR SELECT TO public USING (true);
CREATE POLICY "Gestión total de eventos"
  ON public.events FOR ALL TO public USING (true);

-- Memoria Viva
CREATE POLICY "Lectura pública de memoria viva"
  ON public.completed_works_gallery FOR SELECT TO public USING (true);
CREATE POLICY "Permitir publicar en memoria viva"
  ON public.completed_works_gallery FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Gestión total de memoria viva"
  ON public.completed_works_gallery FOR ALL TO public USING (true);

-- ==============================================================================
-- SEED DATA — Faenas de ejemplo
-- ==============================================================================
INSERT INTO public.events (
  title, event_date, time_display, is_online, location,
  event_type, luma_url, speaker_name, speaker_linkedin, guardian, status
) VALUES
(
  'De Estudiante a Tech Lead: El Camino Sin Secretos',
  'Jueves 17 de Septiembre, 2026',
  '07:00 PM — 08:30 PM (CDMX)',
  true, 'Google Meet',
  'tequio_talks',
  'https://luma.com/event/evt-C1nAPcQ4ME9mTeL',
  'David Reyes',
  'https://www.linkedin.com/in/david-reyes-tech',
  'tochtli', 'activa'
),
(
  'Hackathon por la Comunidad: Código Abierto con Causa',
  'Sábado 20 de Septiembre, 2026',
  '10:00 AM — 06:00 PM (CDMX)',
  false, 'Centro Comunitario La Esperanza, CDMX',
  'forja',
  'https://luma.com/event/evt-C1nAPcQ4ME9mTeL',
  'Sofía Morales & Mentores Tequio',
  'https://www.linkedin.com/in/sofia-morales-dev',
  'tlacu', 'pasada'
),
(
  'Caravana al DevFest CDMX 2026',
  'Sábado 24 de Octubre, 2026',
  '09:00 AM — 06:00 PM (CDMX)',
  false, 'Telmex Hub / WTC CDMX',
  'caravana',
  'https://luma.com/event/evt-C1nAPcQ4ME9mTeL',
  'Líderes de Comunidad GDG & Tequio',
  'https://www.linkedin.com/company/tequio',
  'kuku', 'pasada'
);

INSERT INTO public.completed_works_gallery (
  author_name, linkedin_post_url, quote, event_title, guardian
) VALUES
(
  'Sofía Morales',
  'https://www.linkedin.com/posts/sofia-morales-tequio-faena',
  'Aprender en comunidad rompió el miedo a programar en proyectos reales con impacto tangible.',
  'Hackathon por la Comunidad: Código Abierto con Causa',
  'tlacu'
),
(
  'David Reyes',
  'https://www.linkedin.com/feed/update/urn:li:activity:7493522800209661952/',
  'El verdadero poder del software está en poner el conocimiento al servicio de los demás.',
  'De Estudiante a Tech Lead: El Camino Sin Secretos',
  'tochtli'
),
(
  'Carlos Mendoza',
  'https://www.linkedin.com/posts/carlos-mendoza-talent-land-tequio',
  'Caminar en tribu te impulsa a llegar más lejos de lo que jamás imaginaste solo.',
  'Caravana al DevFest CDMX 2026',
  'kuku'
);

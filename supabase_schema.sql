-- ==============================================================================
-- ✦ ESQUEMA DE BASE DE DATOS SUPABASE — COMUNIDAD TEQUIO (EVENTOS LUMA & MEMORIA VIVA) ✦
-- Copia y ejecuta este script en el SQL Editor de tu consola de Supabase.
-- ==============================================================================

-- 1. LIMPIEZA INICIAL DE TABLAS Y TRIGGERS OBSOLETOS
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
-- TABLA 1: EVENTS (Agenda de Faenas y Encuentros con Registro Luma)
-- ==============================================================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  time_display TEXT NOT NULL DEFAULT '07:00 PM — 08:30 PM (CDMX)',
  is_online BOOLEAN NOT NULL DEFAULT true, -- true = 🖥️ En línea / Google Meet | false = 📍 En persona / Presencial
  location TEXT NOT NULL DEFAULT 'Google Meet',
  luma_url TEXT NOT NULL, -- Enlace de registro Luma (ej: https://luma.com/event/evt-C1nAPcQ4ME9mTeL o https://lu.ma/...)
  description TEXT,
  guardian TEXT NOT NULL DEFAULT 'tochtli' CHECK (guardian IN ('tochtli', 'tlacu', 'kuku')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'abierto' CHECK (status IN ('abierto', 'finalizado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 2: COMPLETED_WORKS_GALLERY (Memoria Viva de la Tribu)
-- ==============================================================================
CREATE TABLE public.completed_works_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  linkedin_post_url TEXT NOT NULL, -- Enlace 100% verificado de LinkedIn
  quote TEXT NOT NULL, -- Frase/reflexión obtenida del evento (máximo 50 palabras)
  event_title TEXT NOT NULL, -- Nombre del evento al que asistió
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  guardian TEXT NOT NULL DEFAULT 'tlacu' CHECK (guardian IN ('tochtli', 'tlacu', 'kuku')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ==============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_works_gallery ENABLE ROW LEVEL SECURITY;

-- Políticas para Events
CREATE POLICY "Lectura pública de eventos" 
  ON public.events FOR SELECT TO public USING (true);

CREATE POLICY "Gestión total de eventos" 
  ON public.events FOR ALL TO public USING (true);

-- Políticas para Memoria Viva (Completed Works Gallery)
CREATE POLICY "Lectura pública de memoria viva" 
  ON public.completed_works_gallery FOR SELECT TO public USING (true);

CREATE POLICY "Permitir publicar en memoria viva" 
  ON public.completed_works_gallery FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Gestión total de memoria viva" 
  ON public.completed_works_gallery FOR ALL TO public USING (true);

-- ==============================================================================
-- DATOS INICIALES (SEED DATA CON ENLACES DE LUMA Y MEMORIA VIVA)
-- ==============================================================================

INSERT INTO public.events (
  title,
  event_date,
  time_display,
  is_online,
  location,
  luma_url,
  description,
  guardian,
  is_featured,
  status
) VALUES 
(
  'De Estudiante a Tech Lead: El Camino Sin Secretos',
  'Jueves 17 de Septiembre, 2026',
  '07:00 PM — 08:30 PM (CDMX)',
  true,
  'Google Meet',
  'https://luma.com/event/evt-C1nAPcQ4ME9mTeL',
  'Mentoría directa sobre navegación de carrera tech, transición a liderazgo y revisión de perfiles en vivo.',
  'tochtli',
  true,
  'abierto'
),
(
  'Hackathon por la Comunidad: Código Abierto con Causa',
  'Sábado 20 de Septiembre, 2026',
  '10:00 AM — 06:00 PM (CDMX)',
  false,
  'Centro Comunitario La Esperanza, CDMX',
  'https://luma.com/event/evt-C1nAPcQ4ME9mTeL',
  '8 horas de forja colaborativa para desarrollar herramientas abiertas que resuelven retos sociales.',
  'tlacu',
  false,
  'abierto'
),
(
  'Caravana al DevFest CDMX 2026',
  'Sábado 24 de Octubre, 2026',
  '09:00 AM — 06:00 PM (CDMX)',
  false,
  'Telmex Hub / WTC CDMX',
  'https://luma.com/event/evt-C1nAPcQ4ME9mTeL',
  'Asistiremos en bloque como tribu Tequio al gran encuentro anual de desarrolladores para aprender y hacer networking juntos.',
  'kuku',
  false,
  'abierto'
);

INSERT INTO public.completed_works_gallery (
  author_name,
  linkedin_post_url,
  quote,
  event_title,
  guardian
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

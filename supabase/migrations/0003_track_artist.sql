-- ============================================================================
-- tracks: add artist/producer credit
-- ============================================================================
alter table public.tracks
  add column artist text;

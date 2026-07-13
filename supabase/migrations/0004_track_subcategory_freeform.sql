-- ============================================================================
-- tracks: subcategory needs differ per category (brain-wave bands like
-- "delta" vs. Solfeggio Hz labels like "432Hz"), so a single fixed enum
-- doesn't fit — drop the check constraint and allow free-form text.
-- ============================================================================
alter table public.tracks
  drop constraint if exists tracks_subcategory_check;

-- ============================================================================
-- tracks: add subcategory (brain wave band) for brain_waves category
-- ============================================================================
alter table public.tracks
  add column subcategory text
    check (subcategory in ('alpha', 'beta', 'delta', 'theta', 'gamma'));

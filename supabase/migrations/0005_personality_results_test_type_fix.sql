-- ============================================================================
-- personality_results: the live check constraint had drifted from this
-- migration file's definition (missing 'horoscope', possibly others) —
-- recreate it explicitly so the two can't disagree.
-- ============================================================================
alter table public.personality_results
  drop constraint if exists personality_results_test_type_check;

alter table public.personality_results
  add constraint personality_results_test_type_check
  check (test_type in ('numerology', 'astrology', 'human_design', 'mbti', 'big_five', 'archetype', 'horoscope'));

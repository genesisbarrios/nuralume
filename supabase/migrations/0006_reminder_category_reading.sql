-- ============================================================================
-- reminders: add "reading" category
-- ============================================================================
alter table public.reminders
  drop constraint if exists reminders_category_check;

alter table public.reminders
  add constraint reminders_category_check
  check (category in ('hydration', 'nutrition', 'meditation', 'exercise', 'grounding', 'coping_skills', 'reading'));

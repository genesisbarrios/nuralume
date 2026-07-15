export type PersonalityTestType =
  | "numerology"
  | "astrology"
  | "human_design"
  | "mbti"
  | "big_five"
  | "archetype"
  | "horoscope";
export type TrackCategory = "brain_waves" | "solfeggio" | "binaural_beats";
// Free-form: brain_waves uses wave-band names ("delta"), solfeggio uses Hz
// labels ("432Hz"), etc. — meaning differs per category, so no fixed enum.
export type TrackSubcategory = string;
export type ReminderCategory =
  | "hydration"
  | "nutrition"
  | "meditation"
  | "exercise"
  | "grounding"
  | "coping_skills"
  | "reading";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          birth_date: string | null;
          birth_time: string | null;
          birth_city: string | null;
          birth_country_code: string | null;
          horoscope_frequency: "daily" | "weekly";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          sort_order: number;
          is_default: boolean;
          category: ReminderCategory | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reminders"]["Row"]> & {
          user_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Row"]>;
        Relationships: [];
      };
      reminder_completions: {
        Row: {
          id: string;
          reminder_id: string;
          user_id: string;
          completed_date: string;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["reminder_completions"]["Row"]
        > & {
          reminder_id: string;
          user_id: string;
          completed_date: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["reminder_completions"]["Row"]
        >;
        Relationships: [];
      };
      affirmation_favorites: {
        Row: {
          id: string;
          user_id: string;
          affirmation_id: string;
          affirmation_text: string;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["affirmation_favorites"]["Row"]
        > & {
          user_id: string;
          affirmation_id: string;
          affirmation_text: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["affirmation_favorites"]["Row"]
        >;
        Relationships: [];
      };
      personality_results: {
        Row: {
          id: string;
          user_id: string;
          test_type: PersonalityTestType;
          result: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["personality_results"]["Row"]
        > & {
          user_id: string;
          test_type: PersonalityTestType;
          result: Record<string, unknown>;
        };
        Update: Partial<
          Database["public"]["Tables"]["personality_results"]["Row"]
        >;
        Relationships: [];
      };
      tracks: {
        Row: {
          id: string;
          title: string;
          category: TrackCategory;
          subcategory: TrackSubcategory | null;
          label: string;
          artist: string | null;
          storage_path: string;
          duration_seconds: number | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tracks"]["Row"]> & {
          title: string;
          category: TrackCategory;
          label: string;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["tracks"]["Row"]>;
        Relationships: [];
      };
      seraphim_scores: {
        Row: {
          id: string;
          user_id: string;
          leaderboard_name: string;
          score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["seraphim_scores"]["Row"]
        > & {
          user_id: string;
          leaderboard_name: string;
          score: number;
        };
        Update: Partial<Database["public"]["Tables"]["seraphim_scores"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

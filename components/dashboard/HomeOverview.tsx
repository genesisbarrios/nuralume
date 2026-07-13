"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { BellRing, Check, Heart, Moon, Pencil, Sparkles } from "lucide-react";
import PageCard from "@/components/dashboard/PageCard";
import ApiFallbackNotice from "@/components/dashboard/ApiFallbackNotice";
import BirthDataForm from "@/components/dashboard/BirthDataForm";
import type { ProfileBirthData } from "@/libs/profile";
import { getProfileBirthData } from "@/libs/profile";
import type { Affirmation } from "@/libs/affirmations";
import type { HoroscopeResult } from "@/libs/horoscope";
import type { ReminderWithStatus } from "@/app/dashboard/reminders/actions";
import { toggleReminderCompletion } from "@/app/dashboard/reminders/actions";
import { toggleFavoriteAffirmation } from "@/app/dashboard/affirmations/actions";

export default function HomeOverview({
  profile: initialProfile,
  reminders: initialReminders,
  dailyAffirmation,
  initialFavoriteIds,
  horoscope,
}: {
  profile: ProfileBirthData | null;
  reminders: ReminderWithStatus[];
  dailyAffirmation: Affirmation;
  initialFavoriteIds: string[];
  horoscope: HoroscopeResult | null;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [reminders, setReminders] = useState(initialReminders);
  const [isFavorite, setIsFavorite] = useState(
    initialFavoriteIds.includes(dailyAffirmation.id)
  );
  const [, startTransition] = useTransition();

  const toggleReminder = (id: string, isDone: boolean) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isDone: !isDone } : r))
    );
    startTransition(() => {
      toggleReminderCompletion(id, isDone);
    });
  };

  const toggleFavorite = () => {
    setIsFavorite((v) => !v);
    startTransition(() => {
      toggleFavoriteAffirmation(dailyAffirmation);
    });
  };

  const remaining = reminders.filter((r) => !r.isDone);

  return (
    <div className="space-y-4">
      <PageCard title="Today's reminders">
        {reminders.length === 0 ? (
          <p className="text-sm text-base-content/60">No reminders yet.</p>
        ) : (
          <ul className="space-y-2">
            {reminders.slice(0, 4).map((reminder) => (
              <li
                key={reminder.id}
                className="flex items-center justify-between rounded-lg bg-base-200 px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => toggleReminder(reminder.id, reminder.isDone)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      reminder.isDone
                        ? "border-primary bg-primary text-primary-content"
                        : "border-base-content/30"
                    }`}
                  >
                    {reminder.isDone && <Check className="h-3 w-3" />}
                  </span>
                  <span
                    className={`text-sm ${
                      reminder.isDone ? "text-base-content/50 line-through" : ""
                    }`}
                  >
                    {reminder.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-base-content/50">
          <span className="flex items-center gap-1">
            <BellRing className="h-3.5 w-3.5" />
            {remaining.length} remaining today
          </span>
          <Link href="/dashboard/reminders" className="link link-primary">
            See all
          </Link>
        </div>
      </PageCard>

      <PageCard title="Today's affirmation">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-5 text-center">
          <p className="font-handwritten text-xl leading-snug">
            &ldquo;{dailyAffirmation.text}&rdquo;
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={toggleFavorite}
              className={`btn btn-sm gap-2 ${isFavorite ? "btn-primary" : "btn-outline"}`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Saved" : "Save"}
            </button>
            <Link
              href="/dashboard/affirmations"
              className="btn btn-outline btn-sm gap-2"
            >
              <Sparkles className="h-4 w-4" />
              More
            </Link>
          </div>
        </div>
      </PageCard>

      <PageCard
        title={
          horoscope?.frequency === "weekly"
            ? "This week's horoscope"
            : "Today's horoscope"
        }
      >
        {horoscope ? (
          <div>
            {horoscope.source === "fallback" && <ApiFallbackNotice />}
            <p className="mb-2 flex items-center gap-1 text-sm font-semibold">
              <Moon className="h-4 w-4 text-primary" />
              {horoscope.sign}
            </p>
            <p className="rounded-xl bg-base-200 p-4 text-sm leading-relaxed">
              {horoscope.text}
            </p>
          </div>
        ) : (
          <p className="text-sm text-base-content/60">
            Add your birthday below to see your horoscope here.
          </p>
        )}
        <Link
          href="/dashboard/astrology"
          className="mt-3 inline-block text-xs text-primary underline"
        >
          View astrology tab
        </Link>
      </PageCard>

      <PageCard title="Your profile">
        {editingProfile ? (
          <BirthDataForm
            initial={profile}
            onSaved={async () => {
              setEditingProfile(false);
              setProfile(await getProfileBirthData());
            }}
          />
        ) : (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-handwritten text-xl">
                  {profile?.displayName || "Add your name"}
                </p>
                <p className="mt-1 text-sm text-base-content/60">
                  {profile?.birthDate
                    ? new Date(profile.birthDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No birth date yet"}
                  {profile?.birthCity ? ` · ${profile.birthCity}` : ""}
                </p>
                <p className="mt-1 text-xs text-base-content/50">
                  Horoscope: {profile?.horoscopeFrequency ?? "daily"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(true)}
                className="btn btn-ghost btn-xs gap-1"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          </div>
        )}
      </PageCard>
    </div>
  );
}

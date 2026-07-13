"use client";

import { useState } from "react";
import type { ProfileBirthData } from "@/libs/profile";
import { saveBirthData } from "@/libs/profile";
import type { HoroscopeFrequency } from "@/libs/horoscope";

export default function BirthDataForm({
  initial,
  onSaved,
}: {
  initial: ProfileBirthData | null;
  onSaved: () => void;
}) {
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? "");
  const [birthTime, setBirthTime] = useState(initial?.birthTime ?? "");
  const [birthCity, setBirthCity] = useState(initial?.birthCity ?? "");
  const [birthCountryCode, setBirthCountryCode] = useState(
    initial?.birthCountryCode ?? ""
  );
  const [horoscopeFrequency, setHoroscopeFrequency] =
    useState<HoroscopeFrequency>(initial?.horoscopeFrequency ?? "daily");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !birthDate) return;
    setIsSaving(true);
    await saveBirthData({
      displayName: displayName.trim(),
      birthDate,
      birthTime: birthTime || undefined,
      birthCity: birthCity.trim() || undefined,
      birthCountryCode: birthCountryCode.trim().toUpperCase() || undefined,
      horoscopeFrequency,
    });
    setIsSaving(false);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-base-content/70">
        Your full name and birth date power numerology and your sun sign
        instantly. Add a birth time, city, and country for your full
        astrology chart, wellness insight, and astrocartography.
      </p>

      <label className="form-control">
        <span className="label-text mb-1 text-xs">Full name</span>
        <input
          type="text"
          required
          className="input input-bordered input-sm"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>

      <label className="form-control">
        <span className="label-text mb-1 text-xs">Birth date</span>
        <input
          type="date"
          required
          className="input input-bordered input-sm"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </label>

      <label className="form-control">
        <span className="label-text mb-1 text-xs">
          Birth time (optional)
        </span>
        <input
          type="time"
          className="input input-bordered input-sm"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
        />
      </label>

      <div className="grid grid-cols-3 gap-2">
        <label className="form-control col-span-2">
          <span className="label-text mb-1 text-xs">
            Birth city (optional)
          </span>
          <input
            type="text"
            placeholder="London"
            className="input input-bordered input-sm"
            value={birthCity}
            onChange={(e) => setBirthCity(e.target.value)}
          />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 text-xs">Country code</span>
          <input
            type="text"
            placeholder="GB"
            maxLength={2}
            className="input input-bordered input-sm uppercase"
            value={birthCountryCode}
            onChange={(e) => setBirthCountryCode(e.target.value)}
          />
        </label>
      </div>
      <p className="text-xs text-base-content/50">
        Country code is the 2-letter ISO code (e.g. US, GB, IN) — used to look
        up your birth coordinates automatically.
      </p>

      <label className="form-control">
        <span className="label-text mb-1 text-xs">Horoscope on your home page</span>
        <select
          className="select select-bordered select-sm"
          value={horoscopeFrequency}
          onChange={(e) =>
            setHoroscopeFrequency(e.target.value as HoroscopeFrequency)
          }
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isSaving}
        className="btn btn-primary btn-sm w-full"
      >
        {isSaving ? "Saving..." : "Save details"}
      </button>
    </form>
  );
}

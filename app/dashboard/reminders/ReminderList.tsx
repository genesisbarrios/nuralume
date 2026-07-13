"use client";

import { useState, useTransition } from "react";
import { Bell, Check, Plus, Trash2 } from "lucide-react";
import type { ReminderWithStatus } from "./actions";
import {
  addReminder,
  deleteReminder,
  setReminderCategory,
  toggleReminderCompletion,
} from "./actions";
import {
  getRotatingReminderMessage,
  REMINDER_CATEGORY_LABELS,
} from "@/libs/reminderMessages";
import type { ReminderCategory } from "@/types/database";

const CATEGORIES: ReminderCategory[] = [
  "hydration",
  "nutrition",
  "meditation",
  "exercise",
];

export default function ReminderList({
  reminders,
}: {
  reminders: ReminderWithStatus[];
}) {
  const [items, setItems] = useState(reminders);
  const [newTitle, setNewTitle] = useState("");
  const [notifStatus, setNotifStatus] = useState<NotificationPermission | null>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : null
  );
  const [, startTransition] = useTransition();

  const toggle = (id: string, isDone: boolean) => {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isDone: !isDone } : r))
    );
    startTransition(() => {
      toggleReminderCompletion(id, isDone);
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    setItems((prev) => [
      ...prev,
      {
        id: `pending-${Date.now()}`,
        title,
        isDefault: false,
        isDone: false,
        category: null,
        message: null,
      },
    ]);
    setNewTitle("");
    startTransition(() => {
      addReminder(title);
    });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      deleteReminder(id);
    });
  };

  const isCategoryEnabled = (category: ReminderCategory) =>
    items.some((r) => r.category === category);

  const toggleCategory = (category: ReminderCategory) => {
    const enabled = isCategoryEnabled(category);
    if (enabled) {
      setItems((prev) => prev.filter((r) => r.category !== category));
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `pending-cat-${category}`,
          title: REMINDER_CATEGORY_LABELS[category],
          isDefault: false,
          isDone: false,
          category,
          message: getRotatingReminderMessage(category),
        },
      ]);
    }
    startTransition(() => {
      setReminderCategory(category, !enabled);
    });
  };

  const requestNotifications = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotifStatus(permission);
  };

  const doneCount = items.filter((r) => r.isDone).length;

  return (
    <div>
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold text-base-content/60">
          Get nudges throughout the day for:
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const enabled = isCategoryEnabled(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`badge gap-1 py-3 ${
                  enabled ? "badge-primary" : "badge-outline"
                }`}
              >
                {REMINDER_CATEGORY_LABELS[category]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-base-content/60">
        <span>
          {doneCount} / {items.length} done today
        </span>
        {notifStatus !== null && notifStatus !== "granted" && (
          <button
            type="button"
            onClick={requestNotifications}
            className="btn btn-ghost btn-xs gap-1"
          >
            <Bell className="h-3.5 w-3.5" />
            Enable alerts
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {items.map((reminder) => (
          <li
            key={reminder.id}
            className="flex items-center justify-between rounded-lg bg-base-200 px-3 py-3"
          >
            <button
              type="button"
              onClick={() => toggle(reminder.id, reminder.isDone)}
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
              <span className="flex flex-col">
                <span
                  className={
                    reminder.isDone ? "text-base-content/50 line-through" : ""
                  }
                >
                  {reminder.title}
                </span>
                {reminder.message && !reminder.isDone && (
                  <span className="text-xs text-base-content/50">
                    {reminder.message}
                  </span>
                )}
              </span>
            </button>
            {!reminder.isDefault && !reminder.category && (
              <button
                type="button"
                aria-label="Delete reminder"
                onClick={() => handleDelete(reminder.id)}
                className="btn btn-ghost btn-xs text-error"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a reminder..."
          className="input input-bordered input-sm flex-1"
        />
        <button type="submit" className="btn btn-primary btn-sm gap-1">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
    </div>
  );
}

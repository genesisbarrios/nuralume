import PageCard from "@/components/dashboard/PageCard";
import { getRemindersWithStatus } from "./actions";
import ReminderList from "./ReminderList";

export default async function RemindersPage() {
  const reminders = await getRemindersWithStatus();

  return (
    <PageCard title="Reminders">
      <ReminderList reminders={reminders} />
    </PageCard>
  );
}

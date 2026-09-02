"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/libs/supabase/client";
import { deleteAccount } from "@/libs/account";

export default function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    const { error: deleteError } = await deleteAccount();
    if (deleteError) {
      setError(deleteError);
      setIsDeleting(false);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost btn-xs gap-1 text-error"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>

      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete your account?</h3>
            <p className="py-3 text-sm text-base-content/70">
              This permanently deletes your profile, birth data, reminders,
              and favorites. This can&apos;t be undone.
            </p>
            {error && <p className="text-sm text-error">{error}</p>}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={handleConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="modal-backdrop"
            onClick={() => !isDeleting && setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}

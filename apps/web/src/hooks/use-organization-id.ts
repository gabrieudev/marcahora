"use client";

import { useEffect, useState } from "react";

export default function useOrganizationId() {
  const [currentOrganizationId, setCurrentOrganizationId] = useState<
    string | null
  >(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("ch_selected_org")
      : null,
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ch_selected_org") {
        setCurrentOrganizationId(e.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleOrganizationChange = (id: string | null) => {
    setCurrentOrganizationId(id);
    if (id) {
      localStorage.setItem("ch_selected_org", id);
    } else {
      localStorage.removeItem("ch_selected_org");
    }
  };

  return { currentOrganizationId, handleOrganizationChange };
}

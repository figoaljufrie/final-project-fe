"use client";

import { useEffect, useState } from "react";
import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`transition-all duration-1000 delay-300 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <DashboardOverview />
    </div>
  );
}

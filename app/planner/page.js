"use client";

import { useState } from "react";
import PlannerShell from "@/components/PlannerShell";
import { mockPlannerData } from "@/lib/mockData/planner";

export default function PlannerPage() {
  // State setup
  const [selectedZoneId, setSelectedZoneId] = useState(null); // null by default
  const [selectedInterventionIds, setSelectedInterventionIds] = useState([]); // empty array by default
  const [planConfirmed, setPlanConfirmed] = useState(false); // false by default
  const [budget, setBudget] = useState(2000000); // Default ₹20 Lakhs

  return (
    <PlannerShell
      data={mockPlannerData}
      selectedZoneId={selectedZoneId}
      setSelectedZoneId={setSelectedZoneId}
      selectedInterventionIds={selectedInterventionIds}
      setSelectedInterventionIds={setSelectedInterventionIds}
      planConfirmed={planConfirmed}
      setPlanConfirmed={setPlanConfirmed}
      budget={budget}
      setBudget={setBudget}
    />
  );
}

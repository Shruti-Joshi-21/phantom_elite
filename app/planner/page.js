import PlannerShell from "@/components/PlannerShell";
import { mockPlannerData } from "@/lib/mockData/planner";

export const metadata = {
  title: "City Planner Dashboard · UrbanCool",
  description:
    "AI-powered decision-support workflow for heat mitigation planning and budget optimization.",
};

export default function PlannerPage() {
  return <PlannerShell data={mockPlannerData} />;
}

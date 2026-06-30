import CitizenShell from "@/components/CitizenShell";
import { mockCitizenData } from "@/lib/mockData/citizen";

export const metadata = {
  title: "My Heat Reading · UrbanCool",
  description:
    "Your personal urban heat exposure reading, nearby zone map, and actionable cooling tips.",
};

/**
 * Citizen Dashboard — Phase 1 shell using mock data.
 * To wire real data: replace `mockCitizenData` with an async fetch here,
 * then pass the result down as the `data` prop to CitizenShell.
 */
export default function CitizenPage() {
  return <CitizenShell data={mockCitizenData} />;
}

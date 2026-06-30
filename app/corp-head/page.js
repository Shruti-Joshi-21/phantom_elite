import CorpHeadShell from "@/components/CorpHeadShell";
import { mockCorpHeadData } from "@/lib/mockData/corpHead";

export const metadata = {
  title: "Corporation Head Dashboard · UrbanCool",
  description:
    "Strategic city-wide overview of heat mitigation allocations, portfolio budgets, and equity priorities.",
};

export default function CorpHeadPage() {
  return <CorpHeadShell data={mockCorpHeadData} />;
}

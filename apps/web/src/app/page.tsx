import { FeaturesList, MonorepoOverview } from "@/widgets";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <MonorepoOverview />
      <FeaturesList />
    </div>
  );
}

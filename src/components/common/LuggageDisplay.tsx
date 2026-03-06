"use client";

import useGetLuggageList from "@/hooks/auth/useGetLuggageList";

type LuggageListItem = { type: string; title: string; weight: number };

function formatLuggageDisplay(
  luggageType: string,
  luggageList: LuggageListItem[]
): string {
  if (!luggageType) return "";
  const match = luggageList.find((item) => item.type === luggageType);
  if (!match) return luggageType;
  if (match.type === "NoLuggage") return match.title;
  return `${match.type} (${match.title}, ~${match.weight} kg)`;
}

type LuggageDisplayProps = {
  luggageType?: string | null;
  className?: string;
};

const LuggageDisplay = ({ luggageType, className }: LuggageDisplayProps) => {
  const { luggageList } = useGetLuggageList();
  const display = luggageType
    ? formatLuggageDisplay(luggageType, luggageList)
    : "No Luggage";

  if (!display) return null;

  return <span className={className}>{display}</span>;
};

export default LuggageDisplay;

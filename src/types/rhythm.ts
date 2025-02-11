export interface RhythmItem {
  name: string;
  category: string;
  attendees: string;
  duration: string;
  frequency: string;
  link: string;
}

export const FREQUENCIES = [
  "daily",
  "weekly",
  "bi-weekly",
  "monthly",
  "quarterly",
  "annual",
  "ad hoc"
];

export const TEAM_SIZE_TEMPLATES = [
  { label: "Team of 4-15", value: "team-4-15" },
  { label: "Team of 15-30", value: "team-15-30" },
  { label: "Team of 30-50", value: "team-30-50" },
  { label: "Team of 50-150", value: "team-50-150" },
  { label: "Team of 150-400", value: "team-150-400" },
  { label: "Team of 500+", value: "team-500-plus" }
];

export interface RhythmDetail {
  name: string;
  category: string;
  attendees: string;
  duration: number;
  frequency: string;
}

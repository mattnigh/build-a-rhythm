
/**
 * Type definitions for rhythm-related data structures
 */

/**
 * Represents a single rhythm item with all its properties
 */
export interface RhythmItem {
  name: string;      // Name of the rhythm activity
  category: string;  // Category the rhythm belongs to
  attendees: string; // Who attends this rhythm
  duration: string;  // Duration in minutes
  frequency: string; // How often it occurs
  link: string;      // Optional link to more information
}

/**
 * Represents organization details like repos and channels
 */
export interface OrgDetail {
  type: string;     // Type of detail (e.g., "Team Repos", "Slack Channels")
  url: string;      // URL for the detail
}

/**
 * List of valid frequency values for rhythm items
 */
export const FREQUENCIES = [
  "daily",
  "weekly",
  "bi-weekly",
  "monthly",
  "quarterly",
  "annual",
  "ad hoc"
];

/**
 * Available team size templates with their labels and values
 */
export const TEAM_SIZE_TEMPLATES = [
  { label: "Team of 4-15", value: "team-4-15" },
  { label: "Team of 15-30", value: "team-15-30" },
  { label: "Team of 30-50", value: "team-30-50" },
  { label: "Team of 50-150", value: "team-50-150" },
  { label: "Team of 150-400", value: "team-150-400" },
  { label: "Team of 500+", value: "team-500-plus" }
];

/**
 * Represents the essential details of a rhythm item
 * Used for display and calculations
 */
export interface RhythmDetail {
  name: string;      // Name of the rhythm
  category: string;  // Category it belongs to
  attendees: string; // Participants
  duration: number;  // Duration in minutes
  frequency: string; // Frequency of occurrence
}


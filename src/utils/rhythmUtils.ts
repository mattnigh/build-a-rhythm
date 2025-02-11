
import { organizations } from "@/data/organizations";
import { RhythmItem } from "@/types/rhythm";

export const CATEGORIES = Array.from(
  new Set(
    organizations.flatMap(org => {
      const lines = org.content.split('\n');
      return lines
        .filter(line => line.startsWith('## '))
        .map(line => line.replace('## ', '').trim());
    })
  )
).sort();

/**
 * Generates a markdown string from the organization name and rhythm items.
 * Format matches the Team Rhythms page template:
 * # Organization Name - Rhythm of Business
 * 
 * ## Category
 * - name [attendees] [duration] [frequency] link
 * 
 * @param organizationName - Name of the organization
 * @param rhythms - Array of rhythm items to include
 * @returns Formatted markdown string
 */
export const generateMarkdown = (organizationName: string, rhythms: RhythmItem[]): string => {
  // Group rhythms by category for organized output
  const rhythmsByCategory: { [key: string]: RhythmItem[] } = {};
  
  // Sort rhythms into their respective categories
  rhythms.forEach(rhythm => {
    if (!rhythmsByCategory[rhythm.category]) {
      rhythmsByCategory[rhythm.category] = [];
    }
    rhythmsByCategory[rhythm.category].push(rhythm);
  });

  // Start markdown with organization header
  let markdown = `# ${organizationName} - Rhythm of Business\n\n`;

  // Add each category and its rhythms
  Object.entries(rhythmsByCategory).forEach(([category, items]) => {
    markdown += `## ${category}\n`;
    items.forEach(rhythm => {
      // Format duration to match parser expectations (ensure it's just the number)
      const duration = rhythm.duration.toString().replace(/[^0-9]/g, '');
      markdown += `- ${rhythm.name} [${rhythm.attendees}] [${duration}] [${rhythm.frequency}]${rhythm.link ? ` ${rhythm.link}` : ''}\n`;
    });
    markdown += '\n';
  });

  return markdown;
};


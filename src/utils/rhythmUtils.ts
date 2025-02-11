
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

export const generateMarkdown = (organizationName: string, rhythms: RhythmItem[]): string => {
  const rhythmsByCategory: { [key: string]: RhythmItem[] } = {};
  rhythms.forEach(rhythm => {
    if (!rhythmsByCategory[rhythm.category]) {
      rhythmsByCategory[rhythm.category] = [];
    }
    rhythmsByCategory[rhythm.category].push(rhythm);
  });

  let markdown = `# ${organizationName} - Rhythm of Business\n\n`;

  Object.entries(rhythmsByCategory).forEach(([category, items]) => {
    markdown += `## ${category}\n`;
    items.forEach(rhythm => {
      markdown += `- ${rhythm.name} [${rhythm.attendees}] [${rhythm.duration}] [${rhythm.frequency}]${rhythm.link ? ` ${rhythm.link}` : ''}\n`;
    });
    markdown += '\n';
  });

  return markdown;
};


import { organizations } from "@/data/organizations";
import { OrgDetail, RhythmItem } from "@/types/rhythm";

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
 * Parses organization details from markdown content
 */
export const parseOrgDetails = (content: string): OrgDetail[] => {
  const lines = content.split('\n');
  const detailsSection = lines
    .slice(
      lines.findIndex(line => line.startsWith('### Organization Details')) + 1,
      lines.findIndex(line => line.startsWith('## '))
    )
    .filter(line => line.trim());

  return detailsSection.map(line => {
    const [type, url] = line.replace('- ', '').split(': ');
    return { type, url };
  });
};

/**
 * Generates a markdown string from the organization name, details, and rhythm items.
 */
export const generateMarkdown = (
  organizationName: string, 
  rhythms: RhythmItem[],
  orgDetails: OrgDetail[] = []
): string => {
  // Start markdown with organization header
  let markdown = `# ${organizationName} - Rhythm of Business\n\n`;

  // Add organization details if present
  if (orgDetails.length > 0) {
    markdown += `### Organization Details\n`;
    orgDetails.forEach(detail => {
      markdown += `- ${detail.type}: ${detail.url}\n`;
    });
    markdown += '\n';
  }

  // Group rhythms by category
  const rhythmsByCategory: { [key: string]: RhythmItem[] } = {};
  
  rhythms.forEach(rhythm => {
    if (!rhythmsByCategory[rhythm.category]) {
      rhythmsByCategory[rhythm.category] = [];
    }
    rhythmsByCategory[rhythm.category].push(rhythm);
  });

  // Add each category and its rhythms
  Object.entries(rhythmsByCategory).forEach(([category, items]) => {
    markdown += `## ${category}\n`;
    items.forEach(rhythm => {
      const duration = rhythm.duration.toString().replace(/[^0-9]/g, '');
      markdown += `- ${rhythm.name} [${rhythm.attendees}] [${duration}] [${rhythm.frequency}]${rhythm.link ? ` ${rhythm.link}` : ''}\n`;
    });
    markdown += '\n';
  });

  return markdown;
};


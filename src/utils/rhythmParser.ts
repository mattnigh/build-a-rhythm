
/**
 * Functions to parse rhythm data from markdown content
 */

/**
 * Parses the markdown content and extracts rhythm data organized by sections.
 * Each section contains a title and items with details about rhythm activities.
 * 
 * @param content - The markdown string to parse
 * @returns An array of sections, each containing a title and rhythm items
 */
export const getRhythmData = (content: string) => {
  // Split content into individual lines
  const lines = content.split('\n');
  const sections = [];
  let currentSection = { title: '', items: [] as any[] };
  
  // Process each line to extract sections and items
  for (const line of lines) {
    // Check if line starts a new section (marked by ##)
    if (line.startsWith('## ')) {
      // Save previous section if it exists
      if (currentSection.title) {
        sections.push({ ...currentSection });
      }
      // Start new section
      currentSection = { 
        title: line.replace('## ', ''), 
        items: []
      };
    } 
    // Check if line is an item (marked by -)
    else if (line.startsWith('- ')) {
      // Parse item details using regex pattern
      // Format: - name[attendees][duration][frequency]link
      const match = line.match(/- (.*?)\[(.*?)\]\s*\[(.*?)\]\s*\[(.*?)\](.*)/);
      if (match) {
        currentSection.items.push({
          name: match[1].trim(),
          category: currentSection.title,
          attendees: match[2].trim(),
          duration: parseInt(match[3]),
          frequency: match[4].trim(),
          link: match[5]?.trim()
        });
      }
    }
  }
  // Add the last section if it exists
  if (currentSection.title) {
    sections.push(currentSection);
  }
  return sections;
};

/**
 * Extracts the header information from the markdown content.
 * Looks for the first line starting with # and removes the # symbol.
 * 
 * @param content - The markdown string to parse
 * @returns The header text or default text if not found
 */
export const getHeaderInfo = (content: string) => {
  const lines = content.split('\n');
  const headerLine = lines.find(line => line.startsWith('# '));
  return headerLine ? headerLine.replace('# ', '') : "Rhythm Analysis";
};

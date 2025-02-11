
export const getRhythmData = (content: string) => {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = { title: '', items: [] as any[] };
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection.title) {
        sections.push({ ...currentSection });
      }
      currentSection = { 
        title: line.replace('## ', ''), 
        items: []
      };
    } else if (line.startsWith('- ')) {
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
  if (currentSection.title) {
    sections.push(currentSection);
  }
  return sections;
};

export const getHeaderInfo = (content: string) => {
  const lines = content.split('\n');
  const headerLine = lines.find(line => line.startsWith('# '));
  return headerLine ? headerLine.replace('# ', '') : "Rhythm Analysis";
};

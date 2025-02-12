
// Import markdown files
import acmeCorpMd from '../data/luther-corp.md?raw';
import team4_15Md from '../../public/templates/team-4-15.md?raw';
import team15_30Md from '../../public/templates/team-15-30.md?raw';
import team30_50Md from '../../public/templates/team-30-50.md?raw';
import team50_150Md from '../../public/templates/team-50-150.md?raw';
import team150_400Md from '../../public/templates/team-150-400.md?raw';
import team500PlusMd from '../../public/templates/team-500-plus.md?raw';

export const organizations = [
  {
    id: 'luther-corp',
    content: acmeCorpMd
  },
  {
    id: 'team-4-15',
    content: team4_15Md
  },
  {
    id: 'team-15-30',
    content: team15_30Md
  },
  {
    id: 'team-30-50',
    content: team30_50Md
  },
  {
    id: 'team-50-150',
    content: team50_150Md
  },
  {
    id: 'team-150-400',
    content: team150_400Md
  },
  {
    id: 'team-500-plus',
    content: team500PlusMd
  }
];

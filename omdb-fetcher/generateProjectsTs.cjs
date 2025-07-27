const fs = require('fs');
const path = require('path');

const projectsJsonPath = path.join(__dirname, 'projects.json');
const projectsTsPath = path.join(__dirname, '..', 'src', 'data', 'projects.ts');

try {
  const projectsData = fs.readFileSync(projectsJsonPath, 'utf8');
  const projects = JSON.parse(projectsData);

  const tsContent = `import { Project, Testimonial } from '../types';

export const projects: Project[] = ${JSON.stringify(projects, null, 2)};

// Testimonial data (can be kept separate or merged if relevant)
export const testimonials: Testimonial[] = [
  {
    text: "This platform transformed my understanding of crowdfunding. The insights into film financing and community engagement are unparalleled.",
    author: "Rohan Kumar",
    movie: "The Silent Echo",
    rating: 5,
  },
  {
    text: "An innovative approach to connect with creators and invest in captivating projects. I love being part of this journey!",
    author: "Priya Sharma",
    movie: "Starlight Serenade",
    rating: 5,
  },
  {
    text: "Finally, a platform that understands the pulse of the audience and empowers them to be a part of the creative process. Highly recommended!",
    author: "Amit Patel",
    movie: "City of Dreams",
    rating: 4,
  },
  {
    text: "The diverse range of projects and the transparency in funding make this platform a game-changer for independent cinema.",
    author: "Deepika Singh",
    movie: "Echoes of the Past",
    rating: 5,
  },
  {
    text: "It's inspiring to see how this platform bridges the gap between filmmakers and their audience, creating a vibrant community.",
    author: "Vikram Reddy",
    movie: "The Last Chapter",
    rating: 4,
  },
];
`;

  fs.writeFileSync(projectsTsPath, tsContent, 'utf8');
  console.log('✅ src/data/projects.ts generated successfully from omdb-fetcher/projects.json');
} catch (error) {
  console.error('❌ Error generating projects.ts:', error);
} 
export const SITE_CONFIG = {
  name: "Bizimana Fils Web Pro",
  tagline: "Innovating at the Intersection of Technology & African Ingenuity",
  description:
    "Personal portfolio and innovation platform by Bizimana Fils — Electrical Vehicle Technician, AI Enthusiast, and Technology Researcher from Kigali, Rwanda.",
  url: "https://bizimana-fils.vercel.app",
  founder: {
    name: "Bizimana Fils",
    role: "Electrical Vehicle Technician & Innovation Technologist",
    location: "Kigali, Rwanda",
    email: "bizimanaideaagency@gmail.com",
    phone: "0783444370 / 0795914094",
    languages: ["Kinyarwanda", "English"],
    education: "A2 Certificate in Automobile Technology",
    school: "Ecole Technique de Kabgayi",
    image: "/images/founder.jpg",
    bio: "Born and raised in Kigali, Rwanda, Bizimana Fils developed a passion for technology and innovation at an early age. His journey began with a deep curiosity about how things work, leading him to pursue formal education in Automobile Technology at Ecole Technique de Kabgayi. As an Electrical Vehicle Technician, he specializes in vehicle diagnostics, EV systems, and modern automotive technologies. Beyond automotive technology, Bizimana is an avid AI enthusiast and web development practitioner.",
    hero_stat_1_label: "Years Experience",
    hero_stat_1_value: "5+",
    hero_stat_2_label: "Projects Completed",
    hero_stat_2_value: "20+",
    hero_stat_3_label: "Technologies",
    hero_stat_3_value: "15+",
    skills: [
      "Electrical Vehicle Technician",
      "Automobile Technology",
      "Vehicle Diagnostics",
      "EV Systems",
      "AI Prompt Engineering",
      "Web Development Concepts",
      "Technology Research",
    ],
    goals: [
      "Advance EV technology adoption in East Africa",
      "Build innovative solutions bridging automotive and AI",
      "Contribute to Rwanda's tech ecosystem growth",
    ],
  },
  social: {
    github: "https://github.com/bizimana-fils",
    twitter: "https://twitter.com/bizimana_fils",
    linkedin: "https://linkedin.com/in/bizimana-fils",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Files", href: "/files" },
    { label: "Quotes", href: "/quotes" },
    { label: "Contact", href: "/messages" },
  ],
} as const;

export const PROJECT_CATEGORIES = [
  { value: "ai", label: "AI Innovation" },
  { value: "ev", label: "EV Technology" },
  { value: "web", label: "Web Development" },
  { value: "automobile", label: "Automobile" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" },
] as const;

export const PROJECT_STATUSES = [
  { value: "public", label: "Public" },
  { value: "draft", label: "Draft" },
] as const;

export const FILE_VISIBILITY = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
] as const;

export const FILE_CATEGORIES = [
  { value: "document", label: "Documents" },
  { value: "report", label: "Reports" },
  { value: "presentation", label: "Presentations" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "archive", label: "Archives" },
  { value: "other", label: "Other" },
] as const;

export const ADMIN_CREDENTIALS = {
  email: "bizimanaideaagency@gmail.com",
  password: "#B4r#12@@",
};

export const FLAG_COLORS = {
  green: "#00A651",
  yellow: "#FEDD00",
  blue: "#003F87",
} as const;

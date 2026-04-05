export interface ProfileExperience {
  company: string;
  role: string;
  period: string;
  location?: string;
}

export interface ProfileSkill {
  name: string;
  level: 'advanced' | 'intermediate' | 'basic';
}

export interface ProfileSkillCategory {
  name: string;
  skills: ProfileSkill[];
}

export interface Profile {
  name: string;
  title: string;
  yearsOfExperience: number;
  location: string;
  summary: string;
  experience: ProfileExperience[];
  skills: ProfileSkillCategory[];
  differentiators: string[];
  github: string;
  linkedin: string;
  website: string;
}

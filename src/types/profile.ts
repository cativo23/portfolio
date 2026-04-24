export interface ProfileExperience {
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  highlights?: string[];
  tags?: string[];
}

export interface ProfileSkill {
  name: string;
  level?: 'advanced' | 'intermediate' | 'basic';
}

export interface ProfileSkillCategory {
  name: string;
  skills: ProfileSkill[];
}

export interface SideProject {
  name: string;
  status: 'live' | 'active' | 'alpha' | 'mvp';
  description: string;
  tags: string[];
}

export interface OutsideCode {
  title: string;
  icon: string;
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  yearsOfExperience: number;
  location: string;
  summary: string[];
  experience: ProfileExperience[];
  skills: ProfileSkillCategory[];
  sideProjects: SideProject[];
  outsideCode: OutsideCode[];
  github: string;
  linkedin: string;
  website: string;
}

export interface Project {
    id?: string | number;
    title: string;
    description: string;
    techStack: string | string[];
    repoUrl: string;
    liveUrl?: string;
    is_featured?: boolean;
}

export interface Project {
    id?: string | number;
    title: string;
    description: string;
    shortDescription?: string;
    techStack: string[];
    repoUrl: string;
    liveUrl?: string;
    isFeatured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

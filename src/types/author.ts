export interface Author {
    name: string;
    email?: string;
    avatar?: string;
    bio?: string;
    social?: {
        twitter?: string;
        github?: string;
        linkedin?: string;
    };
}

export interface BlogPost {
    title: string;
    description?: string;
    excerpt?: string; // Used in LatestBlogPostCard (can be alias for description)
    created_at?: string | Date;
    date?: string; // Formatted date string (used in LatestBlogPostCard)
    image?: string;
    author?: string;
    tags?: string[];
    path?: string;
    slug?: string;
}

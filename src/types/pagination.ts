export interface PaginationMeta {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
}

export interface ApiResponse<T> {
    status: string;
    data: T[];
    meta: {
        pagination: PaginationMeta;
    };
}

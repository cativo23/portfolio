export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    status: string;
    data: T[];
    meta: {
        pagination: PaginationMeta;
    };
}

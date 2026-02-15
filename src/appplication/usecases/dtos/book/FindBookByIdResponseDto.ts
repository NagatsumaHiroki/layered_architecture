export interface FindBookByIdResponseDto {
    id: string;
    title: string;
    isAvailable: boolean;
    createAt: Date;
    updatedAt: Date;
}

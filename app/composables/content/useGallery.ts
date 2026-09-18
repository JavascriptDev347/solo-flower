import type { PaginatedList } from "~/types/api";
import type { GalleryPost } from "~/types/gallery";

export interface GalleryListParams {
    page?: number;
    page_size?: number;
}

export interface CreateGalleryPayload {
    images?: File[];
    description?: string;
}

export function useGallery() {
    const { get, upload, delete: del } = useApi();

    const list = (params?: GalleryListParams) =>
        get<PaginatedList<GalleryPost>>("/gallery", params);

    const create = (payload: CreateGalleryPayload) => {
        const formData = new FormData();
        for (const image of payload.images ?? []) {
            formData.append("images", image);
        }
        if (payload.description) {
            formData.append("description", payload.description);
        }
        return upload<GalleryPost>("/admin/gallery", formData);
    };

    const remove = (id: string) =>
        del<string>(`/admin/gallery/${id}`);

    return { list, create, remove };
}

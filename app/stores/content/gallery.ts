import { defineStore } from "pinia";
import {
    useGallery,
    type CreateGalleryPayload,
    type GalleryListParams,
} from "~/composables/content/useGallery";
import type { Pagination } from "~/types/api";
import type { GalleryPost } from "~/types/gallery";

export const useGalleryStore = defineStore("gallery", {
    state: () => ({
        items: [] as GalleryPost[],
        pagination: null as Pagination | null,
        loading: false,
    }),

    actions: {
        async fetchAll(params?: GalleryListParams, force = false) {
            const requestedPage = params?.page ?? 1;
            const requestedPageSize = params?.page_size;
            const isCached =
                !force &&
                this.pagination?.page === requestedPage &&
                (requestedPageSize == null ||
                    this.pagination.page_size === requestedPageSize);
            if (isCached) return this.items;

            const { list } = useGallery();
            this.loading = true;
            try {
                const result = await list(params);
                this.items = result?.items ?? [];
                this.pagination = result?.pagination ?? null;
                return this.items;
            } finally {
                this.loading = false;
            }
        },

        async create(payload: CreateGalleryPayload) {
            const { create } = useGallery();
            const result = await create(payload);
            await this.fetchAll(
                {
                    page: this.pagination?.page ?? 1,
                    page_size: this.pagination?.page_size,
                },
                true,
            );
            return result;
        },

        async remove(id: string) {
            const { remove } = useGallery();
            await remove(id);
            this.items = this.items.filter((post) => post.id !== id);
        },
    },
});

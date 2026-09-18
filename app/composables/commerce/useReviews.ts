import type { PaginatedList } from "~/types/api";
import type { Review } from "~/types/review";

export interface ReviewListParams {
  page?: number;
  page_size?: number;
}

export interface CreateReviewPayload {
  product_id: string;
  rating: number;
  comment?: string;
}

export function useReviews() {
  const { get, post } = useApi();

  const list = (productId: string, params?: ReviewListParams) =>
    get<PaginatedList<Review>>(
      `/products/${productId}/reviews`,
      params as Record<string, string | number>,
    );

  const create = (payload: CreateReviewPayload) =>
    post<Review>("/reviews", payload);

  return { list, create };
}

import type {
    DashboardSummary,
    LowStockProduct,
    RevenueHistoryPoint,
} from "~/types/dashboard";

export function useDashboard() {
    const { get } = useApi();

    const getSummary = () =>
        get<DashboardSummary>("/admin/dashboard/summary");

    const getRevenueHistory = (period: "day" | "month") =>
        get<RevenueHistoryPoint[]>("/admin/dashboard/revenue-history", {
            period,
        });

    const getLowStock = () =>
        get<LowStockProduct[]>("/admin/dashboard/low-stock");

    return { getSummary, getRevenueHistory, getLowStock };
}

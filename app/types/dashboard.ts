export interface DashboardSummary {
    total_products: number;
    total_units_sold: number;
    total_revenue: number;
}

export interface RevenueHistoryPoint {
    period: string;
    revenue: number;
}

export interface LowStockProduct {
    id: string;
    name_uz: string;
    stock: number;
}

export interface AdminOrderItem {
  id: string;
  slug: string;
  name: string;
  sku?: string | null;
  qty: number;
  unitPrice: number;
}

export interface AdminActivity {
  id: string;
  type: string;
  message: string;
  adminUser: string | null;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  reference: string;
  createdAt: string;
  customerName: string;
  phone: string;
  city: string;
  address: string | null;
  postal: string | null;
  status: string;
  confirmationStatus: string | null;
  deliveryStatus: string | null;
  paymentStatus: string;
  source: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  device: string | null;
  browser: string | null;
  country: string | null;
  total: number;
  discount: number;
  shippingFee: number;
  notes: string | null;
  externalId: number | null;
  externalUuid: string | null;
  externalStatus: string | null;
  externalDeliveryStatus: string | null;
  lastSyncedAt: string | null;
  trackingNumber: string | null;
  items: AdminOrderItem[];
  activities: AdminActivity[];
}

export const STATUS_ORDER = [
  "new",
  "pending",
  "pending_confirmation",
  "confirmed",
  "preparing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "paid",
  "canceled",
  "cancelled",
  "returned",
];

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  pending: "Pending",
  pending_confirmation: "Awaiting Confirmation",
  confirmed: "Confirmed",
  preparing: "Preparing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  paid: "Paid",
  canceled: "Canceled",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  google: "Google",
  snapchat: "Snapchat",
  youtube: "YouTube",
  other: "Other",
};

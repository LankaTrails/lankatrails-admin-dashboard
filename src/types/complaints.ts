export type BusinessType = "INDIVIDUAL" | "COMPANY" | "ORGANIZATION";
export type UserStatus = "ACTIVE" | "PENDING" | "DISABLED";
export type ComplaintStatus = "RESOLVED" | "PENDING" | "IN_PROGRESS";
export type ComplaintResult = "REFUND_FROM_PROVIDER" | "REFUND_FROM_COMPANY" | "REJECT";
export type RefundStatus = "REFUNDED";

/** Mirrors the backend ComplaintViewDTO (fields the admin app reads). */
export interface Complaint {
  complaintId: number;
  serviceName: string | null;
  businessType: BusinessType | null;
  touristEmail: string | null;
  userStatus: UserStatus | null;
  complaintStatus: ComplaintStatus;
  complaintResult: ComplaintResult | null;
  complaintDateTime: string | null;
  description: string | null;
  bookingId: number | null;
  investigationStartedDate: string | null;
  paidAmount: string | number | null;
  refundReason: string | null;
  refundStatus: RefundStatus | null;
  complaintImgs: string[] | null;
  adminToTourist: string | null;
  adminToProvider: string | null;
}

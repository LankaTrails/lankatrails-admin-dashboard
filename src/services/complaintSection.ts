import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";
import type { Complaint, ComplaintResult } from "@/types/complaints";

/** All complaints (summary rows). The API returns null instead of [] when there are none. */
export async function findAllComplaints(): Promise<Complaint[]> {
  try {
    const response = await api.get("/admin/complaints");
    return response.data.data?.content ?? [];
  } catch (error) {
    throw toApiError(error, "Failed to load complaints");
  }
}

export async function findComplaintById(id: number | string): Promise<Complaint> {
  try {
    const response = await api.get(`/admin/complaints/${id}`);
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Failed to load the complaint");
  }
}

/** Marks the complaint IN_PROGRESS (PUT /admin/complaints/{id}, ComplaintViewDTO). */
export async function updateComplaintStatus(id: number | string, investigationStartedDate: string): Promise<void> {
  try {
    await api.put(`/admin/complaints/${id}`, { investigationStartedDate });
  } catch (error) {
    throw toApiError(error, "Failed to update the complaint status");
  }
}

/** Records who is at fault (PUT /admin/complaint-result/{id}, ComplaintViewDTO.complaintResult). */
export async function updateComplaintResult(id: number | string, complaintResult: ComplaintResult): Promise<void> {
  try {
    await api.put(`/admin/complaint-result/${id}`, { complaintResult });
  } catch (error) {
    throw toApiError(error, "Failed to save the fault classification");
  }
}

/**
 * Issues the refund. The backend refunds the booking's Stripe payment: a provider-fault refund
 * reverses the provider's payout, a company refund is paid by the platform.
 */
export async function processRefund(
  id: number | string,
  refund: { complaintResult: ComplaintResult; refundReason: string },
): Promise<void> {
  try {
    await api.put(`/admin/complaint-refund/${id}`, { ...refund, refundStatus: "REFUNDED" });
  } catch (error) {
    throw toApiError(error, "Failed to process the refund");
  }
}

/** Emails feedback to the provider and stores it on the complaint (adminToProvider). */
export async function sendFeedbackToProvider(id: number | string, message: string): Promise<void> {
  try {
    await api.put(`/admin/complaint-provider-feedback/${id}`, { adminToProvider: message });
  } catch (error) {
    throw toApiError(error, "Failed to send feedback to the provider");
  }
}

/** Emails feedback to the tourist and stores it on the complaint (adminToTourist). */
export async function sendFeedbackToTourist(id: number | string, message: string): Promise<void> {
  try {
    await api.put(`/admin/complaint-tourist-feedback/${id}`, { adminToTourist: message });
  } catch (error) {
    throw toApiError(error, "Failed to send feedback to the tourist");
  }
}

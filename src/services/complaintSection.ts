import api from "@/api/axiosInstance";
import { Complaint } from "@/types/complaints";

//load all the complaints (basic details)
export async function findAllComplaints(): Promise<Complaint[]> {
    try {
        const response = await api.get(`/admin/complaints`);
        console.log('Response from getAllComplaints:', response.data.data);
        return response.data.data.content;
    } catch (error : any) {
        if (error.response && error.response.data) {
            const { code, message, details, userMessage } = error.response.data;
            throw {
                code,
                message,
                details,
                userMessage,
            };
        
        }
        throw {
            message: 'Failed to load complaints',
            code: 'UNKNOWN_ERROR',
        };
    }
    
}

//load a specific complaint by its id
export async function findComplaintById(id:any): Promise<Complaint> {
    try {
        const response = await api.get(`/admin/complaints/${id}`);
        console.log('Response from find a Complaint By ID:', response.data);
        return response.data.data;
    } catch (error : any) {
        if (error.response && error.response.data) {
            const { code, message, details, userMessage } = error.response.data;
            throw {
                code,
                message,
                details,
                userMessage,
            };
        
        }
        throw {
            message: 'Failed to load complaints',
            code: 'UNKNOWN_ERROR',
        };
    }
    
}

//update complaint status to IN_PROGRESS
export async function updateComplaintStatus(id: string, investigationStartedDate: string): Promise<Complaint> {
    try {
        console.log('Updating complaint status with investigationStartedDate:', investigationStartedDate);
        const response = await api.put(`/admin/complaints/${id}`, { investigationStartedDate });
        console.log('Response from updating complaint status:', response.data);
        return response.data.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            const { code, message, details, userMessage } = error.response.data;
            throw {
                code,
                message,
                details,
                userMessage,
            };
        }
        throw {
            message: 'Failed to update complaint status',
            code: 'UNKNOWN_ERROR',
        };
    }
}

// update complaint result (REFUND_FROM_PROVIDER, REFUND_FROM_COMPANY, or REJECT)
export async function updateComplaintResult(id: string, complaintResult: string): Promise<Complaint> {
    try {
        console.log('Updating complaint result with:', complaintResult);
        const response = await api.put(`/admin/complaint-result/${id}`, { complaintResult });
        console.log('Response from updating complaint result:', response.data);
        return response.data.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            const { code, message, details, userMessage } = error.response.data;
            throw {
                code,
                message,
                details,
                userMessage,
            };
        }
        throw {
            message: 'Failed to update complaint result',
            code: 'UNKNOWN_ERROR',
        };
    }
}
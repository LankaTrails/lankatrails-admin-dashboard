import api from "@/api/axiosInstance";
import { Complaint } from "@/types/complaints";

//load all the complaints (basic details)
export async function findAllComplaints(): Promise<Complaint[]> {
    try {
        const response = await api.get('/admin/complaints');
        console.log('Response from getAllComplaints:', response.data);
        return response.data;
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

//update complaint status
// update complaint status
export async function updateComplaintStatus(id: string, updateData: any): Promise<void> {
    try {
        console.log('Updating complaint status with data:', updateData);
        const response = await api.put(`/admin/complaints/${id}`, updateData.resolutionStatus);
        console.log('Response from updating complaint status:', response.data);
        // No return value since it's void
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

// update complaint result
export async function updateComplaintResult(id: string, complaintResult: any): Promise<void> {
    try {
        console.log('Updating complaint result with data:',complaintResult);
        const response = await api.put(`/admin/complaint-result/${id}`, complaintResult);
        console.log('Response from updating complaint status:', response.data);
        // No return value since it's void
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
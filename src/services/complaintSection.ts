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
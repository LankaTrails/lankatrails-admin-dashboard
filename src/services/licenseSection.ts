import api from "@/api/axiosInstance";
import { LicenseDTO } from "@/types/provider";

//load all licenses
export async function loadAllLicenses(): Promise<LicenseDTO[]> {
    try {
        const response = await api.get('/admin/licenses/unchecked');
        console.log('Response from loadAllLicenses:', response.data);
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
            message: 'Failed to load licenses',
            code: 'UNKNOWN_ERROR',
        };
    }
}

//load a single license details by its id
export async function loadLicenseDetails(): Promise<LicenseDTO[]> {
    try {
        const response = await api.get('/admin/licenses/unchecked');
        console.log('Response from loadAllLicenses:', response.data);
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
            message: 'Failed to load licenses',
            code: 'UNKNOWN_ERROR',
        };
    }
}
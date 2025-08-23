export type BusinessType = 'INDIVIDUAL'| 'COMPANY' | 'ORGANIZATION';

export type UserStatus = 'ACTIVE' | 'PENDING' | 'DISABLED';

export type ComplaintStatus = 'RESOLVED' | 'PENDING';

export interface Complaint {
    businessName : string;
    businessType : BusinessType;
    touristEmail : string;
    userStatus : UserStatus;
    complaintStatus : ComplaintStatus;
    complaintId : string;
}
export type BusinessType = 'INDIVIDUAL'| 'COMPANY' | 'ORGANIZATION';

export type UserStatus = 'ACTIVE' | 'PENDING' | 'DISABLED';

export type ComplaintStatus = 'RESOLVED' | 'PENDING' | 'IN_PROGRESS';

export type FaultType = 'APP_FAULT' | 'PROVIDER_FAULT' | 'REJECT';

export interface Complaint {
    serviceName : string;
    businessType : BusinessType;
    touristEmail : string;
    userStatus : UserStatus;
    complaintStatus : ComplaintStatus;
    complaintId : string;
    complaintDateTime : string;
    description: string;
    bookingId : string;
    investigationStartedDate : string;
    faultType: String;
}

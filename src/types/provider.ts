
export type ServiceCategory = 'ACCOMMODATION'| 'TRANSPORT' | 'FOOD_BEVERAGE'|'TOUR_GUIDE' | 'ACTIVITY' ;

export interface LicenseDTO {
  licenseNumber: string;
  licenseId:string;
  expiryDate: string;
  licenseUrl: string;
  category:{
    categoryName: ServiceCategory;
  } ;
  providerId: number;
  categoryName:String;
  status: string;
  businessName: string;
}

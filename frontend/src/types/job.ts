export interface Job {
  id: number;
  jobContractName: any;     // Contract object
  jobLocationName: any;     // Location object
  jobServiceName: any;      // Service object
  jobCustomer: any;         // Customer object
  jobPrice: number;
  jobStart: string;
  jobRemark: string;
  jobURL: string | null;
}

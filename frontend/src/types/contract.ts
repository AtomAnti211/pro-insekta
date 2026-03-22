export interface Contract {
  id: number;
  contractLocationName: any;   // Location object
  contractServiceName: any;    // Service object
  contractCustomerName: any;   // Customer object
  contractPrice: number;
  contractStart: string;
  contractValid: boolean;
  contractFrequencyMonth: number;
}
export interface DueContract {
  contractId: number;

  // CUSTOMER
  customerId: number;
  customerName: string;
  customerVat: string;
  customerPostCode: string;
  customerCity: string;
  customerAddress: string;

  // LOCATION
  locationId: number;
  locationPostCode: string;
  locationCity: string;
  locationAddress: string;
  locationLat: number | null;
  locationLng: number | null;


  // SERVICE
  serviceId: number;
  serviceName: string;

  // CONTRACT INFO
  contractStart: string;
  contractFrequencyMonth: number;

  // DUE INFO
  nextDueDate: string;
  monthsUntilDue: number;
  dueNow: number;

  // OWNER
  ownerName: string;
  ownerVat: string;
  ownerPostCode: string;
  ownerAddress: string;
  ownerWorker: string;
  ownerPermission: string;
}

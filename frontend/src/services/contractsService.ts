export interface Contract {
  contractId: number;
  customerName: string;
  locationCity: string;
  locationAddress: string;
  serviceName: string;
  nextDueDate: string;
  monthsUntilDue: number;
}

export async function getDueFullContracts(): Promise<Contract[]> {
  const response = await fetch("http://localhost:8000/api/contracts/due-full/?format=json");

  if (!response.ok) {
    throw new Error("Hiba a due-full lekérésénél");
  }

  return await response.json();
}
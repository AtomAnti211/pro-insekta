import type { DueContract } from "../types/dueContracts";

export async function getDueFullContracts(): Promise<DueContract[]> {
  const response = await fetch("http://localhost:8000/api/contracts/due-full/?format=json");

  if (!response.ok) {
    throw new Error("Hiba a due-full lekérésénél");
  }

  return await response.json();
}

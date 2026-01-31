import type { Owner } from "../types/owner";

export async function getOwner(): Promise<Owner> {
  const response = await fetch("http://localhost:8000/api/owner/");
  if (!response.ok) {
    throw new Error("Failed to fetch owner data");
  }
  return response.json();
}
export async function sendContactMessage(payload: {
  name: string;
  email: string;
  phone: string;
  activity: string;
  message: string;
}) {
  const res = await fetch("http://localhost:8000/api/contact/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Hiba történt az üzenet küldésekor.");
  }

  return await res.json();
}

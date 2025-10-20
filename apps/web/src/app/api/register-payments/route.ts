import "../../../config/otel";

export async function POST(request: Request) {
  const { orderId, amount } = await request.json();

  const response = await fetch("http://localhost:4001/process-payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId, amount }),
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}

import { tracer } from "../../../config";

export async function POST(request: Request) {
  return tracer.startActiveSpan("api/register-payments", async (span) => {
    try {
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
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: 2, message: String(err) });
      throw err;
    } finally {
      span.end();
    }
  });
}

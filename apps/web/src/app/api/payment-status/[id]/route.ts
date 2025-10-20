import { NextRequest } from "next/server";

// SSE endpoint to stream payment status updates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(
          `http://localhost:4001/payment-status/${id}`
        );
        const reader = response.body?.getReader();

        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              try {
                const result = JSON.parse(data);
                controller.enqueue(`data: ${data}\n\n`);

                if (result.status !== "processing") {
                  controller.close();
                  return;
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error) {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

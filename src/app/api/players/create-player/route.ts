import { env } from "@/config/env";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const body = await request.text();

  const backendResponse = await fetch(`${env.API_BASE_URL}/players/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader
        ? {
            cookie: cookieHeader,
          }
        : {}),
    },
    body,
    cache: "no-store",
  });

  const responseBody = await backendResponse.text();

  return new Response(responseBody, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  });
}

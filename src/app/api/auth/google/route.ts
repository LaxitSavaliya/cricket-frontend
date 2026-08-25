import { env } from "@/config/env";

export async function POST(request: Request) {
  const body = await request.text();

  const backendResponse = await fetch(
    `${env.API_BASE_URL}/auth/player/google`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    },
  );

  const responseBody = await backendResponse.text();

  const headers = new Headers();

  headers.set(
    "Content-Type",
    backendResponse.headers.get("content-type") ?? "application/json",
  );

  const setCookie = backendResponse.headers.get("set-cookie");

  if (setCookie) {
    headers.set("set-cookie", setCookie);
  }

  return new Response(responseBody, {
    status: backendResponse.status,
    headers,
  });
}

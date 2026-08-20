import { env } from "@/config/env";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie");

  const backendResponse = await fetch(`${env.API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      ...(cookieHeader
        ? {
            cookie: cookieHeader,
          }
        : {}),
    },
    cache: "no-store",
  });

  const responseBody = await backendResponse.text();

  const headers = new Headers();

  headers.set(
    "Content-Type",
    backendResponse.headers.get("content-type") ?? "application/json",
  );

  // Critical:
  // Express sends Set-Cookie to remove cricket_session.
  // Forward it to the browser.
  const setCookie = backendResponse.headers.get("set-cookie");

  if (setCookie) {
    headers.set("set-cookie", setCookie);
  }

  return new Response(responseBody, {
    status: backendResponse.status,
    headers,
  });
}

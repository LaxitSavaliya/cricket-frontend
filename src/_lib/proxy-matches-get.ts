import "server-only";

import { env } from "@/config/env";

const BACKEND_BASE_URL = env.API_BASE_URL.replace(/\/+$/, "");

export async function proxyMatchesGet(
  request: Request,
  path = "",
): Promise<Response> {
  const incomingUrl = new URL(request.url);
  const backendUrl = new URL(`${BACKEND_BASE_URL}/matches${path}`);

  backendUrl.search = incomingUrl.search;

  try {
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: request.signal,
    });

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") ??
          "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Matches backend request failed:", error);

    return Response.json(
      {
        success: false,
        message: "Match service is currently unavailable.",
        errors: null,
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

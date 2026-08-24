import { proxyMatchesGet } from "@/_lib/proxy-matches-get";

export async function GET(request: Request): Promise<Response> {
  return proxyMatchesGet(request);
}

import { proxyMatchesGet } from "@/_lib/proxy-matches-get";

interface RouteContext {
  params: Promise<{
    slug: string[];
  }>;
}

const ALLOWED_SUBRESOURCES = new Set(["players", "score", "commentary"]);

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { slug: segments } = await context.params;

  const isMatchDetails = segments.length === 1;

  const subresource = segments[1];

  const isAllowedSubresource =
    segments.length === 2 &&
    typeof subresource === "string" &&
    ALLOWED_SUBRESOURCES.has(subresource);

  if (!isMatchDetails && !isAllowedSubresource) {
    return Response.json(
      {
        success: false,
        message: "Match endpoint not found.",
        errors: null,
      },
      {
        status: 404,
      },
    );
  }

  const path = segments.map((segment) => encodeURIComponent(segment)).join("/");

  return proxyMatchesGet(request, `/${path}`);
}

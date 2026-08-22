import { http } from "@/lib/api/http";

import type { CreatePlayerRequest } from "./player.types";

export async function createPlayer(
  payload: CreatePlayerRequest,
): Promise<void> {
  await http.post("/players/me", payload);
}

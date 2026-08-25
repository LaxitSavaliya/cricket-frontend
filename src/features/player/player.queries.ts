import { useMutation } from "@tanstack/react-query";

import { createPlayer } from "./player.api";
import type {
  CreatePlayerMutationOptions,
  CreatePlayerRequest,
  CreatePlayerResult,
} from "./player.types";

export function useCreatePlayer(options: CreatePlayerMutationOptions = {}) {
  return useMutation<CreatePlayerResult, Error, CreatePlayerRequest>({
    ...options,
    mutationFn: createPlayer,
  });
}

/**
 * Generic shape of a successful API response.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Generic shape of an API response containing a list/array of items.
 */
export type ApiListResponse<T> = ApiResponse<T[]>;

/**
 * Shape of the error payload returned by the backend API.
 */
export interface ApiErrorPayload {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: unknown;
}

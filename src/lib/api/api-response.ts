/**
 * Base shape shared by successful API responses.
 */
export interface ApiSuccessResponse {
  success: boolean;
  message: string;
}

/**
 * Successful API response containing data.
 */
export interface ApiResponse<T> extends ApiSuccessResponse {
  data: T;
}

/**
 * Successful API response containing a list of items.
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

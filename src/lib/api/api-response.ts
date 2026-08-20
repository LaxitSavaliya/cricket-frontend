/**
 * Generic shape of a successful API response.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

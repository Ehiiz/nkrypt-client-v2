export interface IApiResponse<T> {
  data?: T | undefined; // The main payload (generic type T)
  status: string; // The status of the response (e.g., "success")
  success: boolean; // Whether the request was successful
  message: string; // Additional message (e.g., error or success description)
}

export const UNKNOWN_ERROR_MESSAGE = 'An unknown error occurred!'

export function toErrorMessage(failure: unknown): string {
  return failure instanceof Error ? failure.message : UNKNOWN_ERROR_MESSAGE
}

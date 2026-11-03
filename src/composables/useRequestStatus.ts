import { ref } from 'vue'
import { toErrorMessage } from '@/utils/errors'

/**
 * Tracks the loading flag and the error message of an asynchronous request.
 * `run` resolves with the request's value, or with `undefined` once a failure has been recorded.
 */
export function useRequestStatus() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function run<T>(request: () => Promise<T>): Promise<T | undefined> {
    isLoading.value = true
    error.value = null
    try {
      return await request()
    } catch (failure) {
      error.value = toErrorMessage(failure)
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, run }
}

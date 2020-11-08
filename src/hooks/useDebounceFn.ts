import { debounce } from 'lodash'
import { useRef } from 'react'
import useCreation from './useCreation'

interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

type Fn = (...args: any) => any

function useDebounceFn<T extends Fn>(fn: T, options?: DebounceOptions) {
  const fnRef = useRef<T>(fn)
  fnRef.current = fn

  const wait = options?.wait ?? 1000

  const debounced = useCreation(
    () =>
      debounce<T>(
        ((...args: any[]) => {
          return fnRef.current(...args)
        }) as T,
        wait,
        options,
      ),
    [],
  )

  return {
    run: (debounced as unknown) as T,
    cancel: debounced.cancel,
    flush: debounced.flush,
  }
}

export default useDebounceFn

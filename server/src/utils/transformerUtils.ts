import * as dayjs from 'dayjs'

export function dateTransformer(format: string = 'YYYY-MM-DD HH:mm:ss') {
  return {
    from: (value: any) => {
      if (!value) {
        return value
      }
      const numberValue = Number(value)
      if (numberValue) {
        value = numberValue
      }
      return dayjs(value).format(format)
    },
    to: (value: any) => value,
  } as const
}

export function numberTransformer() {
  return {
    from: (value: any) => {
      if (!value) {
        return value
      }
      return Number(value)
    },
    to: (value: any) => value,
  } as const
}

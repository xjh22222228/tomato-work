
export enum TypeNames {
  收入 = 1,
  支出 = 2
}

export enum TypeColors {
  '#108ee9' = 1,
  '#f50' = 2
}

export const TYPES = [
  { name: '收入', value: 1, symbol: '+', color: '#666' },
  { name: '支出', value: 2, symbol: '-', color: '#f50' }
]

export const OPTION_TYPES = [
  { name: '全部', value: '' },
  ...TYPES
]

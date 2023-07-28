import { DATA_STORAGE_UNITS } from '@/enums'

export const abbrCenter = (isConnected: boolean, fullAddrss: string) => {
  if (isConnected) {
    return fullAddrss!.slice(0, 6) + '...' + fullAddrss!.slice(-4)
  }
  return ''
}

export const fileSizePreparator = new Intl.NumberFormat('en', {
  style: 'unit',
  unit: DATA_STORAGE_UNITS.KB,
})

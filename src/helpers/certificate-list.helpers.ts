import { FileItemType } from '@/types'

export const useSearchInTheList = (
  certificatesList: FileItemType[],
  data: string,
) => {
  const searchQuery = data.toLowerCase()
  certificatesList = certificatesList.filter(certificate => {
    const title = certificate.title.toLowerCase()
    return title.includes(searchQuery)
  })
  return certificatesList
}

import { config } from '@/config'

const ipfsUri = 'ipfs://'
const baseDescription =
  'This is a certificate that confirms that its owner has completed the course'

export function createMetadataFile(
  certificateFileName: string,
  ipfsImageCid: string,
  contractName: string,
) {
  const metadata = prepareMetadataStructure(
    certificateFileName,
    ipfsImageCid,
    contractName,
  )
  const jsonString = JSON.stringify(metadata, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  return new File([blob], config.METADATA_FILE_NAME, {
    type: 'application/json',
  })
}

export function prepareMetadataStructure(
  certificateFileName: string,
  ipfsImageCid: string,
  contractName: string,
) {
  const [certificateName] = certificateFileName.split('.')

  return {
    name: certificateName,
    description: `${baseDescription}' '${contractName}`,
    image: ipfsUri + ipfsImageCid + '/' + certificateFileName,
    external_url: '',
  }
}

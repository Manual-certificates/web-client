import { computed, ref } from 'vue'
import { EthProviderRpcError, TokenContractV2__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { handleEthError } from '@/helpers'
// import { useI18n } from 'vue-i18n'

// const { t } = useI18n() //todo I cant do it
export const useTokenContact = (address: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInterface = TokenContractV2__factory.createInterface()

  const init = (address: string) => {
    if (!address) {
      throw new Error('errors.failed-init-contract')
    }
    contractAddress.value = address
  }

  const useMintBatch = async (addresses: string[], URIs: string[]) => {
    if (!provider.value) {
      throw new Error('errors.provider-unauthorized')
    }
    try {
      const data = contractInterface.encodeFunctionData('mintBatch', [
        addresses,
        URIs,
      ])

      return provider.value.getHashFromTxResponse(
        await provider.value.signAndSendTx({
          to: contractAddress.value,
          data,
        }),
      )
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    useMintBatch,
  }
}

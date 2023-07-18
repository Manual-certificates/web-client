import { computed, ref } from 'vue'
import { EthProviderRpcError, TokenContractV2__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler, handleEthError } from '@/helpers'

export const useTokenContact = (address: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInterface = TokenContractV2__factory.createInterface()

  const init = (address: string) => {
    if (!address) {
      ErrorHandler.process('Failed to  init contract: empty address')
      //todo maybe have to rewrite to throw
      return
    }
    contractAddress.value = address
  }

  const useMintBatch = async (addresses: string[], URIs: string[]) => {
    if (!provider.value) {
      ErrorHandler.process('Failed to call mint: empty provider')
      return
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

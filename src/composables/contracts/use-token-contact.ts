import { computed, ref } from 'vue'
import { EthProviderRpcError, TokenContract__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { handleEthError } from '@/helpers'

export const useTokenContact = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)
  const contractAddress = ref(address || '')
  const contractInterface = TokenContract__factory.createInterface()

  const contractInstance = computed(() =>
    provider.value.currentProvider && contractAddress.value
      ? TokenContract__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )
      : undefined,
  )

  const init = (address: string) => {
    if (!address) {
      throw new Error()
    }

    contractAddress.value = address
  }

  const getName = () => {
    if (!contractInstance.value) {
      throw new Error()
    }

    return contractInstance.value.name()
  }

  const useMintBatch = async (addresses: string[], URIs: string[]) => {
    if (!provider.value || !contractAddress.value) {
      throw new Error()
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
    getName,
  }
}

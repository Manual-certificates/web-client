import { computed, ref } from 'vue'
import { EthProviderRpcError, TokenContract__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { handleEthError } from '@/helpers'
import { TokenContract } from '@/types'

export const useTokenContact = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)
  const contractAddress = ref(address || '')
  const contractInstance = ref<TokenContract | undefined>()
  const contractInterface = TokenContract__factory.createInterface()

  const getContractInstance = () => {
    if (!provider.value.currentProvider || !contractAddress.value) return

    return TokenContract__factory.connect(
      contractAddress.value,
      provider.value.currentProvider,
    )
  }

  contractInstance.value = getContractInstance()

  const init = (address: string) => {
    if (!address) {
      throw new Error()
    }

    contractAddress.value = address
    contractInstance.value = getContractInstance()
  }

  const getName = () => {
    if (!contractInstance.value) {
      throw new Error()
    }

    return contractInstance.value.name()
  }

  const useMintBatch = async (addresses: string[], URIs: string[]) => {
    if (!provider.value) {
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

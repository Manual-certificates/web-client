import { computed, ref } from 'vue'
import { EthProviderRpcError, TokenContract__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { handleEthError } from '@/helpers'

export const useTokenContact = (address: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)
  const contractAddress = ref(address || '')
  const contractInterface = TokenContract__factory.createInterface()
  const signer = web3ProvidersStore.provider.currentSigner

  const contractInstance = computed(
    () =>
      (!!address &&
        !!signer &&
        TokenContract__factory.connect(address, signer)) ||
      undefined,
  )

  const init = (address: string) => {
    if (!address) {
      throw new Error()
    }

    contractAddress.value = address
  }

  const getName = async () => {
    if (!contractInstance.value) {
      throw new Error()
    }

    return await contractInstance.value.name()
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

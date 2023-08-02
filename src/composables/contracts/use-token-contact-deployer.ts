import { computed, ref } from 'vue'
import { EthProviderRpcError, TokenContractDeployer__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { handleEthError } from '@/helpers'
import { ethers } from 'ethers'
import { TokenContract__factory } from '@/types/contracts/factories/contracts'

export const useTokenContactDeployer = (address: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInterface = TokenContractDeployer__factory.createInterface()

  const deployTokenContract = async (
    tokenName: string,
    tokenContract: string,
    baseUri: string,
  ) => {
    if (!provider.value) return
    const signer = web3ProvidersStore.provider.currentSigner
    if (signer === undefined) {
      return
    }
    const contractInstance = TokenContractDeployer__factory.connect(
      address,
      signer,
    )
    try {
      const params = ethers.utils.defaultAbiCoder
        .encode(
          ['string', 'string', 'string'],
          [tokenName, tokenContract, baseUri],
        )
        .substring(2)

      const inputs = TokenContract__factory.createInterface()
        .getSighash('__TokenContract_init')
        .concat(params)

      const randomNumber = ethers.utils.hexZeroPad(
        ethers.BigNumber.from(ethers.utils.randomBytes(32)).toHexString(),
        32,
      )
      const userAddr = await signer.getAddress()

      const salt = ethers.utils.keccak256(
        ethers.utils.hexConcat([
          userAddr,
          ethers.utils.hexlify(Date.now()),
          randomNumber,
        ]),
      )

      const data = contractInterface.encodeFunctionData('deployTokenContract', [
        inputs,
        salt,
      ])

      await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      return await contractInstance.predictTokenAddress(inputs, salt)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    deployTokenContract,
  }
}

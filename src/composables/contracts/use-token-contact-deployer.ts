import { computed, ref } from 'vue'
import { TokenContractDeployer__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { ethers } from 'ethers'
import { TokenContract__factory } from '@/types/contracts/factories/contracts'

export const useTokenContactDeployer = (address: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()

  const contractAddress = ref(address || '')

  const contractInterface = TokenContractDeployer__factory.createInterface()

  if (!web3ProvidersStore.provider) return

  const signer = web3ProvidersStore.provider.currentSigner
  if (signer === undefined) return

  const contractInstance = computed(() =>
    TokenContractDeployer__factory.connect(address, signer),
  )

  const deployTokenContract = async (
    tokenName: string,
    tokenContract: string,
    baseUri: string,
  ): Promise<string> => {
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

    await web3ProvidersStore.provider.signAndSendTx({
      to: contractAddress.value,
      data,
    })

    return contractInstance.value.predictTokenAddress(inputs, salt)
  }

  return {
    deployTokenContract,
  }
}

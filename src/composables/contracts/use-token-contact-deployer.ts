import { computed, ref } from 'vue'
import { TokenContractDeployer__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { ethers } from 'ethers'
import { TokenContract__factory } from '@/types/contracts/factories/contracts'

export const useTokenContactDeployer = (address: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()

  const contractAddress = ref(address || '')

  const contractInterface = TokenContractDeployer__factory.createInterface()

  const signer = web3ProvidersStore.provider.currentSigner

  const contractInstance = computed(
    () =>
      (!!address &&
        !!signer &&
        TokenContractDeployer__factory.connect(address, signer)) ||
      undefined,
  )

  const createFunctionsParams = async (
    tokenName: string,
    tokenContract: string,
    baseUri: string,
  ) => {
    if (!signer) return { inputs: '', salt: '' }

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

    return {
      inputs,
      salt,
    }
  }

  const deployTokenContract = async (inputs: string, salt: string) => {
    const data = contractInterface.encodeFunctionData('deployTokenContract', [
      inputs,
      salt,
    ])

    const receipt = await web3ProvidersStore.provider.signAndSendTx({
      to: contractAddress.value,
      data,
    })

    return receipt
  }

  const predictTokenAddress = async (inputs: string, salt: string) => {
    if (!contractInstance.value) return ''

    return contractInstance.value.predictTokenAddress(inputs, salt)
  }

  return {
    createFunctionsParams,
    deployTokenContract,
    predictTokenAddress,
  }
}

<template>
  <div class="deployment">
    <deploy-step
      v-if="isStepDeploy"
      @deploy-contract="(name: string) => deployTokenContract(name)"
    />
    <deploying-step v-else-if="isStepDeploying" />
    <deployed-step
      v-else-if="isStepDeployed"
      :address="deployedContractAddress"
      @close="emit('close')"
    />
  </div>
</template>
<script lang="ts" setup>
import { ErrorHandler } from '@/helpers'
import { DeployStep, DeployingStep, DeployedStep } from '@/common'
import { ref, computed } from 'vue'
import { useTokenContactDeployer } from '@/composables'
import { config } from '@config'
import { useI18n } from 'vue-i18n'
import { DEPLOYMENT_STEP } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
const { t } = useI18n()

const deployedContractAddress = ref('')

const web3Store = useWeb3ProvidersStore()

const step = ref(DEPLOYMENT_STEP.deploy)
const isStepDeploy = computed(() => step.value === DEPLOYMENT_STEP.deploy)
const isStepDeploying = computed(() => step.value === DEPLOYMENT_STEP.deploying)
const isStepDeployed = computed(() => step.value === DEPLOYMENT_STEP.deployed)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:error-msg', v: string): void
}>()

const isValidChain = computed(
  () =>
    String(web3Store.provider.chainId).toLowerCase() ===
    config.SUPPORTED_CHAIN_ID.toLowerCase(),
)

async function deployTokenContract(name: string) {
  try {
    if (!isValidChain.value) {
      emit('update:error-msg', t('errors.unsupported-chain'))
      return
    }

    step.value = DEPLOYMENT_STEP.deploying

    const { createFunctionsParams, deployTokenContract, predictTokenAddress } =
      useTokenContactDeployer(config.TOKEN_CONTRACT_ADDR)

    const funcParams = await createFunctionsParams(name, name, '')
    await deployTokenContract(funcParams.inputs, funcParams.salt)
    deployedContractAddress.value = await predictTokenAddress(
      funcParams.inputs,
      funcParams.salt,
    )

    step.value = DEPLOYMENT_STEP.deployed
  } catch (error) {
    ErrorHandler.process(error)
    emit('update:error-msg', t('errors.failed-sent-tx'))
  }
}
</script>

<style lang="scss" scoped>
.deployment {
  margin-bottom: toRem(15);
}
</style>

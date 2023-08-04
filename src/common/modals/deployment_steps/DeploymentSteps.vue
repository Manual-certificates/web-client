<template>
  <div class="contract-deployment-modal__body">
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
const { t } = useI18n()

const deployedContractAddress = ref('')

const step = ref(DEPLOYMENT_STEP.deploy)
const isStepDeploy = computed(() => step.value === DEPLOYMENT_STEP.deploy)
const isStepDeploying = computed(() => step.value === DEPLOYMENT_STEP.deploying)
const isStepDeployed = computed(() => step.value === DEPLOYMENT_STEP.deployed)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:error-msg', v: string): void
}>()

async function deployTokenContract(name: string) {
  try {
    step.value = DEPLOYMENT_STEP.deploying

    const res = await useTokenContactDeployer(
      config.TOKEN_CONTRACT_ADDR,
    ).deployTokenContract(name, name, '')

    if (!res) {
      throw new Error('empty deployed address')
    }

    deployedContractAddress.value = res
    step.value = DEPLOYMENT_STEP.deployed
  } catch (error) {
    ErrorHandler.process(error)
    emit('update:error-msg', t('errors.failed-sent-tx'))
  }
}
</script>

<style lang="scss" scoped>
.contract-deployment-modal__pane {
  background: var(--background-primary-main);
  padding: toRem(24);
  border-radius: toRem(8);
  width: 100%;
  max-width: toRem(552);
}

.contract-deployment-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: toRem(10);
}

.contract-deployment-modal__body {
  margin-bottom: toRem(15);
}

.contract-deployment-modal__icon-title {
  display: flex;
  align-items: center;
}

.contract-deployment-modal__icon-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
  width: toRem(32);
  height: toRem(32);
}

.contract-deployment-modal__title-wrp {
  margin-left: toRem(10);
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.contract-deployment-modal__title {
  font-size: toRem(20);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary-main);
}
</style>

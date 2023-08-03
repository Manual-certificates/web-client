<template>
  <modal
    :is-shown="props.isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    @update:is-shown="(value: boolean) => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="contract-deployment-modal__pane">
        <div class="contract-deployment-modal__header">
          <div class="contract-deployment-modal__icon-title">
            <div class="contract-deployment-modal__icon-wrp">
              <icon :name="$icons.deploy" />
            </div>
            <div class="contract-deployment-modal__title-wrp">
              <h5 class="contract-deployment-modal__title">
                {{ $t('contract-deployment-modal.title') }}
              </h5>
            </div>
          </div>

          <app-button
            class="contract-deployment-modal__close-btn"
            scheme="default"
            :icon-right="$icons.x"
            @click="modal.close"
          />
        </div>

        <div class="contract-deployment-modal__body">
          <deploy-step
            v-if="isStepDeploy"
            @deploy-contract="(name: string) => deployTokenContract(name)"
          />
          <deploying-step v-else-if="isStepDeploying" />
          <deployed-step
            v-else-if="isStepDeployed"
            :address="deployedContractAddress"
            @close="modal.close"
          />
        </div>
      </div>
    </template>
  </modal>
</template>
<script lang="ts" setup>
import { ErrorHandler } from '@/helpers'
import {
  DeployStep,
  DeployingStep,
  DeployedStep,
  Icon,
  AppButton,
  Modal,
} from '@/common'
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

const props = withDefaults(
  defineProps<{
    isShown: boolean
    isCloseByClickOutside?: boolean
    title?: string
    subtitle?: string
  }>(),
  {
    title: '',
    subtitle: '',
    isCloseByClickOutside: true,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'update:error-msg', v: string): void
}>()

function setDeployingStep() {
  step.value = DEPLOYMENT_STEP.deploying
}

function setDeployedStep() {
  step.value = DEPLOYMENT_STEP.deployed
}

async function deployTokenContract(name: string) {
  try {
    setDeployingStep()

    const res = await useTokenContactDeployer(
      config.TOKEN_CONTRACT_ADDR,
    ).deployTokenContract(name, name, '')

    if (!res) {
      throw new Error('empty deployed address')
    }

    deployedContractAddress.value = res
    setDeployedStep()
  } catch (error) {
    ErrorHandler.process(error)
    emit('update:is-shown', false)
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

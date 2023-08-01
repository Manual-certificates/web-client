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
            <div class="contract-deployment-modal__icon">
              <icon :name="$icons.deploy" />
            </div>
            <div class="contract-deployment-modal__header-titles">
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
          <deploy-step-modal
            v-if="isStepDeploy"
            @deploy-contract="(name: string) => deployTokenContract(name)"
          />
          <deploying-step-modal v-if="isStepDeploying" />
          <deployed-step-modal
            v-if="isStepDeployed"
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
import { Icon, AppButton, Modal } from '@/common'
import {
  DeployStepModal,
  DeployingStepModal,
  DeployedStepModal,
} from '@/common'
import { ref, computed } from 'vue'
import { useTokenContactDeployer } from '@/composables'
import { config } from '@config'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const deployStep = 'deploy'
const deployingStep = 'deploying'
const deployedStep = 'deployed'

const deployedContractAddress = ref('')

const step = ref(deployStep)
const isStepDeploy = computed(() => step.value === deployStep)
const isStepDeploying = computed(() => step.value === deployingStep)
const isStepDeployed = computed(() => step.value === deployedStep)

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
  (e: 'update:is-error-modal-shown', v: boolean): void
  (e: 'update:error-msg', v: string): void
}>()

function setDeployingStep() {
  step.value = deployingStep
}

function setDeployedStep() {
  step.value = deployedStep
}

async function deployTokenContract(name: string) {
  try {
    setDeployingStep()

    const res = await useTokenContactDeployer(
      config.CONTRACT_ADDR,
    ).deployTokenContract(name, name, '')

    if (!res) {
      throw new Error('empty deployed address')
    }

    deployedContractAddress.value = res
  } catch (error) {
    ErrorHandler.process(error)
    emit('update:is-shown', false)
    emit('update:error-msg', t('errors.failed-sent-tx'))
    emit('update:is-error-modal-shown', true)
  } finally {
    setDeployedStep()
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

.contract-deployment-modal__icon {
  display: flex;
  flex-direction: column;
  position: relative;
  width: toRem(32);
  height: toRem(32);
}

.contract-deployment-modal__header-titles {
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

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

        <deployment-steps
          @close="modal.close"
          @update:error-msg="(msg:string) => emit('update:error-msg', msg)"
        />
      </div>
    </template>
  </modal>
</template>
<script lang="ts" setup>
import { DeploymentSteps, Icon, AppButton, Modal } from '@/common'

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

<template>
  <modal
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    @update:is-shown="(value: boolean) => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="deployment-confirmation-modal__pane">
        <div class="deployment-confirmation-modal__header">
          <div class="deployment-confirmation-modal__icon-title-wrp">
            <div class="deployment-confirmation-modal__icon-wrp">
              <icon :name="$icons.deploy" />
            </div>
            <div class="deployment-confirmation-modal__title-wrp">
              <h5 class="deployment-confirmation-modal__title">
                {{ $t('deployment-confirmation-modal.title') }}
              </h5>
            </div>
          </div>
          <app-button
            class="deployment-confirmation-modal__close-btn"
            scheme="default"
            :icon-right="$icons.x"
            @click="modal.close"
          />
        </div>
        <div class="deployment-confirmation-modal__body">
          <p class="deployment-confirmation-modal__subtitle">
            {{ $t('deployment-confirmation-modal.subtitle') }}
          </p>
        </div>
        <div class="deployment-confirmation-modal__btns-wrp">
          <app-button
            class="deployment-confirmation-modal__btn"
            :class="'deployment-confirmation-modal__have-btn'"
            size="large"
            scheme="default"
            :text="$t('deployment-confirmation-modal.have-btn')"
            @click="modal.close"
          />
          <app-button
            class="deployment-confirmation-modal__btn"
            size="large"
            color="success"
            :text="$t('deployment-confirmation-modal.deploy-btn')"
            @click="openContractDeployment"
          />
        </div>
      </div>
    </template>
  </modal>
</template>
<script lang="ts" setup>
import { Icon, AppButton, Modal } from '@/common'

withDefaults(
  defineProps<{
    isShown: boolean
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: true,
  },
)

function openContractDeployment() {
  emit('open-contract-deployment')
}

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'open-contract-deployment'): void
}>()
</script>
<style lang="scss" scoped>
.deployment-confirmation-modal__pane {
  background: var(--background-primary-main);
  padding: toRem(24);
  border-radius: toRem(8);
  width: 100%;
  max-width: toRem(652);
}

.deployment-confirmation-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: toRem(10);
}

.deployment-confirmation-modal__title-wrp {
  margin-left: toRem(10);
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.deployment-confirmation-modal__title {
  font-size: toRem(20);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary-main);
}

.deployment-confirmation-modal__icon-title-wrp {
  display: flex;
  align-items: center;
}

.deployment-confirmation-modal__icon-wrp {
  width: toRem(32);
  height: toRem(32);
}

.deployment-confirmation-modal__subtitle {
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.45;
  color: var(--text-secondary-light);
}

.deployment-confirmation-modal__btns-wrp {
  display: flex;
  justify-content: center;
  margin-top: toRem(15);
}

.deployment-confirmation-modal__btn {
  width: 100%;
  border-radius: toRem(8);
  margin-right: toRem(10);
}

.deployment-confirmation-modal__have-btn {
  color: var(--info-main);
}
</style>

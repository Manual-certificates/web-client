<template>
  <modal
    :is-shown="props.isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    @update:is-shown="(value: boolean) => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="confirmation-modal__pane">
        <div class="confirmation-modal__header">
          <div class="confirmation-modal__icon-title">
            <div class="confirmation-modal__icon-wrp">
              <icon :name="$icons.deploy" />
            </div>
            <div class="confirmation-modal__title-wrp">
              <h5 class="confirmation-modal__title">
                {{ $t('confirmation-modal.title') }}
              </h5>
            </div>
          </div>
          <app-button
            class="confirmation-modal__close-btn"
            scheme="default"
            :icon-right="$icons.x"
            @click="modal.close"
          />
        </div>
        <div class="confirmation-modal__body">
          <p class="confirmation-modal__subtitle">
            {{ $t('confirmation-modal.subtitle') }}
          </p>
        </div>
        <div class="confirmation-modal__btns-wrp">
          <app-button
            class="confirmation-modal__btn confirmation-modal__have-btn"
            size="large"
            scheme="default"
            :text="$t('confirmation-modal.have-btn')"
            @click="modal.close"
          />
          <app-button
            class="confirmation-modal__btn"
            size="large"
            color="success"
            :text="$t('confirmation-modal.deploy-btn')"
            @click="openContractDeployment"
          />
        </div>
      </div>
    </template>
  </modal>
</template>
<script lang="ts" setup>
import { Icon, AppButton, Modal } from '@/common'

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

function openContractDeployment() {
  emit('open-contract-deployment')
}

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'open-contract-deployment'): void
}>()
</script>
<style lang="scss" scoped>
.confirmation-modal__pane {
  background: var(--background-primary-main);
  padding: toRem(24);
  border-radius: toRem(8);
  width: 100%;
  max-width: toRem(652);
}

.confirmation-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: toRem(10);
}

.confirmation-modal__title-wrp {
  margin-left: toRem(10);
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.confirmation-modal__title {
  font-size: toRem(20);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary-main);
}

.confirmation-modal__icon-title {
  display: flex;
  align-items: center;
}

.confirmation-modal__icon-wrp {
  width: toRem(32);
  height: toRem(32);
}

.confirmation-modal__subtitle {
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.45;
  color: var(--text-secondary-light);
}

.confirmation-modal__btns-wrp {
  display: flex;
  justify-content: center;
  margin-top: toRem(15);
}

.confirmation-modal__btn {
  width: 100%;
  border-radius: toRem(8);
  margin-right: toRem(10);
}

.confirmation-modal__have-btn {
  color: var(--info-main);
}
</style>

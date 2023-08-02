<template>
  <div class="contract-deployment-modal__body">
    <span class="contract-deployment-modal__subtitle">
      {{ $t('contract-deployment-modal.subtitle-deployed') }}
    </span>
  </div>
  <div class="contract-deployment-modal__verified-wrp">
    <div class="contract-deployment-modal__field-input">
      <input-field v-model="form.address" :readonly="form.address" />
    </div>
    <app-button
      size="small"
      color="info"
      :icon-right="$icons.copy"
      @click="copyToClipboard(props.address)"
    />
  </div>
  <div class="contract-deployment-modal__btns-wrp">
    <app-button
      class="contract-deployment-modal__btn"
      size="large"
      color="info"
      :text="$t('contract-deployment-modal.ok-btn')"
      @click="emit('close')"
    />
  </div>
</template>
<script lang="ts" setup>
import { copyToClipboard } from '@/helpers'
import { InputField } from '@/fields'
import { AppButton } from '@/common'
import { reactive } from 'vue'

const props = withDefaults(
  defineProps<{
    address: string
  }>(),
  {
    address: '',
  },
)

const form = reactive({
  address: props.address,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
<style lang="scss" scoped>
.contract-deployment-modal__body {
  margin-bottom: toRem(15);
}

.contract-deployment-modal__btns-wrp {
  display: flex;
  margin-top: toRem(15);
}

.contract-deployment-modal__btn {
  width: 100%;
  border-radius: toRem(8);
  margin-right: toRem(10);
}

.contract-deployment-modal__verified-wrp {
  margin-right: toRem(15);
  display: flex;
  justify-content: space-between;
}

.contract-deployment-modal__field-input {
  width: 100%;
  padding-right: toRem(15);
}

.contract-deployment-modal__subtitle {
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.45;
  color: var(--text-secondary-light);
}
</style>

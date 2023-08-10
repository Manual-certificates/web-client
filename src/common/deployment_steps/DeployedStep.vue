<template>
  <div class="deployed-step">
    <div class="deployed-step__title-wrp">
      <span class="deployed-step__title">
        {{ $t('deployed-step.subtitle') }}
      </span>
    </div>
    <div class="deployed-step__verified-wrp">
      <div class="deployed-step__input-wrp">
        <input-field
          readonly
          :model-value="address"
          :error-message="
            !address.length ? t('errors.empty-deployed-address') : ''
          "
        />
      </div>
      <app-button
        size="small"
        color="info"
        :icon-right="$icons.copy"
        @click="copyToClipboard(address), $event.target.blur()"
      />
    </div>
    <div class="deployed-step__btns-wrp">
      <app-button
        class="deployed-step__ok-btn"
        size="large"
        color="info"
        :text="$t('deployed-step.ok-btn')"
        @click="emit('close')"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { copyToClipboard } from '@/helpers'
import { InputField } from '@/fields'
import { AppButton } from '@/common'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps<{
  address: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
<style lang="scss" scoped>
.deployed-step__title-wrp {
  margin-bottom: toRem(15);
}

.deployed-step__btns-wrp {
  display: flex;
  margin-top: toRem(15);
}

.deployed-step__ok-btn {
  width: 100%;
  border-radius: toRem(8);
  margin-right: toRem(10);
}

.deployed-step__verified-wrp {
  margin-right: toRem(15);
  display: flex;
  justify-content: space-between;
}

.deployed-step__input-wrp {
  width: 100%;
  padding-right: toRem(15);
}

.deployed-step__title {
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.45;
  color: var(--text-secondary-light);
}
</style>

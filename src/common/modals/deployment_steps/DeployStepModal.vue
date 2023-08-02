<template>
  <div class="contract-deployment-modal__body">
    <span class="contract-deployment-modal__subtitle">
      {{ $t('contract-deployment-modal.subtitle') }}
    </span>
  </div>
  <div>
    <div class="contract-deployment-modal__labels-wrp">
      <span class="contract-deployment-modal__span">
        {{ $t('contract-deployment-modal.contract-name') }}
      </span>
      <span class="contract-deployment-modal__span">
        {{ form.name.length + '/' + MAX_LENGTH.contractName }}
      </span>
    </div>
    <input-field
      v-model="form.name"
      :error-message="form.name.length ? getFieldErrorMessage('name') : ''"
    />
  </div>
  <div class="contract-deployment-modal__btns-wrp">
    <app-button
      class="contract-deployment-modal__btn"
      size="large"
      color="info"
      :text="$t('contract-deployment-modal.deploy-btn')"
      :disabled="!isFormValid()"
      @click="emit('deploy-contract', form.name)"
    />
  </div>
</template>
<script lang="ts" setup>
import { InputField } from '@/fields'
import { AppButton } from '@/common'
import { reactive } from 'vue'
import { useFormValidation } from '@/composables'
import { required, maxLength } from '@/validators'
import { MAX_LENGTH } from '@/enums'

const form = reactive({
  name: '',
})

const emit = defineEmits<{
  (e: 'deploy-contract', v: string): void
}>()

const { isFormValid, getFieldErrorMessage } = useFormValidation(form, {
  name: { required, maxLength: maxLength(MAX_LENGTH.contractName) },
})
</script>

<style lang="scss" scoped>
.contract-deployment-modal__body {
  margin-bottom: toRem(15);
}

.contract-deployment-modal__subtitle {
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.45;
  color: var(--text-secondary-light);
}

.contract-deployment-modal__labels-wrp {
  display: flex;
  justify-content: space-between;
  color: var(--text-primary-main);
  margin-left: toRem(5);
  margin-right: toRem(5);
  margin-bottom: toRem(10);
}

.contract-deployment-modal__span {
  font-size: toRem(12);
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
</style>

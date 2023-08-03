<template>
  <div>
    <div class="deploy-step__labels-wrp">
      <span class="deploy-step__label">
        {{ $t('deploy-step.contract-name') }}
      </span>
      <span class="deploy-step__label">
        {{ nameLength }}
      </span>
    </div>
    <input-field
      v-model="form.contractName"
      :error-message="
        form.contractName.length ? getFieldErrorMessage('contractName') : ''
      "
    />
  </div>
  <div class="deploy-step__btns-wrp">
    <app-button
      class="deploy-step__deploy-btn"
      size="large"
      color="info"
      :text="$t('deploy-step.deploy-btn')"
      :disabled="!isFormValid()"
      @click="emit('deploy-contract', form.contractName)"
    />
  </div>
</template>
<script lang="ts" setup>
import { InputField } from '@/fields'
import { AppButton } from '@/common'
import { computed, reactive } from 'vue'
import { useFormValidation } from '@/composables'
import { required, maxLength } from '@/validators'
import { MAX_LENGTH } from '@/enums'

const form = reactive({
  contractName: '',
})

const nameLength = computed(
  () => `${form.contractName.length} / ${MAX_LENGTH.contractName}`,
)

const emit = defineEmits<{
  (e: 'deploy-contract', v: string): void
}>()

const { isFormValid, getFieldErrorMessage } = useFormValidation(form, {
  contractName: { required, maxLength: maxLength(MAX_LENGTH.contractName) },
})
</script>

<style lang="scss" scoped>
.deploy-step__labels-wrp {
  display: flex;
  justify-content: space-between;
  color: var(--text-primary-main);
  margin-left: toRem(5);
  margin-right: toRem(5);
  margin-bottom: toRem(10);
}

.deploy-step__label {
  font-size: toRem(12);
}

.deploy-step__btns-wrp {
  display: flex;
  margin-top: toRem(15);
}

.deploy-step__deploy-btn {
  width: 100%;
  border-radius: toRem(8);
  margin-right: toRem(10);
}
</style>

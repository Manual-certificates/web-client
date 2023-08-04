<template>
  <form class="mint-form">
    <input-field
      v-model="form.address"
      class="mint-form__field-input"
      :error-message="
        form.address.length ? getFieldErrorMessage('address') : ''
      "
    />
    <div class="mint-form__btns-wrp">
      <app-button
        class="mint-form__btn"
        size="large"
        color="info"
        :route="{
          name: $routes.main,
        }"
        :text="$t('mint-form.cancel-btn')"
      />
      <app-button
        class="mint-form__btn"
        size="large"
        color="info"
        :disabled="!isFormValid() || !props.isFileUploaded"
        :text="$t('mint-form.issue-btn')"
        @click="emit('mint', form.address)"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { InputField } from '@/fields'
import { AppButton } from '@/common'
import { reactive } from 'vue'
import { address } from '@/validators'
import { useFormValidation } from '@/composables'

const props = defineProps<{
  isFileUploaded: boolean
}>()

const emit = defineEmits<{
  (e: 'mint', address: string): void
}>()

const form = reactive({
  address: '',
})

const { isFormValid, getFieldErrorMessage } = useFormValidation(form, {
  address: { address },
})
</script>

<style lang="scss" scoped>
.mint-form__btns-wrp {
  display: flex;
  margin-top: toRem(50);
}

.mint-form__btn {
  width: toRem(200);
  border-radius: toRem(8);
  margin-right: toRem(10);
}

.mint-form__field-input {
  width: toRem(427);
}
</style>

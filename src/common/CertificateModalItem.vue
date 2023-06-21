<template>
  <div class="certificate-item">
    <div class="certificate-item__img-wrp">
      <icon class="certificate-item__img" name="file-item"></icon>
    </div>
    <div class="certificate-item__info">
      <div class="certificate-item__info-title">
        <h5>
          {{ certificate.title }}
        </h5>
        <p>{{ preparedSize(certificate.size) }}</p>
      </div>
      <div class="certificate-item__info-size"></div>
    </div>
    <app-button
      :icon-right="ICON_NAMES.x"
      @click="emit('remove-certificate', certificate)"
    />
  </div>
</template>
<script setup lang="ts">
import { FileItemType } from '@/types'
import { Icon } from '@/common/'
import AppButton from '@/common/AppButton.vue'
import { ICON_NAMES } from '@/enums'

defineProps<{
  certificate: FileItemType
}>()

const emit = defineEmits<{
  (e: 'remove-certificate', certificate: FileItemType): void
}>()

const preparedSize = (size: string) => {
  return (Number(size) / 1000).toString() + 'KB'
}
</script>

<style scoped lang="scss">
.certificate-item {
  display: flex;
  padding: toRem(15);
  border: toRem(1) solid var(--border-primary-light);
  justify-content: space-between;
  border-radius: toRem(12);
  margin: toRem(14);
}

.certificate-item__info {
  margin: auto toRem(10);
  width: 80%;
  display: grid;
}

.certificate-item__img-wrp {
  margin: auto 0;
  width: toRem(33);
  height: toRem(26);
}
</style>

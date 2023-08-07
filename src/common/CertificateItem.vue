<template>
  <div class="certificate-item">
    <div class="certificate-item__content">
      <div class="certificate-item__img-wrp">
        <icon class="certificate-item__img" :name="$icons.fileItem" />
      </div>
      <div class="certificate-item__info">
        <div class="certificate-item__info-title">
          <h5>
            {{ certificate.title }}
          </h5>
          <p>{{ fileSizePreparator.format(certificate.size) }}</p>
        </div>
      </div>
    </div>

    <app-button
      :icon-right="$icons.x"
      @click="emit('remove-certificate', certificate)"
    />
  </div>
</template>
<script setup lang="ts">
import { FileItemType } from '@/types'
import { Icon, AppButton } from '@/common'
import { fileSizePreparator } from '@/helpers'

defineProps<{
  certificate: FileItemType
}>()

const emit = defineEmits<{
  (e: 'remove-certificate', certificate: FileItemType): void
}>()
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

.certificate-item__content {
  display: flex;
}

.certificate-item__info {
  margin: auto toRem(10);
  display: grid;
}

.certificate-item__img-wrp {
  display: flex;
  margin: auto;
  width: toRem(33);
  height: toRem(26);
}
</style>

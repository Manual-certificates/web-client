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
        <p>{{ certificate.size }}</p>
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
import { CertificateFile } from '@/types'
import { Icon } from '@/common/'
import AppButton from '@/common/AppButton.vue'
import { ICON_NAMES } from '@/enums'

const props = defineProps<{
  certificate: CertificateFile
}>()

const emit = defineEmits<{
  (e: 'remove-certificate', certificate: CertificateFile): void
}>()
</script>

<style scoped lang="scss">
.certificate-item {
  display: flex;
  padding: toRem(15);
  border: 1px solid #e0e0e0;
  justify-content: space-between;
  border-radius: 12px;
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

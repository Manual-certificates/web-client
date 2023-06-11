<template>
  <div class="certificate-item">
    <div class="certificate-item__img-wrp">
      <icon name="certificate"></icon>
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
  </div>
</template>
<script setup lang="ts">
import { CertificateFile } from '@/types'
import { Icon } from '@/common/'

const props = defineProps<{
  certificate: CertificateFile
}>()
</script>

<style scoped lang="scss">
.certificate-item__info {
  display: grid;
}
</style>

<template>
  <div class="contract-deployment-modal__body">
    <span class="contract-deployment-modal__subtitle">
      {{ $t('contract-deployment-modal.subtitle-processing') }}
    </span>
  </div>
  <div class="contract-deployment-modal__loader">
    <spinner />
  </div>
</template>
<script lang="ts" setup>
import { Spinner } from '@/common'
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

.contract-deployment-modal__loader {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

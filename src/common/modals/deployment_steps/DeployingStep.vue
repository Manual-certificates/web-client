<template>
  <div class="deploying-step__body">
    <span class="deploying-step__subtitle">
      {{ $t('deploying-step.subtitle') }}
    </span>
  </div>
  <div class="deploying-step__loader">
    <spinner />
  </div>
</template>
<script lang="ts" setup>
import { Spinner } from '@/common'
</script>

<style lang="scss" scoped>
.deploying-step__body {
  margin-bottom: toRem(15);
}

.deploying-step__subtitle {
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.45;
  color: var(--text-secondary-light);
}

.deploying-step__loader {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

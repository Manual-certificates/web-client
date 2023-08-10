<template>
  <div class="deploying-step">
    <div class="deploying-step__title-wrp">
      <span class="deploying-step__title">
        {{ $t('deploying-step.subtitle') }}
      </span>
    </div>
    <div class="deploying-step__loader">
      <spinner />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Spinner } from '@/common'
</script>

<style lang="scss" scoped>
.deploying-step__title-wrp {
  margin-bottom: toRem(15);
}

.deploying-step__title {
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

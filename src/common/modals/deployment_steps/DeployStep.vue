<template>
  <div class="deploy-step__body">
    <span class="deploy-step__subtitle">
      {{ $t('deploy-step.subtitle') }}
    </span>
  </div>
  <deploy-contract-form
    @deploy-contract="name => emit('deploy-contract', name)"
  />
</template>
<script lang="ts" setup>
import { DeployContractForm } from '@/forms'

const emit = defineEmits<{
  (e: 'deploy-contract', v: string): void
}>()
</script>

<style lang="scss" scoped>
.deploy-step__body {
  margin-bottom: toRem(15);
}

.deploy-step__subtitle {
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.45;
  color: var(--text-secondary-light);
}
</style>

<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="(value: boolean) => emit('update:is-shown', value)"
  >
    <div class="loader-modal__pane">
      <h3 class="loader-modal__title">
        {{ title }}
      </h3>
      <p class="loader-modal__description">
        {{ description }}
      </p>

      <progress
        class="loader-modal__loader"
        :max="fileCount"
        :value="loadState"
      />
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { Modal } from '@/common'

withDefaults(
  defineProps<{
    isShown: boolean
    title: string
    description: string
    loadState: number
    fileCount?: number
  }>(),
  {
    fileCount: 0,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()
</script>

<style lang="scss" scoped>
.loader-modal__pane {
  background: var(--background-primary-main);
  padding: toRem(24);
  border-radius: toRem(8);
  width: toRem(652);
  height: toRem(116);
}

.loader-modal__loader {
  width: 100%;
  height: toRem(20);
  color: var(--info-dark);
}

.loader-modal__description {
  color: var(--text-secondary-light);
}
</style>

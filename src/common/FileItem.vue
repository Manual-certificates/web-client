<template>
  <div class="file-item">
    <div class="file-item__content">
      <icon class="file-item__icon" :name="icon" />
      <div class="file-item__text">
        <p class="file-item__title">
          {{ preparedTitle }}
        </p>
        <p class="file-item__description">
          {{ description }}
        </p>
      </div>
    </div>
    <app-button
      class="file-item__btn"
      :icon-left="ICON_NAMES.x"
      @click="emit('delete-item', item)"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { ICON_NAMES } from '@/enums'
import { Icon, AppButton } from '@/common'
import { FileItemType } from '@/types'

const props = defineProps<{
  icon: ICON_NAMES
  title: string
  description: string
  item: FileItemType
}>()

const emit = defineEmits<{
  (e: 'delete-item', v: FileItemType): void
}>()

const preparedTitle = ref('')

const prepareFileTitle = () => {
  if (props.title.length > 10) {
    preparedTitle.value =
      props.title.slice(0, 10) + '...' + props.title.slice(-5)
    return
  }
  preparedTitle.value = props.title
}
onBeforeMount(prepareFileTitle)
</script>

<style lang="scss" scoped>
.file-item {
  border: toRem(1) solid var(--border-primary-light);
  text-align: center;
  display: flex;
  justify-content: space-between;
  border-radius: toRem(8);
}

.file-item__btn {
  max-height: toRem(40);
  margin: auto 0;

  @include respond-to('large') {
    max-width: toRem(30);
  }
}

.file-item__content {
  display: flex;
  text-align: left;
  padding: toRem(2);
  align-items: center;
}

.file-item__icon {
  margin: auto toRem(10);
  width: toRem(33);
  height: toRem(37);

  @include respond-to('large') {
    width: toRem(30);
  }
}

.file-item__description {
  font-size: toRem(14);

  @include respond-to('large') {
    font-size: toRem(12);
  }
}
</style>

<template>
  <div class="file-item">
    <div class="file-item__content">
      <icon class="file-item__icon" :name="$icons.fileItem" />
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
      size="small"
      :icon-left="$icons.x"
      @click="emit('delete-item', item)"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { ICON_NAMES } from '@/enums'
import { Icon, AppButton } from '@/common'
import { FileItemType } from '@/types'
import { abbrCenter } from '@/helpers'

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

onBeforeMount(() => {
  preparedTitle.value = abbrCenter(true, props.title)
})
</script>

<style lang="scss" scoped>
.file-item {
  display: flex;
  border: toRem(1) solid var(--border-primary-light);
  text-align: center;
  justify-content: space-between;
  border-radius: toRem(8);
}

.file-item__btn {
  max-height: toRem(40);
  margin: auto 0;

  @include respond-to(large) {
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

  @include respond-to(large) {
    width: toRem(30);
  }
}

.file-item__description {
  font-size: toRem(14);

  @include respond-to(large) {
    font-size: toRem(12);
  }
}
</style>

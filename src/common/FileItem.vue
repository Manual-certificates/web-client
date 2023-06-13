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
import { CertificateFile } from '@/types'

const props = defineProps<{
  icon: ICON_NAMES
  title: string
  description: string
  item: CertificateFile
}>()

const emit = defineEmits<{
  (e: 'delete-item', v: CertificateFile): void
}>()

const preparedTitle = ref('')

const prepareFileTitle = () => {
  if (props.title.length > 15) {
    preparedTitle.value =
      props.title.slice(0, 15) + '...' + props.title.slice(-5)
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
}

.file-item__text {
  font-style: normal;
  //line-height: ;
  //font-weight: 500;
}
</style>

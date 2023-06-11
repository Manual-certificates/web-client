<template>
  <div class="file-drop-area">
    <div class="file-drop-area__content" @drag="dragFile">
      <icon class="file-drop-area__icon" :name="icon" @drag="dragFile" />
      <div class="file-drop-area__text">
        <label for="input">
          {{ title }}
        </label>
        <input
          type="file"
          multiple
          id="input"
          hidden
          @input="uploadFile"
          class="file-drop-area__text-title"
        />

        <p class="file-drop-area__text-description">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ICON_NAMES } from '@/enums'
import Icon from '@/common/Icon.vue'
const files = ref<File[]>([])
const data = ref<string[][]>([])

const props = defineProps<{
  icon: ICON_NAMES
  title: string
  description: string
}>()

const emit = defineEmits<{
  (e: 'handle-files-upload', file: File[]): void
}>()

const uploadFile = e => {
  console.log('test')
  console.log(e.target.files)
  files.value = e.target.files
  emit('handle-files-upload', files.value)
}
const dragFile = e => {
  console.log('test2 ')
  console.log(e.dataTransfer.files)
  files.value = e.dataTransfer.files
  emit('handle-files-upload', files.value)
}
</script>

<style lang="scss" scoped>
.file-drop-area {
  border: 2px dashed #ccc;

  text-align: center;
  cursor: pointer;
  border-radius: toRem(8);
}

.file-drop-area__content {
  display: flex;
  text-align: left;
  padding: toRem(12);
  gap: toRem(8);
  justify-content: space-around;
  align-items: center;
}

.file-drop-area__icon {
  width: toRem(21);
  height: toRem(27);
}

.file-drop-area__text {
  font-style: normal;
  //font-weight: 500;
}

.file-drop-area.active {
  border-color: var(--info-dark);
}

input[type='file']::file-selector-button {
  display: none;
}
</style>

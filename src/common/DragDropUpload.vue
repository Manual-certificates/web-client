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
import { defineEmits, ref } from 'vue'
import { ICON_NAMES } from '@/enums'
import Icon from '@/common/Icon.vue'
const files = ref<File[]>([])

const props = defineProps<{
  icon: ICON_NAMES
  title: string
  description: string
}>()

const emit = defineEmits<{
  (e: 'handle-files-upload', files: File[]): void
}>()

const uploadFile = e => {
  files.value = e.target.files
  for (let i = 0; i < 100; i++) {
    console.log(e.target.files.length)
  }
  emit('handle-files-upload', files.value)
}
const dragFile = e => {
  files.value = e.dataTransfer.files
  emit('handle-files-upload', files.value)
}
</script>

<style lang="scss" scoped>
.file-drop-area {
  border: toRem(2) dashed var(--border-primary-light);

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
  width: toRem(33);
  height: toRem(37);
}

.file-drop-area__text {
  font-style: normal;
}

.file-drop-area.active {
  border-color: var(--info-dark);
}

input[type='file']::file-selector-button {
  display: none;
}
</style>

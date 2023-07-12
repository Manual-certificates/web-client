<template>
  <div
    class="file-drop-area"
    :data-active="active"
    @dragenter.prevent="active = true"
    @dragover.prevent="active = true"
    @dragleave.prevent="active = false"
    @drop.prevent="dragFile"
  >
    <div class="file-drop-area__content">
      <icon
        class="file-drop-area__icon"
        :name="$icons.fileSelect"
        @drag="dragFile"
      />
      <div class="file-drop-area__text">
        <label :for="id" class="file-drop-area__text">
          {{ title }}
        </label>
        <input
          class="file-drop-area__text-title"
          type="file"
          multiple
          hidden
          :id="id"
          :disabled="isDisabled"
          :accept="filesType"
          @input="uploadFile"
          @drag="dragFile"
        />
        <p class="file-drop-area__text-description file-drop-area__text">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { ICON_NAMES } from '@/enums'
import { Icon } from '@/common'

const files = ref<File[]>([])

const ID_WRP = '_id'

const props = defineProps<{
  icon: ICON_NAMES
  title: string
  description: string
  filesType: string
  isDisabled?: boolean
}>()

const active = ref(false)

const id = props.filesType + ID_WRP

const emit = defineEmits<{
  (e: 'handle-files-upload', files: File[]): void
}>()

const uploadFile = e => {
  files.value = e.target.files
  emit('handle-files-upload', files.value)
}
const dragFile = e => {
  active.value = false
  files.value = e.dataTransfer.files
  emit('handle-files-upload', files.value)
  e.dataTransfer.files = []
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
  padding: toRem(10);
  justify-content: left;
  align-items: center;
}

.file-drop-area__icon {
  width: toRem(33);
  height: toRem(37);

  @include respond-to('large') {
    width: toRem(30);
    height: toRem(30);
  }
}

.file-drop-area__text {
  padding-top: toRem(5);
  font-style: normal;
  margin: auto;

  @include respond-to('large') {
    font-size: toRem(14);
  }
}

input[type='file']::file-selector-button {
  display: none;
}
</style>

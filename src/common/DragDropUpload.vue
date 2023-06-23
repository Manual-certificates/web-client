<template>
  <div
    class="file-drop-area"
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="dragFile"
  >
    <div class="file-drop-area__content">
      <icon class="file-drop-area__icon" :name="icon" @drag="dragFile" />
      <div class="file-drop-area__text">
        <label :for="id" class="file-drop-area__text">
          {{ title }}
        </label>
        <input
          type="file"
          multiple
          :id="id"
          :disabled="isDisabled"
          :accept="filesType"
          hidden
          @input="uploadFile"
          @drag="dragFile"
          class="file-drop-area__text-title"
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
import Icon from '@/common/Icon.vue'

const files = ref<File[]>([])

const props = defineProps<{
  icon: ICON_NAMES
  title: string
  description: string
  filesType: string
  isDisabled?: boolean
}>()

const id = props.filesType + '_id'

const emit = defineEmits<{
  (e: 'handle-files-upload', files: File[]): void
}>()

const uploadFile = e => {
  files.value = e.target.files
  emit('handle-files-upload', files.value)
}
const dragFile = e => {
  setInactive()
  files.value = e.dataTransfer.files
  emit('handle-files-upload', files.value)
  e.dataTransfer.files = []
}

const active = ref(false)

const setActive = () => {
  active.value = true
}
const setInactive = () => {
  active.value = false
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

.file-drop-area.active {
  border-color: var(--info-dark);
}

input[type='file']::file-selector-button {
  display: none;
}
</style>

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
        <label for="input">
          {{ title }}
        </label>
        <input
          type="file"
          multiple
          id="input"
          hidden
          :accept="filesType"
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

defineProps<{
  icon: ICON_NAMES
  title: string
  description: string
  filesType: string
}>()

const emit = defineEmits<{
  (e: 'handle-files-upload', files: File[]): void
}>()

const uploadFile = e => {
  files.value = e.target.files
  emit('handle-files-upload', files.value)
}
const dragFile = e => {
  setInactive()
  files.value = e.target.files || e.dataTransfer.files
  emit('handle-files-upload', files.value)
}

const active = ref(false)

function setActive() {
  active.value = true
}
function setInactive() {
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

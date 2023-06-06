<template>
  <div
    class="file-drop-area"
    @dragenter.prevent="active = true"
    @dragover.prevent="active = true"
    @dragleave.prevent="active = false"
    @drop="handleDrop"
  >
    <div v-if="!files.length" class="file-drop-area__content">
      <icon class="file-drop-area__icon" :name="icon" />
      <div class="file-drop-area__text">
        <p class="file-drop-area__text-title">
          {{ title }}
        </p>
        <p class="file-drop-area__text-description">
          {{ description }}
        </p>
      </div>
    </div>
    <div v-else>
      <ul>
        <li v-for="file in files" :key="file.name">
          {{ file.name }}
        </li>
      </ul>
      <button @click="clearFiles">Clear</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import { ICON_NAMES } from '@/enums'
import Icon from '@/common/Icon.vue'
import log from 'loglevel'

const active = ref(false)
const files = ref<File[]>([])
const headers = ref<string[]>([])
const data = ref<string[][]>([])

const props = defineProps<{
  icon: ICON_NAMES
  title: string
  description: string
}>()

const emit = defineEmits<{
  (e: 'handle-files-upload', file: FileList): void
}>()

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  active.value = false
  if (event.dataTransfer && event.dataTransfer.files) {
    const fileList = event.dataTransfer.files
    console.log('fileList inner: ', event.dataTransfer.files)
    emit('handle-files-upload', fileList)
  }
}

const clearFiles = () => {
  files.value = []
}

onMounted(() => {
  const dragEnterHandler = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    active.value = true
  }

  const dragOverHandler = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    active.value = true
  }

  const dragLeaveHandler = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    active.value = false
  }

  const dropHandler = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleDrop(event)
  }

  document.addEventListener('dragenter', dragEnterHandler)
  document.addEventListener('dragover', dragOverHandler)
  document.addEventListener('dragleave', dragLeaveHandler)
  document.addEventListener('drop', dropHandler)

  onUnmounted(() => {
    document.removeEventListener('dragenter', dragEnterHandler)
    document.removeEventListener('dragover', dragOverHandler)
    document.removeEventListener('dragleave', dragLeaveHandler)
    document.removeEventListener('drop', dropHandler)
  })
})
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

.file-drop-area__text-description {
  margin-top: toRem(-10);
}

.file-drop-area__icon {
  width: toRem(21);
  height: toRem(27);
}

.file-drop-area__text {
  font-size: toRem(20);
  line-height: 1.5;

  font-family: 'Inter', fantasy;
}

.file-drop-area.active {
  border-color: #007bff;
}

.file-drop-area ul {
  list-style-type: none;
}

.file-drop-area button {
  margin-top: 1rem;
}
</style>

<template>
  <div class="second-step">
    <div class="second-step__field-info">
      <p class="second-step__field-title">
        {{ $t('second-step.title') }}
      </p>
    </div>

    <i18n-t
      class="second-step__field-description"
      keypath="second-step.description"
      tag="p"
    >
      <template #link>
        <a
          class="second-step__field-description-link"
          target="_blank"
          rel="noopener"
          :href="TEMPLATE_LINK"
        >
          {{ $t('second-step.description-link') }}
        </a>
      </template>
    </i18n-t>

    <file-drop-area
      v-if="!tableFile.title"
      class="second-step__select"
      :key="TABLE_KEY"
      :files-type="TABLE_FORMAT"
      :icon="$icons.fileSelect"
      :title="$t('second-step.select-table-title')"
      :description="$t('second-step.select-table-description')"
      @handle-files-upload="parseTable"
    />
    <file-item
      v-else
      class="second-step__select-item"
      :icon="$icons.fileSelect"
      :title="tableFile.title"
      :description="fileSizePreparator.format(tableFile.size)"
      :item="tableFile"
      @delete-item="clearTableFile"
    />
  </div>
</template>

<script setup lang="ts">
import { FileDropArea, FileItem } from '@/common'
import * as XLSX from 'xlsx'

import { fileSizePreparator } from '@/helpers'
import { ref } from 'vue'
import { FileItemType } from '@/types'

const TABLE_FORMAT =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const TEMPLATE_LINK =
  'https://docs.google.com/spreadsheets/d/1ceqqJimxOKcfsYC9RFrYGLUnVnfet2bgNUBmLOGQR34'
const TABLE_KEY = 'tableKey'

const tableData = ref<string[][]>([])
const tableFile = ref<FileItemType>({} as FileItemType)

const emit = defineEmits<{
  (e: 'table-data', data: string[][], file: FileItemType): void
}>()

const parseTable = (files: File[]) => {
  const reader = new FileReader()
  const file = files[0]
  reader.onload = e => {
    const fileData = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(fileData, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    tableData.value = getTableDataRows(worksheet)
    tableFile.value = {
      title: file.name,
      size: file.size.toString(),
      file: file,
      content: '',
    }
    emit('table-data', tableData.value, tableFile.value)
  }

  reader.readAsArrayBuffer(file)
}

const getTableDataRows = (worksheet: XLSX.WorkSheet) => {
  const dataRows: string[][] = []
  const range = XLSX.utils.decode_range(worksheet['!ref'] as string)
  const rowStart = range.s.r + 1
  const rowEnd = range.e.r

  for (let i = rowStart; i <= rowEnd; i++) {
    const row: string[] = []
    const columnStart = range.s.c
    const columnEnd = range.e.c

    for (let j = columnStart; j <= columnEnd; j++) {
      const cellAddress = XLSX.utils.encode_cell({ r: i, c: j })
      const cell = worksheet[cellAddress]
      row.push(cell ? cell.v.toString() : '')
    }

    dataRows.push(row)
  }
  return dataRows
}

const clearTableFile = () => {
  tableFile.value = {} as FileItemType
}
</script>

<style scoped lang="scss">
.second-step__select {
  max-width: toRem(300);
  max-height: toRem(72);
  width: 100%;
  height: 100%;
  margin-right: toRem(15);

  @include respond-to(large) {
    max-width: toRem(250);
  }
}

.second-step__select-item {
  max-width: toRem(300);
  max-height: toRem(72);
  width: 100%;
  height: 100%;
  margin-right: toRem(10);
  display: flex;

  @include respond-to(large) {
    max-width: toRem(260);
  }
}

.second-step__field-title {
  display: flex;
  text-align: left;
}

.second-step__field-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: toRem(20);
}

.second-step__field-description-link {
  color: var(--info-dark);
  font-size: toRem(14);
}

.second-step__field-description {
  text-align: left;
  max-width: toRem(350);
  font-size: toRem(14);
  color: var(--text-primary-light);
  margin-bottom: toRem(10);
  line-height: 1.5;
}
</style>

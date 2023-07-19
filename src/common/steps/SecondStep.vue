<template>
  <div class="second-step">
    <div class="second-step_field-info">
      <p class="second-step__field-title">
        {{ $t('mint-page.step-2-title') }}
      </p>
    </div>

    <i18n-t
      class="second-step__field-description"
      keypath="mint-page.step-2-description"
      tag="p"
    >
      <template #link>
        <a
          class="second-step__field-description-link"
          target="_blank"
          rel="noopener"
          :href="TEMPLATE_LINK"
        >
          {{ $t('mint-page.step-2-description-link') }}
        </a>
      </template>
    </i18n-t>

    <file-drop-area
      v-if="!tableFile.title"
      class="second-step__select"
      :key="TABLE_KEY"
      :files-type="TABLE_FORMAT"
      :icon="$icons.fileSelect"
      :title="$t('mint-page.select-table-title')"
      :description="$t('mint-page.select-table-description')"
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

const TABLE_KEY = 'tableKey'
const TEMPLATE_LINK =
  'https://docs.google.com/spreadsheets/d/1ceqqJimxOKcfsYC9RFrYGLUnVnfet2bgNUBmLOGQR34'

const tableData = ref<string[][]>([])
const tableFile = ref<FileItemType>({} as FileItemType)

const emit = defineEmits<{
  (e: 'remove-certificate', v: FileItemType): void
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
.second-step {
  display: block;
}

.second-step__select {
  width: toRem(300);
  height: toRem(72);
  margin-right: toRem(15);

  @include respond-to(large) {
    width: toRem(250);
  }
}

.second-step__select-item {
  width: toRem(300);
  height: toRem(72);
  margin-right: toRem(10);
  display: flex;

  @include respond-to(large) {
    width: toRem(260);
  }
}

.second-step__field-number {
  width: toRem(30);
  height: toRem(30);
  color: var(--text-primary-invert-light);
  border-radius: toRem(20);
  background: var(--info-dark);

  @include respond-to(medium) {
    width: toRem(25);
    height: toRem(25);
  }
}

.second-step__field-payload {
  height: toRem(180);
  margin: toRem(10) 0;
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

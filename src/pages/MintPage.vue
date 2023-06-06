<template>
  <div>
    <drag-drop-upload
      class="mint-page__select-images mint-page__select"
      icon="file-select"
      :title="$t('mint-page.select-images-title')"
      :description="$t('mint-page.select-images-description')"
      @handle-files-upload="parseImages"
    />
    <drag-drop-upload
      class="mint-page__select-table mint-page__select"
      icon="file-select"
      :title="$t('mint-page.select-table-title')"
      :description="$t('mint-page.select-table-description')"
      @handle-files-upload="parseTable"
    />
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import DragDropUpload from '@/common/DragDropUpload.vue'
import { ref } from 'vue'
import { ErrorHandler } from '@/helpers'

const files = ref<FileList>()
const tableData = ref<string[][]>()

const parseTable = (fileList: FileList) => {
  const file = fileList[0]
  const reader = new FileReader()
  reader.onload = e => {
    const fileData = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(fileData, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    tableData.value = getTableDataRows(worksheet)
    console.log(tableData.value)
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

const parseImages = (fileList: FileList) => {
  console.log(fileList)
  if (!fileList) {
    ErrorHandler.process('empty list')
  }
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    if (!file) {
      ErrorHandler.process('empty file')
    }
    const reader = new FileReader()
    console.log(file)
    reader.readAsDataURL(file)
    reader.onload = function () {
      //me.modelvalue = reader.result;
      console.log(reader.result)
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
    }
  }
}
</script>

<style lang="scss" scoped>
.mint-page__select {
  width: toRem(278);
  height: toRem(72);
}
</style>

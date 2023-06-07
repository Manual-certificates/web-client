<template>
  <div>
    <h2>
      {{ $t('mint-page.title') }}
    </h2>
    <div class="mint-page__body">
      <div class="mint-page__state-labels">
        <div class="mint-page__field">
          <p class="mint-page__field-number">
1
</p>
          <div class="mint-page__field-border mint-page__field-payload"></div>
        </div>
        <div class="mint-page__field">
          <p class="mint-page__field-number">
1
</p>
          <div class="mint-page__field-border mint-page__field-payload"></div>
        </div>
        <div class="mint-page__field">
          <p class="mint-page__field-number">
1
</p>

          <div class="mint-page__field-border mint-page__field-payload"></div>
        </div>
      </div>
      <div class="mint-page__payload">
        <div class="mint-page__field">
          <p class="mint-page__field-payload-title">
            {{ $t('mint-page.step-1-title') }}
          </p>
          <p>
            {{ $t('mint-page.step-1-description') }}
          </p>
          <drag-drop-upload
            :title="$t('mint-page.select-images-title')"
            :icon="'template'"
            :description="$t('mint-page.select-images-description')"
          />
        </div>
        <div class="mint-page__field">
          <p class="mint-page__field-payload-title">
            {{ $t('mint-page.step-2-title') }}
          </p>
          <p class="mint-page__field-payload-title">
            {{ $t('mint-page.step-1-title') }}
          </p>
          <p>
            {{ $t('mint-page.step-1-description') }}
          </p>
          <drag-drop-upload
            class="mint-page__select-table mint-page__select"
            icon="file-select"
            :title="$t('mint-page.select-table-title')"
            :description="$t('mint-page.select-table-description')"
            @handle-files-upload="parseTable"
          />
        </div>
        <div class="mint-page__field">
          <p class="mint-page__field-payload-title">
            {{ $t('mint-page.step-3-title') }}
          </p>
        </div>
      </div>
      <!--    <drag-drop-upload-->
      <!--      class="mint-page__select-images mint-page__select"-->
      <!--      icon="file-select"-->
      <!--      :title="$t('mint-page.select-images-title')"-->
      <!--      :description="$t('mint-page.select-images-description')"-->
      <!--      @handle-files-upload="parseImages"-->
      <!--    />-->
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import DragDropUpload from '@/common/DragDropUpload.vue'
import { ref } from 'vue'
import { ErrorHandler } from '@/helpers'

const files = ref<FileList>()
const tableData = ref<string[][]>()

const parseTable = (fileList: File[]) => {
  const file = fileList[0]
  const reader = new FileReader()
  reader.onload = e => {
    console.log('reader ', reader)
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

const parseImages = (fileList: File[]) => {
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
  width: toRem(300);
  height: toRem(72);
}

.mint-page__body {
  display: flex;
}

.mint-page__payload {
  margin-left: toRem(20);
}

.mint-page__field {
  display: grid;
  text-align: center;
  justify-items: center;
  height: toRem(200);
  margin: toRem(30) 0;
}

.mint-page__field-number {
  width: toRem(30);
  border-radius: toRem(20);
  background: var(--info-dark);
}

.mint-page__field-border {
  width: toRem(1);
  border: toRem(2) solid var(--info-dark);
}

.mint-page__field-payload {
  height: toRem(180);
  margin: toRem(10) 0;
}

.mint-page__field-payload-title {
  display: flex;
  text-align: left;
}
</style>

<template>
  <div class="mint-page">
    <certificates-modal
      class="mint-page__certificate-modal"
      v-model:is-shown="isShown"
      :certificate-list="certificateList"
    />

    <h2 class="mint-page__title">
      {{ $t('mint-page.title') }}
    </h2>
    <div class="mint-page__body">
      <div class="mint-page__state-labels">
        <div class="mint-page__field">
          <!--          <div class="mint-page__field-border-wrp v">-->
          <p class="mint-page__field-number">
            {{ $t('mint-page.step-1-number') }}
          </p>
          <div class="mint-page__field-border"></div>
          <!--          </div>-->
        </div>
        <div class="mint-page__field">
          <p class="mint-page__field-number">
            {{ $t('mint-page.step-2-number') }}
          </p>
          <div class="mint-page__field-border"></div>
        </div>
        <div class="mint-page__field">
          <p class="mint-page__field-number">
            {{ $t('mint-page.step-3-number') }}
          </p>
          <div class="mint-page__field-border"></div>
        </div>
      </div>

      <div class="mint-page__payload">
        <div class="mint-page__field">
          <div class="mint-page__field-info">
            <p class="mint-page__field-title">
              {{ $t('mint-page.step-1-title') }}
            </p>

            <app-button
              class="mint_page__certificate-count"
              :text="$t('mint-page.see-all') + count.toString()"
              @click="showModal"
            />
          </div>
          <div>
            <p class="mint-page__field-description">
              {{ $t('mint-page.step-1-description') }}
            </p>
            <drag-drop-upload
              class="mint-page__select-table mint-page__select"
              :title="$t('mint-page.select-images-title')"
              icon="template"
              :description="$t('mint-page.select-images-description')"
            />
          </div>
        </div>

        <div class="mint-page__field">
          <div class="mint-page__field-info">
            <p class="mint-page__field-title">
              {{ $t('mint-page.step-2-title') }}
            </p>
          </div>
          <p class="mint-page__field-description">
            {{ $t('mint-page.step-2-description') }}
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
          <div class="mint-page__field-info">
            <p class="mint-page__field-title">
              {{ $t('mint-page.step-3-title') }}
            </p>
          </div>
          <input-field
            class="mint-page__field-input"
            :model-value="contractAddress"
          />
        </div>
      </div>
    </div>
    <div class="mint-page__btns-wrp">
      <app-button
        class="mint-page__btn"
        size="large"
        color="info"
        :text="$t('mint-page.cancel-btn')"
      />
      <app-button
        class="mint-page__btn"
        size="large"
        color="info"
        :text="$t('mint-page.issue-btn')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import DragDropUpload from '@/common/DragDropUpload.vue'
import { onBeforeMount, ref } from 'vue'
import { ErrorHandler } from '@/helpers'
import { AppButton } from '@/common'
import CertificatesModal from '@/common/modals/CertificatesModal.vue'
import { CertificateFile } from '@/types'
import InputField from '@/fields/InputField.vue'

const files = ref<FileList>()
const isShown = ref(false)
const tableData = ref<string[][]>()
const certificateList = ref<CertificateFile[]>([])
const count = ref(0)
const contractAddress = ref('')
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

const showModal = () => {
  isShown.value = true
  console.log(isShown.value)
}
onBeforeMount(() => {
  console.log('test mint')
})
</script>

<style lang="scss" scoped>
.mint-page__select {
  width: toRem(300);
  height: toRem(72);
}

.mint-page__body {
  display: flex;
}

.mint-page__title {
  margin-bottom: toRem(30);
}

.mint-page__certificate-modal {
}

.mint-page__state-labels {
  display: grid;
  justify-content: center;
  margin: 0;
}

.mint-page__payload {
  margin-left: toRem(20);
  width: 100%;
}

.mint-page__field {
  display: flow;
  text-align: center;
  row-gap: toRem(8);
  height: toRem(200);
}

.mint-page__field-number {
  width: toRem(30);
  height: toRem(30);
  color: var(--text-primary-invert-light);
  border-radius: toRem(20);

  background: var(--info-dark);
}

.mint-page__field-border {
  width: toRem(1);
  height: 60%;
  margin: toRem(30) auto;
  border: toRem(2) solid var(--info-dark);
}

.mint-page__field-payload {
  height: toRem(180);
  margin: toRem(10) 0;
}

.mint-page__field-title {
  display: flex;
  text-align: left;
}

.mint-page__field-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: toRem(20);
}

.mint-page__field-border-wrp {
  display: grid;
  justify-items: center;
}

.mint-page__btns-wrp {
  display: flex;
}

.mint-page__btn {
  width: toRem(200);
  border-radius: toRem(8);
  margin-right: toRem(10);
}

.mint-page__field-description {
  text-align: left;
  max-width: 30%;
  font-size: toRem(14);
  color: var(--text-primary-light);
  margin-bottom: toRem(10);
  line-height: 1.5;
}

.mint-page__field-input {
  width: toRem(427);
}
</style>

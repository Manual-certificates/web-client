<template>
  <div class="mint-page">
    <certificates-modal
      class="mint-page__certificate-modal"
      v-model:is-shown="isShown"
      :certificate-list="certificateList.slice(0, 100)"
      @remove-certificate="removeCertificate"
    />

    <loader-modal
      :title="$t('mint-page.loader-modal-title')"
      :description="$t('mint-page.loader-modal-description')"
      :is-shown="isMintLoaderShown"
      :load-state="loadState"
      :file-count="certificateList.length"
    />

    <error-modal v-model:is-shown="isErrorModalShown" :error-msg="errorMsg" />

    <success-modal
      v-model:is-shown="isSuccessModalShown"
      :tx="txHash"
      @success="router.push({ name: $router.main })"
    />

    <h2 class="mint-page__title">
      {{ $t('mint-page.title') }}
    </h2>
    <div class="mint-page__body">
      <div class="mint-page__state-labels">
        <div class="mint-page__field">
          <p class="mint-page__field-number">
            {{ $t('mint-page.step-1-number') }}
          </p>
          <div class="mint-page__field-border"></div>
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
              color="info"
              :text="
                $t('mint-page.see-all') + certificateList.length.toString()
              "
              @click="showModal"
            />
          </div>
          <div>
            <p class="mint-page__field-description">
              {{ $t('mint-page.step-1-description') }}
            </p>
            <div class="mint-page__field-images">
              <drag-drop-upload
                class="mint-page__select"
                :key="imageKey"
                :files-type="imageFormat"
                :icon="$icons.template"
                :is-disabled="certificateList.length >= 100"
                :title="$t('mint-page.select-images-title')"
                :description="$t('mint-page.select-images-description')"
                @handle-files-upload="handlerUploadFile"
              />
              <div
                v-if="certificateList.length > 0"
                class="mint-page__field-images"
              >
                <div v-for="item in certificateList.slice(0, 3)" :key="item">
                  <file-item
                    class="mint-page__select-item"
                    :icon="$icons.fileItem"
                    :title="item.title"
                    :description="preparedSize(item.size)"
                    :item="item"
                    @delete-item="removeCertificate"
                  />
                </div>
              </div>
            </div>
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
            <a
              class="mint-page__field-description-link"
              href="https://docs.google.com/spreadsheets/d/1ceqqJimxOKcfsYC9RFrYGLUnVnfet2bgNUBmLOGQR34"
              target="_blank"
              rel="noopener"
            >
              {{ $t('mint-page.step-2-description-link') }}
            </a>
          </p>

          <drag-drop-upload
            v-if="!tableFile.title"
            class="mint-page__select"
            :key="tableKey"
            :files-type="tableFormat"
            :icon="$icons.fileSelect"
            :title="$t('mint-page.select-table-title')"
            :description="$t('mint-page.select-table-description')"
            @handle-files-upload="handlerUploadFile"
          />
          <file-item
            v-else
            class="mint-page__select-item"
            :icon="$icons.fileSelect"
            :title="tableFile.title"
            :description="preparedSize(tableFile.size)"
            :item="tableFile"
            @delete-item="removeTableFile"
          />
        </div>

        <div class="mint-page__field">
          <div class="mint-page__field-info">
            <p class="mint-page__field-title">
              {{ $t('mint-page.step-3-title') }}
            </p>
          </div>
          <p class="mint-page__field-description">
            {{ $t('mint-page.step-3-description') }}
          </p>
          <input-field
            class="mint-page__field-input"
            :error-message="
              !contractAddress ||
              isNotValidAddress ||
              contractAddress.match(/(\b0x[a-f0-9A-F]{40}\b)/g)
                ? ''
                : $t('mint-page.address-error-msg')
            "
            v-model:model-value="contractAddress"
          />
          <div class="mint-page__btns-wrp">
            <app-button
              class="mint-page__btn"
              size="large"
              color="info"
              :route="{
                name: ROUTE_NAMES.main,
              }"
              :text="$t('mint-page.cancel-btn')"
            />
            <app-button
              class="mint-page__btn"
              size="large"
              color="info"
              :disabled="
                !contractAddress.match(/(\b0x[a-f0-9A-F]{40}\b)/g) ||
                !certificateList.length ||
                !tableFile
              "
              :text="$t('mint-page.issue-btn')"
              @click="mintCertificates"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import DragDropUpload from '@/common/DragDropUpload.vue'
import { ref } from 'vue'
import { ErrorHandler } from '@/helpers'
import { AppButton } from '@/common'
import CertificatesModal from '@/common/modals/CertificatesModal.vue'
import { FileItemType } from '@/types'
import InputField from '@/fields/InputField.vue'
import FileItem from '@/common/FileItem.vue'
import { useTokenContact } from '@/composables'
import { IpfsUtils } from '@/utils/ipfs.utils'
import LoaderModal from '@/common/modals/LoaderModal.vue'
import ErrorModal from '@/common/modals/ErrorModal.vue'
import SuccessModal from '@/common/modals/SuccessModal.vue'
import { ROUTE_NAMES } from '@/enums'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const isShown = ref(false)
const isMintLoaderShown = ref(false)
const isErrorModalShown = ref(false)
const isSuccessModalShown = ref(false)
const tableData = ref<string[][]>()
const tableFile = ref<FileItemType>({} as FileItemType)
const certificateList = ref<FileItemType[]>([])
const contractAddress = ref('')
const loadState = ref(0)
const txHash = ref('')
const tableFormat =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const imageFormat = 'image/*'
const imageKey = 'imageKey'
const tableKey = 'tableKey'
const isNotValidAddress = ref(false)
const { t } = useI18n()

const router = useRouter()
const errorMsg = ref('')

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
  if (!fileList) {
    ErrorHandler.process('empty list')
  }
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]

    if (!file) {
      ErrorHandler.process('empty file')
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      const certificate: FileItemType = {
        title: file.name,
        size: file.size.toString(),
        file: file,
        content: reader.result as string,
      }

      certificateList.value.push(certificate)
    }
    reader.onerror = function (error) {
      ErrorHandler.process(error)
    }
  }
}

const handlerUploadFile = (fileList: File[]) => {
  if (
    fileList[0].type ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    parseTable(fileList)
    return
  }
  parseImages(fileList)
}
const preparedSize = (size: string) => {
  return (Number(size) / 1000).toString() + 'KB'
}
const showModal = () => {
  isShown.value = true
}

const mintCertificates = async () => {
  const undefinedNames = []
  const addresses: string[] = []
  const URIs: string[] = []
  try {
    isMintLoaderShown.value = true
    let iFilesUpload = false
    for (const item of tableData.value!) {
      const certificateByFileName = certificateList.value.find(
        certificate => certificate.title === item[2],
      )
      if (certificateByFileName === undefined) {
        undefinedNames.push(item)
        continue
      }
      addresses.push(item[1])
      loadState.value++

      URIs.push(await IpfsUtils.storeFile(certificateByFileName.file!))
      iFilesUpload = true
    }
    if (!iFilesUpload) {
      errorMsg.value = t('errors.files-not-found')
      isErrorModalShown.value = true
      return
    }
    const res = await useTokenContact(contractAddress.value).mintBatch(
      addresses,
      URIs,
    )
    txHash.value = res!.transactionHash!
    isSuccessModalShown.value = true
  } catch (error) {
    isMintLoaderShown.value = false
    isErrorModalShown.value = true
    loadState.value = 0

    errorMsg.value = t('errors.failed-sent-tx')
    ErrorHandler.process(error)
  } finally {
    isMintLoaderShown.value = false
    loadState.value = 0
  }
}

const removeCertificate = (certificate: FileItemType) => {
  certificateList.value = certificateList.value.filter(
    obj => obj.title !== certificate.title,
  )
}

const removeTableFile = () => {
  tableFile.value = {} as FileItemType
}
</script>

<style lang="scss" scoped>
.mint-page {
  width: var(--page-large);
  margin: 0 auto;

  @include respond-to(large) {
    width: var(--page-xmedium);
  }
}

.mint-page__select {
  width: toRem(300);
  height: toRem(72);
  margin-right: toRem(15);

  @include respond-to(large) {
    width: toRem(250);
  }
}

.mint-page__select-item {
  width: toRem(300);
  height: toRem(72);
  margin-right: toRem(10);

  @include respond-to('large') {
    width: toRem(260);
  }
}

.mint-page__body {
  display: flex;
}

.mint-page__title {
  margin-bottom: toRem(30);
}

.mint-page__payload {
  margin-left: toRem(20);
  width: 100%;
}

.mint-page__field {
  display: flow;
  text-align: center;
  row-gap: toRem(8);
  height: toRem(220);
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
  height: 65%;
  margin: toRem(30) auto;
  border: toRem(1) solid var(--info-dark);
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
  margin-top: toRem(50);
}

.mint-page__btn {
  width: toRem(200);
  border-radius: toRem(8);
  margin-right: toRem(10);
}

.mint-page__field-description-link {
  color: var(--info-dark);
  font-size: toRem(14);
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

.mint-page__field-images {
  display: flex;
}
</style>

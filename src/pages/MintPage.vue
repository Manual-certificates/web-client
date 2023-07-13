<template>
  <div class="mint-page">
    <certificates-modal
      class="mint-page__certificate-modal"
      v-model:is-shown="isCertificatesModalShown"
      :certificate-list="certificateList.slice(0, MAX_CERTIFICATES_COUNT)"
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
      @success="mintSuccess"
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
                $t('mint-page.see-all', {
                  number: certificateList.length.toString(),
                })
              "
              @click="showModal"
            />
          </div>
          <div>
            <p class="mint-page__field-description">
              {{ $t('mint-page.step-1-description') }}
            </p>
            <div class="mint-page__field-images">
              <file-drop-area
                class="mint-page__select"
                :key="IMAGE_KEY"
                :files-type="IMAGE_FORMAT"
                :icon="$icons.template"
                :is-disabled="certificateList.length >= MAX_CERTIFICATES_COUNT"
                :title="$t('mint-page.select-images-title')"
                :description="$t('mint-page.select-images-description')"
                @handle-files-upload="handlerUploadFile"
              />
              <div
                v-if="certificateList.length"
                class="mint-page__field-images"
              >
                <div
                  v-for="item in certificateList.slice(0, CERTIFICATES_ON_PAGE)"
                  :key="item.title"
                >
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

          <i18n-t
            class="mint-page__field-description"
            keypath="mint-page.step-2-description"
            tag="p"
          >
            <template #link>
              <a
                class="mint-page__field-description-link"
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
            class="mint-page__select"
            :key="TABLE_KEY"
            :files-type="TABLE_FORMAT"
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
          <mint-form
            :is-file-uploaded="filesIsReady()"
            @mint="mintCertificates"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import { ref } from 'vue'
import { ErrorHandler } from '@/helpers'
import { AppButton, FileDropArea, FileItem } from '@/common'
import { FileItemType } from '@/types'
import { useTokenContact } from '@/composables'
import { IpfsUtil } from '@/utils'
import {
  SuccessModal,
  ErrorModal,
  LoaderModal,
  CertificatesModal,
} from '@/common/modals'
import { useRouter } from 'vue-router'
import { MintForm } from '@/forms'
import { DATA_STORAGE_UNITS, ROUTE_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'
import { Log } from '@ethersproject/abstract-provider'
const { t } = useI18n()

const isCertificatesModalShown = ref(false)
const isMintLoaderShown = ref(false)
const isErrorModalShown = ref(false)
const isSuccessModalShown = ref(false)

const tableData = ref<string[][]>()
const tableFile = ref<FileItemType>({} as FileItemType)
const certificateList = ref<FileItemType[]>([])
const loadState = ref(0)
const txHash = ref('')

const router = useRouter()
const errorMsg = ref('')

const MAX_CERTIFICATES_COUNT = 100
const TABLE_FORMAT =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const IMAGE_FORMAT = 'image/*'
const IMAGE_KEY = 'imageKey'
const TABLE_KEY = 'tableKey'
const TEMPLATE_LINK =
  'https://docs.google.com/spreadsheets/d/1ceqqJimxOKcfsYC9RFrYGLUnVnfet2bgNUBmLOGQR34'
const CERTIFICATES_ON_PAGE = 3

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
    ErrorHandler.process(t('mint-page.error-empty-list'))
    return
  }
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]

    if (!file) {
      ErrorHandler.process(t('mint-page.error-empty-file'))
      return
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
  if (fileList[0].type === TABLE_FORMAT) {
    parseTable(fileList)
    return
  }
  parseImages(fileList)
}
const preparedSize = (size: string) => {
  return (Number(size) / 1000).toString() + DATA_STORAGE_UNITS.KB
}
const showModal = () => {
  isCertificatesModalShown.value = true
}

const mintCertificates = async (address: string) => {
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
      if (!certificateByFileName) {
        undefinedNames.push(item)
        continue
      }
      addresses.push(item[1])
      loadState.value++

      URIs.push(await IpfsUtil.storeFile(certificateByFileName.file!))
      iFilesUpload = true
    }

    if (!iFilesUpload) {
      errorMsg.value = t('errors.files-not-found')
      isErrorModalShown.value = true
      return
    }

    const res = (await useTokenContact(address).mintBatch(
      addresses,
      URIs,
    )) as Log

    txHash.value = res.transactionHash
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

const filesIsReady = () => {
  return !!certificateList.value && !!tableFile.value
}

const mintSuccess = () => {
  isSuccessModalShown.value = false
  router.push({ name: ROUTE_NAMES.main })
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

  @include respond-to(large) {
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

.mint-page__field-images {
  display: flex;
}
</style>

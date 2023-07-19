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
      :is-shown="isLoaderModalShown"
      :load-state="loadState"
      :file-count="certificateList.length"
    />

    <error-modal v-model:is-shown="isErrorModalShown" :error-msg="errorMsg" />

    <success-modal
      v-model:is-shown="isSuccessModalShown"
      :tx="txHash"
      @success="onMintSuccess"
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
        <div>
          <first-step
            class="mint-page__field"
            v-model:certificate-list="certificateList"
            @show-certificates-modal="isCertificatesModalShown = true"
            @remove-certificate="removeCertificate"
          />

          <second-step сlass="mint-page__field" @table-data="onTableData" />

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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ErrorHandler } from '@/helpers'
import { FileItemType } from '@/types'
import { useTokenContact } from '@/composables'
import { IpfsUtil } from '@/utils'
import {
  SuccessModal,
  ErrorModal,
  LoaderModal,
  CertificatesModal,
} from '@/common'
import { useRouter } from 'vue-router'
import { MintForm } from '@/forms'
import { ROUTE_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'
import FirstStep from '@/common/steps/FirstStep.vue'
import SecondStep from '@/common/steps/SecondStep.vue'

const { t } = useI18n()

const isCertificatesModalShown = ref(false)
const isLoaderModalShown = ref(false)
const isErrorModalShown = ref(false)
const isSuccessModalShown = ref(false)

const tableData = ref<string[][]>([])
const tableFile = ref<FileItemType>({} as FileItemType)
const certificateList = ref<FileItemType[]>([])
const loadState = ref(0)
const txHash = ref('')

const router = useRouter()
const errorMsg = ref('')

const MAX_CERTIFICATES_COUNT = 100

const mintCertificates = async (address: string) => {
  try {
    isLoaderModalShown.value = true

    const { addresses, URIs } = await sendToIPFS()
    const hash = await useTokenContact(address).useMintBatch(addresses, URIs)

    if (!hash) {
      ErrorHandler.process(t('errors.failed-sent-tx'))
      return
    }

    txHash.value = hash
    isSuccessModalShown.value = true
  } catch (error) {
    isErrorModalShown.value = true
    errorMsg.value = t('errors.failed-sent-tx')
  }

  isLoaderModalShown.value = false
  loadState.value = 0
}

const sendToIPFS = async () => {
  const undefinedNames = []
  const addresses: string[] = []
  const URIs: string[] = []
  for (const item of tableData.value) {
    const certificateByFileName = certificateList.value.find(
      certificate => certificate.title === item[2],
    )

    if (!certificateByFileName) {
      undefinedNames.push(item)
      continue
    }

    addresses.push(item[1])
    loadState.value++
    if (!certificateByFileName.file) {
      continue
    }

    URIs.push(await IpfsUtil.storeFile(certificateByFileName.file))
  }

  return {
    undefinedNames,
    addresses,
    URIs,
  }
}

const removeCertificate = (certificate: FileItemType) => {
  certificateList.value = certificateList.value.filter(
    obj => obj.title !== certificate.title,
  )
}

const filesIsReady = () => {
  return Boolean(certificateList.value) && Boolean(tableFile.value)
}

const onMintSuccess = () => {
  isSuccessModalShown.value = false
  router.push({ name: ROUTE_NAMES.main })
}

const onTableData = (data: string[][], file: FileItemType) => {
  tableFile.value = file
  tableData.value = data
}
</script>

<style lang="scss" scoped>
.mint-page {
  max-width: var(--page-large);
  min-width: var(--page-medium);
  width: 100%;
  margin: 0 auto;
}

.mint-page__select {
  max-width: toRem(300);
  width: 100%;
  height: toRem(72);
  margin-right: toRem(15);

  @include respond-to(large) {
    width: toRem(250);
  }
}

.mint-page__select-item {
  max-width: toRem(300);
  width: 100%;
  height: toRem(72);
  margin-right: toRem(10);
  display: inline-flex;

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

  @include respond-to(medium) {
    width: toRem(25);
    height: toRem(25);
  }
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
  max-width: toRem(350);
  font-size: toRem(14);
  color: var(--text-primary-light);
  margin-bottom: toRem(10);
  line-height: 1.5;
}
</style>

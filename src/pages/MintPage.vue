<template>
  <div class="mint-page">
    <certificates-modal
      v-model:is-shown="isCertificatesModalShown"
      class="mint-page__certificate-modal"
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

    <deployment-confirmation-modal
      v-model:is-shown="isDeploymentConfirmationModalShown"
      @open-contract-deployment="openContractDeploymentModal"
    />

    <contract-deployment-modal
      v-model:is-shown="isContractDeploymentModalShown"
      @update:error-msg="onError"
    />

    <error-modal v-model:is-shown="isErrorModalShown" :error-msg="errorMsg" />

    <success-modal
      v-model:is-shown="isSuccessModalShown"
      :tx="txHash"
      @success="router.push({ name: $routes.main })"
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
        <first-step
          class="mint-page__field"
          :certificate-list="certificateList"
          @add-certificate="addCertificate"
          @show-certificates-modal="isCertificatesModalShown = true"
          @remove-certificate="removeCertificate"
        />

        <second-step class="mint-page__field" @table-data="onTableData" />

        <third-step
          v-model:is-loader-modal-shown="isLoaderModalShown"
          :table-data="tableData"
          :certificate-list="certificateList"
          :is-ready="filesIsReady()"
          @on-success="onMintSuccess"
          @on-error="onError"
          @update-load-state="updateLoadState"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FileItemType } from '@/types'
import {
  SuccessModal,
  ErrorModal,
  LoaderModal,
  CertificatesModal,
  FirstStep,
  SecondStep,
  ThirdStep,
  DeploymentConfirmationModal,
  ContractDeploymentModal,
} from '@/common'
import { useRouter } from 'vue-router'

const router = useRouter()

const isCertificatesModalShown = ref(false)
const isLoaderModalShown = ref(false)
const isErrorModalShown = ref(false)
const isSuccessModalShown = ref(false)
const isDeploymentConfirmationModalShown = ref(true)
const isContractDeploymentModalShown = ref(false)

const tableData = ref<string[][]>([])
const tableFile = ref<FileItemType>({} as FileItemType)
const certificateList = ref<FileItemType[]>([])
const loadState = ref(0)
const txHash = ref('')
const errorMsg = ref('')

const MAX_CERTIFICATES_COUNT = 100

const removeCertificate = (certificate: FileItemType) => {
  certificateList.value = certificateList.value.filter(
    obj => obj.title !== certificate.title,
  )
}
const addCertificate = (certificate: FileItemType) => {
  certificateList.value.push(certificate)
}

const updateLoadState = (state: number) => {
  loadState.value = state
}

const filesIsReady = () => {
  return Boolean(certificateList.value) && Boolean(tableFile.value)
}

const onMintSuccess = (hash: string) => {
  txHash.value = hash
  isSuccessModalShown.value = true
}

const onTableData = (data: string[][], file: FileItemType) => {
  tableFile.value = file
  tableData.value = data
}

const onError = (msg: string) => {
  isLoaderModalShown.value = false
  isContractDeploymentModalShown.value = false
  errorMsg.value = msg
  isErrorModalShown.value = true
}

const openContractDeploymentModal = () => {
  isDeploymentConfirmationModalShown.value = false
  isContractDeploymentModalShown.value = true
}
</script>

<style lang="scss" scoped>
.mint-page {
  max-width: var(--page-large);
  min-width: var(--page-small);
  width: 100%;
  margin: 0 auto;
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
  max-height: toRem(220);
  height: 100%;
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
</style>

<template>
  <div class="third-page">
    <div class="third-page__field-info">
      <p class="third-page__field-title">
        {{ $t('third-step.title') }}
      </p>
    </div>
    <p class="third-page__field-description">
      {{ $t('third-step.description') }}
    </p>
    <mint-form
      :is-file-uploaded="isReady"
      :disabled="!isReady"
      @mint="mintCertificates"
    />
  </div>
</template>

<script setup lang="ts">
import { useTokenContact } from '@/composables'
import { IpfsUtil } from '@/utils'
import { useI18n } from 'vue-i18n'
import { MintForm } from '@/forms'
import { ref, computed } from 'vue'
import { FileItemType } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@/config'
import { validateAddresses, createMetadataFile } from '@/helpers'

const { t } = useI18n()
const web3Store = useWeb3ProvidersStore()

const props = defineProps<{
  certificateList: FileItemType[]
  tableData: string[][]
  isReady: boolean
}>()

//TODO think about cleaning
const emit = defineEmits<{
  (e: 'update:is-loader-modal-shown', v: boolean): void
  (e: 'update-load-state', v: number): void
  (e: 'on-success', hash: string): void
  (e: 'on-error', msg: string): void
}>()

const isValidChain = computed(
  () =>
    String(web3Store.provider.chainId).toLowerCase() ===
    config.SUPPORTED_CHAIN_ID.toLowerCase(),
)

const mintCertificates = async (address: string) => {
  try {
    emit('update:is-loader-modal-shown', true)
    if (!isValidChain.value) {
      emit('on-error', t('errors.unsupported-chain'))
      return
    }

    const tokenContact = useTokenContact(address)

    const contractName = await tokenContact.getName()

    const { addresses, URIs } = await sendToIPFS(contractName)
    if (!URIs.length) {
      emit('on-error', t('errors.failed-sent-to-ipfs'))
      return
    }

    if (!validateAddresses(addresses)) {
      emit('on-error', t('errors.invalid-address-in-table'))
      return
    }

    const urisWithCorrectPath = URIs.map(
      el => el + '/' + config.METADATA_FILE_NAME,
    )

    const hash = await tokenContact.useMintBatch(addresses, urisWithCorrectPath)
    if (!hash) {
      emit('on-error', t('errors.failed-sent-tx'))
      return
    }

    emit('update:is-loader-modal-shown', false)
    emit('on-success', hash)
  } catch (error) {
    emit('on-error', t('errors.default'))
  }
  emit('update-load-state', 0)
}

const sendToIPFS = async (contractName: string) => {
  const undefinedNames = []
  const addresses: string[] = []
  const URIs: string[] = []
  const loadState = ref(0)
  for (const item of props.tableData) {
    const certificateByFileName = props.certificateList.find(
      certificate => certificate.title === item[2],
    )

    if (!certificateByFileName) {
      undefinedNames.push(item)
      continue
    }

    addresses.push(item[1])
    loadState.value++
    emit('update-load-state', loadState.value)

    if (!certificateByFileName.file) {
      continue
    }

    const ipfsImageCid = await IpfsUtil.storeFile(certificateByFileName.file)

    const file = createMetadataFile(
      certificateByFileName.file.name,
      ipfsImageCid,
      contractName,
    )
    URIs.push(await IpfsUtil.storeFile(file))
  }

  return {
    undefinedNames,
    addresses,
    URIs,
  }
}
</script>

<style scoped lang="scss">
.third-page__field-title {
  display: flex;
  text-align: left;
}

.third-page__field-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: toRem(20);
}

.third-page__field-description {
  text-align: left;
  max-width: toRem(350);
  width: 100%;
  font-size: toRem(14);
  color: var(--text-primary-light);
  margin-bottom: toRem(10);
  line-height: 1.5;
}
</style>

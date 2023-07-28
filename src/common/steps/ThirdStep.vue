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
    <mint-form :is-file-uploaded="isReady" @mint="mintCertificates" />
  </div>
</template>

<script setup lang="ts">
import { useTokenContact } from '@/composables'
import { ErrorHandler } from '@/helpers'
import { IpfsUtil } from '@/utils'
import { useI18n } from 'vue-i18n'
import { MintForm } from '@/forms'
import { ref } from 'vue'
import { FileItemType } from '@/types'
const { t } = useI18n()

const props = defineProps<{
  certificateList: FileItemType[]
  tableData: string[][]
  isReady: boolean
}>()

const emit = defineEmits<{
  (e: 'update:is-loader-modal-shown', v: boolean): void
  (e: 'update-load-state', v: number): void
  (e: 'on-success', hash: string): void
  (e: 'on-error', msg: string): void
}>()

const mintCertificates = async (address: string) => {
  try {
    emit('update:is-loader-modal-shown', true)
    const { addresses, URIs } = await sendToIPFS()
    const hash = await useTokenContact(address).useMintBatch(addresses, URIs)

    if (!hash) {
      ErrorHandler.process(t('errors.failed-sent-tx'))
      return
    }

    emit('on-success', hash)
  } catch (error) {
    emit('on-error', t('errors.failed-sent-tx'))
  }
  emit('update-load-state', 0)
}

const sendToIPFS = async () => {
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

    URIs.push(await IpfsUtil.storeFile(certificateByFileName.file))
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

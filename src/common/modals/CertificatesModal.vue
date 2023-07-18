<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="(value: boolean) => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="certificates-modal__pane">
        <div class="certificates-modal__header">
          <h2 class="certificates-modal__header-title">
            {{ $t('certificates-modal.title') }}
          </h2>
          <div class="certificates-modal__header-page-number">
            <p>
              {{
                $t('certificates-modal.count', {
                  start: (pageCount * CERTIFICATES_ON_PAGE).toString(),
                  end: ((pageCount + 1) * CERTIFICATES_ON_PAGE).toString(),
                  number: certificatesListBuffer.length.toString(),
                })
              }}
            </p>

            <app-button
              icon-left="chevron-left"
              :disabled="pageCount === 0"
              @click="pageCount--"
            />
            <app-button
              icon-left="chevron-right"
              :disabled="isValidatedCertificatesCount"
              @click="pageCount++"
            />
          </div>
        </div>

        <div class="certificates-modal__search">
          <input-field
            v-model="searchData"
            class="certificates-modal__search-input"
            :placeholder="$t('certificates-modal.search-placeholder')"
            @input="search"
          />
        </div>

        <certificates-item-list
          v-model:page-count="pageCount"
          :certificate-list="prepareList()"
          @remove-certificate="removeItem"
        />

        <div class="certificates-modal__close-btn-wrp">
          <app-button
            size="large"
            class="certificates-modal__close-btn"
            :text="$t('certificates-modal.close-btn')"
            @click="modal.close"
          />
        </div>
      </div>
    </template>
  </modal>
</template>

<script lang="ts" setup>
import { AppButton, Modal, CertificatesItemList } from '@/common'

import { computed, ref } from 'vue'
import { FileItemType } from '@/types'
import { InputField } from '@/fields'

const searchData = ref('')
const pageCount = ref(0)
const certificatesListBuffer = ref<FileItemType[]>([])

const CERTIFICATES_ON_PAGE = 5

const props = withDefaults(
  defineProps<{
    isShown: boolean
    certificateList: FileItemType[]
    title?: string
    subtitle?: string
  }>(),
  {
    title: '',
    subtitle: '',
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'remove-certificate', v: FileItemType): void
}>()

const search = () => {
  if (!searchData.value.length && certificatesListBuffer.value) {
    certificatesListBuffer.value = props.certificateList
    return
  }
  const searchQuery = searchData.value.toLowerCase()
  certificatesListBuffer.value = certificatesListBuffer.value.filter(
    certificate => {
      const title = certificate.title.toLowerCase()
      return title.includes(searchQuery)
    },
  )
}

const removeItem = (certificate: FileItemType) => {
  emit('remove-certificate', certificate)
}

const prepareList = () => {
  if (!searchData.value.length && certificatesListBuffer.value) {
    certificatesListBuffer.value = props.certificateList
  }
  return certificatesListBuffer.value
}

const isValidatedCertificatesCount = computed(() => {
  return (
    (pageCount.value + 1) * CERTIFICATES_ON_PAGE >=
    certificatesListBuffer.value.length
  )
})
</script>

<style lang="scss" scoped>
.certificates-modal__pane {
  background: var(--background-primary-main);
  padding: toRem(24);
  border-radius: toRem(8);
  min-width: toRem(652); // more adaptive
  min-height: toRem(752);
}

.certificates-modal__title {
  text-align: center;
}

.certificates-modal__header {
  justify-content: center;
  align-items: flex-start;
  margin-bottom: toRem(32);
}

.certificates-modal__search {
  max-width: toRem(580);
  margin: auto;
}

.certificates-modal__header-title {
  max-width: toRem(600);
  text-align: center;
}

.certificates-modal__header-page-number {
  display: flex;
  justify-content: right;
  align-items: center;
}

.certificates-modal__subtitle {
  font-size: toRem(14);
  line-height: 1.45;
  color: var(--text-secondary-main);
}

.certificates-modal__close-btn-wrp {
  display: flex;
  justify-content: center;
  bottom: toRem(30);
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.certificates-modal__close-btn {
  max-width: toRem(580);
  width: 100%;
}
</style>

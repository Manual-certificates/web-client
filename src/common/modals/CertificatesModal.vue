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
                  number: certificateList.length.toString(),
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
              :disabled="hasMoreCertificates"
              @click="pageCount++"
            />
          </div>
        </div>

        <input-field
          v-model="searchData"
          class="certificates-modal__search"
          :placeholder="$t('certificates-modal.search-placeholder')"
        />

        <certificates-item-list
          v-model:page-count="pageCount"
          class="certificates-modal__certificate_list"
          :certificate-list="filteredCertificateList"
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
import { useSearchInTheList } from '@/helpers/certificate-list.helpers'

const searchData = ref('')
const pageCount = ref(0)

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

const filteredCertificateList = computed(() =>
  useSearchInTheList(props.certificateList, searchData.value),
)

const removeItem = (certificate: FileItemType) => {
  emit('remove-certificate', certificate)
}

const hasMoreCertificates = computed(() => {
  return (
    (pageCount.value + 1) * CERTIFICATES_ON_PAGE >= props.certificateList.length
  )
})
</script>

<style lang="scss" scoped>
.certificates-modal__pane {
  background: var(--background-primary-main);
  padding: toRem(24);
  border-radius: toRem(8);
  max-width: toRem(652);
  max-height: toRem(752);
  width: 100%;
  height: 100%;

  @include respond-to(x-small) {
    padding: 3%;
  }
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
  padding: 0 toRem(15);
  margin: 0 auto;
}

.certificates-modal__header-title {
  width: 100%;
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
  padding: toRem(24);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;

  @include respond-to(x-small) {
    padding: 3%;
  }
}

.certificates-modal__close-btn {
  width: 100%;
}
</style>

<template>
  <div class="certificate-item-list">
    <div
      v-for="item in certificateList.slice(
        pageCount * CERTIFICATES_ON_PAGE,
        pageCount * CERTIFICATES_ON_PAGE + CERTIFICATES_ON_PAGE,
      )"
      :key="item.title"
    >
      <certificate-item :certificate="item" @remove-certificate="removeItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CertificateItem } from '@/common'
import { FileItemType } from '@/types'

const CERTIFICATES_ON_PAGE = 5

defineProps<{
  pageCount: number
  certificateList: FileItemType[]
}>()

const emit = defineEmits<{
  (e: 'remove-certificate', v: FileItemType): void
}>()

const removeItem = (certificate: FileItemType) => {
  emit('remove-certificate', certificate)
}
</script>

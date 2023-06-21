<template>
  <div class="certificate-item-list">
    <div
      v-for="item in certificateList?.slice(pageCount * 5, pageCount * 5 + 5)"
      :key="item"
    >
      <certificate-modal-item
        :certificate="item"
        @remove-certificate="removeItem"
      />

      <div class=""></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CertificateModalItem from '@/common/CertificateModalItem.vue'
import { FileItemType } from '@/types'

const props = defineProps<{
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

<style scoped lang="scss"></style>

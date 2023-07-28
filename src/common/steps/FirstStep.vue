<template>
  <div class="first-step">
    <div class="first-step__field-info">
      <p class="first-step__field-title">
        {{ $t('first-step.title') }}
      </p>

      <app-button
        class="first-step__certificate-count"
        color="info"
        :text="
          $t('first-step.see-all', {
            number: certificateList.length.toString(),
          })
        "
        @click="emit('show-certificates-modal', true)"
      />
    </div>
    <p class="first-step__field-description">
      {{ $t('first-step.description') }}
    </p>
    <div class="first-step__field-images-wrp">
      <file-drop-area
        class="first-step__select"
        :key="IMAGE_KEY"
        :files-type="IMAGE_FORMAT"
        :icon="$icons.template"
        :is-disabled="certificateList.length >= MAX_CERTIFICATES_COUNT"
        :title="$t('first-step.select-images-title')"
        :description="$t('first-step.select-images-description')"
        @handle-files-upload="parseImages"
      />
      <div v-if="certificateList.length" class="first-step__field-images">
        <div
          v-for="item in certificateList.slice(0, CERTIFICATES_ON_PAGE)"
          :key="item.title"
        >
          <file-item
            class="first-step__select-item"
            :icon="$icons.fileItem"
            :title="item.title"
            :description="fileSizePreparator.format(item.size)"
            :item="item"
            @delete-item="removeCertificate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileDropArea, FileItem, AppButton } from '@/common'

import { ErrorHandler, fileSizePreparator } from '@/helpers'
import { FileItemType } from '@/types'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const IMAGE_FORMAT = 'image/*'
const IMAGE_KEY = 'imageKey'
const CERTIFICATES_ON_PAGE = 3
const MAX_CERTIFICATES_COUNT = 100

defineProps<{
  certificateList: FileItemType[]
}>()

const emit = defineEmits<{
  (e: 'remove-certificate', v: FileItemType): void
  (e: 'show-certificates-modal', v: boolean): void
  (e: 'add-certificate', v: FileItemType): void
}>()

const removeCertificate = (certificate: FileItemType) => {
  emit('remove-certificate', certificate)
}

const parseImages = (fileList: File[]) => {
  if (!fileList) {
    ErrorHandler.process(t('errors.error-empty-list'))
    return
  }
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]

    if (!file) {
      ErrorHandler.process(t('errors.error-empty-file'))
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

      emit('add-certificate', certificate)
    }
    reader.onerror = function (error) {
      ErrorHandler.process(error)
    }
  }
}
</script>

<style scoped lang="scss">
.first-step__select {
  max-width: toRem(300);
  max-height: toRem(72);
  width: 100%;
  height: 100%;
  margin-right: toRem(15);

  @include respond-to(large) {
    max-width: toRem(250);
  }
}

.first-step__select-item {
  display: flex;
  max-width: toRem(300);
  min-width: toRem(250);
  max-height: toRem(72);
  min-height: toRem(50);
  margin-right: toRem(10);
  width: auto;
  height: 100%;

  @include respond-to(large) {
    max-width: toRem(260);
  }
}

.first-step__field-title {
  display: flex;
  text-align: left;
}

.first-step__field-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: toRem(20);
}

.first-step__field-description {
  text-align: left;
  max-width: toRem(350);
  width: 100%;
  font-size: toRem(14);
  color: var(--text-primary-light);
  margin-bottom: toRem(10);
  line-height: 1.5;
}

.first-step__field-images {
  display: flex;
  overflow: hidden;
}

.first-step__field-images-wrp {
  display: flex;
  list-style: none;
  white-space: nowrap;
}
</style>

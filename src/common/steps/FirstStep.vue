<template>
  <div class="first-step">
    <div class="first-step__field-info">
      <p class="irst-step__field-title">
        {{ $t('mint-page.step-1-title') }}
      </p>

      <app-button
        class="first-step__certificate-count"
        color="info"
        :text="
          $t('mint-page.see-all', {
            number: certificateList.length.toString(),
          })
        "
        @click="emit('show-certificates-modal', true)"
      />
    </div>
    <div>
      <p class="first-step__field-description">
        {{ $t('mint-page.step-1-description') }}
      </p>
      <div class="first-step__field-images-wrp">
        <file-drop-area
          class="first-step__select"
          :key="IMAGE_KEY"
          :files-type="IMAGE_FORMAT"
          :icon="$icons.template"
          :is-disabled="certificateList.length >= MAX_CERTIFICATES_COUNT"
          :title="$t('mint-page.select-images-title')"
          :description="$t('mint-page.select-images-description')"
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
  </div>
</template>

<script setup lang="ts">
import { FileDropArea, FileItem, AppButton } from '@/common'

import { ErrorHandler, fileSizePreparator } from '@/helpers'
import { FileItemType } from '@/types'
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
const { t } = useI18n()

const IMAGE_FORMAT = 'image/*'
const IMAGE_KEY = 'imageKey'
const CERTIFICATES_ON_PAGE = 3
const MAX_CERTIFICATES_COUNT = 100

const certificateList = ref<FileItemType[]>([])

const props = defineProps<{
  certificateList: FileItemType[]
}>()

const emit = defineEmits<{
  (e: 'remove-certificate', v: FileItemType): void
  (e: 'show-certificates-modal', v: boolean): void
  (e: 'update:certificate-list', v: FileItemType[]): void
}>()

const removeCertificate = (certificate: FileItemType) => {
  emit('remove-certificate', certificate)
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
  emit('update:certificate-list', certificateList.value)
}

watch(
  () => props.certificateList,
  newValue => {
    certificateList.value = newValue
  },
)
</script>

<style scoped lang="scss">
.first-step__select {
  width: toRem(300);
  height: toRem(72);
  margin-right: toRem(15);

  @include respond-to(large) {
    width: toRem(250);
  }
}

.first-step__select-item {
  width: toRem(300);
  height: toRem(72);
  margin-right: toRem(10);
  display: inline-flex;

  @include respond-to(large) {
    width: toRem(260);
  }
}

.first-step__field {
  text-align: center;
  row-gap: toRem(8);
  height: toRem(220);
}

.first-step__field-number {
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

.first-step__field-title {
  display: flex;
  text-align: left;
}

.first-step__field-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: toRem(20);
}

.first-step__field-description {
  text-align: left;
  max-width: toRem(350);
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

<template>
  <modal
    :is-shown="props.isShown"
    @update:is-shown="(value: boolean) => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="certificates-modal__pane" v-bind="$attrs">
        <div class="certificates-modal__header">
          <h2 class="certificates-modal__header-title">
            {{ $t('certificates-modal.title') }}
          </h2>
          <div class="certificates-modal__header-count">
            <p>
              {{ (pageCount * 5).toString() + '-' + (pageCount + 1) * 5 }}
              {{
                $t('certificates-modal.count') +
                certificateList.length.toString()
              }}
            </p>

            <app-button
              icon-left="chevron-left"
              :disabled="pageCount === 0"
              @click="pageCount--"
            />
            <app-button
              icon-left="chevron-right"
              :disabled="(pageCount + 1) * 5 > certificateList.length"
              @click="pageCount++"
            />
          </div>
        </div>

        <div class="certificates-modal__search">
          <input-field
            class="certificates-modal__search-input"
            :model-value="searchData"
            :placeholder="$t('certificates-modal.search-placeholder')"
            @input="search"
          />
        </div>

        <div
          v-for="item in certificateList?.slice(
            pageCount * 5,
            pageCount * 5 + 5,
          )"
          :key="item"
        >
          <certificate-modal-item
            :certificate="item"
            @remove-certificate="removeItem"
          />

          <div class=""></div>
        </div>
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
import { AppButton, Modal } from '@/common'

import { ref } from 'vue'
import { CertificateFile } from '@/types'
import CertificateModalItem from '@/common/CertificateModalItem.vue'
import InputField from '@/fields/InputField.vue'

const searchData = ref('')
const pageCount = ref(0)

const props = defineProps<{
  isShown: boolean
  certificateList?: CertificateFile[]
  title?: string
  subtitle?: string
}>()

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'remove-certificate', v: CertificateFile): void
}>()

const search = () => {
  console.log(searchData)
}

const removeItem = (certificate: CertificateFile) => {
  emit('remove-certificate', certificate)
}
</script>

<style lang="scss" scoped>
.certificates-modal__pane {
  background: var(--background-primary-main);
  padding: toRem(24);
  border-radius: toRem(8);
  width: toRem(652);
  height: toRem(752);
}

.certificates-modal__title {
  text-align: center;
  width: 100%;
}

.certificates-modal__header {
  display: grid;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: toRem(32);
}

.certificates-modal__search {
  width: 95%;
  margin: auto;
}

.certificates-modal__search-input {
}

.certificates-modal__header-title {
  //display: flex;

  //flex-direction: column;
  //gap: toRem(8);

  width: toRem(600);
  text-align: center;
}

.certificates-modal__header-count {
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
  bottom: toRem(50);
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
.certificates-modal__close-btn {
  width: 90%;
}
</style>

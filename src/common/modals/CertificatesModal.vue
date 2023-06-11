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
              {{ (pageCount * 8).toString() + '-' + (pageCount + 1) * 8 }}
              {{
                $t('certificates-modal.count') +
                certificateList.length.toString()
              }}
            </p>
          </div>
        </div>

        <div class="certificates-modal__search">
          <input-field
            :model-value="searchData"
            :placeholder="$t('certificates-modal.search-placeholder')"
          />
        </div>

        <div v-for="item in certificateList" :key="item">
          <certificate-modal-item :certificate="item" />

          <div class=""></div>
        </div>
        <div class="certificates-modal__close-btn-wrp">
          <app-button
            size="medium"
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

import { onBeforeMount, ref, watch } from 'vue'
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
}>()

onBeforeMount(() => {
  console.log('test')
})
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
  //width: 100%;
  margin-bottom: toRem(32);
}

.certificates-modal__header-title {
  //display: flex;

  //flex-direction: column;
  //gap: toRem(8);

  width: toRem(600);
  text-align: center;
}

.certificates-modal__header-count {
  width: 100%;
  text-align: right;
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

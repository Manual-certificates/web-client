<template>
  <div class="main-certificate-banner">
    <div class="main-certificate-border__content">
      <icon
        class="main-certificate-banner__icon"
        :name="ICON_NAMES.certificate"
      />
      <h2 class="main-certificate-border__title">
        {{ $t('main-certificate-banner.title') }}
      </h2>
      <p class="main-certificate-border__description">
        {{ $t('main-certificate-banner.description') }}
      </p>

      <div v-if="isReady">
        <app-button
          class="main-certificate-banner__btn"
          size="large"
          color="success"
          :text="$t('main-certificate-banner.issue-sbt-btn')"
          :route="{
            name: ROUTE_NAMES.mint,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { Icon } from '@/common'
import AppButton from '@/common/AppButton.vue'

defineProps<{
  isReady: boolean
}>()
</script>

<style scoped lang="scss">
.main-certificate-banner {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: toRem(24);
  gap: toRem(12);
  border: toRem(1) solid var(--border-primary-light);
  border-radius: toRem(16);
}

.main-certificate-border__content {
  display: grid;
  justify-content: center;
  text-align: center;
}

.main-certificate-border__title {
  font-family: 'NT Somic', sans-serif;
  margin: toRem(10) auto;
}

.main-certificate-border__description {
  font-family: 'Inter', sans-serif;
  color: var(--text-primary-light);
  max-width: 100%;
}

.main-certificate-banner__icon {
  margin: toRem(10) auto;
  max-width: toRem(108);
  max-height: toRem(108);
}

.main-certificate-banner__btn {
  margin: toRem(20) auto;
  width: 60%;
  border-radius: toRem(8);
}
</style>

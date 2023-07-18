<template>
  <div class="main-certificate-banner">
    <div class="main-certificate-banner__content">
      <icon class="main-certificate-banner__icon" :name="$icons.certificate" />
      <h2 class="main-certificate-banner__title">
        {{ $t('main-certificate-banner.title') }}
      </h2>
      <p class="main-certificate-banner__description">
        {{ $t('main-certificate-banner.description') }}
      </p>

      <app-button
        v-if="isReady"
        class="main-certificate-banner__btn"
        size="large"
        color="success"
        :text="$t('main-certificate-banner.issue-sbt-btn')"
        :route="{
          name: $routes.mint,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton, Icon } from '@/common'

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

.main-certificate-banner__content {
  display: grid;
  justify-content: center;
  text-align: center;
}

.main-certificate-banner__title {
  font-family: var(--app-font-family-nt);
  margin: toRem(10) auto;
}

.main-certificate-banner__description {
  font-family: var(--app-font-family-inter);
  color: var(--text-primary-light);
}

.main-certificate-banner__icon {
  margin: toRem(10) auto;
  max-width: toRem(108);
  max-height: toRem(108);
  width: 100%;
}

.main-certificate-banner__btn {
  margin: toRem(20) auto;
  max-width: toRem(200);
  width: 100%;
  border-radius: toRem(8);
}
</style>

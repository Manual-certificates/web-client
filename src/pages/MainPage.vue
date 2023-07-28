<template>
  <div class="main-page">
    <div class="main-page__info">
      <h1 class="main-page__info-title">
        {{ $t('main-page.page-title') }}
      </h1>
      <p class="main-page__info-description">
        {{ $t('main-page.page-description') }}
      </p>
    </div>

    <main-certificate-banner
      class="main-page__banner"
      :class="{ 'main-page__banner--ready': provider.isConnected }"
      :is-ready="provider.isConnected"
    />

    <div v-if="!provider.isConnected" class="main-page__login">
      <p class="main-page__login-description">
        {{ $t('main-page.login-message') }}
      </p>
      <app-button
        class="main-page__login-btn"
        size="large"
        color="success"
        :text="$t('main-page.metamask-connect-btn')"
        @click="connect"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, MainCertificateBanner } from '@/common'
import { useWeb3ProvidersStore } from '@/store'

const { provider } = useWeb3ProvidersStore()

const connect = async () => {
  await provider.connect()
}
</script>

<style lang="scss" scoped>
.main-page {
  margin: 0 auto;
}

.main-page__info {
  text-align: center;
  margin: 0 auto toRem(25) auto;
  max-width: toRem(426);
  width: 100%;
}

.main-page__info-title {
  font-family: var(--app-font-family-nt);
  margin-bottom: toRem(25);
}

.main-page__info-description {
  font-family: var(--app-font-family-inter);
  color: var(--text-primary-light);
}

.main-page__banner {
  margin: auto;
  min-height: toRem(300);
  max-width: toRem(426);
  min-width: toRem(350);
  width: 100%;

  &--ready {
    min-height: toRem(400);
  }
}

.main-page__login-description {
  text-align: center;
  margin-top: toRem(10);
  color: var(--text-primary-light);
  font-size: toRem(16);
}

.main-page__login-btn {
  border-radius: toRem(8);
  margin: toRem(15) auto;
}
</style>

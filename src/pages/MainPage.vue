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
import MainCertificateBanner from '@/common/MainCertificateBanner.vue'
import { AppButton } from '@/common'
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
  width: toRem(426);
}

.main-page__info-title {
  font-family: 'NT Somic', sans-serif;
  margin-bottom: toRem(25);
}

.main-page__info-description {
  font-family: 'Inter', sans-serif;
  color: var(--text-primary-light);
}

.main-page__banner {
  margin: auto;
  height: toRem(260);
  width: toRem(426);

  &--ready {
    height: toRem(340);
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

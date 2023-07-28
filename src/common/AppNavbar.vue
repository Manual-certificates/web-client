<template>
  <div class="app-navbar">
    <div class="app-navbar__content">
      <app-logo class="app-navbar__logo" />

      <app-button
        class="app-navbar__btn"
        :text="abbrCenter(
          provider.isConnected, provider.selectedAddress!) ||
          $t('app-navbar.metamask-connect')"
        :icon-left="$icons.metamask"
        @click="connect"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { abbrCenter } from '@/helpers'
import { AppButton, AppLogo } from '@/common'
import { useWeb3ProvidersStore } from '@/store'

const { provider } = useWeb3ProvidersStore()

const connect = async () => {
  await provider.connect()
}
</script>

<style lang="scss" scoped>
.app-navbar {
  background: var(--background-primary-main);
  border-bottom: var(--border-primary-main);
  box-shadow: 0 toRem(4) toRem(16) rgba(var(--black-rgb), 0.06);
  margin-bottom: toRem(20);
}

.app-navbar__content {
  display: flex;
  align-items: center;
  margin: auto;
  justify-content: space-between;
  padding: toRem(12) var(--app-padding-right) toRem(12) var(--app-padding-left);
  max-width: var(--page-large);
  width: 100%;
}

.app-navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  border-bottom: var(--border-primary-main);
}

.app-navbar__logo {
  @include respond-to(xsmall) {
    width: 100%;
    margin-bottom: toRem(24);
  }
}

.app-navbar__metamask {
  width: toRem(175);

  @include respond-to(xmedium) {
    width: toRem(150);
  }

  @include respond-to(medium) {
    width: toRem(125);
  }
}
</style>

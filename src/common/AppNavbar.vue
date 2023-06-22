<template>
  <div class="app-navbar">
    <div class="app-navbar__content">
      <app-logo class="app-navbar__logo" />

      <app-button
        class="app-navbar__btn"
        :text="prepareAddress() || $t('app-navbar.metamask-connect')"
        :icon-left="$icons.metamask"
        @click="connect"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, AppLogo } from '@/common'
import { useWeb3ProvidersStore } from '@/store'

const { provider } = useWeb3ProvidersStore()

const connect = async () => {
  await provider.connect()
  prepareAddress()
}

const prepareAddress = () => {
  if (provider.isConnected) {
    return (
      provider.selectedAddress!.slice(0, 6) +
      '...' +
      provider.selectedAddress!.slice(-4)
    )
  }
  return ''
}
</script>

<style lang="scss" scoped>
$box-shadow-r: 0;
$box-shadow-g: 0;
$box-shadow-b: 0;
$box-shadow-a: 0.06;

.app-navbar {
  width: 100%;
  background: var(--background-primary-main);
  border-bottom: var(--border-primary-main);
  box-shadow: 0 toRem(4) toRem(16)
    rgba($box-shadow-r, $box-shadow-g, $box-shadow-b, $box-shadow-a);
  margin-bottom: toRem(20);
}

.app-navbar__content {
  display: flex;
  align-items: center;
  margin: auto;
  justify-content: space-between;
  padding: toRem(12) var(--app-padding-right) toRem(12) var(--app-padding-left);
  max-width: var(--page-large);

  @include respond-to(xmedium) {
    width: toRem(1280);
  }

  @include respond-to(medium) {
    width: toRem(1024);
  }

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  border-bottom: var(--border-primary-main);
  width: 100%;
}

.app-navbar__logo {
  @include respond-to(xsmall) {
    width: 100%;
    margin-bottom: toRem(24);
  }
}

.app-navbar__configuration {
  width: 15%;
  display: flex;
  justify-content: space-between;
}

.app-navbar__img {
  width: toRem(20);
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

.app-navbar__btn .app-navbar__settings {
  height: toRem(50);
  border-radius: toRem(8);

  @include respond-to(xmedium) {
    height: toRem(40);
  }
}
</style>

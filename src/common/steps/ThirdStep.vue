<template>
  <div class="third-step"></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.first-step {
  display: block;
}

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

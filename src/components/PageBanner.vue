<template>
  <div class="card blue-grey darken-2">
    <div class="card-content white-text">
      <span class="card-title">
        <slot name="title"></slot>
      </span>
      <p>
        <slot name="description"></slot>
      </p>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin-top: 0px;
}
</style>

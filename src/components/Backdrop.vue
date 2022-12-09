<template>
  <div class="backdrop">
  <q-circular-progress
    indeterminate
    rounded
    size="50px"
    color="orange"
    class="q-ma-md"
  />
  </div>
</template>

<script setup></script>

<style scoped>
.backdrop {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  border-radius: inherit !important;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: inherit;
  width: 100%;
  will-change: opacity;
  background: #fff;
}
</style>

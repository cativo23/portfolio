<template>
  <span class="now-playing-bars"><span /><span /><span /></span>
</template>

<style scoped>
.now-playing-bars {
  display: flex;
  align-items: flex-end;
  gap: 1px;
  height: 10px;
  @apply text-nw-green;
}
.now-playing-bars span {
  display: block;
  width: 2px;
  background: currentColor;
  animation: eq-bar 0.8s ease-in-out infinite alternate;
}
.now-playing-bars span:nth-child(1) { height: 4px; animation-delay: 0s; }
.now-playing-bars span:nth-child(2) { height: 7px; animation-delay: 0.2s; }
.now-playing-bars span:nth-child(3) { height: 5px; animation-delay: 0.4s; }

@keyframes eq-bar {
  0% { height: 3px; }
  100% { height: 10px; }
}
</style>

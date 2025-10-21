<template>
  <div>
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
<style scoped>
main {
  min-height: 80vh;
}
</style>
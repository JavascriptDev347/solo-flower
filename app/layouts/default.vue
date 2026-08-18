<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppHeader />
    <main class="flex-1 min-h-[60vh]">
      <slot />
    </main>
    <AppFooter />

    <AppMobileTabBar />
  </div>
</template>

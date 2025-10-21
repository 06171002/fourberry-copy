<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// 로딩 상태 ref (초기값 true)
const isLoading = ref(true)
const isLoaderHidden = ref(false)

onMounted(() => {
  // 클라이언트 측에서 컴포넌트가 마운트된 후 (하이드레이션 완료 후) 실행
  // 로딩 상태를 false로 변경
  isLoading.value = false;

  // GSAP을 사용하여 preloader를 부드럽게 숨김
  setTimeout(() => {
    isLoaderHidden.value = true;
  }, 800);
})

</script>

<template>
  <div>
    <div
        class="preloader"
        :class="{ 'fade-out': !isLoading, 'hidden': isLoaderHidden }"
    >
    </div>

    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style> /* scoped가 아닌 일반 style 태그 사용 */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  visibility: visible;
  /* opacity와 visibility에 대한 트랜지션 설정 */
  transition: opacity 0.8s ease-out, visibility 0s linear 0.8s;
}

.preloader.fade-out {
  opacity: 0;
  visibility: hidden; /* 트랜지션 완료 후 숨김 */
}

/* 트랜지션 완료 후 완전히 제거 (선택 사항) */
.preloader.hidden {
  display: none;
}

/* (선택 사항) 간단한 스피너 예시 */
/*
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/
</style>

<style scoped>
main {
  min-height: 80vh;
}
</style>
<template>
  <header :class="headerClasses">

    <div class="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">

      <NuxtLink to="/" class="font-bold text-2xl no-underline">FOURBERRY</NuxtLink>

      <nav class="hidden md:flex items-center space-x-6">
        <NuxtLink to="/about" class="text-base no-underline hover:opacity-80 transition-opacity">회사소개</NuxtLink>
        <NuxtLink to="/projects" class="text-base no-underline hover:opacity-80 transition-opacity">SI/SM</NuxtLink>
        <NuxtLink to="/services" class="text-base no-underline hover:opacity-80 transition-opacity">솔루션</NuxtLink>
        <NuxtLink to="/contact" class="text-base no-underline hover:opacity-80 transition-opacity">문의하기</NuxtLink>
      </nav>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" :class="hamburgerButtonClasses" aria-label="메뉴 열기/닫기">
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <transition name="slide-down">
      <nav
          v-if="isMobileMenuOpen"
          class="md:hidden absolute top-full left-0 w-full bg-white shadow-lg flex flex-col border-t border-gray-200"
      >
        <NuxtLink @click="isMobileMenuOpen = false" to="/about" class="px-6 py-3 text-gray-800 font-medium no-underline hover:bg-gray-50">회사소개</NuxtLink>
        <NuxtLink @click="isMobileMenuOpen = false" to="/projects" class="px-6 py-3 text-gray-800 font-medium no-underline hover:bg-gray-50">SI/SM</NuxtLink>
        <NuxtLink @click="isMobileMenuOpen = false" to="/services" class="px-6 py-3 text-gray-800 font-medium no-underline hover:bg-gray-50">솔루션</NuxtLink>
        <NuxtLink @click="isMobileMenuOpen = false" to="/contact" class="px-6 py-3 text-gray-800 font-medium no-underline hover:bg-gray-50">문의하기</NuxtLink>
      </nav>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useHeaderVisibility } from '~/composables/useHeaderState'

gsap.registerPlugin(ScrollTrigger)

// --- 기존 상태 로직 ---
const isScrolled = ref(false)
const route = useRoute()
const isHeaderHidden = useHeaderVisibility() // useHeaderState()의 반환값
const isHomePage = computed(() => route.path === '/')
// [핵심] 스크롤되었거나, 홈이 아니면 true
const shouldApplyScrolledClass = computed(() => isScrolled.value || !isHomePage.value)
let scrollTriggerInstance: ScrollTrigger | null = null;

// --- ❗ NEW: 모바일 메뉴 로직 ---
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// --- ❗ NEW: Tailwind 클래스 바인딩 로직 ---

// 헤더의 동적 클래스를 계산합니다.
const headerClasses = computed(() => [
  'top-0', 'left-0', 'w-full', 'z-50',
  'transition-all', 'duration-300', 'ease-in-out',
  // 스크롤 시 숨김/표시
  isHeaderHidden.value ? '-translate-y-full' : 'translate-y-0',

  // 'scrolled' 상태 (흰색 배경) 또는 'initial' 상태 (투명 배경)
  shouldApplyScrolledClass.value
      ? 'fixed bg-white border-b border-gray-200 shadow-md text-gray-800' // 스크롤됨
      : 'absolute bg-transparent border-b border-white/20 text-white' // 초기 상태
]);

// 모바일 햄버거 버튼의 포커스 링 색상을 동적으로 계산합니다.
const hamburgerButtonClasses = computed(() => [
  'p-2', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-inset',
  shouldApplyScrolledClass.value ? 'focus:ring-gray-800' : 'focus:ring-white'
]);


// --- 기존 생명주기 로직 (수정됨) ---
onMounted(() => {
  // 메인 페이지에서만 스크롤 트리거 생성
  if (isHomePage.value) {
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: '+=10',
      onUpdate: self => {
        isScrolled.value = self.scroll() > 10;
      },
    });
  } else {
    isScrolled.value = true;
  }

  // 라우트 변경 감지
  watch(() => route.path, (newPath) => {
    // ❗ 페이지 이동 시 헤더 표시 및 모바일 메뉴 닫기
    isHeaderHidden.value = false;
    isMobileMenuOpen.value = false;

    if (newPath === '/') {
      isScrolled.value = window.scrollY > 10;
      if (!scrollTriggerInstance) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: 'body',
          start: 'top top',
          end: '+=10',
          onUpdate: self => {
            isScrolled.value = self.scroll() > 10;
          },
        });
      } else {
        scrollTriggerInstance.enable();
      }
    } else {
      isScrolled.value = true;
      scrollTriggerInstance?.disable();
    }
  });

})

onUnmounted(() => {
  scrollTriggerInstance?.kill();
})
</script>

<style scoped>
/* 모바일 메뉴 드롭다운 트랜지션 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
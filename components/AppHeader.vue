<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="container">
      <NuxtLink to="/" class="logo">FOURBERRY</NuxtLink>
      <nav class="navigation">
        <NuxtLink to="/about">회사소개</NuxtLink>
        <NuxtLink to="/projects">SI/SM</NuxtLink>
        <NuxtLink to="/services">솔루션</NuxtLink>
        <NuxtLink to="/contact">문의하기</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onUnmounted } from 'vue'
import { watch } from 'vue'

gsap.registerPlugin(ScrollTrigger)

// 스크롤 상태를 저장할 ref 변수
const isScrolled = ref(false)
const route = useRoute()

const isHomePage = computed(() => route.path === '/')

const shouldApplyScrolledClass = computed(() => isScrolled.value || !isHomePage.value)

let scrollTriggerInstance: ScrollTrigger | null = null;

onMounted(() => {
  // 메인 페이지에서만 스크롤 트리거 생성
  if (isHomePage.value) {
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: '+=10', // 약간 스크롤해도 감지하도록 짧은 범위 설정
      onUpdate: self => {
        // console.log("Scroll position:", self.scroll(), "Active:", self.isActive); // 디버깅 로그
        isScrolled.value = self.scroll() > 10;
      },
      // immediate: true // 초기 로드 시에도 한 번 체크 (선택 사항)
    });
  } else {
    // 메인 페이지가 아니면 기본적으로 스크롤된 상태로 시작
    isScrolled.value = true;
  }

  // 라우트 변경 감지 (페이지 이동 시)
  watch(() => route.path, (newPath) => {
    if (newPath === '/') {
      // 메인 페이지로 돌아오면 스크롤 상태 초기화 및 트리거 재활성화 (필요 시)
      isScrolled.value = window.scrollY > 10; // 현재 스크롤 위치 반영
      if (!scrollTriggerInstance) {
        // 트리거가 없으면 생성
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: 'body',
          start: 'top top',
          end: '+=10',
          onUpdate: self => {
            isScrolled.value = self.scroll() > 10;
          },
        });
      } else {
        scrollTriggerInstance.enable(); // 기존 트리거 활성화
      }
    } else {
      // 다른 페이지로 이동하면 항상 스크롤된 상태로 설정하고 트리거 비활성화
      isScrolled.value = true;
      scrollTriggerInstance?.disable(); // 트리거 비활성화
    }
  });

})

// 컴포넌트 언마운트 시 ScrollTrigger 정리 (메모리 누수 방지)
onUnmounted(() => {
  scrollTriggerInstance?.kill(); // ScrollTrigger 인스턴스 제거
})
</script>

<style scoped>
/* 헤더의 기본(초기) 스타일: 투명 배경, 절대 위치 */
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background-color: transparent; /* 투명 배경 */
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* 연한 테두리 */
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease; /* color 트랜지션 추가 */
}

/* 스크롤 내렸을 때 적용될 스타일: 흰색 배경, 상단 고정 */
.header.header-scrolled {
  position: fixed; /* 상단 고정 */
  background-color: #ffffff; /* 흰색 배경 */
  border-bottom: 1px solid #eaeaea; /* 기존 테두리 색상 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* 그림자 효과 */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem; /* 반응형을 위해 추가 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  /* color 속성은 아래에서 상태별로 관리 */
}

.navigation a { /* NuxtLink는 a 태그로 렌더링되므로 이 스타일은 유효 */
  margin-left: 1.5rem;
  text-decoration: none;
  transition: color 0.3s ease; /* color 트랜지션 추가 */
}

/* 스크롤 시 글자색 (어두운 색) */
.header-scrolled .logo,
.header-scrolled .navigation a {
  color: #2c3e50;
}

/* 초기 상태 글자색 (밝은 색) */
.header:not(.header-scrolled) .logo,
.header:not(.header-scrolled) .navigation a {
  color: #ffffff; /* 어두운 배경 이미지일 경우 흰색으로 */
}

/* (선택) 호버 효과 추가 */
.navigation a:hover {
  opacity: 0.8;
}
</style>
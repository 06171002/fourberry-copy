<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
// ❗ ScrollTrigger와 함께 Observer를 import 합니다.
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

const mainContainer = ref<HTMLElement | null>(null);

// ❗ unmount 시 정리할 타임라인과 옵저버 인스턴스를 저장할 변수
let heroTl: gsap.core.Timeline | null = null;
let panelTls: (gsap.core.Timeline | null)[] = [];
let observer: Observer | null = null;
let panels: HTMLElement[] = []; // 패널 배열

onMounted(() => {
  // ❗ Observer 플러그인 등록
  gsap.registerPlugin(ScrollTrigger, Observer)

  panels = gsap.utils.toArray<HTMLElement>('.panel');
  if (!mainContainer.value || panels.length === 0) return;

  // --- 1. Hero 섹션 초기 로드 애니메이션 (기존 코드 유지) ---
  gsap.set('.home-hero h1, .home-hero .hero-subtitle', { autoAlpha: 0, y: 40 });
  gsap.set('.header', { autoAlpha: 0 });

  heroTl = gsap.timeline(); // ❗ 변수에 할당

  heroTl.to(".home-hero h1", {
    duration: 1.2,
    y: 0,
    autoAlpha: 1,
    ease: "power3.out"
  }, "-=0.3")
      .to(".home-hero .hero-subtitle", {
        duration: 1.2,
        y: 0,
        autoAlpha: 1,
        ease: "power3.out"
      }, "-=0.9")
      .to(".home-hero .hero-background-image", {
        duration: 2.5,
        clipPath: 'ellipse(150% 150% at 50% 100%)',
        opacity: 1,
        ease: "power2.inOut"
      }, "<0.2")
      .to(".home-hero .hero-content", {
        duration: 2.0,
        color: '#ffffff',
        ease: 'power2.inOut'
      }, "-=2.5")
      .to('.header', {
        duration: 1.0,
        autoAlpha: 1,
      }, "-=1.5");


  // ❗❗❗ [수정] --- 2. Observer 방식 섹션 전환 로직 --- ❗❗❗

  // --- 2a. 패널 스타일 및 위치 초기화 ---
  // Observer 방식은 패널들이 겹쳐져 있어야 하므로 CSS를 동적으로 설정합니다.
  gsap.set(mainContainer.value, { position: 'relative', height: '100dvh', overflow: 'hidden' });
  gsap.set(panels, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' });
  // 첫 번째 패널을 제외한 모든 패널을 화면 아래에 숨깁니다.
  gsap.set(panels.slice(1), { yPercent: 100, autoAlpha: 0 });
  // 첫 번째 패널은 제자리에 보이도록 설정
  gsap.set(panels[0], { yPercent: 0, autoAlpha: 1 });


  // --- 2b. 각 패널 내부 콘텐츠 애니메이션 타임라인 생성 (ScrollTrigger 제거) ---
  // (ScrollTrigger 대신 gotoSection에서 수동으로 재생/되감기 합니다)
  panelTls = panels.map((panel, i) => {
    // Hero 섹션(i=0)은 이미 'heroTl'이 애니메이션하므로 별도 타임라인이 필요 없습니다.
    if (i === 0) {
      return null;
    }

    const title = panel.querySelector('h2');
    const description = panel.querySelector('.section-description');
    const cards = gsap.utils.toArray(panel.querySelectorAll('.area-card, .card'));
    const buttons = panel.querySelector('.details-button, .contact-button');

    // ❗ paused: true 로 생성
    const contentTl = gsap.timeline({ paused: true });

    const elementsToSet = [title, description, ...cards, buttons].filter(Boolean);
    if (elementsToSet.length > 0) {
      gsap.set(elementsToSet, { autoAlpha: 0, y: 30 });
    }

    if (title) contentTl.to(title, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.1);
    if (description) contentTl.to(description, { autoAlpha: 1, y: 0, duration: 0.6 }, '<0.1');
    if (cards.length > 0) contentTl.to(cards, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.5 }, '<0.2');
    if (buttons) contentTl.to(buttons, { autoAlpha: 1, y: 0, duration: 0.4 }, '<0.1');

    return contentTl; // 생성된 타임라인 반환
  });


  // --- 2c. 섹션 전환 함수 (gotoSection) 정의 ---
  let currentIndex = 0;
  let animating = false;
  const numPanels = panels.length;

  const gotoSection = (toIndex: number, direction: number) => {
    // 1(아래로) 또는 -1(위로)
    if (animating) return;

    const fromIndex = currentIndex;

    // ❗ 무한 루프 방지: 인덱스 경계 확인
    if (toIndex < 0 || toIndex >= numPanels) {
      return; // 범위를 벗어나면 아무것도 안 함
    }

    animating = true;
    currentIndex = toIndex;
    const dFactor = direction; // 1 or -1

    // 1. 떠나는 패널의 콘텐츠 애니메이션 되감기
    panelTls[fromIndex]?.seek(0).pause();

    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => {
        animating = false;
        // 3. 도착한 패널의 콘텐츠 애니메이션 재생
        panelTls[toIndex]?.play();
      }
    });

    // 2. 패널 슬라이드 애니메이션
    // 들어올 패널 위치 설정 (방향에 따라 위/아래)
    gsap.set(panels[toIndex], { yPercent: 100 * dFactor, autoAlpha: 1 });

    // 현재 패널 내보내기 (반대 방향으로)
    tl.to(panels[fromIndex], { yPercent: -100 * dFactor })
        // 들어올 패널 가져오기 (제자리로)
        .to(panels[toIndex], { yPercent: 0 }, 0); // 0초에 동시에 시작
  };


  // --- 2d. Observer 생성 ---
  observer = Observer.create({
    target: mainContainer.value, // 래퍼(.mainContainer)에서 이벤트 감지
    type: 'wheel,touch,pointer', // 감지할 이벤트 타입
    onDown: () => { // 아래로 스크롤/스와이프
      if (!animating) gotoSection(currentIndex + 1, 1);
    },
    onUp: () => { // 위로 스크롤/스와이프
      if (!animating) gotoSection(currentIndex - 1, -1);
    },
    tolerance: 10, // 이벤트 감지 민감도
    preventDefault: true // 기본 스크롤 동작 방지
  });

});

// 컴포넌트 언마운트 시 Observer 및 GSAP 인스턴스 정리
onUnmounted(() => {
  observer?.kill();
  heroTl?.kill();
  panelTls.forEach(tl => tl?.kill());

  // ❗ GSAP이 적용한 인라인 스타일 초기화
  if (mainContainer.value) {
    gsap.set(mainContainer.value, { clearProps: 'position,height,overflow' });
  }
  gsap.set(panels, { clearProps: 'position,top,left,width,height,yPercent,autoAlpha' });

  // ❗ 내부 콘텐츠 스타일도 초기화 (필요시)
  const contentSelectors = '.home-hero h1, .home-hero .hero-subtitle, .header, h2, .section-description, .area-card, .card, .details-button, .contact-button';
  gsap.set(contentSelectors, { clearProps: 'autoAlpha,y,clipPath,opacity,color' });
});
</script>

<template>
  <div class="w-full overflow-hidden" ref="mainContainer">

    <CommonPageHero
        class="panel h-dvh"
        title="한 발 앞선 IT 서비스로<br />고객의 경험과 가치를 우선합니다."
        subtitle="making sweet and sour software"
        :is-home="true"
    />

    <section class="panel h-dvh py-12 px-4 md:py-24 md:px-8 bg-white">
      <div class="max-w-[1100px] mx-auto px-4 md:px-8 text-center h-full flex flex-col justify-center">
        <h2 class="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800 overflow-hidden section-title">ABOUT US</h2>
        <p class="text-base md:text-[1.1rem] text-gray-600 mb-8 md:mb-16 leading-6 md:leading-7 section-description">
          포베리는 사람 중심의 IT 기술 발전을 위해
          AICBM(AI, IoT, Cloud, Big Data, Mobile) 중심의 사업에 매진하고 있습니다.
        </p>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 md:gap-6 business-areas">
          <div class="text-center p-5 md:p-8 border border-gray-200 rounded-xl bg-gray-50 area-card">
            <h3 class="text-lg md:text-[1.3rem] mb-2 text-slate-700">시스템 통합 및 유지보수</h3>
            <p class="text-sm md:text-[0.95rem] text-gray-500 leading-normal md:leading-relaxed">비즈니스 환경에 최적화된 시스템을 구축하고 안정적으로 운영합니다.</p>
          </div>
          <div class="text-center p-5 md:p-8 border border-gray-200 rounded-xl bg-gray-50 area-card">
            <h3 class="text-lg md:text-[1.3rem] mb-2 text-slate-700">자체 솔루션 개발</h3>
            <p class="text-sm md:text-[0.95rem] text-gray-500 leading-normal md:leading-relaxed">SSO, 웹 자동화 등 고객의 비즈니스에 새로운 가치를 더하는 기술을 개발합니다.</p>
          </div>
          <div class="text-center p-5 md:p-8 border border-gray-200 rounded-xl bg-gray-50 area-card">
            <h3 class="text-lg md:text-[1.3rem] mb-2 text-slate-700">AI/빅데이터 R&D</h3>
            <p class="text-sm md:text-[0.95rem] text-gray-500 leading-normal md:leading-relaxed">AI, 빅데이터 기술을 활용한 산학협력을 통해 혁신적인 솔루션을 연구합니다.</p>
          </div>
          <div class="text-center p-5 md:p-8 border border-gray-200 rounded-xl bg-gray-50 area-card">
            <h3 class="text-lg md:text-[1.3rem] mb-2 text-slate-700">IT 컨설팅</h3>
            <p class="text-sm md:text-[0.95rem] text-gray-500 leading-normal md:leading-relaxed">비즈니스 목표 달성을 위한 최적의 IT 전략과 방향성을 제시합니다.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="panel h-dvh py-16 md:py-24 px-4 md:px-8 md:flex md:flex-col md:justify-center">
      <div class="max-w-[1100px] mx-auto px-4 md:px-8 text-center h-full flex flex-col justify-center">
        <h2 class="text-3xl md:text-4xl mb-4 overflow-hidden">시스템 통합 및 유지보수 (SI/SM)</h2>
        <p class="text-base md:text-[1.1rem] text-gray-600 mb-8 md:mb-10 section-description large">
          다년간 축적된 경험과 기술력을 바탕으로 고객의 비즈니스 환경에 최적화된 시스템을
          설계, 구축하고 안정적으로 운영하여 업무 효율을 극대화합니다.
        </p>
        <NuxtLink to="/projects" class="inline-block bg-transparent text-blue-600 border border-blue-600 rounded-lg py-2 px-6 md:py-3 md:px-7 no-underline font-semibold transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-white details-button">자세히 보기</NuxtLink>
      </div>
    </section>

    <section class="panel h-dvh bg-gray-50 py-16 md:py-24 px-4 md:px-8 md:flex md:flex-col md:justify-center">
      <div class="max-w-[1100px] mx-auto px-4 md:px-8 text-center h-full flex flex-col justify-center">
        <h2 class="text-3xl md:text-4xl mb-4 overflow-hidden">자체 개발 솔루션</h2>
        <p class="text-base md:text-[1.1rem] text-gray-600 mb-8 md:mb-10 section-description large">
          고객의 비즈니스에 새로운 가치를 더하는 포베리만의 기술력을 만나보세요.
        </p>
        <div class="flex flex-col items-center gap-6 md:gap-8 mb-8 md:mb-10 md:flex-row md:justify-center solution-cards">
          <div class="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-[300px] card">
            <h3 class="text-lg mb-2">베리패스 (Berry-Pass)</h3>
            <p class="text-sm">다양한 소셜 인증을 통한 통합 회원 관리(SSO) 솔루션</p>
          </div>
          <div class="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-[300px] card">
            <h3 class="text-lg mb-2">베리마인 (Berry-Mine)</h3>
            <p class="text-sm">웹 정보 자동 수집 및 상호 작용을 위한 웹 자동화 솔루션</p>
          </div>
        </div>
        <NuxtLink to="/services" class="inline-block bg-transparent text-blue-600 border border-blue-600 rounded-lg py-2 px-6 md:py-3 md:px-7 no-underline font-semibold transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-white details-button">자세히 보기</NuxtLink>
      </div>
    </section>

    <section class="panel h-dvh bg-blue-600 text-white py-16 md:py-24">
      <div class="max-w-[1100px] mx-auto px-4 md:px-8 text-center h-full flex flex-col justify-center cta-section">
        <h2 class="text-2xl md:text-[2.2rem] overflow-hidden">포베리와 함께<br class="hidden sm:block" /> 새로운 가치를 만들어보세요.</h2>
        <NuxtLink to="/contact" class="inline-block bg-white text-blue-600 rounded-lg py-3 px-8 md:py-4 md:px-10 no-underline text-base md:text-[1.1rem] font-bold mt-6 transition-transform duration-200 ease-in-out hover:scale-105 contact-button">프로젝트 문의하기</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 스타일은 기존과 동일하게 유지합니다.
  패널의 position, height 등은 스크립트에서 GSAP.set()으로 동적 제어합니다.
*/
</style>
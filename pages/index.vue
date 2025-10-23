<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
// ❗ ScrollTrigger와 함께 Observer를 import 합니다.
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

// 페이지 메타 정의: home 레이아웃 사용
definePageMeta({
  layout: 'home',
})

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

    if (observer) {
      // 마지막 패널에 도달하면 preventDefault 비활성화, 아니면 활성화
      observer.vars.preventDefault = (currentIndex !== numPanels - 1);
    }
  };


  // --- 2d. Observer 생성 ---
  observer = Observer.create({
    target: mainContainer.value, // 래퍼(.mainContainer)에서 이벤트 감지
    type: 'wheel,touch,pointer', // 감지할 이벤트 타입
    onDown: () => { // 아래로 스크롤/스와이프
      // 마지막 패널이 아닐 때만 gotoSection 호출
      if (currentIndex < numPanels - 1) {
        if (!animating) gotoSection(currentIndex + 1, 1);
      } else {
        // 마지막 패널이면 기본 스크롤 허용 (preventDefault가 false여야 함)
        // 여기서 특별히 할 일 없음 (gotoSection에서 preventDefault 변경)
      }
    },
    onUp: () => { // 위로 스크롤/스와이프
      // 첫 패널이 아닐 때만 gotoSection 호출
      if (currentIndex > 0) {
        if (!animating) gotoSection(currentIndex - 1, -1);
      }
      // 첫 패널에서 위로 스크롤 시 preventDefault 다시 활성화 (필요 시)
      if(currentIndex === 0 && observer) {
        observer.vars.preventDefault = true;
      }
    },
    tolerance: 10, // 이벤트 감지 민감도
    preventDefault: true // 기본 스크롤 동작 방지
  });

  // 초기 로드 시 마지막 패널이면 preventDefault 해제
  if (currentIndex === numPanels - 1 && observer) {
    observer.vars.preventDefault = false;
  }
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
  const contentSelectors = '.home-hero h1, .home-hero .hero-subtitle, h2, .section-description, .area-card, .card, .details-button, .contact-button';
  gsap.set(contentSelectors, { clearProps: 'autoAlpha,y,clipPath,opacity,color' });
});
</script>

<template>
  <div class="w-full overflow-hidden" ref="mainContainer">

    <CommonPageHero
        class="panel h-dvh text-white" title="한 발 앞선 IT 서비스로<br />고객의 경험과 가치를 우선합니다."
        subtitle="making sweet and sour software"
        :is-home="true"
    />

    <BaseSection class="panel h-dvh bg-white text-black"> <div class="text-center h-full flex flex-col justify-center">
      <h2 class="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 section-title">ABOUT US</h2>
      <p class="text-lg md:text-xl text-gray-700 mb-12 md:mb-16 leading-relaxed section-description">
        포베리는 사람 중심의 IT 기술 발전을 위해
        AICBM(AI, IoT, Cloud, Big Data, Mobile) 중심의 사업에 매진하고 있습니다.
      </p>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 md:gap-8 business-areas">
        <div class="text-center p-5 md:p-8 area-card">
          <h3 class="text-xl md:text-2xl font-semibold mb-3 text-gray-800">시스템 통합 및 유지보수</h3>
          <p class="text-base md:text-lg text-gray-600 leading-normal md:leading-relaxed">비즈니스 환경에 최적화된 시스템을 구축하고 안정적으로 운영합니다.</p>
        </div>
        <div class="text-center p-5 md:p-8 area-card">
          <h3 class="text-xl md:text-2xl font-semibold mb-3 text-gray-800">자체 솔루션 개발</h3>
          <p class="text-base md:text-lg text-gray-600 leading-normal md:leading-relaxed">SSO, 웹 자동화 등 고객의 비즈니스에 새로운 가치를 더하는 기술을 개발합니다.</p>
        </div>
        <div class="text-center p-5 md:p-8 area-card">
          <h3 class="text-xl md:text-2xl font-semibold mb-3 text-gray-800">AI/빅데이터 R&D</h3>
          <p class="text-base md:text-lg text-gray-600 leading-normal md:leading-relaxed">AI, 빅데이터 기술을 활용한 산학협력을 통해 혁신적인 솔루션을 연구합니다.</p>
        </div>
        <div class="text-center p-5 md:p-8 area-card">
          <h3 class="text-xl md:text-2xl font-semibold mb-3 text-gray-800">IT 컨설팅</h3>
          <p class="text-base md:text-lg text-gray-600 leading-normal md:leading-relaxed">비즈니스 목표 달성을 위한 최적의 IT 전략과 방향성을 제시합니다.</p>
        </div>
      </div>
    </div>
    </BaseSection>

    <BaseSection class="panel h-dvh bg-black text-white"> <div class="text-center h-full flex flex-col justify-center">
      <h2 class="text-5xl md:text-7xl font-extrabold mb-6 section-title">시스템 통합 및 유지보수 (SI/SM)</h2>
      <p class="text-lg md:text-xl text-gray-300 mb-10 md:mb-12 leading-relaxed section-description large">
        다년간 축적된 경험과 기술력을 바탕으로 고객의 비즈니스 환경에 최적화된 시스템을
        설계, 구축하고 안정적으로 운영하여 업무 효율을 극대화합니다.
      </p>
      <NuxtLink to="/projects" class="inline-block bg-blue-600 text-white rounded-lg py-3 px-8 md:py-4 md:px-10 no-underline font-bold transition-all duration-200 ease-in-out hover:bg-blue-700 hover:scale-105 details-button">자세히 보기</NuxtLink>
    </div>
    </BaseSection>

    <BaseSection class="panel h-dvh bg-white text-black"> <div class="text-center h-full flex flex-col justify-center">
      <h2 class="text-5xl md:text-7xl font-extrabold mb-6 section-title">자체 개발 솔루션</h2>
      <p class="text-lg md:text-xl text-gray-700 mb-10 md:mb-12 leading-relaxed section-description large">
        고객의 비즈니스에 새로운 가치를 더하는 포베리만의 기술력을 만나보세요.
      </p>
      <div class="flex flex-col items-center gap-6 md:gap-8 mb-10 md:mb-12 md:flex-row md:justify-center solution-cards">
        <div class="bg-white p-6 md:p-8 rounded-xl shadow-xl w-full max-w-[350px] card border border-gray-100">
          <h3 class="text-xl md:text-2xl font-semibold mb-3 text-gray-800">베리패스 (Berry-Pass)</h3>
          <p class="text-base md:text-lg text-gray-600 leading-normal">SSO 솔루션: 다양한 인증 통합 관리</p> </div>
        <div class="bg-white p-6 md:p-8 rounded-xl shadow-xl w-full max-w-[350px] card border border-gray-100">
          <h3 class="text-xl md:text-2xl font-semibold mb-3 text-gray-800">베리마인 (Berry-Mine)</h3>
          <p class="text-base md:text-lg text-gray-600 leading-normal">웹 자동화 솔루션: 정보 수집 및 RPA</p> </div>
      </div>
      <NuxtLink to="/services" class="inline-block bg-transparent text-blue-600 border-2 border-blue-600 rounded-lg py-3 px-8 md:py-4 md:px-10 no-underline font-bold transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-white hover:border-blue-600 details-button">자세히 보기</NuxtLink>
    </div>
    </BaseSection>

    <BaseSection class="panel h-dvh bg-black text-white flex items-center"> <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center cta-section">
      <div class="strengths text-left"> <h3 class="text-3xl md:text-4xl font-bold mb-6">FOURBERRY STRENGTHS</h3>
        <ul class="space-y-4">
          <li>
            <strong class="text-blue-400">✓ 사람 중심 철학:</strong><br>
            <span class="text-gray-300 text-sm md:text-base">사용자를 최우선으로 생각하는 시스템을 구축합니다. </span>
          </li>
          <li>
            <strong class="text-blue-400">✓ 미래 기술 선도:</strong><br>
            <span class="text-gray-300 text-sm md:text-base">AICBM 기반 기술과 R&D 투자로 혁신을 추구합니다. </span>
          </li>
          <li>
            <strong class="text-blue-400">✓ 자체 솔루션 보유:</strong><br>
            <span class="text-gray-300 text-sm md:text-base">Berry-Pass(SSO), Berry-Mine(웹 자동화) 등 검증된 솔루션을 제공합니다. [cite: 657, 666]</span>
          </li>
          <li>
            <strong class="text-blue-400">✓ 풍부한 프로젝트 경험:</strong><br>
            <span class="text-gray-300 text-sm md:text-base">다양한 산업 분야의 SI/SM 프로젝트 성공 경험을 보유하고 있습니다. (e.g., 동행복권, 쿠쿠, 농협 등) [cite: 674, 702, 689]</span>
          </li>
          <li>
            <strong class="text-blue-400">✓ 최고의 팀워크:</strong><br>
            <span class="text-gray-300 text-sm md:text-base">검증된 역량과 뛰어난 팀워크로 최상의 결과물을 만듭니다. </span>
          </li>
        </ul>
      </div>

      <div class="inquiry text-center md:text-left"> <h2 class="text-4xl md:text-6xl font-extrabold leading-tight mb-8">
        함께 성장할<br class="hidden sm:block" />
        프로젝트를<br class="hidden sm:block" />
        기다립니다.
      </h2>
        <NuxtLink to="/contact" class="inline-block bg-blue-600 text-white rounded-lg py-3 px-8 md:py-4 md:px-10 no-underline text-lg md:text-xl font-bold transition-transform duration-200 ease-in-out hover:scale-105 contact-button">
          프로젝트 문의하기
        </NuxtLink>
      </div>
    </div>
    </BaseSection>

    <AppFooter class="panel h-dvh bg-black text-gray-400 flex flex-col justify-center"/>
  </div>
</template>

<style scoped>
/* 히어로 섹션 텍스트 그림자 (배경 이미지 위에 잘 보이도록) */
.home-hero h1, .home-hero .hero-subtitle {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* ABOUT US 섹션 카드 스타일 (템플릿에서 배경/테두리 제거했으므로 조정) */
.business-areas .area-card {
  border: none; /* 테두리 제거 */
  background-color: transparent; /* 배경 제거 */
  padding: 1rem 0; /* 패딩 조정 */
}
.business-areas .area-card h3 {
  /* 파란색 포인트를 제목에 적용 */
  color: #2563eb; /* Tailwind blue-600 */
}

/* 솔루션 카드 추가 스타일 (그림자 등은 템플릿에서 처리) */
.solution-cards .card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.solution-cards .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); /* 호버 시 그림자 강조 */
}
</style>
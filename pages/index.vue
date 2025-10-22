<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // --- 1. Hero 섹션 초기 로드 애니메이션 (페이지 처음 켰을 때) ---
  gsap.set('.home-hero h1, .home-hero .hero-subtitle', { autoAlpha: 0, y: 40 });
  gsap.set('.header', { autoAlpha: 0 });

  const tl = gsap.timeline();

  tl.to(".home-hero h1", { // 셀렉터 수정
    duration: 1.2,
    y: 0,
    autoAlpha: 1,
    ease: "power3.out"
  }, "-=0.3")
      .to(".home-hero .hero-subtitle", { // 셀렉터 수정
        duration: 1.2,
        y: 0,
        autoAlpha: 1,
        ease: "power3.out"
      }, "-=0.9")
      .to(".home-hero .hero-background-image", { // 셀렉터 수정
        duration: 2.5,
        clipPath: 'ellipse(150% 150% at 50% 100%)',
        opacity: 1,
        ease: "power2.inOut"
      }, "<0.2")
      .to(".home-hero .hero-content", { // 셀렉터 수정
        duration: 2.0,
        color: '#ffffff',
        ease: 'power2.inOut'
      }, "-=2.5")
      .to('.header', {
        duration: 1.0,
        autoAlpha: 1,
      }, "-=1.5");


  const panels = gsap.utils.toArray('.panel');

  panels.forEach((panel, i) => {
    if (i < panels.length - 1) { // 마지막 패널 제외
      const el = panel as HTMLElement;

      // ▼▼▼ [수정된] 타임라인 로직 ▼▼▼
      const panelTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          pin: true,

          // 1. [제거] pinSpacing: false, <-- 이 줄을 반드시 삭제!

          scrub: 1,

          // 2. [수정] 스크롤 길이를 뷰포트 100% 높이만큼으로 변경
          end: '+=100%',
        }
      });

      // 3. [수정] 타임라인 시퀀스 변경
      //    scrub을 쓸 때는 duration 대신 타임라인 위치(0.1, 0.7)로 제어

      if(i > 0) { // 0번(Hero) 패널 제외한 나머지 패널들
        const title = el.querySelector('h2');
        const description = el.querySelector('.section-description');
        const cards = gsap.utils.toArray(el.querySelectorAll('.area-card, .card'));
        const buttons = el.querySelector('.details-button, .contact-button');

        // (시작 전 초기 상태 설정)
        gsap.set([title, description, cards, buttons], { autoAlpha: 0, y: 30 });

        // 스크롤 0% ~ 20% 동안 콘텐츠가 나타나는 애니메이션
        panelTl
            .to(title, { autoAlpha: 1, y: 0 }, 0.05) // 타임라인 5% 지점
            .to(description, { autoAlpha: 1, y: 0 }, 0.1) // 타임라인 10% 지점
            .to(cards, { autoAlpha: 1, y: 0, stagger: 0.05 }, 0.1) // 10% 지점
            .to(buttons, { autoAlpha: 1, y: 0 }, 0.15); // 15% 지점
      }

      // 4. (중요) 패널이 화면 밖으로 올라가는 애니메이션
      //    스크롤 70% 지점에서 시작해서 100% 지점에서 완료되도록 설정
      panelTl.to(el, {
        yPercent: -100, // y축으로 -100% 이동
        ease: 'none',
      }, 0.7); // 타임라인 70% 지점에서 시작

      // 0번(Hero) 패널이 올라갈 때 헤더도 같이
      if(i === 0) {
        panelTl.to('.header', {
          yPercent: -100,
          autoAlpha: 0,
          ease: 'none'
        }, 0.7); // 동일하게 70% 지점에서 시작
      }
    }
  });
});
</script>

<template>
  <div class="w-full overflow-hidden">

    <CommonPageHero
        class="panel h-screen"
        title="한 발 앞선 IT 서비스로<br />고객의 경험과 가치를 우선합니다."
        subtitle="making sweet and sour software"
        :is-home="true"
    />

    <section class="panel h-screen py-24 px-8 bg-white">
      <div class="max-w-[1100px] mx-auto px-8 text-center h-full flex flex-col justify-center">
        <h2 class="text-4xl font-extrabold mb-4 text-gray-800 overflow-hidden section-title">ABOUT US</h2>
        <p class="text-[1.1rem] text-gray-600 mb-16 leading-7 section-description">
          포베리는 사람 중심의 IT 기술 발전을 위해<br />
          AICBM(AI, IoT, Cloud, Big Data, Mobile) 중심의 사업에 매진하고 있습니다.
        </p>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 business-areas">
          <div class="text-center p-8 border border-gray-200 rounded-xl bg-gray-50 area-card">
            <h3 class="text-[1.3rem] mb-2 text-slate-700">시스템 통합 및 유지보수</h3>
            <p class="text-[0.95rem] text-gray-500 leading-relaxed">비즈니스 환경에 최적화된 시스템을 구축하고 안정적으로 운영합니다.</p>
          </div>
          <div class="text-center p-8 border border-gray-200 rounded-xl bg-gray-50 area-card">
            <h3 class="text-[1.3rem] mb-2 text-slate-700">자체 솔루션 개발</h3>
            <p class="text-[0.95rem] text-gray-500 leading-relaxed">SSO, 웹 자동화 등 고객의 비즈니스에 새로운 가치를 더하는 기술을 개발합니다.</p>
          </div>
          <div class="text-center p-8 border border-gray-200 rounded-xl bg-gray-50 area-card">
            <h3 class="text-[1.3rem] mb-2 text-slate-700">AI/빅데이터 R&D</h3>
            <p class="text-[0.95rem] text-gray-500 leading-relaxed">AI, 빅데이터 기술을 활용한 산학협력을 통해 혁신적인 솔루션을 연구합니다.</p>
          </div>
          <div class="text-center p-8 border border-gray-200 rounded-xl bg-gray-50 area-card">
            <h3 class="text-[1.3rem] mb-2 text-slate-700">IT 컨설팅</h3>
            <p class="text-[0.95rem] text-gray-500 leading-relaxed">비즈니스 목표 달성을 위한 최적의 IT 전략과 방향성을 제시합니다.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="panel h-screen py-24 px-8 md:flex md:flex-col md:justify-center">
      <div class="max-w-[1100px] mx-auto px-8 text-center h-full flex flex-col justify-center">
        <h2 class="text-4xl mb-4 overflow-hidden">시스템 통합 및 유지보수 (SI/SM)</h2>
        <p class="text-[1.1rem] text-gray-600 mb-10 section-description large">
          다년간 축적된 경험과 기술력을 바탕으로 고객의 비즈니스 환경에 최적화된 시스템을<br />
          설계, 구축하고 안정적으로 운영하여 업무 효율을 극대화합니다.
        </p>
        <NuxtLink to="/projects" class="inline-block bg-transparent text-blue-600 border border-blue-600 rounded-lg py-3 px-7 no-underline font-semibold transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-white details-button">자세히 보기</NuxtLink>
      </div>
    </section>

    <section class="panel h-screen bg-gray-50 py-24 px-8 md:flex md:flex-col md:justify-center">
      <div class="max-w-[1100px] mx-auto px-8 text-center h-full flex flex-col justify-center">
        <h2 class="text-4xl mb-4 overflow-hidden">자체 개발 솔루션</h2>
        <p class="text-[1.1rem] text-gray-600 mb-10 section-description large">
          고객의 비즈니스에 새로운 가치를 더하는 포베리만의 기술력을 만나보세요.
        </p>
        <div class="flex flex-col items-center gap-8 mb-10 md:flex-row md:justify-center solution-cards">
          <div class="bg-white p-8 rounded-xl shadow-lg w-[300px] card">
            <h3 class="mb-2">베리패스 (Berry-Pass)</h3>
            <p>다양한 소셜 인증을 통한 통합 회원 관리(SSO) 솔루션</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-lg w-[300px] card">
            <h3 class="mb-2">베리마인 (Berry-Mine)</h3>
            <p>웹 정보 자동 수집 및 상호 작용을 위한 웹 자동화 솔루션</p>
          </div>
        </div>
        <NuxtLink to="/services" class="inline-block bg-transparent text-blue-600 border border-blue-600 rounded-lg py-3 px-7 no-underline font-semibold transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-white details-button">자세히 보기</NuxtLink>
      </div>
    </section>

    <section class="panel h-screen bg-blue-600 text-white py-24">
      <div class="max-w-[1100px] mx-auto px-8 text-center h-full flex flex-col justify-center cta-section">
        <h2 class="text-[2.2rem] overflow-hidden">포베리와 함께<br />새로운 가치를 만들어보세요.</h2>
        <NuxtLink to="/contact" class="inline-block bg-white text-blue-600 rounded-lg py-4 px-10 no-underline text-[1.1rem] font-bold mt-6 transition-transform duration-200 ease-in-out hover:scale-105 contact-button">프로젝트 문의하기</NuxtLink>
      </div>
    </section>
  </div>
</template>

<<style scoped>

</style>

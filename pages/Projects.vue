<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch, onBeforeMount } from 'vue' // computed 추가
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useHeaderVisibility } from '../composables/useHeaderState'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const isHeaderHidden = useHeaderVisibility() // 헤더 상태 가져오기
let headerScrollTrigger: ScrollTrigger | null = null;
let pinTrigger: ScrollTrigger | null = null;
let titleFadeTrigger: ScrollTrigger | null = null;

// pages/Projects.vue 의 <script setup> 내부

const projects = ref([
  {
    id: 'cuckoo-oms',
    title: '쿠쿠 통합 쇼핑몰 관리 (OMS)',
    description: '78개 영업채널의 주문, 배송, 재고 관리를 위한 차세대 시스템',
    period: '2021.11 ~ 2022.09 (구축) / 2025.01 ~ 현재 (운영)',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fG9yZGVyJTIwbWFuYWdlbWVudHxlbnwwfHx8fDE2NzgwNjQ0MDU&ixlib=rb-4.0.3&q=80&w=1080',
    keywords: ['78개 채널', '주문/배송/재고 통합', 'SCM 시스템'], // [추가]
    details: [ // [추가]
      '기존 수작업 위주의 SCM 업무 및 3rd party 업체의 E-MAIL/EXCEL 위주 업무 처리 방식 개선 요구 [cite: 160]',
      '유통사별 SCM 업무 일원화 및 단순/반복 업무 자동화를 통한 인력/시간 절감 목표 [cite: 160]',
      'API 연동, RPA PC 도입 등 개선 방향 적용 [cite: 160]',
      '차세대 SCM 시스템과 영업 시스템 간의 연관성 검토 및 시너지 효과 분석 [cite: 160]',
    ],
    detailImages: [ // [추가] - 실제 이미지 URL 또는 경로로 변경 필요
      '[포베리]회사소개서_20250930.pptx 페이지 12의 추진 배경 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 12의 업무처리 프로세스 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 13의 개선방향 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 13의 업무 연관성 이미지',
    ]
  },
  {
    id: 'cuckoo-pos',
    title: '쿠쿠 차세대 영업관리 (POS & WEB)',
    description: '판매, 정산, 재고, 매출, 고객 정보 등 유통 관점의 실시간 데이터 관리 시스템',
    period: '2019.05 ~ 2019.12 (구축) / 2025.01 ~ 현재 (운영)',
    image: 'https://images.unsplash.com/photo-1587691592099-f4d15f0892de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEyfHxwb3MlMjBzeXN0ZW18ZW58MHx8fHwxNjc4MDY0NDYx&ixlib=rb-4.0.3&q=80&w=1080',
    keywords: ['실시간 데이터 관리', 'POS & WEB', '판매/정산/재고'], // [추가]
    details: [ // [추가]
      '업무 중심의 판매 관리 시스템(POS & WEB) 도입 [cite: 168]',
      '정산 관리, 재고 및 매출 관리, 영업 분석 기능 제공 [cite: 168]',
      '판매 고객 정보 관리 등 유통 관점의 실시간 판매 데이터 관리에 최적화된 시스템 구축 [cite: 168]',
    ],
    detailImages: [ // [추가]
      '[포베리]회사소개서_20250930.pptx 페이지 14의 시스템 화면 이미지'
    ]
  },
  {
    id: 'nonghyup-mall',
    title: '영등포농협 브랜드 쇼핑몰',
    description: '하이브리드 모바일 쇼핑몰, 관리자 사이트, 관리자 앱 시스템 (Always withFresh)',
    period: '2024.01 ~ 2025.03 (구축) / 2025.04 ~ 현재 (운영)',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGdyb2NlcnklMjBzdG9yZXxlbnwwfHx8fDE2NzgwNjQ1MDI&ixlib=rb-4.0.3&q=80&w=1080',
    keywords: ['Hybrid 모바일 쇼핑몰', 'Always withFresh', '관리자 앱 포함'], // [추가]
    details: [ // [추가]
      '영등포농협 자체 브랜드몰 "Always withFresh" 구축 [cite: 143]',
      'Hybrid 모바일 앱 형태의 온라인 쇼핑몰 개발 [cite: 144]',
      '상품, 전시, 컨텐츠(CMS), 프로모션(행사, 쿠폰), 통계 등 100여 건의 관리자 메뉴 개발 [cite: 145]',
    ],
    detailImages: [ // [추가]
      '[포베리]회사소개서_20250930.pptx 페이지 11의 모바일 화면 (메인) 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 11의 모바일 화면 (카테고리) 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 11의 모바일 화면 (상품목록) 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 11의 모바일 화면 (상품상세) 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 11의 모바일 화면 (팝업) 이미지',
    ]
  },
  {
    id: 'nonghyup-sso',
    title: '영등포농협 SSO 시스템',
    description: '온라인몰 포함 3개 사이트 통합 회원 관리를 위한 SSO 시스템 (소셜 인증 포함)',
    period: '2024.08 ~ 2024.12 (구축)',
    image: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxsYW5kc2NhcGV8ZW58MHx8fHwxNjc4MDY0NTMw&ixlib.rb-4.0.3&q=80&w=1080',
    keywords: ['SSO', '3개 사이트 통합', '소셜 인증'], // [추가]
    details: [ // [추가]
      '영등포농협 관리 사이트 2개 및 신규 브랜드 온라인몰의 통합 회원 관리 시스템 구축 [cite: 203]',
      '휴대폰 번호 및 다양한 소셜(카카오, 네이버, 애플 등) 인증을 통한 가입 및 로그인 기능 제공 [cite: 203]',
      '사이트별 약관 동의 관리 및 통합 계정 관리 기능 구현 [cite: 204]',
    ],
    detailImages: [ // [추가]
      '[포베리]회사소개서_20250930.pptx 페이지 17의 로그인 선택 화면 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 17의 소셜 로그인 화면 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 17의 내정보관리 화면 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 17의 약관동의 화면 이미지',
    ]
  },
  {
    id: 'dhlottery',
    title: '동행복권 인쇄복권 DB 전환',
    description: '이원화된 시스템 통합 및 안정성 확보를 위한 DB 전환 (MySql to Oracle)',
    period: '2024.10 ~ 현재 (2025년 10월 전환 예정)',
    image: 'https://images.unsplash.com/photo-1518186285587-e21e49e921d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGxvYWR8ZW58MHx8fHwxNjc4MDY0NTYy&ixlib=rb-4.0.3&q=80&w=1080',
    keywords: ['DB 전환 (MySQL→Oracle)', '시스템 통합', '약 50억 건 이관'], // [추가]
    details: [ // [추가]
      '이원화된 인쇄복권 시스템(PTMS/PLMS) 통합 [cite: 128]',
      '시스템 안정성 확보를 위한 데이터베이스 전환 (MySQL to Oracle) [cite: 128, 129]',
      '약 200여 개 시스템 메뉴 변환 작업 포함 [cite: 128]',
      '전체 데이터 약 50억 건에 대한 데이터 변환 및 이관 수행 [cite: 129]',
      '현황 분석, 개발 표준 및 ETL 구축, 전환 계획 수립 및 리허설, 시스템 전환 및 안정화 단계로 진행 [cite: 132, 133, 134, 135]',
    ],
    detailImages: [ // [추가]
      '[포베리]회사소개서_20250930.pptx 페이지 10의 데이터 전환 분석 표 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 10의 개발 표준 목차 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 10의 ETL 도구 이미지',
    ]
  },
  {
    id: 'autocrypt',
    title: '아우토크립트 K-CSMS',
    description: '자동차 보안 취약점 정보 제공 커뮤니티 사이트',
    period: '1차: 2024.06 ~ 2024.10 / 2차: 2025.06 ~ 2025.09 (구축)',
    image: 'https://images.unsplash.com/photo-1487058792275-054922ca9c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fHNlY3VyaXR5fGVufDB8fHx8MTY3ODA2NDU5MQ&ixlib=rb-4.0.3&q=80&w=1080',
    keywords: ['K-CSMS', '자동차 보안', '취약점 정보 커뮤니티'], // [추가]
    details: [ // [추가]
      '자동차 IT 보안 취약점 정보 제공 및 공유를 위한 커뮤니티 사이트 구축 [cite: 179]',
      '벤더, 제품, 플랫폼별 취약점 현황 통계 대시보드 제공 [cite: 182]',
      '코드 기반 SW 자동 점검 및 CVE/CWE 분석, CVSS 위험도 시각화 기능 구현 [cite: 182]',
    ],
    detailImages: [ // [추가]
      '[포베리]회사소개서_20250930.pptx 페이지 15의 대시보드 화면 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 15의 통계 화면 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 15의 파일 업로드 화면 이미지',
    ]
  },
  {
    id: 'kobc-game', // ID 변경: hyundai -> kobc-game
    title: '한국해양공사 매연 저감 캠페인',
    description: '선박 매연 저감 주제의 게이미피케이션 캠페인 시스템 (부루마블 형식)',
    period: '2024.10 ~ 2025.01 (구축)',
    image: 'https://images.unsplash.com/photo-1487058792275-054922ca9c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fHNlY3VyaXR5fGVufDB8fHx8MTY3ODA2NDU5MQ&ixlib=rb-4.0.3&q=80&w=1080', // 이미지 변경
    keywords: ['게이미피케이션', '부루마블', '매연 저감 캠페인', 'PC/모바일 최적화'], // [추가]
    details: [ // [추가]
      '선박 매연 저감 캠페인을 부루마블 게임 형식과 접목 [cite: 190]',
      '각 항구별 매연 수치를 최소화하며 완주하는 게임 방식 [cite: 190]',
      'PC와 모바일 환경 모두 지원하며, 저사양 모바일 기기에서도 원활히 구동되도록 최적화 진행 [cite: 191]',
      '구축 완료 후 1차, 2차 캠페인 진행 지원 [cite: 193]',
    ],
    detailImages: [ // [추가]
      '[포베리]회사소개서_20250930.pptx 페이지 16의 PC 게임 화면 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 16의 모바일 게임 화면 이미지',
    ]
  },
  {
    id: 'hyundai',
    title: '현대자동차 차량출입관제',
    description: '실시간 차량 출입 집계 및 관리를 통한 작업자 안전 및 보안 관리 향상',
    period: '2020.07 ~ 2020.10 (구축)',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxjYXJ8ZW58MHx8fHwxNjc4MDY0NjIx&ixlib=rb-4.0.3&q=80&w=1080',
    keywords: ['차량 출입 관제', 'Kiosk/WEB 시스템', '안전/보안 강화'], // [추가]
    details: [ // [추가]
      'Kiosk 도입 및 WEB 시스템을 통해 출입 명부 및 출입 차량의 실시간 전산 관리 [cite: 274, 278]',
      '출입자의 신속한 사업장 출입 지원 [cite: 275]',
      '실시간 출입 명부 관리를 통해 작업자 안전 및 보안 체계 관리 향상 [cite: 276]',
      '차량 5부제 안내, 방문 차량 환영 메시지, 차량 인식 및 등록/미등록 정보 표시 등 기능 구현 [cite: 278]',
    ],
    detailImages: [ // [추가]
      '[포베리]회사소개서_20250930.pptx 페이지 20의 Kiosk 화면 예시 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 20의 화면 구성 설명 이미지',
    ]
  },
  {
    id: 'etas',
    title: 'eTAS 운행기록분석시스템',
    description: '노후 장비 교체, 실시간 DTG 수집체계 구축 및 정보 컨설팅',
    period: '2020.06 ~ 2020.12 (구축)',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGJ1c3xlbnwwfHx8fDE2NzgwNjQ2NDk&ixlib=rb-4.0.3&q=80&w=1080',
    keywords: ['DTG 분석 시스템', '실시간 수집', '정보 컨설팅'], // [추가]
    details: [ // [추가]
      '운행기록분석시스템(eTAS)의 노후 장비 교체 및 안정적 인프라 구성 [cite: 286]',
      '모바일 DTG 확산을 위한 실시간 DTG(운행기록장치) 수집 체계 구축 [cite: 287]',
      '시스템의 효율적 운영과 장기적 발전 계획 수립을 위한 정보 컨설팅 수행 [cite: 288]',
    ],
    detailImages: [ // [추가]
      '[포베리]회사소개서_20250930.pptx 페이지 21의 시스템 구성도 이미지',
      '[포베리]회사소개서_20250930.pptx 페이지 21의 데이터 수집 방식 이미지',
    ]
  },
]);
const activeProjectId = ref(projects.value[0]?.id || '')
let triggers: ScrollTrigger[] = [];

// --- ✨ 현재 활성화된 프로젝트 객체를 찾는 computed 속성 ---
const activeProject = computed(() => {
  return projects.value.find(p => p.id === activeProjectId.value);
});

// 스크롤 이동 메소드
const scrollToProject = (projectId: string) => {
  // 클릭 시 activeProjectId 즉시 변경 (선택 사항, 더 빠른 반응성)
  // activeProjectId.value = projectId;
  gsap.to(window, {
    duration: 1,
    scrollTo: { y: `#${projectId}`, offsetY: 100 },
    ease: 'power2.inOut'
  });
}

// ❗️ scrollToActiveTitle 함수는 더 이상 필요 없으므로 제거

onMounted(async () => {
  await nextTick();
  const titlesElement = document.querySelector('.project-titles');
  // const detailsElement = document.querySelector('.project-details');
  const mainContentElement = document.querySelector('.main-content-area');
  const sections = gsap.utils.toArray<HTMLElement>('.project-detail-section');

  // --- ❗ Pinning ScrollTrigger 추가 ---
  // if (titlesElement && detailsElement) {
  //   pinTrigger = ScrollTrigger.create({
  //     trigger: detailsElement, // 스크롤 길이는 details 영역 기준
  //     pin: titlesElement,      // 고정할 요소는 titles 영역
  //     start: 'top 200px',     // details 상단이 헤더 아래(100px)에 닿을 때 고정 시작
  //     end: () => `+=${detailsElement.scrollHeight - window.innerHeight + 100}`, // details 영역 전체 스크롤 + 여유 공간 만큼 고정
  //     // markers: true, // 디버깅용
  //     pinSpacing: false // Pin된 요소 아래 간격 자동 추가 안함 (grid gap 사용)
  //   });
  // }

  if (titlesElement && mainContentElement) {
    // GSAP 애니메이션 생성 (초기에는 실행 X)
    const titleAnimation = gsap.to(titlesElement, {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateX(0)',
      duration: 0.5,
      ease: 'power2.out',
      paused: true // 스크롤 트리거가 제어하도록 paused 설정
    });

    // 스크롤 트리거 생성
    titleFadeTrigger = ScrollTrigger.create({
      trigger: mainContentElement, // .main-content-area를 기준으로
      start: 'top 300px', // main-content-area 상단이 뷰포트 상단에서 300px 지점에 닿을 때
      end: 'bottom center',
      toggleActions: 'play reverse play reverse',
      animation: titleAnimation, // 위에서 만든 애니메이션 연결
      // markers: true, // 디버깅용
    });
  }

  sections.forEach((section) => {
    const projectId = section.dataset.projectId;

    if (projectId) {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top center+=50',
        end: 'bottom center-=50',
        // markers: true,
        onEnter: () => { activeProjectId.value = projectId; },
        onEnterBack: () => { activeProjectId.value = projectId; },
      });
      triggers.push(trigger);
    }

    gsap.from(section.querySelector('.detail-content'), {
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });
  });

  if (projects.value.length > 0) {
    activeProjectId.value = projects.value[0].id;
  }

  headerScrollTrigger = ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom top',
    onUpdate: self => {
      const currentScrollY = self.scroll();

      // 스크롤이 100px 미만이거나 스크롤을 올릴 때(direction: -1) 헤더 표시
      if (currentScrollY < 100 || self.direction === -1) {
        isHeaderHidden.value = false;
      }
      // 스크롤을 내릴 때(direction: 1) 헤더 숨김
      else if (self.direction === 1) {
        isHeaderHidden.value = true;
      }
    },
  });
});

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill());
  headerScrollTrigger?.kill();
  titleFadeTrigger?.kill();
  // pinTrigger?.kill();
});
</script>

<template>
  <div class="projects-page">
    <CommonPageHero
        title="SI / SM Projects"
        subtitle="포베리가 성공적으로 수행한 시스템 통합 및 유지보수 프로젝트들입니다."
        background-image-url="https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
    />

    <div class="main-content-area">
      <aside class="project-titles">
        <Transition name="fade-up" mode="out-in">
          <div :key="activeProject?.id" class="active-title-wrapper">
            <h3 v-if="activeProject">{{ activeProject.title }}</h3>
            <ul v-if="activeProject?.keywords" class="active-project-keywords">
              <li v-for="keyword in activeProject.keywords" :key="keyword">{{ keyword }}</li>
            </ul>
          </div>
        </Transition>
        <ul style="display: none;">
          <li v-for="project in projects" :key="project.id">
            <a :href="`#${project.id}`" @click.prevent="scrollToProject(project.id)">
              {{ project.title }}
            </a>
          </li>
        </ul>
      </aside>

      <main class="project-details">
        <section
            v-for="project in projects"
            :key="project.id"
            :id="project.id"
            class="project-detail-section"
            :data-project-id="project.id"
        >
          <div class="detail-content">
            <h2>{{ project.title }}</h2>
            <p>{{ project.description }}</p>
            <span class="period">{{ project.period }}</span>
            <img :src="project.image" :alt="`${project.title} image`" loading="lazy">
            <div v-if="project.details && project.details.length > 0" class="project-extra-details">
              <h4>주요 내용</h4>
              <ul>
                <li v-for="(detail, index) in project.details" :key="index">{{ detail }}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>

    <section class="outro-section">
      <h2>더 많은 프로젝트가 궁금하신가요?</h2>
      <NuxtLink to="/contact" class="contact-button">문의하기</NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.projects-page {
  background-color: #ffffff;
}

.outro-section {
  padding: 6rem 2rem;
  text-align: center;
  background-color: #f8f9fa;
  min-height: 500px;
}
.outro-section h2 { font-size: 2rem; margin-bottom: 1.5rem; }
.contact-button { /* 스타일은 이전과 동일 */
  display: inline-block;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2.5rem;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 700;
  transition: transform 0.2s ease, background-color 0.2s ease;
}
.contact-button:hover { transform: scale(1.05); background-color: #0056b3; }

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px); /* 아래에서 시작 */
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px); /* 위로 사라짐 (선택 사항) */
}

/* (선택 사항) 제목 래퍼 높이 고정하여 레이아웃 밀림 방지 */
.active-title-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* --- 메인 콘텐츠 영역 --- */
.main-content-area {
  display: grid;
  /* 왼쪽 컬럼 너비 고정, 오른쪽은 나머지 공간 차지 */
  grid-template-columns: 300px 1fr;
  gap: 5rem; /* 컬럼 사이 간격 */
  max-width: 1400px;
  margin: 4rem auto;
  padding: 0 2rem;
  align-items: start; /* 중요: 컬럼들이 위쪽 정렬되도록 */
}

/* --- 왼쪽 제목 목록 --- */
.project-titles {
  position: sticky;
  top: 250px;
  z-index: 10;
  /* overflow 제거 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
  padding: 1rem 0; /* 상하 여백 */
  height: fit-content; /* 내용 높이에 맞춤 */

  opacity: 0;
  visibility: hidden;
  transform: translateX(-30px);
}

.project-titles h3 {
  font-size: 3rem; /* 제목 크기 키움 */
  font-weight: 700;
  color: #007aff; /* 활성 색상 */
}

.project-titles ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
/* Webkit 브라우저 스크롤바 */
.project-titles ul::-webkit-scrollbar {
  width: 6px;
}
.project-titles ul::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 3px;
}
.project-titles ul::-webkit-scrollbar-thumb {
  background-color: #007aff;
  border-radius: 3px;
}


.project-titles a {
  text-decoration: none;
  color: #888;
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.3s ease, font-weight 0.3s ease, background-color 0.3s ease, padding 0.3s ease; /* transition 추가 */
  display: block;
  padding: 1rem 1.5rem; /* 패딩 추가 */
  border-left: 3px solid transparent; /* 비활성 상태 테두리 */
}

.project-titles a.active {
  color: #007aff;
  font-weight: 700;
  background-color: #e9ecef; /* 활성 배경색 */
  border-left-color: #007aff; /* 활성 테두리 */
}
.project-titles a:hover {
  color: #333;
  background-color: #f8f9fa; /* 호버 배경색 */
}

.active-project-keywords {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #777;
}
.active-project-keywords li {
  display: inline-block; /* 가로 배치 */
  margin-right: 0.5rem;
  margin-bottom: 0.3rem;
  padding: 0.2rem 0.6rem;
  background-color: #f0f0f0; /* 배경색 */
  border-radius: 4px; /* 둥근 모서리 */
}

/* --- 오른쪽 상세 내용 --- */
.project-detail-section {
  padding-top: 5rem;    /* ✨ 내부 상단 여백 추가 (sticky top 값 등 고려) */
  padding-bottom: 5rem; /* ✨ 내부 하단 여백 추가 */
  margin-bottom: 5rem;  /* ✨ 섹션 간 간격 */
  box-sizing: border-box;
}
.project-details {
  /* margin-left 제거 */
  padding-bottom: 10vh; /* ✨ 마지막 섹션 스크롤 공간 확보 (값 조절 필요) */
}

.project-extra-details {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee; /* 구분선 */
  text-align: left; /* 상세 내용은 왼쪽 정렬 */
}

.project-extra-details h4 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

.project-extra-details ul {
  list-style: disc; /* 기본 불릿 리스트 */
  padding-left: 1.5rem; /* 들여쓰기 */
  margin: 0;
}

.project-extra-details li {
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 0.8rem;
}


.project-detail-images h4 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: left; /* 제목 왼쪽 정렬 */
}


.image-gallery img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  object-fit: cover; /* 이미지 비율 유지하며 채우기 */
  margin-top: 0; /* 기존 img 스타일 덮어쓰기 */
}

.detail-content {
  /* 내용 스타일 */
}

.detail-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.detail-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 1rem;
}

.detail-content .period {
  display: block;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 2.5rem;
}

.detail-content img {
  width: 100%;
  max-width: 800px; /* 이미지 최대 너비 */
  height: auto;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-top: 2rem; /* 이미지 위쪽 여백 */
  display: block; /* margin auto 적용 위해 */
  margin-left: auto;
  margin-right: auto;
}


/* [추가] 1400px 이하 ~ 993px 이상일 때 */
@media (max-width: 1400px) and (min-width: 993px) {
  .project-titles {
    /* 화면이 1400px보다 좁아지면
       (100vw - 100vw)/2 + 2rem = 2rem 이 됨 */
    left: 2rem;
  }
}
/* 반응형 스타일 */
@media (max-width: 992px) {
  .main-content-area {
    padding: 4rem 2rem;
  }
  .project-titles {
    position: static; /* sticky 해제 */
    margin-bottom: 3rem;
    padding-bottom: 0;
    text-align: center; /* 모바일에선 중앙 정렬 */
    transform: none;
    width: auto;
    left: auto;
  }
  .project-details {
    margin-left: 0;
  }
  .project-titles ul {
    max-height: none;
    overflow-x: auto; /* 가로 스크롤 */
    overflow-y: hidden; /* 세로 스크롤 숨김 */
    display: flex;
    padding-bottom: 1rem;
    white-space: nowrap;
    border-bottom: 1px solid #eee; /* 구분선 */
  }
  .project-titles li {
    margin-right: 0;
  }
  .project-titles a {
    padding: 0.8rem 1rem;
    border-left: none; /* 왼쪽 테두리 제거 */
    border-bottom: 3px solid transparent; /* 하단 테두리 준비 */
  }
  .project-titles a.active {
    background-color: transparent; /* 활성 배경색 제거 */
    border-left-color: transparent;
    border-bottom-color: #007aff; /* 활성 하단 테두리 */
  }
  .project-titles a:hover {
    background-color: #f8f9fa;
  }
  .project-detail-section {
    min-height: auto;
    margin-bottom: 6rem;
    padding-top: 0; /* 모바일에서는 필요 없음 */
  }
  .project-titles h3 {
    font-size: 1.5rem; /* 모바일 제목 크기 조정 */
  }
  .project-detail-section {
    min-height: auto;
    margin-bottom: 6rem;
    padding-top: 0;
  }
}
</style>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch, onBeforeMount } from 'vue' // computed 추가
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useHeaderVisibility } from '../composables/useHeaderState'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const isHeaderHidden = useHeaderVisibility() // 헤더 상태 가져오기
let headerScrollTrigger: ScrollTrigger | null = null;

const projects = ref([
  // ... 프로젝트 데이터 ...
  { id: 'cuckoo-oms', title: '쿠쿠 통합 쇼핑몰 관리 (OMS)', description: '78개 영업채널의 주문, 배송, 재고 관리를 위한 차세대 시스템', period: '2021.11 ~ 2022.09 (구축) / 2025.01 ~ 현재 (운영)', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fG9yZGVyJTIwbWFuYWdlbWVudHxlbnwwfHx8fDE2NzgwNjQ0MDU&ixlib=rb-4.0.3&q=80&w=1080' },
  { id: 'cuckoo-pos', title: '쿠쿠 차세대 영업관리 (POS & WEB)', description: '판매, 정산, 재고, 매출, 고객 정보 등 유통 관점의 실시간 데이터 관리 시스템', period: '2019.05 ~ 2019.12 (구축) / 2025.01 ~ 현재 (운영)', image: 'https://images.unsplash.com/photo-1587691592099-f4d15f0892de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEyfHxwb3MlMjBzeXN0ZW18ZW58MHx8fHwxNjc4MDY0NDYx&ixlib=rb-4.0.3&q=80&w=1080' },
  { id: 'nonghyup-mall', title: '영등포농협 브랜드 쇼핑몰', description: '하이브리드 모바일 쇼핑몰, 관리자 사이트, 관리자 앱 시스템 (Always withFresh)', period: '2024.01 ~ 2025.03 (구축) / 2025.04 ~ 현재 (운영)', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGdyb2NlcnklMjBzdG9yZXxlbnwwfHx8fDE2NzgwNjQ1MDI&ixlib=rb-4.0.3&q=80&w=1080' },
  { id: 'nonghyup-sso', title: '영등포농협 SSO 시스템', description: '온라인몰 포함 3개 사이트 통합 회원 관리를 위한 SSO 시스템 (소셜 인증 포함)', period: '2024.08 ~ 2024.12 (구축)', image: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxsYW5kc2NhcGV8ZW58MHx8fHwxNjc4MDY0NTMw&ixlib.rb-4.0.3&q=80&w=1080' },
  { id: 'dhlottery', title: '동행복권 인쇄복권 DB 전환', description: '이원화된 시스템 통합 및 안정성 확보를 위한 DB 전환 (MySql to Oracle)', period: '2024.10 ~ 현재 (2025년 10월 전환 예정)', image: 'https://images.unsplash.com/photo-1518186285587-e21e49e921d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGxvYWR8ZW58MHx8fHwxNjc4MDY0NTYy&ixlib=rb-4.0.3&q=80&w=1080' },
  { id: 'autocrypt', title: '아우토크립트 K-CSMS', description: '자동차 보안 취약점 정보 제공 커뮤니티 사이트', period: '1차: 2024.06 ~ 2024.10 / 2차: 2025.06 ~ 2025.09 (구축)', image: 'https://images.unsplash.com/photo-1487058792275-054922ca9c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fHNlY3VyaXR5fGVufDB8fHx8MTY3ODA2NDU5MQ&ixlib=rb-4.0.3&q=80&w=1080' },
  { id: 'hyundai', title: '현대자동차 차량출입관제', description: '실시간 차량 출입 집계 및 관리를 통한 작업자 안전 및 보안 관리 향상', period: '2020.07 ~ 2020.10 (구축)', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxjYXJ8ZW58MHx8fHwxNjc4MDY0NjIx&ixlib=rb-4.0.3&q=80&w=1080' },
  { id: 'etas', title: 'eTAS 운행기록분석시스템', description: '노후 장비 교체, 실시간 DTG 수집체계 구축 및 정보 컨설팅', period: '2020.06 ~ 2020.12 (구축)', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGJ1c3xlbnwwfHx8fDE2NzgwNjQ2NDk&ixlib=rb-4.0.3&q=80&w=1080' },
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
  const sections = gsap.utils.toArray('.project-detail-section');

  sections.forEach((section) => {
    const el = section as HTMLElement;
    const projectId = el.dataset.projectId;

    if (projectId) {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top center+=50',
        end: 'bottom center-=50',
        // markers: true,
        onEnter: () => { activeProjectId.value = projectId; },
        onEnterBack: () => { activeProjectId.value = projectId; },
      });
      triggers.push(trigger);
    }

    gsap.from(el.querySelector('.detail-content'), {
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
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
});
</script>

<template>
  <div class="projects-page">
    <section class="intro-section">
      <h1>SI / SM Projects</h1>
      <p>포베리가 성공적으로 수행한 시스템 통합 및 유지보수 프로젝트들입니다.</p>
    </section>

    <div class="main-content-area">
      <aside class="project-titles">
        <Transition name="fade-up" mode="out-in">
          <div :key="activeProject?.id" class="active-title-wrapper">
            <h3 v-if="activeProject">{{ activeProject.title }}</h3>
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
  color: #333;
}

.intro-section {
  /* [수정] 최소 높이를 화면 전체 높이로 변경 */
  min-height: 100vh;
  padding: 6rem 2rem;
  text-align: center;

  /* [추가] Flexbox를 사용해 텍스트 콘텐츠를 수직/수평 중앙 정렬 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* [추가] 배경 이미지 및 어두운 오버레이 */
  background-image:
    /* 1. 어두운 오버레이 (가독성을 위해 60% 불투명도 검은색) */
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
        /* 2. 추천 이미지 URL (추상적인 기술/네트워크) */
      url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920');

  background-color: #222; /* 이미지 로딩 전 배경색 */
  background-size: cover; /* 화면에 꽉 차게 */
  background-position: center center; /* 중앙 정렬 */
  background-attachment: fixed; /* 스크롤 시 고정되는 패럴랙스 효과 */
}

/* [수정] 어두운 배경에 맞춰 h1 텍스트 색상 변경 */
.intro-section h1 {
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
  color: #ffffff; /* 흰색 */
}

/* [수정] 어두운 배경에 맞춰 p 텍스트 색상 변경 */
.intro-section p {
  font-size: 1.1rem;
  color: #f0f0f0; /* 밝은 회색 */
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
  min-height: 50px; /* 제목 폰트 크기 및 줄 수에 맞게 조절 */
  display: flex;
  align-items: center; /* 세로 중앙 정렬 (선택 사항) */
}

/* --- 메인 콘텐츠 영역 --- */
.main-content-area {
  display: grid;
  max-width: 1400px; /* 전체 최대 너비 */
  margin: 0 auto;
  padding: 4rem 2rem;
}

/* --- 왼쪽 제목 목록 --- */
.project-titles {
  position: sticky;
  top: 50vh;
  transform: translateY(-50%);
  z-index: 10;
  /* overflow 제거 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
  padding: 1rem 0; /* 상하 여백 */
  height: fit-content; /* 내용 높이에 맞춤 */
  align-self: start; /* Grid 아이템을 시작점에 정렬 (매우 중요) */
}

.project-titles h3 {
  font-size: 1.8rem; /* 제목 크기 키움 */
  font-weight: 700;
  color: #007aff; /* 활성 색상 */
  margin: 0; /* 기본 마진 제거 */
  line-height: 1.4;
}

.project-titles ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 100%; /* 부모 높이만큼 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  /* 스크롤바 디자인 (선택 사항) */
  scrollbar-width: thin;
  scrollbar-color: #007aff #f8f9fa;
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

.project-titles li {
  margin-bottom: 0; /* 아래쪽 마진 제거 */
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

/* --- 오른쪽 상세 내용 --- */
.project-detail-section {
  min-height: 90vh; /* 높이를 조금 더 늘려 겹침 방지 */
  margin-bottom: 5rem; /* 간격 살짝 줄임 */
  padding-top: 150px; /* 상단 여백 조금 더 확보 */
  box-sizing: border-box;
}
.project-detail-section:last-child {
  margin-bottom: 0;
  min-height: calc(90vh - 150px);
}
.project-details {
  /* [추가] fixed된 왼쪽 영역(300px) + 갭(4rem) 만큼 마진 */
  margin-left: calc(300px + 4rem);
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
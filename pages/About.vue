<script setup lang="ts">
import { ref, computed } from 'vue'

// 1. 연혁 데이터를 년도별로 그룹화
const historyData = ref({
  '2025': [
    { month: '06', title: '아우토크립트 K-CSMS 구축 (2차)', description: '자동차 보안 취약점 정보 제공 커뮤니티 사이트 2차 구축을 시작합니다.' },
    { month: '04', title: '영등포농협 온라인 쇼핑몰 운영 시작', description: "'Always withFresh' 시스템 운영 및 고도화를 시작했습니다." },
    { month: '01', title: '쿠쿠 시스템 운영 및 고도화 시작', description: '차세대 영업관리 및 통합 쇼핑몰 관리 시스템의 운영 및 고도화를 시작했습니다.' },
  ],
  '2024': [
    { month: '10', title: '한국해양공사 매연 저감 캠페인 시스템 구축 시작', description: '부루마블 형식의 게이미피케이션 캠페인 시스템 구축을 시작했습니다.' },
    { month: '10', title: '동행복권 DB 전환 사업 착수', description: '인쇄복권 시스템 통합 및 DB 전환 프로젝트를 시작했습니다.' },
    { month: '08', title: '영등포농협 SSO 시스템 구축 시작', description: '온라인몰 포함 3개 사이트 통합 회원 관리를 위한 SSO 시스템 구축을 시작했습니다.' },
    { month: '06', title: '아우토크립트 K-CSMS 구축 (1차)', description: '자동차 보안 취약점 정보 제공 커뮤니티 사이트 1차 구축을 완료했습니다.' },
    { month: '05', title: 'TAD 홈페이지 구축', description: '브로셔 아카이브 및 소개 반응형 사이트를 구축했습니다.' },
    { month: '01', title: '영등포농협 온라인 쇼핑몰 구축 시작', description: "자체 브랜드몰 'Always withFresh' 개발 프로젝트를 시작했습니다." },
  ],
  '2023': [
    { month: '10', title: '포베리 주식회사 설립', description: '사람 중심의 IT 서비스를 목표로 회사를 설립했습니다.' },
  ],
})

// 2. 선택된 년도 상태 관리 (최신 년도를 기본값으로)
const years = computed(() => Object.keys(historyData.value).sort((a, b) => parseInt(b) - parseInt(a)))
const selectedYear = ref(years.value[0] || '')
const filteredHistory = computed(() => {
  // 월별 내림차순 정렬 추가
  return (historyData.value[selectedYear.value] || []).sort((a, b) => parseInt(b.month) - parseInt(a.month));
})


// 년도 선택 함수
const selectYear = (year: string) => {
  selectedYear.value = year
}
</script>

<template>
  <div class="about-page">
    <section class="hero-section">
      <h2>사람 중심의 IT, 더 나은 가치를 만듭니다.</h2>
      <p>포베리는 IT 분야의 기본을 지키며 고객과 함께 성장합니다.</p>
    </section>

    <div class="page-content">
      <section class="intro-section">
        <h3>대표 소개</h3>
        <div class="ceo-profile">
          <div class="message">
            <p>
              "시스템은 사람이 중심이 되어야 하고 사람을 위해서 존재해야 한다는 것이 저희 포베리가 IT 산업을 바라보는 철학이자 기업의 경영 방침입니다."
            </p>
            <p>
              사람 중심의 기술 발전을 위해 AICBM(AI, IoT, Cloud, Big Data, Mobile) 중심의 사업에 매진함과 동시에 R&D 역량 향상에도 집중적으로 투자하고 있습니다.
              고객과 함께 노력하며 사람 중심의 IT 기업을 완성해 나가겠습니다.
            </p>
            <span class="ceo-name">포베리 주식회사 대표이사 <strong>우대식</strong></span>
          </div>
        </div>
      </section>

      <section class="history-section new-layout toss-style">
        <h3>회사 연혁</h3>
        <div class="history-container">
          <aside class="year-selector">
            <ul class="year-list">
              <div class="timeline-line"></div>
              <li v-for="year in years" :key="year" class="year-item">
                <div class="timeline-dot" :class="{ active: selectedYear === year }"></div>
                <button
                    :class="{ active: selectedYear === year }"
                    @click="selectYear(year)"
                >
                  {{ year }}
                </button>
              </li>
            </ul>
          </aside>
          <main class="history-display">
            <TransitionGroup name="fade-up" tag="ul" class="history-event-list">
              <li v-for="(item, index) in filteredHistory" :key="`${selectedYear}-${item.month}-${item.title}`" class="history-event-item" :style="{'--index': index}">
                <span class="event-date">{{ selectedYear }}.{{ item.month }}</span>
                <p class="event-title">{{ item.title }}</p>
              </li>
            </TransitionGroup>
          </main>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ============== Hero 섹션 스타일 ============== */
.hero-section {
  padding: 6rem 2rem;
  text-align: center;
  background-color: #f8f9fa;
}

.hero-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.1rem;
  color: #555;
}

/* ============== 페이지 콘텐츠 레이아웃 ============== */
.page-content {
  max-width: 900px;
  margin: 4rem auto;
  padding: 0 2rem;
}

/* ============== 대표 소개 섹션 스타일 ============== */
.intro-section {
  margin-bottom: 5rem;
}

.intro-section h3 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2.5rem;
}

.ceo-profile .message p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 1.5rem;
}

.ceo-name {
  display: block;
  text-align: right;
  margin-top: 2rem;
  font-size: 1.1rem;
}

/* ============== 회사 연혁 섹션 스타일 ============== */
.history-section.toss-style h3 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 4rem; /* 여백 증가 */
}

.history-container {
  display: grid;
  grid-template-columns: 150px 1fr; /* 왼쪽 너비 조정 */
  gap: 4rem; /* 컬럼 사이 간격 증가 */
  align-items: flex-start;
}

/* --- 왼쪽 년도 선택 --- */
.year-selector {
  position: sticky;
  top: 120px; /* 헤더 높이 고려 */
  align-self: start;
  padding-top: 10px; /* 점이 위에 잘리지 않도록 */
}

.year-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative; /* 선과 점의 기준 */
}

.timeline-line {
  position: absolute;
  top: 10px; /* 첫 점의 중앙에 맞춤 */
  left: 14px; /* 점의 중앙에 맞춤 */
  width: 2px;
  height: calc(100% - 20px); /* 위아래 여백 제외 */
  background-color: #e9ecef; /* 연한 회색 선 */
  z-index: 1;
}

.year-item {
  position: relative;
  padding-left: 40px; /* 점과 텍스트 사이 간격 */
  margin-bottom: 1.5rem; /* 년도 간 간격 */
}

.timeline-dot {
  position: absolute;
  top: 50%;
  left: 8px; /* 선 위에 위치하도록 조정 (14px - (12px/2)) */
  width: 12px;
  height: 12px;
  background-color: #e9ecef; /* 기본 점 색상 */
  border-radius: 50%;
  transform: translateY(-50%);
  transition: background-color 0.3s ease, transform 0.3s ease;
  z-index: 2; /* 선보다 위에 */
}

.timeline-dot.active {
  background-color: #007aff; /* 활성 점 색상 */
  transform: translateY(-50%) scale(1.3); /* 활성 시 약간 크게 */
}

.year-selector button {
  background: none;
  border: none;
  padding: 0; /* 내부 패딩 제거 */
  font-size: 1.1rem;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  text-align: left;
  transition: color 0.3s ease, font-weight 0.3s ease;
  line-height: 1.5; /* 점과 세로 중앙 정렬 */
}

.year-selector button.active {
  color: #007aff; /* 활성 텍스트 색상 */
  font-weight: 700;
}

.year-selector button:hover:not(.active) {
  color: #333;
}

/* --- 오른쪽 연혁 내용 --- */
.history-display {
  padding-top: 10px; /* 왼쪽과 높이 맞춤 */
}
.history-event-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-event-item {
  margin-bottom: 2rem; /* 항목 간 간격 */
}

.event-date {
  display: block;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.event-title {
  font-size: 1.2rem; /* 제목 크기 조정 */
  font-weight: 600; /* 제목 굵게 */
  color: #333;
  margin: 0; /* 기본 마진 제거 */
  line-height: 1.6;
}

/* --- 연혁 아이템 애니메이션 --- */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
/* 순차적 애니메이션을 위해 transition-delay 추가 */
.fade-up-enter-active {
  /* CSS 변수 --index를 사용하여 각 아이템에 다른 딜레이 적용 */
  transition-delay: calc(0.08s * var(--index));
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(15px);
}


/* 반응형 스타일 */
@media (max-width: 768px) {
  .history-container {
    grid-template-columns: 1fr; /* 모바일에선 세로로 쌓임 */
    gap: 2rem;
  }
  .year-selector {
    position: static;
    padding-top: 0;
  }
  .year-list {
    display: flex;
    overflow-x: auto;
    padding-bottom: 1.5rem; /* 스크롤바 공간 확보 및 구분선 역할 */
    border-bottom: 1px solid #eee;
    margin-bottom: 2rem;
  }
  .timeline-line {
    display: none; /* 모바일에서 세로선 숨김 */
  }
  .year-item {
    padding-left: 0; /* 왼쪽 패딩 제거 */
    margin-bottom: 0;
    margin-right: 1.5rem; /* 가로 간격 */
    display: flex; /* 점과 버튼 가로 배치 */
    align-items: center;
  }
  .timeline-dot {
    position: static; /* static으로 변경 */
    transform: none; /* transform 제거 */
    margin-right: 0.5rem; /* 점과 텍스트 사이 간격 */
    width: 8px; /* 점 크기 축소 */
    height: 8px;
  }
  .year-selector button {
    padding: 0.5rem 0;
    white-space: nowrap;
    line-height: 1; /* 점과 세로 중앙 정렬 */
  }
  .history-display {
    padding-top: 0;
  }
}
</style>

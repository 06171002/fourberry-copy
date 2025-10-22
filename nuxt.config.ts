// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // [추가] GitHub Pages 배포 설정
  app: {
    // 저장소 이름을 여기에 입력하세요 (예: '/fourberry-copy/')
    baseURL: '/fourberry-copy/',
    buildAssetsDir: 'assets', // GitHub Pages Jekyll 처리와의 충돌 방지 (권장)
  },

  // [추가] SSG 모드 활성화 (v3 기본값이지만 명시) 및 라우팅 설정
  ssr: true,

  modules: ['@nuxtjs/tailwindcss'],
})
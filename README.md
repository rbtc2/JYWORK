# 🌍 세계 여행 앱

여행 일정을 관리하고 세계지도에서 시각화하는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🗺️ **인터랙티브 세계지도**: Leaflet을 사용한 동적 지도
- 📊 **대시보드**: 여행 통계 및 시각화
- 📚 **콜렉션**: 여행 일정 관리 및 타임라인
- 📅 **캘린더**: 월별 여행 일정 보기
- ⚙️ **설정**: 사용자 설정 및 데이터 관리

## 🚀 시작하기

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 8.0.0 이상

### 설치

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 시작**
   ```bash
   npm run dev
   ```

3. **프로덕션 빌드**
   ```bash
   npm run build
   ```

## 📁 프로젝트 구조

```
JYWORK/
├── src/
│   └── input.css          # TailwindCSS 소스 파일
├── dist/
│   └── output.css         # 빌드된 CSS 파일
├── index.html             # 메인 HTML 파일
├── *.js                   # JavaScript 모듈들
├── package.json           # 프로젝트 설정
├── tailwind.config.js     # TailwindCSS 설정
├── postcss.config.js      # PostCSS 설정
└── README.md             # 프로젝트 문서
```

## 🛠️ 개발 스크립트

- `npm run dev`: 개발 모드 (CSS 파일 감시)
- `npm run build`: 프로덕션 빌드 (CSS 최소화)
- `npm run build:prod`: 프로덕션 빌드 완료 메시지

## 🎨 스타일링

이 프로젝트는 **TailwindCSS**를 사용하여 스타일링됩니다:

- **로컬 설치**: CDN 대신 로컬 TailwindCSS 사용
- **커스텀 컴포넌트**: 재사용 가능한 CSS 클래스
- **반응형 디자인**: 모바일 우선 접근법
- **애니메이션**: 부드러운 전환 효과

### 커스텀 스타일

`src/input.css`에서 다음을 정의할 수 있습니다:

- **@layer base**: 기본 HTML 요소 스타일
- **@layer components**: 재사용 가능한 컴포넌트
- **@layer utilities**: 유틸리티 클래스

## 🗺️ 지도 기능

- **Leaflet 라이브러리**: 인터랙티브 지도 구현
- **마커 시스템**: 방문한 도시 표시
- **미니맵**: 일정 상세 정보에서 위치 표시
- **반응형 지도**: 다양한 화면 크기 지원

## 💾 데이터 관리

- **로컬 스토리지**: 브라우저 기반 데이터 저장
- **JSON 형식**: 구조화된 데이터 관리
- **백업/복원**: 데이터 내보내기/가져오기

## 🔧 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: TailwindCSS 프레임워크
- **JavaScript**: ES6+ 모듈 시스템
- **Leaflet**: 지도 라이브러리
- **PostCSS**: CSS 전처리기

## 📱 반응형 디자인

- **모바일 우선**: 작은 화면부터 시작
- **브레이크포인트**: sm, md, lg, xl
- **터치 친화적**: 모바일 터치 이벤트 지원

## 🚀 배포

1. **프로덕션 빌드**
   ```bash
   npm run build:prod
   ```

2. **정적 파일 서빙**
   - `index.html`
   - `dist/output.css`
   - 모든 JavaScript 파일들

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말

- [TailwindCSS](https://tailwindcss.com/) - CSS 프레임워크
- [Leaflet](https://leafletjs.com/) - 지도 라이브러리
- [OpenStreetMap](https://www.openstreetmap.org/) - 지도 데이터 
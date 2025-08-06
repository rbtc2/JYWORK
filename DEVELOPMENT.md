# 🛠️ Development Guide

이 문서는 Travel Tracker 프로젝트의 개발자를 위한 상세한 가이드입니다.

## 📋 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [Git 저장소 관리](#git-저장소-관리)
3. [코드 스타일 가이드](#코드-스타일-가이드)
4. [디버깅 가이드](#디버깅-가이드)
5. [성능 최적화](#성능-최적화)
6. [테스트 전략](#테스트-전략)
7. [배포 가이드](#배포-가이드)

## 🚀 개발 환경 설정

### 필수 도구

```bash
# Node.js 16.0.0 이상 설치 확인
node --version

# npm 8.0.0 이상 설치 확인
npm --version

# Git 설치 확인
git --version
```

### 프로젝트 초기 설정

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/travel-tracker.git
cd travel-tracker

# 2. 의존성 설치
npm install

# 3. Git 저장소 정리 (권장)
chmod +x cleanup-git.sh
./cleanup-git.sh

# 4. Git hooks 설정
npm run prepare

# 5. 개발 서버 실행
npm run dev
```

### IDE 설정

#### VS Code 권장 확장 프로그램

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### VS Code 설정 (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.js": "javascript"
  },
  "emmet.includeLanguages": {
    "javascript": "html"
  }
}
```

## 🔧 Git 저장소 관리

### 저장소 정리 스크립트

```bash
# 정기적인 저장소 정리 (월 1회 권장)
./cleanup-git.sh

# 또는 npm 스크립트 사용
npm run clean:git
```

### .gitignore 관리

현재 프로젝트의 `.gitignore`는 다음을 포함합니다:

- **Dependencies**: `node_modules/`, `package-lock.json`
- **Build outputs**: `dist/`, `build/`, `out/`
- **Environment files**: `.env*`
- **IDE files**: `.vscode/`, `.idea/`
- **OS files**: `.DS_Store`, `Thumbs.db`
- **Logs**: `*.log`, `npm-debug.log*`
- **Cache**: `.cache/`, `.parcel-cache/`

### 브랜치 전략

```
main (보호됨)
├── develop
│   ├── feature/별점-시스템
│   ├── feature/지도-개선
│   └── feature/모바일-최적화
├── hotfix/긴급-버그-수정
└── release/v1.2.0
```

### 커밋 메시지 규칙

```
타입(범위): 간단한 설명

타입:
- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 코드
- chore: 빌드/설정 변경

범위 (선택사항):
- ui: 사용자 인터페이스
- map: 지도 관련
- storage: 데이터 저장
- calendar: 캘린더 기능

예시:
feat(ui): 별점 평가 시스템 추가
fix(map): 모바일 터치 이벤트 수정
docs: README 업데이트
```

## 📝 코드 스타일 가이드

### JavaScript 스타일

```javascript
// 함수 선언
function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// 화살표 함수 (콜백에서 사용)
const entries = data.map(entry => ({
  ...entry,
  days: calculateDays(entry.startDate, entry.endDate)
}));

// 비동기 함수
async function loadUserData() {
  try {
    const savedEntries = localStorage.getItem('travelEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    return [];
  }
}
```

### CSS 스타일 (TailwindCSS 우선)

```css
/* TailwindCSS 클래스 우선 사용 */
.custom-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors;
}

/* 커스텀 스타일은 최소화 */
.star-icon {
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
}
```

### HTML 구조

```html
<!-- 시맨틱 마크업 사용 -->
<main class="container mx-auto px-4">
  <section class="travel-form">
    <h2 class="text-2xl font-bold">새 여행 추가</h2>
    <form class="space-y-4">
      <!-- 폼 요소들 -->
    </form>
  </section>
</main>
```

## 🐛 디버깅 가이드

### 브라우저 개발자 도구

```javascript
// 콘솔 로깅
console.log('데이터:', entries);
console.warn('경고 메시지');
console.error('에러 메시지');

// 조건부 로깅
if (process.env.NODE_ENV === 'development') {
  console.log('디버그 정보');
}
```

### LocalStorage 디버깅

```javascript
// LocalStorage 내용 확인
console.log('LocalStorage:', {
  travelEntries: localStorage.getItem('travelEntries'),
  userResidence: localStorage.getItem('userResidence')
});

// LocalStorage 클리어
localStorage.clear();
```

### 성능 모니터링

```javascript
// 성능 측정
console.time('데이터 로드');
loadUserData();
console.timeEnd('데이터 로드');

// 메모리 사용량 확인
console.log('메모리 사용량:', performance.memory);
```

## ⚡ 성능 최적화

### JavaScript 최적화

```javascript
// 이벤트 리스너 최적화
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 검색 기능에 디바운스 적용
const debouncedSearch = debounce(searchEntries, 300);
```

### DOM 최적화

```javascript
// DocumentFragment 사용
const fragment = document.createDocumentFragment();
entries.forEach(entry => {
  const element = createEntryElement(entry);
  fragment.appendChild(element);
});
container.appendChild(fragment);
```

### LocalStorage 최적화

```javascript
// 데이터 압축
function compressData(data) {
  return JSON.stringify(data);
}

function decompressData(compressedData) {
  return JSON.parse(compressedData);
}
```

## 🧪 테스트 전략

### 수동 테스트 체크리스트

#### 기능 테스트
- [ ] 여행 일정 추가/수정/삭제
- [ ] 별점 평가 시스템
- [ ] 지도 마커 표시
- [ ] 캘린더 이벤트 표시
- [ ] 데이터 내보내기/가져오기

#### 브라우저 호환성
- [ ] Chrome (최신)
- [ ] Firefox (최신)
- [ ] Safari (최신)
- [ ] Edge (최신)

#### 모바일 테스트
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] 터치 이벤트
- [ ] 반응형 디자인

### 자동화 테스트 (향후 구현)

```javascript
// Jest 테스트 예시
describe('Travel Tracker', () => {
  test('여행 일정 추가', () => {
    const entry = {
      country: '대한민국',
      city: '서울',
      startDate: '2024-01-01',
      endDate: '2024-01-03'
    };
    
    addEntry(entry);
    expect(getEntries()).toContainEqual(entry);
  });
});
```

## 🚀 배포 가이드

### 개발 환경

```bash
# 개발 서버 실행
npm run dev

# 코드 검증
npm run validate
```

### 프로덕션 빌드

```bash
# 프로덕션 빌드
npm run build:prod

# 정적 파일 생성 확인
ls -la dist/
```

### 호스팅 플랫폼별 배포

#### Netlify
```bash
# netlify-cli 설치
npm install -g netlify-cli

# 배포
netlify deploy --prod --dir=.
```

#### Vercel
```bash
# vercel-cli 설치
npm install -g vercel

# 배포
vercel --prod
```

#### GitHub Pages
```bash
# gh-pages 설치
npm install --save-dev gh-pages

# 배포
npm run deploy
```

### 환경 변수 설정

```bash
# .env 파일 생성
NODE_ENV=production
API_URL=https://api.example.com
```

## 📊 모니터링 및 분석

### 에러 추적

```javascript
// 전역 에러 핸들러
window.addEventListener('error', (event) => {
  console.error('전역 에러:', event.error);
  // 에러 로깅 서비스로 전송
});

// Promise 에러 핸들러
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise 에러:', event.reason);
});
```

### 사용자 행동 분석

```javascript
// 페이지 뷰 추적
function trackPageView(page) {
  console.log('페이지 뷰:', page);
  // Google Analytics 등으로 전송
}

// 이벤트 추적
function trackEvent(category, action, label) {
  console.log('이벤트:', { category, action, label });
  // 분석 서비스로 전송
}
```

## 🔄 업데이트 및 유지보수

### 정기적인 업데이트

```bash
# 의존성 업데이트 확인
npm outdated

# 보안 취약점 확인
npm audit

# 의존성 업데이트
npm update
```

### 코드 리팩토링

```javascript
// 함수 분리 및 모듈화
// Before
function handleFormSubmit() {
  // 100줄의 코드
}

// After
function validateForm() { /* ... */ }
function processFormData() { /* ... */ }
function saveToStorage() { /* ... */ }
function updateUI() { /* ... */ }

function handleFormSubmit() {
  if (!validateForm()) return;
  const data = processFormData();
  saveToStorage(data);
  updateUI();
}
```

## 📚 추가 리소스

- [ESLint 규칙](https://eslint.org/docs/rules/)
- [Prettier 설정](https://prettier.io/docs/en/configuration.html)
- [TailwindCSS 문서](https://tailwindcss.com/docs)
- [Leaflet 문서](https://leafletjs.com/reference.html)
- [Git 가이드](https://git-scm.com/book/ko/v2)

---

이 가이드를 통해 일관된 개발 환경과 코드 품질을 유지할 수 있습니다. 
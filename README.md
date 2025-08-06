# 🌍 Travel Tracker

여행 기록 및 관리 웹 애플리케이션입니다. LocalStorage 기반으로 동작하며, 여행 일정을 기록하고 관리할 수 있습니다.

## ✨ 주요 기능

- 📅 **여행 일정 관리**: 체류 기간, 목적, 동행자 정보 기록
- ⭐ **별점 평가 시스템**: 여행 경험에 대한 별점 평가
- 🗺️ **지도 시각화**: Leaflet을 활용한 방문 지역 지도 표시
- 📊 **통계 대시보드**: 방문 국가, 도시, 총 체류일 통계
- 📱 **반응형 디자인**: 모바일 친화적 UI/UX
- 💾 **로컬 저장**: LocalStorage를 활용한 데이터 저장

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 8.0.0 이상
- Git

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/travel-tracker.git
cd travel-tracker

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 🛠️ 개발 환경 설정

### 초기 설정

```bash
# 1. Git 저장소 정리 (첫 실행 시 권장)
chmod +x cleanup-git.sh
./cleanup-git.sh

# 2. 개발 도구 설정
npm run prepare  # Husky Git hooks 설정
```

### 개발 도구 사용법

```bash
# 코드 검사 및 수정
npm run lint        # 코드 검사
npm run lint:fix    # 코드 자동 수정
npm run format      # 코드 포맷팅

# 의존성 관리
npm run clean       # node_modules 재설치
npm run clean:git   # Git 저장소 정리

# 빌드 및 검증
npm run build       # 개발 빌드
npm run build:prod  # 프로덕션 빌드
npm run validate    # 코드 검증
```

### Git Hooks 설정

프로젝트는 Husky를 통해 Git hooks가 자동으로 설정됩니다:

- **pre-commit**: 코드 검사 및 포맷팅
- **prepare**: Husky 설치

## 📁 프로젝트 구조

```
travel-tracker/
├── index.html              # 메인 HTML 파일
├── main.js                 # 메인 애플리케이션 로직
├── storage.js              # LocalStorage 관리
├── collectionTimeline.js   # 타임라인 렌더링
├── calendar.js             # 캘린더 기능
├── map.js                  # 지도 기능
├── settings.js             # 설정 관리
├── utils.js                # 유틸리티 함수
├── data.js                 # 정적 데이터
├── countries.js            # 국가 정보
├── style.css               # 스타일시트
├── public/                 # 정적 파일
├── package.json            # 프로젝트 설정
├── .gitignore             # Git 무시 파일 (최적화됨)
├── cleanup-git.sh         # Git 저장소 정리 스크립트
├── .eslintrc.json         # ESLint 설정
├── .prettierrc            # Prettier 설정
├── .husky/                # Git hooks 설정
└── README.md              # 프로젝트 문서
```

## 🔧 개발 가이드

### 코드 스타일

- **JavaScript**: ES6+ 문법 사용, ESLint 규칙 준수
- **CSS**: TailwindCSS 클래스 우선 사용
- **HTML**: 시맨틱 마크업 준수
- **네이밍**: camelCase (JavaScript), kebab-case (CSS/HTML)

### Git 워크플로우

#### 1. 새 기능 개발

```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 새 브랜치 생성
git checkout -b feature/새기능명

# 3. 개발 및 커밋
npm run dev
# ... 개발 작업 ...
git add .
git commit -m "feat: 새 기능 추가"

# 4. 푸시 및 PR 생성
git push origin feature/새기능명
```

#### 2. 커밋 메시지 규칙

```
타입: 간단한 설명

타입:
- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 코드
- chore: 빌드/설정 변경

예시:
feat: 별점 평가 시스템 추가
fix: 모바일 터치 이벤트 수정
docs: README 업데이트
```

#### 3. 브랜치 전략

- `main`: 프로덕션 브랜치 (보호됨)
- `develop`: 개발 브랜치
- `feature/기능명`: 새로운 기능 개발
- `hotfix/버그명`: 긴급 버그 수정
- `release/버전명`: 릴리스 준비

### 저장소 관리

#### Git 저장소 정리

```bash
# 정기적인 저장소 정리 (월 1회 권장)
./cleanup-git.sh

# 또는 npm 스크립트 사용
npm run clean:git
```

#### .gitignore 관리

- `node_modules/`, `*.log`, `.DS_Store` 등이 자동으로 무시됨
- 새로운 무시 패턴 추가 시 팀원들과 공유
- IDE 설정 파일은 개인별로 관리

## 📦 배포

### 로컬 빌드

```bash
# 개발 빌드
npm run build

# 프로덕션 빌드 (검증 포함)
npm run build:prod
```

### 정적 호스팅

- **Netlify**: `netlify deploy`
- **Vercel**: `vercel --prod`
- **GitHub Pages**: `gh-pages` 브랜치 사용
- **Firebase Hosting**: `firebase deploy`

### 환경별 설정

```bash
# 개발 환경
npm run dev

# 프로덕션 환경
npm run build:prod
```

## 🔒 보안 및 데이터 관리

### LocalStorage 보안

- 민감한 정보는 저장하지 않음
- 정기적인 데이터 백업 권장
- 브라우저 캐시 정리 시 데이터 손실 가능성

### 데이터 백업

```javascript
// 데이터 내보내기 (storage.js에 구현됨)
exportData() // 모든 데이터를 JSON 파일로 내보내기
```

## 🐛 문제 해결

### 일반적인 문제

#### 1. 의존성 문제
```bash
npm run clean
npm install
```

#### 2. Git 저장소 크기 문제
```bash
./cleanup-git.sh
```

#### 3. 코드 포맷팅 문제
```bash
npm run format
npm run lint:fix
```

#### 4. Git hooks 문제
```bash
npm run prepare
```

#### 5. 개발 서버 문제
```bash
# 포트 충돌 시
npm run dev -- --port=3001

# 캐시 문제 시
rm -rf node_modules
npm install
```

### 성능 최적화

#### Git 저장소 최적화
```bash
# 저장소 크기 확인
du -sh .git/

# 큰 파일 찾기
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -10
```

#### 개발 환경 최적화
```bash
# 불필요한 파일 제거
find . -name "*.log" -delete
find . -name ".DS_Store" -delete

# 캐시 정리
npm cache clean --force
```

## 🤝 기여하기

### 기여 프로세스

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **개발 환경 설정**
   ```bash
   npm install
   npm run prepare
   ```
4. **개발 및 테스트**
   ```bash
   npm run dev
   npm run validate
   ```
5. **Commit your Changes** (`git commit -m 'feat: Add some AmazingFeature'`)
6. **Push to the Branch** (`git push origin feature/AmazingFeature`)
7. **Open a Pull Request**

### 코드 리뷰 체크리스트

- [ ] 코드 스타일 가이드 준수
- [ ] ESLint 검사 통과
- [ ] Prettier 포맷팅 적용
- [ ] 기능 테스트 완료
- [ ] 문서 업데이트 (필요시)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/your-username/travel-tracker](https://github.com/your-username/travel-tracker)

## 🙏 감사의 말

- [Leaflet](https://leafletjs.com/) - 지도 라이브러리
- [TailwindCSS](https://tailwindcss.com/) - CSS 프레임워크
- [OpenStreetMap](https://www.openstreetmap.org/) - 지도 데이터

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! 
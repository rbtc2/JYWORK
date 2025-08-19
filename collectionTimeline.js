/**
 * collectionTimeline.js - 콜렉션 타임라인 생성, 수정, 삭제 기능
 * 여행 일정의 CRUD 작업과 콜렉션 타임라인 렌더링을 담당
 */

// 페이지네이션 상태 관리
let timelineCurrentPage = 1;
let ratingCurrentPage = 1;
const ITEMS_PER_PAGE = 10;

// 정렬 상태 관리
let timelineSortType = 'newest'; // 'newest' 또는 'oldest'
let ratingSortType = 'rating-high'; // 'rating-high' 또는 'rating-low'

// 국가별 국기 이모지 매핑 (data.js에서 제공하는 전역 countryFlags 사용)
// const countryFlags = {
//     'KR': '🇰🇷',
//     'JP': '🇯🇵',
//     'US': '🇺🇸',
//     'GB': '🇬🇧',
//     'FR': '🇫🇷',
//     'DE': '🇩🇪'
// };

// 도시명을 정확한 한글명으로 변환하는 함수
function getCityNameByCode(countryCode, cityName) {
    // 도시명이 이미 한글이거나 영어인 경우 그대로 반환
    if (cityName && typeof cityName === 'string') {
        // 한글 도시명 패턴 확인
        const koreanCityPattern = /[가-힣]/;
        if (koreanCityPattern.test(cityName)) {
            return cityName;
        }
        
        // 영어 도시명을 한글로 변환
        const cityMap = {
            'KR': {
                'Seoul': '서울',
                'Busan': '부산',
                'Daegu': '대구',
                'Incheon': '인천',
                'Gwangju': '광주',
                'Daejeon': '대전',
                'Ulsan': '울산',
                'Jeju': '제주'
            },
            'JP': {
                'Tokyo': '도쿄',
                'Osaka': '오사카',
                'Kyoto': '교토',
                'Yokohama': '요코하마',
                'Nagoya': '나고야',
                'Sapporo': '삿포로'
            },
            'US': {
                'New York': '뉴욕',
                'Los Angeles': '로스앤젤레스',
                'Chicago': '시카고',
                'Houston': '휴스턴',
                'Phoenix': '피닉스',
                'Philadelphia': '필라델피아'
            },
            'GB': {
                'London': '런던',
                'Birmingham': '버밍엄',
                'Leeds': '리즈',
                'Glasgow': '글래스고',
                'Sheffield': '셰필드',
                'Bradford': '브래드포드'
            },
            'FR': {
                'Paris': '파리',
                'Marseille': '마르세유',
                'Lyon': '리옹',
                'Toulouse': '툴루즈',
                'Nice': '니스',
                'Nantes': '낭트'
            },
            'DE': {
                'Berlin': '베를린',
                'Hamburg': '함부르크',
                'Munich': '뮌헨',
                'Cologne': '쾰른',
                'Frankfurt': '프랑크푸르트',
                'Stuttgart': '슈투트가르트'
            }
        };
        
        const countryCities = cityMap[countryCode];
        if (countryCities && countryCities[cityName]) {
            return countryCities[cityName];
        }
    }
    
    return cityName;
}

// 메모 텍스트를 안전하게 처리하는 함수
function sanitizeMemo(memo) {
    if (!memo || typeof memo !== 'string') return '';
    return memo.replace(/[<>]/g, ''); // XSS 방지를 위한 기본적인 이스케이프
}

// 여행 스타일 텍스트를 안전하게 처리하는 함수
function sanitizeCompanions(companions) {
    if (!companions || typeof companions !== 'string') return '';
    return companions.replace(/[<>]/g, ''); // XSS 방지를 위한 기본적인 이스케이프
}

// 메모 텍스트를 카드뷰용으로 축약하는 함수
function truncateMemoForCard(memo, maxLength = 50) {
    if (!memo || typeof memo !== 'string') return '';
    const sanitizedMemo = sanitizeMemo(memo);
    if (sanitizedMemo.length <= maxLength) return sanitizedMemo;
    return sanitizedMemo.substring(0, maxLength) + '...';
}

// 메모 텍스트를 상세 모달용으로 축약하는 함수
function truncateMemoForDetail(memo, maxLength = 100) {
    if (!memo || typeof memo !== 'string') return '';
    const sanitizedMemo = sanitizeMemo(memo);
    if (sanitizedMemo.length <= maxLength) return sanitizedMemo;
    return sanitizedMemo.substring(0, maxLength) + '...';
}

// 메모가 축약되었는지 확인하는 함수
function isMemoTruncated(memo, maxLength = 100) {
    if (!memo || typeof memo !== 'string') return false;
    return memo.length > maxLength;
}

// 페이지네이션 유틸리티 함수들
function getPaginatedItems(items, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
}

function getTotalPages(totalItems, itemsPerPage) {
    return Math.ceil(totalItems / itemsPerPage);
}

function renderPagination(currentPage, totalPages, paginationId, prevId, nextId, pageNumbersId) {
    const paginationContainer = document.getElementById(paginationId);
    const prevButton = document.getElementById(prevId);
    const nextButton = document.getElementById(nextId);
    const pageNumbersContainer = document.getElementById(pageNumbersId);
    
    if (totalPages <= 1) {
        paginationContainer.classList.add('hidden');
        paginationContainer.classList.remove('flex');
        return;
    }
    
    paginationContainer.classList.remove('hidden');
    paginationContainer.classList.add('flex');
    
    // 이전/다음 버튼 상태 업데이트
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    
    // 페이지 번호 생성
    let pageNumbersHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        pageNumbersHTML += `
            <button class="page-number px-3 sm:px-4 py-2 text-sm min-h-[40px] rounded-lg transition-colors ${
                isActive 
                    ? 'bg-blue-500 text-white font-bold' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    pageNumbersContainer.innerHTML = pageNumbersHTML;
    
    // 페이지 번호 클릭 이벤트 추가
    pageNumbersContainer.querySelectorAll('.page-number').forEach(button => {
        button.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            if (paginationId === 'timeline-pagination') {
                timelineCurrentPage = page;
                renderCollectionTimeline();
            } else if (paginationId === 'rating-pagination') {
                ratingCurrentPage = page;
                renderRatingTimeline();
            }
            // 페이지 변경 시 상단으로 스크롤
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function initializePaginationButtons() {
    // 타임라인 페이지네이션 버튼
    const timelinePrev = document.getElementById('timeline-prev');
    const timelineNext = document.getElementById('timeline-next');
    
    if (timelinePrev && timelineNext) {
        timelinePrev.addEventListener('click', function() {
            if (timelineCurrentPage > 1) {
                timelineCurrentPage--;
                renderCollectionTimeline();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        timelineNext.addEventListener('click', function() {
            const totalPages = getTotalPages(entries.length, ITEMS_PER_PAGE);
            if (timelineCurrentPage < totalPages) {
                timelineCurrentPage++;
                renderCollectionTimeline();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    // 별점별 페이지네이션 버튼
    const ratingPrev = document.getElementById('rating-prev');
    const ratingNext = document.getElementById('rating-next');
    
    if (ratingPrev && ratingNext) {
        ratingPrev.addEventListener('click', function() {
            if (ratingCurrentPage > 1) {
                ratingCurrentPage--;
                renderRatingTimeline();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        ratingNext.addEventListener('click', function() {
            const ratedEntries = entries.filter(entry => entry.rating && entry.rating > 0);
            const totalPages = getTotalPages(ratedEntries.length, ITEMS_PER_PAGE);
            if (ratingCurrentPage < totalPages) {
                ratingCurrentPage++;
                renderRatingTimeline();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

// 별점 표시 헬퍼 함수
function displayRatingInCard(rating) {
    if (!rating || rating === 0) return '';
    
    const filledStars = '⭐'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    
    return `
        <div class="flex items-center gap-1 mt-2">
            <span class="text-xs">${filledStars}${emptyStars}</span>
        </div>
    `;
}

// 콜렉션 타임라인 렌더링
function renderCollectionTimeline() {
    const collectionTimelineList = document.getElementById('collection-timeline-list');
    const collectionTimelineEmpty = document.getElementById('collection-timeline-empty');

    if (entries.length === 0) {
        collectionTimelineList.style.display = 'none';
        collectionTimelineEmpty.style.display = 'block';
        // 페이지네이션 숨기기
        document.getElementById('timeline-pagination').classList.add('hidden');
        return;
    }

    collectionTimelineList.style.display = 'block';
    collectionTimelineEmpty.style.display = 'none';

    // 정렬 로직
    let sortedEntries;
    switch (timelineSortType) {
        case 'oldest':
            sortedEntries = [...entries].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            break;
        case 'newest':
        default:
            sortedEntries = [...entries].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            break;
    }
    
    // 페이지네이션 적용
    const totalPages = getTotalPages(sortedEntries.length, ITEMS_PER_PAGE);
    
    // 현재 페이지가 총 페이지 수를 초과하면 마지막 페이지로 조정
    if (timelineCurrentPage > totalPages && totalPages > 0) {
        timelineCurrentPage = totalPages;
    }
    
    const paginatedEntries = getPaginatedItems(sortedEntries, timelineCurrentPage, ITEMS_PER_PAGE);

    collectionTimelineList.innerHTML = paginatedEntries.map(entry => {
        // 국가명과 도시명을 정확한 한글명으로 변환
        const countryName = getKoreanName(entry.countryCode) || entry.country;
        const cityName = getCityNameByCode(entry.countryCode, entry.city) || entry.city;
        
        const days = calculateDays(entry.startDate, entry.endDate);
        const purposeText = getPurposeText(entry.purpose);
        const flag = countryFlags[entry.countryCode] || '🏳️';
        const ratingDisplay = displayRatingInCard(entry.rating);

        return `
            <div class="collection-timeline-card bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] sm:active:scale-100" 
                 onclick="showEntryDetail('${entry.id}')">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div class="flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-gray-800 break-words">${flag} ${cityName}, ${countryName}</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">${purposeText}</p>
                    </div>
                    <div class="flex items-center justify-end sm:justify-start">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                            ${days}일
                        </span>
                    </div>
                </div>
                <div class="text-xs sm:text-sm text-gray-500 mt-3">
                    📅 ${entry.startDate} ~ ${entry.endDate}
                </div>
                ${ratingDisplay}
                ${entry.memo ? `<p class="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded mt-3 overflow-hidden"><span class="line-clamp-1">📝 ${truncateMemoForCard(entry.memo)}</span></p>` : ''}
            </div>
        `;
    }).join('');
    
    // 페이지네이션 렌더링
    renderPagination(timelineCurrentPage, totalPages, 'timeline-pagination', 'timeline-prev', 'timeline-next', 'timeline-page-numbers');
}

// 수정 함수
function modifyEntry(entryId) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    // 수정 모드 설정
    isEditMode = true;
    editingEntryId = entryId;

    // 모달 제목 변경
    document.querySelector('#modal-overlay h2').textContent = '여행 수정';

    // 폼에 기존 데이터 채우기
    document.getElementById('country-input').value = entry.country;
    document.getElementById('country-code').value = entry.countryCode;
    document.getElementById('country-label').value = entry.countryLabel;
    document.getElementById('city-input').value = entry.city;
    document.getElementById('city-name').value = entry.cityName;
    document.getElementById('start-date').value = entry.startDate;
    document.getElementById('end-date').value = entry.endDate;
    document.getElementById('purpose').value = entry.purpose;
    // 여행 스타일 정보 설정 (기존 string과 새 객체 구조 모두 지원)
    const companionsValue = entry.companions || '';
    const companionType = entry.companionType || '';
    
    // 디버깅을 위한 로그
    console.log('modifyEntry 여행 스타일 정보:', {
        entryId: entryId,
        companions: companionsValue,
        companionType: companionType,
        companionsType: typeof companionsValue
    });
    
    document.getElementById('companions').value = companionsValue;
    document.getElementById('companion-type').value = companionType;
    
    // 여행 스타일 타입 버튼 상태 설정 - 모든 버튼 초기화
    const companionTypeBtns = document.querySelectorAll('.companion-type-btn');
    companionTypeBtns.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // companionType이 있는 경우에만 해당 버튼 선택
    if (companionType && companionType !== '') {
        const selectedBtn = document.querySelector(`[data-type="${companionType}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }
    
    // 상세 입력창 표시/숨김 처리 및 placeholder 업데이트
    const companionDetailContainer = document.getElementById('companion-detail-container');
    const companionsInput = document.getElementById('companions');
    
    if (companionType === 'solo' || !companionType || companionType === '') {
        companionDetailContainer.classList.add('hidden');
    } else {
        companionDetailContainer.classList.remove('hidden');
        
        // 여행 스타일 타입별 placeholder 설정
        const placeholders = {
            'family': '가족 구성원을 입력하세요 (예: 부모님, 형제, 자녀)',
            'couple': '연인/배우자 이름을 입력하세요',
            'friends': '친구 이름들을 입력하세요 (예: 김철수, 이영희)',
            'colleagues': '동료 이름들을 입력하세요 (예: 팀원들, 사장님)',
            'custom': '여행 스타일을 입력하세요'
        };
        
        companionsInput.placeholder = placeholders[companionType] || '여행 스타일을 입력하세요';
    }
    document.getElementById('memo').value = entry.memo || '';

    // 별점 설정
    if (entry.rating && window.setRating) {
        window.setRating(parseInt(entry.rating));
    }

    // 도시 입력 필드 활성화
    document.getElementById('city-input').disabled = false;

    // 제출 버튼 텍스트 변경
    const submitBtn = document.querySelector('#travel-form button[type="submit"]');
    submitBtn.textContent = '수정';

    // 모달 열기
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// 삭제 함수
function deleteEntry(entryId) {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
        entries = entries.filter(entry => entry.id !== entryId);
        
        // 전역 변수 동기화
        if (typeof window !== 'undefined') {
            window.entries = entries;
        }
        
        saveUserData();
        updateAllSections();
        alert('일정이 삭제되었습니다.');
    }
}

// 목적 텍스트 변환 함수
function getPurposeText(purpose) {
    const textMap = {
        'travel': '여행',
        'business': '출장',
        'study': '유학',
        'working-holiday': '워킹 홀리데이',
        'family-visit': '가족 방문',
        'dispatch': '파견',
        'exchange': '교환학생',
        'volunteer': '봉사활동',
        'medical': '의료',
        'language': '어학 연수',
        'transit': '비행 경유'
    };
    return textMap[purpose] || purpose;
}

// 여행 스타일 텍스트 변환 함수
function getCompanionText(entry) {
    // 기존 string companions와 새 객체 구조 모두 지원
    const companions = entry.companions || '';
    const companionType = entry.companionType || '';
    
    // 디버깅을 위한 로그 (프로덕션에서는 제거)
    // console.log('getCompanionText 호출:', {
    //     entryId: entry.id,
    //     companions: companions,
    //     companionType: companionType,
    //     companionsType: typeof companions
    // });
    
    // companionType이 없거나 빈 문자열인 경우 → 여행 스타일 정보 미입력
    if (!companionType || companionType === '') {
        return '정보 없음';
    }
    
    // companionType이 'solo'인 경우 → "혼자" 명시적 선택
    if (companionType === 'solo') {
        return '혼자';
    }
    
    const typeTexts = {
        'family': '가족',
        'couple': '연인',
        'friends': '친구',
        'colleagues': '동료',
        'custom': '여행 스타일'
    };
    
    const typeText = typeTexts[companionType] || '여행 스타일';
    
    // 상세 정보가 있는 경우에만 추가
    if (companions && companions.trim() !== '') {
        return `${typeText}: ${sanitizeCompanions(companions)}`;
    } else {
        return typeText;
    }
}

// 별점 생성 함수
function generateStarRating(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>';
        } else {
            starsHTML += '<svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>';
        }
    }
    return starsHTML;
}

// 일정 상세 정보 모달 표시
function showEntryDetail(entryId) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    // 기존 모달이 있다면 정리하고 제거
    const existingModal = document.getElementById('entry-detail-modal');
    if (existingModal) {
        cleanupEntryDetailModal();
        existingModal.remove();
    }

    const days = calculateDays(entry.startDate, entry.endDate);
    const purposeText = getPurposeText(entry.purpose);
    const flag = countryFlags[entry.countryCode] || '🏳️';
    
    // 국가명과 도시명을 정확한 한글명으로 변환
    const countryName = getKoreanName(entry.countryCode) || entry.country;
    const cityName = getCityNameByCode(entry.countryCode, entry.city) || entry.city;
    
    // 도시 좌표 가져오기
    const cityCoord = cityCoordinates[entry.city];
    const hasMap = cityCoord && cityCoord.lat && cityCoord.lng;

    // 스마트 컨텍스트 정보 계산
    const cityHistory = getCityHistory(entry, entries, window.userResidence);
    // 여행 스타일 정보가 있는 경우: companionType이 존재하는 경우 (혼자 포함)
    const hasCompanions = entry.companionType && entry.companionType !== '';
    const hasMemo = entry.memo && entry.memo.trim();
    
    // 디버깅을 위한 로그 (프로덕션에서는 제거)
    // console.log('showEntryDetail 여행 스타일 정보:', {
    //     entryId: entry.id,
    //     companionType: entry.companionType,
    //     companions: entry.companions,
    //     hasCompanions: hasCompanions,
    //     hasMemo: hasMemo
    // });

    // 모달 HTML 생성
    const modalHTML = `
        <div id="entry-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <!-- 헤더 -->
                <div class="flex justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-100 relative">
                    <div class="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0 pr-12">
                        <span class="text-3xl sm:text-4xl flex-shrink-0" aria-label="${countryName} 국기">${flag}</span>
                        <div class="flex-1 min-w-0">
                            <!-- 모바일: 상하 구조 -->
                            <div class="block sm:hidden">
                                <h2 class="text-lg font-bold text-gray-800 truncate">${cityName}, ${countryName}</h2>
                            </div>
                            <!-- 데스크탑: 한 줄 구조 -->
                            <div class="hidden sm:block">
                                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 truncate">${cityName}, ${countryName}</h2>
                            </div>
                            <p class="text-sm sm:text-lg text-gray-600 mt-1 truncate">${entry.startDate} ~ ${entry.endDate}</p>
                        </div>
                    </div>
                    <button onclick="closeEntryDetail()" 
                            class="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto text-gray-400 hover:text-gray-600 text-xl sm:text-2xl font-bold flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="모달 닫기">
                        ×
                    </button>
                </div>

                <!-- 카드 본문 -->
                <div class="p-6 space-y-6">
                    <!-- 기본 정보 섹션 -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">📋 기본 정보</h3>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">📅</span>
                                <div>
                                    <p class="text-sm text-gray-500">체류 기간</p>
                                    <p class="text-lg font-semibold text-gray-800">${entry.startDate} ~ ${entry.endDate}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-500">총 체류 일수</p>
                                <p class="text-xl font-bold text-blue-600">${days}일</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-3">
                            <span class="text-2xl">🎯</span>
                            <div>
                                <p class="text-sm text-gray-500">체류 목적</p>
                                <p class="text-lg font-semibold text-gray-800">${purposeText}</p>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">⭐</span>
                                <div>
                                    <p class="text-sm text-gray-500">별점 평가</p>
                                    <p class="text-lg font-semibold text-gray-800">${entry.rating || 0}점</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-1">
                                ${generateStarRating(entry.rating || 0)}
                            </div>
                        </div>
                    </div>

                    <!-- 스마트 컨텍스트 섹션 (항상 표시) -->
                    <div class="bg-blue-50 rounded-lg p-6 space-y-4">
                        <h3 class="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">🧠 스마트 인사이트</h3>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">🔄</span>
                                <div>
                                    <p class="text-sm text-blue-600">방문 횟수</p>
                                    <p class="text-lg font-semibold text-blue-800">
                                        ${cityName} ${cityHistory.cityStats.visitCount}번째 방문
                                        ${cityHistory.previousVisitText ? `(이전: ${cityHistory.previousVisitText})` : ''}
                                    </p>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">💡</span>
                                <div>
                                    <p class="text-sm text-blue-600">국가 총 체류일</p>
                                    <p class="text-lg font-semibold text-blue-800">
                                        ${countryName} 총 ${cityHistory.countryStats.totalDays}일
                                    </p>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">🌍</span>
                                <div>
                                    <p class="text-sm text-blue-600">전체 해외 체류일</p>
                                    <p class="text-lg font-semibold text-blue-800">
                                        ${cityHistory.totalOverseasDays}일 중 ${cityHistory.overseasPercentage}%
                                    </p>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">🏆</span>
                                <div>
                                    <p class="text-sm text-blue-600">${cityHistory.countryName} 방문 기록</p>
                                    <p class="text-lg font-semibold text-blue-800">
                                        최장 체류: ${cityHistory.cityStats.longestStay}일
                                        ${cityHistory.cityStats.highestRating > 0 ? `| 최고 별점: ${cityHistory.cityStats.highestRating}점` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 선택적 정보 섹션 (있을 때만 표시) -->
                    ${hasCompanions || hasMemo ? `
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">📝 추가 정보</h3>
                        
                        ${hasCompanions ? `
                        <div class="flex items-start space-x-3">
                            <span class="text-2xl mt-1">👥</span>
                            <div class="flex-1">
                                <p class="text-sm text-gray-500">여행 스타일</p>
                                <p class="text-lg font-semibold text-gray-800">${getCompanionText(entry)}</p>
                            </div>
                        </div>
                        ` : ''}
                        
                        ${hasMemo ? `
                        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div class="flex items-start space-x-3">
                                <span class="text-2xl mt-1">📝</span>
                                <div class="flex-1">
                                    <p class="text-sm text-gray-500">메모</p>
                                    <div class="text-lg font-semibold text-gray-800">
                                        <div id="memo-content-${entry.id}" class="memo-content">
                                            <span id="memo-text-${entry.id}">${isMemoTruncated(entry.memo, 100) ? truncateMemoForDetail(entry.memo) : sanitizeMemo(entry.memo)}</span>
                                            ${isMemoTruncated(entry.memo, 100) ? `
                                                <button onclick="toggleMemoDetail('${entry.id}')" class="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                                                    더보기
                                                </button>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    ` : ''}

                    <!-- 위치 지도 -->
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">🗺️ 위치 정보</h3>
                        ${hasMap ? `
                        <div class="flex items-center space-x-3 mb-4">
                            <span class="text-2xl">📍</span>
                            <div>
                                <p class="text-sm text-gray-500">위치</p>
                                <p class="text-lg font-semibold text-gray-800">${cityName}, ${countryName}</p>
                            </div>
                        </div>
                        <div id="mini-map-${entry.id}" class="mini-map-container rounded-lg overflow-hidden h-48 cursor-pointer hover:shadow-lg transition-all duration-200 relative" 
                             onclick="openExpandedMap('${entry.id}', '${entry.countryCode}', {lat: ${cityCoord.lat}, lng: ${cityCoord.lng}})"
                             onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openExpandedMap('${entry.id}', '${entry.countryCode}', {lat: ${cityCoord.lat}, lng: ${cityCoord.lng}}); }"
                             tabindex="0"
                             role="button"
                             title="클릭하여 국가 전체 보기"
                             aria-label="${cityName}의 국가 전체 지도 보기">
                            <!-- 확대 아이콘 오버레이 -->
                            <div class="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2 shadow-sm z-10 transition-all duration-200 hover:bg-opacity-100 hover:scale-110">
                                <span class="text-sm text-gray-600">🔍</span>
                            </div>
                            <!-- 툴팁 -->
                            <div class="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-200 pointer-events-none" 
                                 style="white-space: nowrap;">
                                클릭하여 국가 전체 보기
                            </div>
                        </div>
                        ` : `
                        <div class="flex items-center space-x-3 mb-4">
                            <span class="text-2xl">📍</span>
                            <div>
                                <p class="text-sm text-gray-500">위치</p>
                                <p class="text-lg font-semibold text-gray-800">${cityName}, ${countryName}</p>
                            </div>
                        </div>
                        <div class="bg-gray-100 rounded-lg overflow-hidden h-48 flex items-center justify-center">
                            <div class="text-center">
                                <p class="text-gray-500 text-sm">📍 위치 정보를 확인할 수 없습니다</p>
                            </div>
                        </div>
                        `}
                    </div>
                </div>

                <!-- 하단 버튼 -->
                <div class="p-6 border-t border-gray-100">
                    <div class="flex justify-center">
                        <div class="flex space-x-2 max-w-md w-full">
                            <button onclick="closeEntryDetail()" 
                                    class="flex-1 px-4 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium min-h-[40px]">
                                ✕ 닫기
                            </button>
                            <button onclick="modifyEntry('${entry.id}'); closeEntryDetail();" 
                                    class="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm font-medium min-h-[40px]">
                                ✏️ 수정
                            </button>
                            <button onclick="deleteEntry('${entry.id}'); closeEntryDetail();" 
                                    class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium min-h-[40px]">
                                🗑️ 삭제
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 새 모달 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 안전한 이벤트 등록
    const escKeyListener = globalEventManager.addEventListener(
        document,
        'keydown',
        function(e) {
            if (e.key === 'Escape') {
                closeEntryDetail();
            }
        }
    );

    // 모달 외부 클릭 이벤트
    const outsideClickListener = globalEventManager.addEventListener(
        document.getElementById('entry-detail-modal'),
        'click',
        function(e) {
            if (e.target.id === 'entry-detail-modal') {
                closeEntryDetail();
            }
        }
    );

    // 모달에 정리 함수 정보 저장
    const modal = document.getElementById('entry-detail-modal');
    modal._cleanupListeners = [escKeyListener, outsideClickListener];

    // 지도 초기화 (좌표가 있는 경우)
    if (hasMap) {
        globalEventManager.setTimeout(() => {
            initializeMiniMap(entry.id, cityCoord.lat, cityCoord.lng, entry.city);
        }, 100, 'mini-map-init-delay');
    }
}

// 확장 지도 모달 열기 (모달 교체 방식)
function openExpandedMap(entryId, countryCode, cityCoordinates) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry || !cityCoordinates || !cityCoordinates.lat || !cityCoordinates.lng) {
        console.warn('Invalid entry or coordinates for expanded map');
        return;
    }

    // 기존 확장 지도 모달이 있다면 정리하고 제거
    const existingExpandedModal = document.getElementById('expanded-map-modal');
    if (existingExpandedModal) {
        closeExpandedMap();
        existingExpandedModal.remove();
    }

    // 상세 모달을 먼저 닫기 (모달 교체 방식)
    const detailModal = document.getElementById('entry-detail-modal');
    if (detailModal) {
        // 부드러운 fade-out 애니메이션
        detailModal.style.transition = 'opacity 0.2s ease-out';
        detailModal.style.opacity = '0';
        
        setTimeout(() => {
            if (detailModal.parentNode) {
                detailModal.remove();
            }
            // 지도 모달 열기
            showExpandedMapModal(entryId, countryCode, cityCoordinates);
        }, 200);
    } else {
        // 상세 모달이 없는 경우 바로 지도 모달 열기
        showExpandedMapModal(entryId, countryCode, cityCoordinates);
    }
}

// 확장 지도 모달 표시 (내부 함수)
function showExpandedMapModal(entryId, countryCode, cityCoordinates) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    const countryName = getKoreanName(countryCode) || countryCode;
    const cityName = getCityNameByCode(countryCode, entry.city) || entry.city;
    const flag = countryFlags[countryCode] || '🏳️';

    // 확장 지도 모달 HTML 생성 (상세 모달과 동일한 디자인)
    const expandedModalHTML = `
        <div id="expanded-map-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[1100] flex items-center justify-center p-4 opacity-0">
            <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform translate-y-4">
                <!-- 헤더 -->
                <div class="flex justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-100 relative">
                    <div class="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0 pr-12">
                        <button onclick="closeExpandedMapAndReturnToDetail('${entryId}')" 
                                class="text-blue-600 hover:text-blue-700 text-lg font-medium flex items-center space-x-2 transition-colors">
                            <span>←</span>
                            <span>상세 정보</span>
                        </button>
                    </div>
                    <button onclick="closeExpandedMapCompletely()" 
                            class="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto text-gray-400 hover:text-gray-600 text-xl sm:text-2xl font-bold flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="모달 닫기">
                        ×
                    </button>
                </div>

                <!-- 제목 -->
                <div class="px-6 pt-4 pb-2">
                    <div class="flex items-center space-x-4">
                        <span class="text-3xl sm:text-4xl" aria-label="${countryName} 국기">${flag}</span>
                        <div>
                            <h2 class="text-xl sm:text-2xl font-bold text-gray-800">🗺️ ${countryName} 전체 지도</h2>
                            <p class="text-sm sm:text-lg text-gray-600 mt-1">${cityName} 위치 중심</p>
                        </div>
                    </div>
                </div>

                <!-- 지도 컨테이너 -->
                <div class="px-6 pb-4">
                    <div id="expanded-map-${entryId}" class="w-full h-96 rounded-lg overflow-hidden border border-gray-200 relative">
                        <!-- 로딩 상태 -->
                        <div id="expanded-map-loading-${entryId}" class="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <div class="text-center">
                                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p class="text-gray-600">지도를 불러오는 중...</p>
                            </div>
                        </div>
                        <!-- 에러 상태 (기본적으로 숨김) -->
                        <div id="expanded-map-error-${entryId}" class="absolute inset-0 bg-red-50 items-center justify-center hidden">
                            <div class="text-center">
                                <span class="text-4xl mb-4">⚠️</span>
                                <p class="text-red-600 font-medium">지도를 불러올 수 없습니다</p>
                                <p class="text-red-500 text-sm mt-2">잠시 후 다시 시도해주세요</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 하단 정보 -->
                <div class="px-6 pb-6">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="text-sm text-gray-600">
                            <span>📍 ${cityName} (${cityCoordinates.lat.toFixed(4)}, ${cityCoordinates.lng.toFixed(4)})</span>
                        </div>
                    </div>
                </div>

                <!-- 하단 버튼 -->
                <div class="p-6 border-t border-gray-100">
                    <div class="flex justify-center space-x-2">
                        <button onclick="closeExpandedMapAndReturnToDetail('${entryId}')" 
                                class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium">
                            ← 상세 정보로
                        </button>
                        <button onclick="closeExpandedMapCompletely()" 
                                class="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium">
                            완전 닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 새 모달 추가
    document.body.insertAdjacentHTML('beforeend', expandedModalHTML);

    // 부드러운 fade-in 애니메이션
    setTimeout(() => {
        const modal = document.getElementById('expanded-map-modal');
        if (modal) {
            modal.style.transition = 'opacity 0.3s ease-in';
            modal.style.opacity = '1';
            
            const content = modal.querySelector('.bg-white');
            if (content) {
                content.style.transition = 'transform 0.3s ease-out';
                content.style.transform = 'translateY(0)';
            }
        }
    }, 50);

    // 안전한 이벤트 등록
    const escKeyListener = globalEventManager.addEventListener(
        document,
        'keydown',
        function(e) {
            if (e.key === 'Escape') {
                closeExpandedMapAndReturnToDetail(entryId);
            }
        }
    );

    // 모달 외부 클릭 이벤트
    const outsideClickListener = globalEventManager.addEventListener(
        document.getElementById('expanded-map-modal'),
        'click',
        function(e) {
            if (e.target.id === 'expanded-map-modal') {
                closeExpandedMapAndReturnToDetail(entryId);
            }
        }
    );

    // 모달에 정리 함수 정보 저장
    const modal = document.getElementById('expanded-map-modal');
    modal._cleanupListeners = [escKeyListener, outsideClickListener];

    // 확장 지도 초기화
    globalEventManager.setTimeout(() => {
        initializeExpandedMap(entryId, cityCoordinates.lat, cityCoordinates.lng, cityName);
    }, 100, 'expanded-map-init-delay');
}

// 확장 지도 모달 닫고 상세 모달로 복귀
function closeExpandedMapAndReturnToDetail(entryId) {
    const modal = document.getElementById('expanded-map-modal');
    if (!modal) return;

    // 부드러운 fade-out 애니메이션
    modal.style.transition = 'opacity 0.2s ease-out';
    modal.style.opacity = '0';
    
    const content = modal.querySelector('.bg-white');
    if (content) {
        content.style.transition = 'transform 0.2s ease-in';
        content.style.transform = 'translateY(4px)';
    }

    setTimeout(() => {
        // 이벤트 리스너 정리
        if (modal._cleanupListeners) {
            modal._cleanupListeners.forEach(cleanup => {
                if (typeof cleanup === 'function') {
                    cleanup();
                }
            });
        }

        // 지도 인스턴스 정리
        const entryIdFromModal = modal.querySelector('[id^="expanded-map-"]')?.id?.replace('expanded-map-', '');
        if (entryIdFromModal) {
            cleanupExpandedMap(entryIdFromModal);
        }

        // 모달 제거
        modal.remove();

        // 상세 모달 다시 열기
        showEntryDetail(entryId);
    }, 200);
}

// 확장 지도 모달 완전 닫기
function closeExpandedMapCompletely() {
    const modal = document.getElementById('expanded-map-modal');
    if (!modal) return;

    // 부드러운 fade-out 애니메이션
    modal.style.transition = 'opacity 0.2s ease-out';
    modal.style.opacity = '0';
    
    const content = modal.querySelector('.bg-white');
    if (content) {
        content.style.transition = 'transform 0.2s ease-in';
        content.style.transform = 'translateY(4px)';
    }

    setTimeout(() => {
        // 이벤트 리스너 정리
        if (modal._cleanupListeners) {
            modal._cleanupListeners.forEach(cleanup => {
                if (typeof cleanup === 'function') {
                    cleanup();
                }
            });
        }

        // 지도 인스턴스 정리
        const entryId = modal.querySelector('[id^="expanded-map-"]')?.id?.replace('expanded-map-', '');
        if (entryId) {
            cleanupExpandedMap(entryId);
        }

        // 모달 제거
        modal.remove();
    }, 200);
}

// 기존 closeExpandedMap 함수는 호환성을 위해 유지 (closeExpandedMapCompletely와 동일)
function closeExpandedMap() {
    closeExpandedMapCompletely();
}

// 확장 지도 초기화 함수
function initializeExpandedMap(entryId, lat, lng, cityName) {
    try {
        const mapContainer = document.getElementById(`expanded-map-${entryId}`);
        const loadingElement = document.getElementById(`expanded-map-loading-${entryId}`);
        const errorElement = document.getElementById(`expanded-map-error-${entryId}`);
        
        if (!mapContainer) {
            console.warn(`ExpandedMap container not found for entry ${entryId}`);
            return;
        }

        // 로딩 상태 표시
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        // Leaflet 라이브러리 확인
        if (typeof L === 'undefined' || !L.map) {
            console.error('Leaflet library is not loaded');
            showExpandedMapError(entryId, 'Leaflet 라이브러리를 불러올 수 없습니다');
            return;
        }

        // 좌표 유효성 검증
        if (typeof lat !== 'number' || typeof lng !== 'number' || 
            isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid coordinates for entry ${entryId}: lat=${lat}, lng=${lng}`);
            showExpandedMapError(entryId, '유효하지 않은 좌표입니다');
            return;
        }

        // Leaflet 지도 생성 (국가 전체가 보이도록 줌 레벨 조정)
        const expandedMap = L.map(mapContainer, {
            center: [lat, lng],
            zoom: 5, // 국가 전체가 보이도록 줌 레벨 조정
            interactive: false,
            dragging: false,
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            tap: false,
            touchZoom: false,
            bounceAtZoomLimits: false,
            zoomSnap: 0,
            zoomDelta: 0,
            wheelPxPerZoomLevel: 0,
            maxZoom: 5, // 최대 줌 레벨 고정
            minZoom: 5, // 최소 줌 레벨 고정
            maxBounds: null,
            maxBoundsViscosity: 0
        });

        // OpenStreetMap 타일 레이어 추가
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 5,
            minZoom: 5,
            updateWhenZooming: false,
            updateWhenIdle: false,
            keepBuffer: 0,
            maxNativeZoom: 5
        }).addTo(expandedMap);

        // 마커 추가
        const marker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'expanded-custom-marker',
                html: '<div style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.5);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(expandedMap);

        // 지도 크기 조정 및 줌 레벨 강제 고정
        setTimeout(() => {
            try {
                if (!expandedMap || typeof expandedMap.invalidateSize !== 'function') {
                    console.warn('ExpandedMap initialization failed: map object is not valid');
                    return;
                }

                expandedMap.invalidateSize();
                expandedMap.setZoom(5, { animate: false });
                
                // 모든 줌 관련 이벤트 비활성화
                expandedMap.off('zoomstart');
                expandedMap.off('zoom');
                expandedMap.off('zoomend');
                expandedMap.off('viewreset');
                
                // 지도 완전 고정
                if (expandedMap.dragging && typeof expandedMap.dragging.disable === 'function') {
                    expandedMap.dragging.disable();
                }
                if (expandedMap.touchZoom && typeof expandedMap.touchZoom.disable === 'function') {
                    expandedMap.touchZoom.disable();
                }
                if (expandedMap.doubleClickZoom && typeof expandedMap.doubleClickZoom.disable === 'function') {
                    expandedMap.doubleClickZoom.disable();
                }
                if (expandedMap.scrollWheelZoom && typeof expandedMap.scrollWheelZoom.disable === 'function') {
                    expandedMap.scrollWheelZoom.disable();
                }
                if (expandedMap.boxZoom && typeof expandedMap.boxZoom.disable === 'function') {
                    expandedMap.boxZoom.disable();
                }
                if (expandedMap.keyboard && typeof expandedMap.keyboard.disable === 'function') {
                    expandedMap.keyboard.disable();
                }
                if (expandedMap.tap && typeof expandedMap.tap.disable === 'function') {
                    expandedMap.tap.disable();
                }

                // 지도 인스턴스를 컨테이너에 저장
                mapContainer._expandedMap = expandedMap;
                
                // 로딩 완료 - 로딩 상태 숨기기
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            } catch (error) {
                console.warn('Error during expandedMap initialization:', error);
                showExpandedMapError(entryId, '지도 초기화 중 오류가 발생했습니다');
            }
        }, 200);
    } catch (error) {
        console.error('Error initializing expandedMap:', error);
        showExpandedMapError(entryId, '지도를 불러올 수 없습니다');
    }
}

// 확장 지도 에러 표시 함수
function showExpandedMapError(entryId, message) {
    const loadingElement = document.getElementById(`expanded-map-loading-${entryId}`);
    const errorElement = document.getElementById(`expanded-map-error-${entryId}`);
    
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    if (errorElement) {
        const errorMessageElement = errorElement.querySelector('p:first-of-type');
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
        }
        // hidden 클래스 제거하고 flex 클래스 추가
        errorElement.classList.remove('hidden');
        errorElement.classList.add('flex');
    }
}

// 확장 지도 정리 함수
function cleanupExpandedMap(entryId) {
    try {
        const mapContainer = document.getElementById(`expanded-map-${entryId}`);
        if (mapContainer && mapContainer._expandedMap) {
            const map = mapContainer._expandedMap;
            if (typeof map.remove === 'function') {
                map.remove();
            }
            mapContainer._expandedMap = null;
        }
    } catch (error) {
        console.warn('Error cleaning up expanded map:', error);
    }
}

// 미니맵 초기화 함수
function initializeMiniMap(entryId, lat, lng, cityName) {
    try {
        const mapContainer = document.getElementById(`mini-map-${entryId}`);
        if (!mapContainer) {
            console.warn(`MiniMap container not found for entry ${entryId}`);
            return;
        }

        // Leaflet 라이브러리 확인
        if (typeof L === 'undefined' || !L.map) {
            console.error('Leaflet library is not loaded');
            return;
        }

        // 좌표 유효성 검증
        if (typeof lat !== 'number' || typeof lng !== 'number' || 
            isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid coordinates for entry ${entryId}: lat=${lat}, lng=${lng}`);
            return;
        }

        // Leaflet 지도 생성 (국가 전체가 보이도록 줌 레벨 조정)
        const miniMap = L.map(mapContainer, {
            center: [lat, lng],
            zoom: 7, // 국가 전체가 보이도록 줌 레벨 조정
            interactive: false,
            dragging: false,
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            tap: false,
            touchZoom: false,
            bounceAtZoomLimits: false,
            zoomSnap: 0, // 줌 스냅 비활성화
            zoomDelta: 0, // 줌 델타 비활성화
            wheelPxPerZoomLevel: 0, // 휠 줌 비활성화
            maxZoom: 7, // 최대 줌 레벨 고정
            minZoom: 7, // 최소 줌 레벨 고정
            maxBounds: null, // 경계 제한 해제
            maxBoundsViscosity: 0 // 경계 점성 비활성화
        });

        // OpenStreetMap 타일 레이어 추가 (지형이 잘 보이는 스타일)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 7, // 타일 레이어도 최대 줌 제한
            minZoom: 7, // 타일 레이어도 최소 줌 제한
            updateWhenZooming: false, // 줌 시 업데이트 비활성화
            updateWhenIdle: false, // 유휴 시 업데이트 비활성화
            keepBuffer: 0, // 버퍼 비활성화
            maxNativeZoom: 7 // 네이티브 최대 줌 제한
        }).addTo(miniMap);

        // 마커 추가 (툴팁 없이, 국가 전체가 보이도록 크기 조정)
        const marker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.4);"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            })
        }).addTo(miniMap);

        // 지도 크기 조정 및 줌 레벨 강제 고정
        setTimeout(() => {
            try {
                // miniMap 객체 유효성 검증
                if (!miniMap || typeof miniMap.invalidateSize !== 'function') {
                    console.warn('MiniMap initialization failed: map object is not valid');
                    return;
                }

                miniMap.invalidateSize();
                miniMap.setZoom(7, { animate: false }); // 줌 레벨 강제 고정
                
                // 모든 줌 관련 이벤트 비활성화
                miniMap.off('zoomstart');
                miniMap.off('zoom');
                miniMap.off('zoomend');
                miniMap.off('viewreset');
                
                // 지도 완전 고정 - 안전한 메서드 체이닝 사용
                if (miniMap.dragging && typeof miniMap.dragging.disable === 'function') {
                    miniMap.dragging.disable();
                }
                if (miniMap.touchZoom && typeof miniMap.touchZoom.disable === 'function') {
                    miniMap.touchZoom.disable();
                }
                if (miniMap.doubleClickZoom && typeof miniMap.doubleClickZoom.disable === 'function') {
                    miniMap.doubleClickZoom.disable();
                }
                if (miniMap.scrollWheelZoom && typeof miniMap.scrollWheelZoom.disable === 'function') {
                    miniMap.scrollWheelZoom.disable();
                }
                if (miniMap.boxZoom && typeof miniMap.boxZoom.disable === 'function') {
                    miniMap.boxZoom.disable();
                }
                if (miniMap.keyboard && typeof miniMap.keyboard.disable === 'function') {
                    miniMap.keyboard.disable();
                }
                if (miniMap.tap && typeof miniMap.tap.disable === 'function') {
                    miniMap.tap.disable();
                }
            } catch (error) {
                console.warn('Error during miniMap initialization:', error);
                // 에러 발생 시에도 지도는 계속 표시되도록 함
            }
        }, 200);
    } catch (error) {
        console.error('Error initializing miniMap:', error);
        // 에러 발생 시에도 사용자 경험에 영향을 주지 않도록 함
    }
}

// 별점별 보기 렌더링
function renderRatingTimeline() {
    const ratingTimelineList = document.getElementById('rating-timeline-list');
    const ratingTimelineEmpty = document.getElementById('rating-timeline-empty');

    // 별점이 있는 일정만 필터링
    const ratedEntries = entries.filter(entry => entry.rating && entry.rating > 0);

    if (ratedEntries.length === 0) {
        ratingTimelineList.style.display = 'none';
        ratingTimelineEmpty.style.display = 'block';
        // 페이지네이션 숨기기
        document.getElementById('rating-pagination').classList.add('hidden');
        return;
    }

    ratingTimelineList.style.display = 'block';
    ratingTimelineEmpty.style.display = 'none';

    // 정렬 로직 - 별점 순으로 정렬하고, 같은 별점 내에서는 날짜 최신순
    let sortedEntries;
    switch (ratingSortType) {
        case 'rating-low':
            sortedEntries = [...ratedEntries].sort((a, b) => {
                if (a.rating !== b.rating) {
                    return a.rating - b.rating;
                }
                return new Date(b.startDate) - new Date(a.startDate);
            });
            break;
        case 'rating-high':
        default:
            sortedEntries = [...ratedEntries].sort((a, b) => {
                if (a.rating !== b.rating) {
                    return b.rating - a.rating;
                }
                return new Date(b.startDate) - new Date(a.startDate);
            });
            break;
    }
    
    // 페이지네이션 적용
    const totalPages = getTotalPages(sortedEntries.length, ITEMS_PER_PAGE);
    
    // 현재 페이지가 총 페이지 수를 초과하면 마지막 페이지로 조정
    if (ratingCurrentPage > totalPages && totalPages > 0) {
        ratingCurrentPage = totalPages;
    }
    
    const paginatedEntries = getPaginatedItems(sortedEntries, ratingCurrentPage, ITEMS_PER_PAGE);

    ratingTimelineList.innerHTML = paginatedEntries.map(entry => {
            // 국가명과 도시명을 정확한 한글명으로 변환
    const countryName = getKoreanName(entry.countryCode) || entry.country;
        const cityName = getCityNameByCode(entry.countryCode, entry.city) || entry.city;
        
        const days = calculateDays(entry.startDate, entry.endDate);
        const purposeText = getPurposeText(entry.purpose);
        const flag = countryFlags[entry.countryCode] || '🏳️';
        const ratingDisplay = displayRatingInCard(entry.rating);

        return `
            <div class="collection-timeline-card bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] sm:active:scale-100" 
                 onclick="showEntryDetail('${entry.id}')">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div class="flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-gray-800 break-words">${flag} ${cityName}, ${countryName}</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">${purposeText}</p>
                    </div>
                    <div class="flex items-center justify-end sm:justify-start">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                            ${days}일
                        </span>
                    </div>
                </div>
                <div class="text-xs sm:text-sm text-gray-500 mt-3">
                    📅 ${entry.startDate} ~ ${entry.endDate}
                </div>
                ${ratingDisplay}
                ${entry.memo ? `<p class="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded mt-3 overflow-hidden"><span class="line-clamp-1">📝 ${truncateMemoForCard(entry.memo)}</span></p>` : ''}
            </div>
        `;
    }).join('');
    
    // 페이지네이션 렌더링
    renderPagination(ratingCurrentPage, totalPages, 'rating-pagination', 'rating-prev', 'rating-next', 'rating-page-numbers');
}

// 타임라인 정렬 버튼 이벤트 핸들러
function initializeTimelineSortButtons() {
    const sortButtons = document.querySelectorAll('.timeline-sort-btn');
    
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 버튼 비활성화
            sortButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            // 클릭된 버튼 활성화
            this.classList.add('active', 'bg-blue-500', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // 정렬 타입 가져오기
            const sortType = this.getAttribute('data-sort');
            timelineSortType = sortType;
            
            // 정렬 설정 저장
            if (typeof saveSortSettings === 'function') {
                saveSortSettings();
            }
            
            // 페이지네이션 초기화
            timelineCurrentPage = 1;
            
            // 타임라인 렌더링
            renderCollectionTimeline();
        });
    });
}

// 별점별 정렬 버튼 이벤트 핸들러
function initializeRatingSortButtons() {
    const sortButtons = document.querySelectorAll('.rating-sort-btn');
    
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 버튼 비활성화
            sortButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            // 클릭된 버튼 활성화
            this.classList.add('active', 'bg-blue-500', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // 정렬 타입 가져오기
            const sortType = this.getAttribute('data-sort');
            ratingSortType = sortType;
            
            // 정렬 설정 저장
            if (typeof saveSortSettings === 'function') {
                saveSortSettings();
            }
            
            // 페이지네이션 초기화
            ratingCurrentPage = 1;
            
            // 별점별 보기 렌더링
            renderRatingTimeline();
        });
    });
}

// 정렬 버튼 상태 업데이트 함수
function updateSortButtonStates() {
    // 타임라인 정렬 버튼 상태 업데이트
    const timelineSortButtons = document.querySelectorAll('.timeline-sort-btn');
    timelineSortButtons.forEach(button => {
        const sortType = button.getAttribute('data-sort');
        if (sortType === timelineSortType) {
            button.classList.add('active', 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
        } else {
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-700');
        }
    });
    
    // 별점별 정렬 버튼 상태 업데이트
    const ratingSortButtons = document.querySelectorAll('.rating-sort-btn');
    ratingSortButtons.forEach(button => {
        const sortType = button.getAttribute('data-sort');
        if (sortType === ratingSortType) {
            button.classList.add('active', 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
        } else {
            button.classList.remove('active', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-700');
        }
    });
}

// 페이지네이션 및 정렬 상태 초기화 함수
function resetPagination() {
    timelineCurrentPage = 1;
    ratingCurrentPage = 1;
    timelineSortType = 'newest';
    ratingSortType = 'rating-high';
}

// 모달 이벤트 리스너 정리 함수
function cleanupEntryDetailModal() {
    const modal = document.getElementById('entry-detail-modal');
    if (modal && modal._cleanupListeners) {
        // 등록된 리스너들 정리
        modal._cleanupListeners.forEach(listenerKey => {
            globalEventManager.removeEventListener(listenerKey);
        });
        delete modal._cleanupListeners;
    }
}

// 메모 더보기/접기 토글 함수
function toggleMemoDetail(entryId) {
    const memoText = document.getElementById(`memo-text-${entryId}`);
    const memoContent = document.getElementById(`memo-content-${entryId}`);
    const entry = entries.find(e => e.id === entryId);
    
    if (!entry || !entry.memo) return;
    
    const isExpanded = memoText.textContent === sanitizeMemo(entry.memo);
    
    if (isExpanded) {
        // 접기
        memoText.textContent = truncateMemoForDetail(entry.memo);
        memoContent.innerHTML = `
            <span id="memo-text-${entryId}">${truncateMemoForDetail(entry.memo)}</span>
            <button onclick="toggleMemoDetail('${entryId}')" class="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                더보기
            </button>
        `;
    } else {
        // 더보기
        memoText.textContent = sanitizeMemo(entry.memo);
        memoContent.innerHTML = `
            <span id="memo-text-${entryId}">${sanitizeMemo(entry.memo)}</span>
            <button onclick="toggleMemoDetail('${entryId}')" class="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                접기
            </button>
        `;
    }
}

// 일정 상세 정보 모달 닫기
function closeEntryDetail() {
    cleanupEntryDetailModal();
    const modal = document.getElementById('entry-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// 전역으로 노출
if (typeof window !== 'undefined') {
    window.showEntryDetail = showEntryDetail;
    window.closeEntryDetail = closeEntryDetail;
    window.modifyEntry = modifyEntry;
    window.deleteEntry = deleteEntry;
    window.toggleMemoDetail = toggleMemoDetail;
} 
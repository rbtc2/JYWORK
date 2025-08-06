/**
 * collectionTimeline.js - 콜렉션 타임라인 생성, 수정, 삭제 기능
 * 여행 일정의 CRUD 작업과 콜렉션 타임라인 렌더링을 담당
 */

// 국가별 국기 이모지 매핑
const countryFlags = {
    'KR': '🇰🇷',
    'JP': '🇯🇵',
    'US': '🇺🇸',
    'GB': '🇬🇧',
    'FR': '🇫🇷',
    'DE': '🇩🇪'
};

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
        return;
    }

    collectionTimelineList.style.display = 'block';
    collectionTimelineEmpty.style.display = 'none';

    // 날짜순으로 정렬 (최신순)
    const sortedEntries = [...entries].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    collectionTimelineList.innerHTML = sortedEntries.map(entry => {
        const days = calculateDays(entry.startDate, entry.endDate);
        const purposeText = getPurposeText(entry.purpose);
        const flag = countryFlags[entry.countryCode] || '🏳️';
        const ratingDisplay = displayRatingInCard(entry.rating);

        return `
            <div class="collection-timeline-card bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] sm:active:scale-100" 
                 onclick="showEntryDetail('${entry.id}')">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div class="flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-gray-800 break-words">${flag} ${entry.country} / ${entry.city}</h3>
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
                ${entry.memo ? `<p class="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded break-words mt-3">📝 ${entry.memo}</p>` : ''}
            </div>
        `;
    }).join('');
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
    document.getElementById('companions').value = entry.companions || '';
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

    const days = calculateDays(entry.startDate, entry.endDate);
    const purposeText = getPurposeText(entry.purpose);
    const flag = countryFlags[entry.countryCode] || '🏳️';
    
    // 도시 좌표 가져오기
    const cityCoord = cityCoordinates[entry.city];
    const hasMap = cityCoord && cityCoord.lat && cityCoord.lng;

    // 모달 HTML 생성
    const modalHTML = `
        <div id="entry-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <!-- 헤더 -->
                <div class="flex justify-between items-center p-6 border-b border-gray-100">
                    <div class="flex items-center space-x-4">
                        <span class="text-4xl">${flag}</span>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">${entry.country} / ${entry.city}</h2>
                            <p class="text-lg text-gray-600">${entry.startDate} ~ ${entry.endDate}</p>
                        </div>
                    </div>
                    <button onclick="closeEntryDetail()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                        ×
                    </button>
                </div>

                <!-- 카드 본문 -->
                <div class="p-6 space-y-6">
                    <!-- 체류 정보 섹션 -->
                    <div class="space-y-4">
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
                    </div>

                    <!-- 별점, 메모, 동행자 정보 -->
                    <div class="bg-gray-50 rounded-lg p-6 space-y-4">
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
                        
                        <div class="flex items-start space-x-3">
                            <span class="text-2xl mt-1">👥</span>
                            <div class="flex-1">
                                <p class="text-sm text-gray-500">동행자</p>
                                <p class="text-lg font-semibold text-gray-800">${entry.companions || '없음'}</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <span class="text-2xl mt-1">📝</span>
                            <div class="flex-1">
                                <p class="text-sm text-gray-500">메모</p>
                                <p class="text-lg font-semibold text-gray-800">${entry.memo || '없음'}</p>
                            </div>
                        </div>
                    </div>

                    <!-- 위치 지도 -->
                    ${hasMap ? `
                    <div class="mt-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <span class="text-2xl">🗺️</span>
                            <div>
                                <p class="text-sm text-gray-500">위치</p>
                                <p class="text-lg font-semibold text-gray-800">${entry.city}</p>
                            </div>
                        </div>
                        <div id="mini-map-${entry.id}" class="mini-map-container rounded-lg overflow-hidden h-48"></div>
                    </div>
                    ` : `
                    <div class="mt-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <span class="text-2xl">🗺️</span>
                            <div>
                                <p class="text-sm text-gray-500">위치</p>
                                <p class="text-lg font-semibold text-gray-800">${entry.city}</p>
                            </div>
                        </div>
                        <div class="bg-gray-100 rounded-lg overflow-hidden h-48 flex items-center justify-center">
                            <div class="text-center">
                                <p class="text-gray-500 text-sm">📍 위치 정보를 확인할 수 없습니다</p>
                            </div>
                        </div>
                    </div>
                    `}
                </div>

                <!-- 하단 버튼 -->
                <div class="p-6 border-t border-gray-100">
                    <div class="flex flex-col sm:flex-row justify-end gap-3">
                        <button onclick="closeEntryDetail()" 
                                class="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base font-medium min-h-[44px] sm:min-h-[40px]">
                            ✕ 닫기
                        </button>
                        <button onclick="modifyEntry('${entry.id}'); closeEntryDetail();" 
                                class="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base font-medium min-h-[44px] sm:min-h-[40px]">
                            ✏️ 수정
                        </button>
                        <button onclick="deleteEntry('${entry.id}'); closeEntryDetail();" 
                                class="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base font-medium min-h-[44px] sm:min-h-[40px]">
                            🗑️ 삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 기존 모달이 있다면 제거
    const existingModal = document.getElementById('entry-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 새 모달 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            closeEntryDetail();
            document.removeEventListener('keydown', closeOnEsc);
        }
    });

    // 모달 외부 클릭으로 닫기
    document.getElementById('entry-detail-modal').addEventListener('click', function(e) {
        if (e.target.id === 'entry-detail-modal') {
            closeEntryDetail();
        }
    });

    // 지도 초기화 (좌표가 있는 경우)
    if (hasMap) {
        setTimeout(() => {
            initializeMiniMap(entry.id, cityCoord.lat, cityCoord.lng, entry.city);
        }, 100);
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
function renderRatingTimeline(sortType = 'date') {
    const ratingTimelineList = document.getElementById('rating-timeline-list');
    const ratingTimelineEmpty = document.getElementById('rating-timeline-empty');

    // 별점이 있는 일정만 필터링
    const ratedEntries = entries.filter(entry => entry.rating && entry.rating > 0);

    if (ratedEntries.length === 0) {
        ratingTimelineList.style.display = 'none';
        ratingTimelineEmpty.style.display = 'block';
        return;
    }

    ratingTimelineList.style.display = 'block';
    ratingTimelineEmpty.style.display = 'none';

    // 정렬 로직
    let sortedEntries;
    switch (sortType) {
        case 'rating-high':
            sortedEntries = [...ratedEntries].sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-low':
            sortedEntries = [...ratedEntries].sort((a, b) => a.rating - b.rating);
            break;
        case 'date':
        default:
            sortedEntries = [...ratedEntries].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            break;
    }

    ratingTimelineList.innerHTML = sortedEntries.map(entry => {
        const days = calculateDays(entry.startDate, entry.endDate);
        const purposeText = getPurposeText(entry.purpose);
        const flag = countryFlags[entry.countryCode] || '🏳️';
        const ratingDisplay = displayRatingInCard(entry.rating);

        return `
            <div class="collection-timeline-card bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] sm:active:scale-100" 
                 onclick="showEntryDetail('${entry.id}')">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div class="flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-gray-800 break-words">${flag} ${entry.country} / ${entry.city}</h3>
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
                ${entry.memo ? `<p class="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded break-words mt-3">📝 ${entry.memo}</p>` : ''}
            </div>
        `;
    }).join('');
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
            
            // 별점별 보기 렌더링
            renderRatingTimeline(sortType);
        });
    });
}

// 일정 상세 정보 모달 닫기
function closeEntryDetail() {
    const modal = document.getElementById('entry-detail-modal');
    if (modal) {
        modal.remove();
    }
} 
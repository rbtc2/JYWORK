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
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <!-- 헤더 -->
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <div class="flex items-center space-x-3">
                        <span class="text-3xl">${flag}</span>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">${entry.country} / ${entry.city}</h2>
                            <p class="text-lg text-gray-600">${entry.startDate} ~ ${entry.endDate}</p>
                        </div>
                    </div>
                    <button onclick="closeEntryDetail()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                        ×
                    </button>
                </div>

                <!-- 기본 정보 -->
                <div class="p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- 기본 정보 카드 -->
                        <div class="bg-blue-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                <span class="mr-2">📋</span>기본 정보
                            </h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">국가:</span>
                                    <span class="font-medium">${flag} ${entry.country}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">도시:</span>
                                    <span class="font-medium">${entry.city}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">체류 기간:</span>
                                    <span class="font-medium">${entry.startDate} ~ ${entry.endDate}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">체류 목적:</span>
                                    <span class="font-medium">${purposeText}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">총 체류 일수:</span>
                                    <span class="font-medium text-blue-600">${days}일</span>
                                </div>
                            </div>
                        </div>

                        <!-- 추가 정보 카드 -->
                        <div class="bg-green-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                <span class="mr-2">📝</span>추가 정보
                            </h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">동행자:</span>
                                    <span class="font-medium">${entry.companions || '없음'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">메모:</span>
                                    <span class="font-medium">${entry.memo || '없음'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 위치 지도 -->
                    ${hasMap ? `
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span class="mr-2">🗺️</span>위치
                        </h3>
                        <div id="mini-map-${entry.id}" class="mini-map-container"></div>
                    </div>
                    ` : `
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span class="mr-2">🗺️</span>위치
                        </h3>
                        <div class="text-gray-500 text-sm text-center py-8">
                            <p>📍 ${entry.city}의 위치 정보를 확인할 수 없습니다.</p>
                        </div>
                    </div>
                    `}
                </div>

                <!-- 하단 버튼 -->
                <div class="p-4 sm:p-6 border-t border-gray-200">
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
    const mapContainer = document.getElementById(`mini-map-${entryId}`);
    if (!mapContainer) return;

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
        miniMap.invalidateSize();
        miniMap.setZoom(7, { animate: false }); // 줌 레벨 강제 고정
        
        // 모든 줌 관련 이벤트 비활성화
        miniMap.off('zoomstart');
        miniMap.off('zoom');
        miniMap.off('zoomend');
        miniMap.off('viewreset');
        
        // 지도 완전 고정
        miniMap.dragging.disable();
        miniMap.touchZoom.disable();
        miniMap.doubleClickZoom.disable();
        miniMap.scrollWheelZoom.disable();
        miniMap.boxZoom.disable();
        miniMap.keyboard.disable();
        miniMap.tap.disable();
    }, 200);
}

// 일정 상세 정보 모달 닫기
function closeEntryDetail() {
    const modal = document.getElementById('entry-detail-modal');
    if (modal) {
        modal.remove();
    }
} 
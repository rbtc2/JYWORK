/**
 * map.js - 안정적인 세계지도 구현
 * Leaflet 지도 초기화 및 기본 설정을 담당
 * 향후 마커 기능 확장을 고려한 구조로 설계
 */

// 지도 관련 변수들
let map = null;
let mapInitialized = false;

// 지도 컨테이너 테스트 함수
function testMapContainer() {
    const mapContainer = document.getElementById('map-container');
    const mapRender = document.getElementById('map-render');
    
    if (!mapContainer || !mapRender) {
        console.error('지도 컨테이너를 찾을 수 없습니다.');
        return false;
    }
    
    const containerRect = mapContainer.getBoundingClientRect();
    const renderRect = mapRender.getBoundingClientRect();
    
    console.log('지도 컨테이너 정보:');
    console.log('- 컨테이너 크기:', containerRect.width, 'x', containerRect.height);
    console.log('- 렌더 크기:', renderRect.width, 'x', renderRect.height);
    console.log('- 컨테이너 표시:', mapContainer.style.display, mapContainer.style.visibility);
    console.log('- 렌더 표시:', mapRender.style.display, mapRender.style.visibility);
    
    return containerRect.width > 0 && containerRect.height > 0;
}

// 지도 초기화 함수
function initializeMap() {
    // 이미 초기화된 경우 제거 후 재생성
    if (map) {
        map.remove();
        map = null;
    }

    // 지도 컨테이너 확인
    const mapContainer = document.getElementById('map-container');
    const mapRender = document.getElementById('map-render');
    
    if (!mapContainer || !mapRender) {
        console.error('지도 컨테이너를 찾을 수 없습니다.');
        return;
    }

    // 컨테이너 테스트
    if (!testMapContainer()) {
        console.error('지도 컨테이너가 올바르게 설정되지 않았습니다.');
        return;
    }

    try {
        // 지도 생성 - 요구사항에 따른 설정
        map = L.map('map-render', {
            center: [20, 0],           // 적도 중심
            zoom: 2.5,                 // 기본 줌 레벨
            minZoom: 2,                // 최소 줌 레벨
            maxZoom: 5,                // 최대 줌 레벨
            worldCopyJump: false,      // 지도 반복 방지
            noWrap: true,              // 경도 래핑 방지
            maxBounds: [[-85, -180], [85, 180]], // 최대 경계 설정
            maxBoundsViscosity: 1.0,   // 경계 고정 강도
            zoomControl: true,         // 줌 컨트롤 표시
            attributionControl: true,  // 속성 컨트롤 표시
            dragging: true,            // 드래그 허용
            touchZoom: true,           // 터치 줌 허용
            scrollWheelZoom: true,     // 스크롤 휠 줌 허용
            doubleClickZoom: true,     // 더블클릭 줌 허용
            boxZoom: false,            // 박스 줌 비활성화
            keyboard: true,            // 키보드 컨트롤 허용
            tap: true,                 // 탭 허용
            tapTolerance: 15          // 탭 허용 오차
        });

        // OpenStreetMap 타일 레이어 추가
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            subdomains: 'abc'
        });

        tileLayer.addTo(map);

        // 타일 로딩 이벤트 리스너 추가
        tileLayer.on('loading', function() {
            console.log('타일 로딩 시작...');
        });

        tileLayer.on('load', function() {
            console.log('타일 로딩 완료');
        });

        tileLayer.on('tileerror', function(e) {
            console.error('타일 로딩 오류:', e);
            // 대체 타일 서버 시도
            console.log('대체 타일 서버를 시도합니다...');
            const fallbackTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            });
            fallbackTileLayer.addTo(map);
        });

        // 지도 로딩 완료 이벤트
        map.on('load', function() {
            console.log('지도 로딩 완료');
        });

        // 지도 타일 로딩 완료 이벤트
        map.on('tileload', function() {
            console.log('타일 로딩됨');
        });

        // 지도 타일 로딩 오류 이벤트
        map.on('tileerror', function(e) {
            console.error('지도 타일 오류:', e);
        });

        // 지도 이벤트 리스너 등록
        setupMapEventListeners();
        
        // 지도 크기 재계산 (리사이징 문제 방지)
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
                updateMapInfo();
            }
        }, 100);

        mapInitialized = true;
        console.log('지도가 성공적으로 초기화되었습니다.');

    } catch (error) {
        console.error('지도 초기화 중 오류 발생:', error);
        showMapError('지도를 불러오는 중 오류가 발생했습니다.');
    }
}

// 지도 이벤트 리스너 설정
function setupMapEventListeners() {
    if (!map) return;

    // 지도 이동 이벤트
    map.on('moveend', function() {
        updateMapInfo();
    });

    // 지도 줌 이벤트
    map.on('zoomend', function() {
        updateMapInfo();
    });

    // 지도 로드 완료 이벤트
    map.on('load', function() {
        console.log('지도 로드 완료');
        updateMapInfo();
    });

    // 지도 오류 이벤트
    map.on('error', function(error) {
        console.error('지도 오류:', error);
        showMapError('지도 로딩 중 오류가 발생했습니다.');
    });
    
    // 지도 리사이즈 이벤트
    map.on('resize', function() {
        console.log('지도 리사이즈 이벤트 발생');
        updateMapInfo();
    });
    
    // 지도 뷰 리셋 이벤트
    map.on('viewreset', function() {
        console.log('지도 뷰 리셋 이벤트 발생');
        updateMapInfo();
    });
}

// 지도 정보 업데이트
function updateMapInfo() {
    if (!map) return;

    try {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();

        // 중심점 정보 업데이트
        const centerElement = document.getElementById('map-center');
        if (centerElement) {
            centerElement.textContent = `위도: ${center.lat.toFixed(2)}°, 경도: ${center.lng.toFixed(2)}°`;
        }

        // 줌 레벨 정보 업데이트
        const zoomElement = document.getElementById('map-zoom');
        if (zoomElement) {
            zoomElement.textContent = zoom.toFixed(1);
        }

        // 표시 범위 정보 업데이트
        const boundsElement = document.getElementById('map-bounds');
        if (boundsElement) {
            const north = bounds.getNorth().toFixed(1);
            const south = bounds.getSouth().toFixed(1);
            const east = bounds.getEast().toFixed(1);
            const west = bounds.getWest().toFixed(1);
            boundsElement.textContent = `북: ${north}°, 남: ${south}°, 동: ${east}°, 서: ${west}°`;
        }

    } catch (error) {
        console.error('지도 정보 업데이트 중 오류:', error);
    }
}

// 지도 오류 표시
function showMapError(message) {
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-100 rounded-xl">
                <div class="text-center p-8">
                    <div class="text-4xl mb-4">🗺️</div>
                    <p class="text-gray-600 text-lg mb-2">지도 로딩 실패</p>
                    <p class="text-gray-500 text-sm">${message}</p>
                    <button onclick="initializeMap()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        다시 시도
                    </button>
                </div>
            </div>
        `;
    }
}

// 지도 범위에 맞춰 보기 (전체 보기)
function fitBounds() {
    if (!map) return;

    try {
        // 기본 세계 뷰로 설정
        map.setView([20, 0], 2.5);
        updateMapInfo();
        console.log('지도를 전체 보기로 설정했습니다.');
    } catch (error) {
        console.error('지도 범위 설정 중 오류:', error);
    }
}

// 지도 리셋
function resetMap() {
    if (!map) return;

    try {
        // 기본 설정으로 리셋
        map.setView([20, 0], 2.5);
        updateMapInfo();
        console.log('지도를 기본 설정으로 리셋했습니다.');
    } catch (error) {
        console.error('지도 리셋 중 오류:', error);
    }
}

// 지도 업데이트 (향후 마커 기능을 위한 준비)
function updateMap() {
    if (!map || !mapInitialized) {
        initializeMap();
        return;
    }

    try {
        // 현재는 기본 업데이트만 수행
        updateMapInfo();
        
        // 향후 마커 기능 추가 시 여기에 마커 생성 로직 추가
        // createMarkers();
        
    } catch (error) {
        console.error('지도 업데이트 중 오류:', error);
    }
}

// 지도 컨트롤 버튼 이벤트 리스너 설정
function setupMapControls() {
    // 전체 보기 버튼
    const fitBoundsBtn = document.getElementById('fit-bounds-btn');
    if (fitBoundsBtn) {
        fitBoundsBtn.addEventListener('click', fitBounds);
    }

    // 지도 리셋 버튼
    const resetMapBtn = document.getElementById('reset-map-btn');
    if (resetMapBtn) {
        resetMapBtn.addEventListener('click', resetMap);
    }
}

// 페이지 로드 시 지도 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 지도 컨트롤 설정
    setupMapControls();
    
    // 지도 초기화
    initializeMap();
});

// 탭 전환 시 지도 리사이징
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-tab') && e.target.dataset.section === 'world-map') {
        // 지도 탭이 활성화된 후 지도 크기 재계산
        setTimeout(() => {
            if (map && mapInitialized) {
                map.invalidateSize();
                updateMapInfo();
            }
        }, 100);
    }
});

// 창 크기 변경 시 지도 리사이징
window.addEventListener('resize', function() {
    if (map && mapInitialized) {
        setTimeout(() => {
            map.invalidateSize();
            updateMapInfo();
        }, 100);
    }
});

// 향후 마커 기능을 위한 준비 함수들 (현재는 비활성화)
function createMarkers() {
    // 향후 마커 생성 로직
    console.log('마커 생성 기능은 향후 구현 예정입니다.');
}

function showMarkers() {
    // 향후 마커 표시 로직
    console.log('마커 표시 기능은 향후 구현 예정입니다.');
}

function hideMarkers() {
    // 향후 마커 숨김 로직
    console.log('마커 숨김 기능은 향후 구현 예정입니다.');
} 
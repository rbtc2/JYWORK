/**
 * map.js - 세계지도 생성, 마커 렌더링, 거주지 강조
 * Leaflet 지도 초기화, 마커 생성, 팝업 표시 등을 담당
 */

// 지도 관련 변수들
let map = null;
let markers = [];
let markerLayer = null;

// 지도 초기화
function initializeMap() {
    if (map) {
        map.remove();
    }

    // 초기 뷰 설정 (거주지가 있으면 거주지 중심, 없으면 기본)
    let initialView = [20, 0];
    let initialZoom = 2;
    
    if (userResidence.coordinates) {
        initialView = [userResidence.coordinates.lat, userResidence.coordinates.lng];
        initialZoom = 8; // 거주지가 있으면 더 확대된 뷰
    }

    // 지도 생성
    map = L.map('world-map').setView(initialView, initialZoom);

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // 마커 레이어 생성
    markerLayer = L.layerGroup().addTo(map);

    // 지도 크기 재계산 (리사이징 문제 방지)
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 100);

    // 지도 컨트롤 이벤트 리스너
    document.getElementById('fit-bounds-btn').addEventListener('click', fitBounds);
    document.getElementById('clear-markers-btn').addEventListener('click', hideMarkers);
    document.getElementById('show-markers-btn').addEventListener('click', showMarkers);
}

// 마커 생성 및 추가
function createMarkers() {
    // 기존 마커 제거
    if (markerLayer) {
        markerLayer.clearLayers();
    }
    markers = [];

    // 중복 제거된 도시 목록 생성
    const uniqueCities = new Map();
    
    entries.forEach(entry => {
        const cityKey = `${entry.country}-${entry.city}`;
        if (!uniqueCities.has(cityKey)) {
            uniqueCities.set(cityKey, {
                country: entry.country,
                city: entry.city,
                entries: []
            });
        }
        uniqueCities.get(cityKey).entries.push(entry);
    });

    // 각 도시에 대해 마커 생성
    uniqueCities.forEach((cityData, cityKey) => {
        const coordinates = cityCoordinates[cityData.city];
        if (coordinates) {
            // 거주지 여부 확인
            const isResidence = userResidence.city && userResidence.city === cityData.city;
            
            // 마커 아이콘 설정 (거주지는 다른 색상)
            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin ${isResidence ? 'text-red-500' : ''}">${isResidence ? '🏠' : '📍'}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            const marker = L.marker([coordinates.lat, coordinates.lng], {
                icon: markerIcon
            });

            // 팝업 내용 생성
            const popupContent = createPopupContent(cityData);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });

            // 마커 클릭 이벤트
            marker.on('click', function() {
                showMarkerInfo(cityData);
            });

            marker.addTo(markerLayer);
            markers.push(marker);
        }
    });
}

// 팝업 내용 생성
function createPopupContent(cityData) {
    const purposeText = {
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

    let content = `
        <div class="popup-content">
            <h3 class="font-bold text-lg mb-2">
                ${cityData.city}, ${cityData.country}
                ${userResidence.city && userResidence.city === cityData.city ? '<span class="text-red-500 ml-2">🏠 거주지</span>' : ''}
            </h3>
            <div class="text-sm space-y-1">
    `;

    cityData.entries.forEach((entry, index) => {
        const purpose = purposeText[entry.purpose] || entry.purpose;
        const days = calculateDays(entry.startDate, entry.endDate);
        
        content += `
            <div class="border-l-2 border-blue-500 pl-2 mb-2">
                <div class="font-medium">${purpose}</div>
                <div class="text-gray-600">📅 ${entry.startDate} ~ ${entry.endDate}</div>
                <div class="text-gray-600">⏱️ ${days}일</div>
                ${entry.memo ? `<div class="text-gray-600">📝 ${entry.memo}</div>` : ''}
            </div>
        `;
    });

    content += `
            </div>
            <div class="text-xs text-gray-500 mt-2">
                총 ${cityData.entries.length}회 방문
            </div>
        </div>
    `;

    return content;
}

// 마커 정보 패널 표시
function showMarkerInfo(cityData) {
    const panel = document.getElementById('marker-info-panel');
    const content = document.getElementById('marker-info-content');
    
    const purposeText = {
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

    let infoContent = `
        <div class="space-y-3">
            <div class="font-semibold text-lg">
                ${cityData.city}, ${cityData.country}
                ${userResidence.city && userResidence.city === cityData.city ? '<span class="text-red-500 ml-2">🏠 거주지</span>' : ''}
            </div>
            <div class="text-sm space-y-2">
    `;

    cityData.entries.forEach((entry, index) => {
        const purpose = purposeText[entry.purpose] || entry.purpose;
        const days = calculateDays(entry.startDate, entry.endDate);
        
        infoContent += `
            <div class="bg-white p-3 rounded border">
                <div class="font-medium text-blue-600">${purpose}</div>
                <div class="text-gray-600">📅 ${entry.startDate} ~ ${entry.endDate}</div>
                <div class="text-gray-600">⏱️ ${days}일</div>
                ${entry.memo ? `<div class="text-gray-600 mt-1">📝 ${entry.memo}</div>` : ''}
            </div>
        `;
    });

    infoContent += `
            </div>
            <div class="text-sm text-gray-500 border-t pt-2">
                총 ${cityData.entries.length}회 방문
            </div>
        </div>
    `;

    content.innerHTML = infoContent;
    panel.classList.remove('hidden');
}

// 지도 범위에 맞춰 보기
function fitBounds() {
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    } else {
        map.setView([20, 0], 2);
    }
}

// 마커 숨기기
function hideMarkers() {
    if (markerLayer) {
        markerLayer.clearLayers();
    }
    document.getElementById('marker-info-panel').classList.add('hidden');
}

// 마커 보기
function showMarkers() {
    createMarkers();
}

// 지도 업데이트
function updateMap() {
    if (map) {
        createMarkers();
    }
} 
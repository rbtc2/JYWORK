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

// 국가 코드를 한글명으로 변환하는 함수
function getCountryNameByCode(countryCode) {
    const countryMap = {
        'KR': '대한민국',
        'JP': '일본',
        'US': '미국',
        'GB': '영국',
        'FR': '프랑스',
        'DE': '독일'
    };
    return countryMap[countryCode] || countryCode;
}

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

    // 국가명과 도시명을 정확한 한글명으로 변환
    const countryName = getCountryNameByCode(cityData.countryCode) || cityData.country;
    const cityName = getCityNameByCode(cityData.countryCode, cityData.city) || cityData.city;

    let content = `
        <div class="popup-content">
            <h3 class="font-bold text-lg mb-2">
                ${cityName}, ${countryName}
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

    // 국가명과 도시명을 정확한 한글명으로 변환
    const countryName = getCountryNameByCode(cityData.countryCode) || cityData.country;
    const cityName = getCityNameByCode(cityData.countryCode, cityData.city) || cityData.city;

    let infoContent = `
        <div class="space-y-3">
            <div class="font-semibold text-lg">
                ${cityName}, ${countryName}
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
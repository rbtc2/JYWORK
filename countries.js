/**
 * countries.js - 방문 국가 배지 컬렉션 관리
 * 방문 국가를 시각적으로 보여주는 배지 컬렉션 모달 기능을 담당
 */

// 현재 정렬 방식
let currentSortMethod = 'name';

// 국가별 방문 데이터를 분석하는 함수
function analyzeCountryData() {
    if (entries.length === 0) {
        return [];
    }

    const countryData = {};
    
    entries.forEach((entry, index) => {
        const country = entry.country;
        const countryCode = entry.countryCode;
        const startDate = new Date(entry.startDate);
        const endDate = new Date(entry.endDate);
        const stayDays = calculateDays(entry.startDate, entry.endDate);
        
        if (!countryData[country]) {
            countryData[country] = {
                name: country,
                code: countryCode,
                visitCount: 0,
                totalStayDays: 0,
                firstVisit: null,
                lastVisit: null,
                visits: [],
                cities: new Set(),
                purposes: new Set()
            };
        }
        
        countryData[country].visitCount++;
        countryData[country].totalStayDays += stayDays;
        countryData[country].cities.add(entry.city);
        countryData[country].purposes.add(entry.purpose);
        
        // 첫 방문과 마지막 방문 날짜 업데이트
        if (!countryData[country].firstVisit || startDate < countryData[country].firstVisit) {
            countryData[country].firstVisit = startDate;
        }
        if (!countryData[country].lastVisit || endDate > countryData[country].lastVisit) {
            countryData[country].lastVisit = endDate;
        }
        
        // 방문 기록 추가
        countryData[country].visits.push({
            city: entry.city,
            startDate: entry.startDate,
            endDate: entry.endDate,
            stayDays: stayDays,
            purpose: entry.purpose,
            companions: entry.companions,
            memo: entry.memo,
            visitOrder: index + 1
        });
    });
    
    return Object.values(countryData);
}

// 국가 데이터를 정렬하는 함수
function sortCountryData(countryData, sortMethod) {
    const sortedData = [...countryData];
    
    switch (sortMethod) {
        case 'name':
            sortedData.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
            break;
        case 'visit-order':
            sortedData.sort((a, b) => {
                const aFirstVisit = a.visits[0]?.visitOrder || 0;
                const bFirstVisit = b.visits[0]?.visitOrder || 0;
                return aFirstVisit - bFirstVisit;
            });
            break;
        case 'stay-days':
            sortedData.sort((a, b) => b.totalStayDays - a.totalStayDays);
            break;
        case 'visit-count':
            sortedData.sort((a, b) => b.visitCount - a.visitCount);
            break;
    }
    
    return sortedData;
}

// 통계를 업데이트하는 함수
function updateCountriesStats(countryData) {
    const totalCountries = countryData.length;
    const totalVisits = countryData.reduce((sum, country) => sum + country.visitCount, 0);
    const totalStayDays = countryData.reduce((sum, country) => sum + country.totalStayDays, 0);
    const avgStayDays = totalCountries > 0 ? Math.round(totalStayDays / totalVisits) : 0;
    
    document.getElementById('total-visited-countries').textContent = totalCountries;
    document.getElementById('total-visit-count').textContent = totalVisits;
    document.getElementById('total-stay-days').textContent = totalStayDays;
    document.getElementById('avg-stay-days').textContent = avgStayDays;
}

// 국가 배지 카드를 생성하는 함수
function createCountryBadge(country) {
    const avgStayDays = Math.round(country.totalStayDays / country.visitCount);
    const citiesList = Array.from(country.cities).join(', ');
    const purposesList = Array.from(country.purposes).map(purpose => {
        const purposeLabels = {
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
        return purposeLabels[purpose] || purpose;
    }).join(', ');
    
    const firstVisitDate = country.firstVisit ? country.firstVisit.toLocaleDateString('ko-KR') : '';
    const lastVisitDate = country.lastVisit ? country.lastVisit.toLocaleDateString('ko-KR') : '';
    
    return `
        <div class="country-badge bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div class="text-center mb-3">
                <div class="text-4xl mb-2">🏳️</div>
                <h3 class="text-lg font-bold text-gray-800 mb-1">${country.name}</h3>
                <div class="text-sm text-gray-600">${country.code}</div>
            </div>
            
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">방문 횟수:</span>
                    <span class="font-semibold text-blue-600">${country.visitCount}회</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">총 체류일:</span>
                    <span class="font-semibold text-green-600">${country.totalStayDays}일</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">평균 체류일:</span>
                    <span class="font-semibold text-purple-600">${avgStayDays}일</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">방문 도시:</span>
                    <span class="font-semibold text-orange-600">${country.cities.size}개</span>
                </div>
            </div>
            
            <div class="mt-3 pt-3 border-t border-gray-200">
                <div class="text-xs text-gray-500 mb-1">
                    <strong>방문 도시:</strong> ${citiesList}
                </div>
                <div class="text-xs text-gray-500 mb-1">
                    <strong>방문 목적:</strong> ${purposesList}
                </div>
                <div class="text-xs text-gray-500">
                    <strong>첫 방문:</strong> ${firstVisitDate}
                </div>
                <div class="text-xs text-gray-500">
                    <strong>최근 방문:</strong> ${lastVisitDate}
                </div>
            </div>
            
            <!-- Unlocked 애니메이션 효과 -->
            <div class="mt-3 flex justify-center">
                <div class="unlocked-badge bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    🔓 Unlocked
                </div>
            </div>
        </div>
    `;
}

// 국가 배지 컬렉션을 렌더링하는 함수
function renderCountriesCollection() {
    const countryData = analyzeCountryData();
    const sortedData = sortCountryData(countryData, currentSortMethod);
    const collectionContainer = document.getElementById('countries-collection');
    const emptyMessage = document.getElementById('countries-empty');
    
    updateCountriesStats(countryData);
    
    if (sortedData.length === 0) {
        collectionContainer.innerHTML = '';
        emptyMessage.classList.remove('hidden');
        return;
    }
    
    emptyMessage.classList.add('hidden');
    
    const badgesHTML = sortedData.map(country => createCountryBadge(country)).join('');
    collectionContainer.innerHTML = badgesHTML;
}

// 정렬 버튼 이벤트 핸들러
function initializeSortButtons() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    sortButtons.forEach(button => {
        globalEventManager.addEventListener(button, 'click', () => {
            // 모든 버튼에서 active 클래스 제거
            sortButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            // 클릭된 버튼에 active 클래스 추가
            button.classList.add('active', 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
            
            // 정렬 방식 업데이트
            const sortMethod = button.id.replace('sort-', '');
            currentSortMethod = sortMethod;
            
            // 컬렉션 다시 렌더링
            renderCountriesCollection();
        });
    });
}

// 모달 열기 함수
function openCountriesModal() {
    const modal = document.getElementById('countries-modal-overlay');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderCountriesCollection();
}

// 모달 닫기 함수
function closeCountriesModal() {
    const modal = document.getElementById('countries-modal-overlay');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// 모달 이벤트 초기화
function initializeCountriesModal() {
    // 방문 국가 카드 클릭 이벤트
    const countriesCard = document.getElementById('countries-card');
    if (countriesCard) {
        globalEventManager.addEventListener(countriesCard, 'click', openCountriesModal);
    }
    
    // 모달 닫기 버튼 이벤트
    const closeButton = document.getElementById('close-countries-modal');
    if (closeButton) {
        globalEventManager.addEventListener(closeButton, 'click', closeCountriesModal);
    }
    
    // 모달 외부 클릭 시 닫기
    const modalOverlay = document.getElementById('countries-modal-overlay');
    if (modalOverlay) {
        globalEventManager.addEventListener(modalOverlay, 'click', (e) => {
            if (e.target === modalOverlay) {
                closeCountriesModal();
            }
        });
    }
    
    // ESC 키 이벤트 - 전역에서 관리
    globalEventManager.addEventListener(
        document,
        'keydown',
        (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('countries-modal-overlay');
                if (modal && !modal.classList.contains('hidden')) {
                    closeCountriesModal();
                }
            }
        }
    );
    
    // 정렬 버튼 초기화
    initializeSortButtons();
}

// 모듈 초기화
function initializeCountriesModule() {
    initializeCountriesModal();
}

// 전역 함수로 export (다른 모듈에서 사용할 수 있도록)
window.initializeCountriesModule = initializeCountriesModule;
window.renderCountriesCollection = renderCountriesCollection; 
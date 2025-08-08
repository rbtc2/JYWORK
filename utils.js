/**
 * utils.js - 자동완성 및 유틸리티 함수들
 * 국가/도시 자동완성, 필터링, 드롭다운 렌더링 등을 담당
 */

// 도시 검색 세션 캐시
const citySearchCache = new Map();
const API_RATE_LIMIT = 1000; // 1초당 1회 요청
let lastApiCall = 0;

// 디바운싱 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 국가 필터링 함수 (성능 최적화)
function filterCountries(query) {
    if (!query || query.length < 2) return countries.slice(0, 15); // 최소 2글자, 최대 15개
    
    const lowerQuery = query.toLowerCase();
    const results = countries.filter(country => 
        country.label.toLowerCase().includes(lowerQuery) ||
        country.enLabel.toLowerCase().includes(lowerQuery) ||
        country.code.toLowerCase().includes(lowerQuery) ||
        country.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
    );
    
    return results.slice(0, 15); // 최대 15개 결과만 반환
}

// 도시 필터링 함수 (성능 최적화) - 정적 데이터 우선
function filterCities(query, countryCode) {
    if (!countryCode) return [];
    if (!query || query.length < 2) return (cities[countryCode] || []).slice(0, 10); // 최소 2글자, 최대 10개
    
    const lowerQuery = query.toLowerCase();
    const staticCities = cities[countryCode] || [];
    const results = staticCities.filter(city => 
        city.name.toLowerCase().includes(lowerQuery) ||
        city.enName.toLowerCase().includes(lowerQuery) ||
        city.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
    );
    
    return results.slice(0, 10); // 최대 10개 결과만 반환
}

// 실시간 도시 검색 함수 (Nominatim API 사용)
async function searchCitiesOnline(query, countryCode) {
    if (!query || query.length < 3) return []; // 최소 3글자
    if (!countryCode) return [];
    
    // 캐시 키 생성
    const cacheKey = `${countryCode}:${query.toLowerCase()}`;
    
    // 캐시된 결과가 있으면 반환
    if (citySearchCache.has(cacheKey)) {
        return citySearchCache.get(cacheKey);
    }
    
    // API 호출 제한 확인
    const now = Date.now();
    if (now - lastApiCall < API_RATE_LIMIT) {
        console.log('API 호출 제한 대기 중...');
        return [];
    }
    
    try {
        lastApiCall = now;
        
        // Nominatim API 호출
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=${countryCode}&format=json&limit=5&featureType=city`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TravelApp/1.0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
        }
        
        const data = await response.json();
        
        // API 응답을 기존 도시 데이터 구조에 맞게 변환
        const onlineCities = data
            .filter(item => item.type === 'city' || item.type === 'administrative')
            .map(item => ({
                name: item.display_name.split(',')[0], // 첫 번째 부분을 도시명으로 사용
                enName: item.name,
                aliases: [item.name, item.display_name.split(',')[0]]
            }))
            .slice(0, 5); // 최대 5개 결과
        
        // 캐시에 저장
        citySearchCache.set(cacheKey, onlineCities);
        
        return onlineCities;
        
    } catch (error) {
        console.error('온라인 도시 검색 실패:', error);
        return [];
    }
}

// 하이브리드 도시 검색 함수 (정적 데이터 + 온라인 검색)
async function searchCitiesHybrid(query, countryCode) {
    if (!countryCode) return [];
    
    // 1. 정적 데이터에서 먼저 검색
    const staticResults = filterCities(query, countryCode);
    
    // 2. 정적 결과가 3개 미만이면 온라인 검색 추가
    if (staticResults.length < 3 && query.length >= 3) {
        try {
            const onlineResults = await searchCitiesOnline(query, countryCode);
            
            // 중복 제거하여 합치기
            const combinedResults = [...staticResults];
            const staticNames = new Set(staticResults.map(city => city.name.toLowerCase()));
            
            onlineResults.forEach(onlineCity => {
                if (!staticNames.has(onlineCity.name.toLowerCase())) {
                    combinedResults.push(onlineCity);
                }
            });
            
            return combinedResults.slice(0, 10); // 최대 10개
        } catch (error) {
            console.error('하이브리드 검색 실패:', error);
            return staticResults;
        }
    }
    
    return staticResults;
}

// 로딩 인디케이터 표시 함수
function showCityLoadingIndicator(show = true) {
    const cityDropdown = document.getElementById('city-dropdown');
    const loadingHtml = '<li class="px-3 py-2 text-gray-500 text-sm flex items-center"><svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>도시 검색 중...</li>';
    
    if (show) {
        cityDropdown.innerHTML = loadingHtml;
        cityDropdown.classList.remove('hidden');
    }
}

// 국가 드롭다운 렌더링
function renderCountryDropdown(filteredCountries) {
    const countryDropdown = document.getElementById('country-dropdown');
    if (filteredCountries.length === 0) {
        countryDropdown.innerHTML = '<li class="px-3 py-2 text-gray-500 text-sm">일치하는 국가가 없습니다.</li>';
        countryDropdown.classList.remove('hidden');
        return;
    }
    
    countryDropdown.innerHTML = filteredCountries.map(country => `
        <li class="country-option px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm" 
            data-code="${country.code}" 
            data-label="${country.label}">
            <span class="font-medium">${country.label}</span>
            <span class="text-gray-500 ml-2">(${country.code})</span>
        </li>
    `).join('');
    
    countryDropdown.classList.remove('hidden');
}

// 도시 드롭다운 렌더링 (하이브리드 결과 지원)
function renderCityDropdown(filteredCities) {
    const cityDropdown = document.getElementById('city-dropdown');
    if (filteredCities.length === 0) {
        cityDropdown.innerHTML = '<li class="px-3 py-2 text-gray-500 text-sm">일치하는 도시가 없습니다.</li>';
        cityDropdown.classList.remove('hidden');
        return;
    }
    
    cityDropdown.innerHTML = filteredCities.map(city => `
        <li class="city-option px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm" 
            data-name="${city.name}" 
            data-en-name="${city.enName}">
            <span class="font-medium">${city.name}</span>
            <span class="text-gray-500 ml-2">(${city.enName})</span>
        </li>
    `).join('');
    
    cityDropdown.classList.remove('hidden');
}

// 국가 선택 처리
function selectCountry(code, label) {
    const countryInput = document.getElementById('country-input');
    const countryCode = document.getElementById('country-code');
    const countryLabel = document.getElementById('country-label');
    const countryDropdown = document.getElementById('country-dropdown');
    
    countryInput.value = label;
    countryCode.value = code;
    countryLabel.value = label;
    countryDropdown.classList.add('hidden');
    
    // 도시 입력 필드 활성화 및 초기화
    const cityInput = document.getElementById('city-input');
    const cityName = document.getElementById('city-name');
    cityInput.disabled = false;
    cityInput.value = '';
    cityName.value = '';
    cityInput.placeholder = '도시명을 입력하거나 선택하세요';
}

// 국가 입력값 자동 매칭
function autoSelectCountry(inputValue) {
    const filteredCountries = filterCountries(inputValue);
    if (filteredCountries.length === 1) {
        const country = filteredCountries[0];
        selectCountry(country.code, country.label);
        return true;
    }
    return false;
}

// 도시 선택 처리
function selectCity(name, enName) {
    const cityInput = document.getElementById('city-input');
    const cityName = document.getElementById('city-name');
    const cityDropdown = document.getElementById('city-dropdown');
    
    cityInput.value = name;
    cityName.value = name;
    cityDropdown.classList.add('hidden');
}

// 도시 입력값 자동 매칭
function autoSelectCity(inputValue, countryCode) {
    const filteredCities = filterCities(inputValue, countryCode);
    if (filteredCities.length === 1) {
        const city = filteredCities[0];
        selectCity(city.name, city.enName);
        return true;
    }
    return false;
}

// 거주지 국가 드롭다운 렌더링
function renderResidenceCountryDropdown(filteredCountries) {
    const residenceCountryDropdown = document.getElementById('residence-country-dropdown');
    if (filteredCountries.length === 0) {
        residenceCountryDropdown.innerHTML = '<li class="px-3 py-2 text-gray-500 text-sm">일치하는 국가가 없습니다.</li>';
        residenceCountryDropdown.classList.remove('hidden');
        return;
    }
    
    residenceCountryDropdown.innerHTML = filteredCountries.map(country => `
        <li class="residence-country-option px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm" 
            data-code="${country.code}" 
            data-label="${country.label}">
            <span class="font-medium">${country.label}</span>
            <span class="text-gray-500 ml-2">(${country.code})</span>
        </li>
    `).join('');
    
    residenceCountryDropdown.classList.remove('hidden');
}

// 거주지 도시 드롭다운 렌더링
function renderResidenceCityDropdown(filteredCities) {
    const residenceCityDropdown = document.getElementById('residence-city-dropdown');
    if (filteredCities.length === 0) {
        residenceCityDropdown.innerHTML = '<li class="px-3 py-2 text-gray-500 text-sm">일치하는 도시가 없습니다.</li>';
        residenceCityDropdown.classList.remove('hidden');
        return;
    }
    
    residenceCityDropdown.innerHTML = filteredCities.map(city => `
        <li class="residence-city-option px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm" 
            data-name="${city.name}" 
            data-en-name="${city.enName}">
            <span class="font-medium">${city.name}</span>
            <span class="text-gray-500 ml-2">(${city.enName})</span>
        </li>
    `).join('');
    
    residenceCityDropdown.classList.remove('hidden');
}

// 거주지 국가 선택 처리
function selectResidenceCountry(code, label) {
    const residenceCountryInput = document.getElementById('residence-country');
    const residenceCountryCode = document.getElementById('residence-country-code');
    const residenceCountryLabel = document.getElementById('residence-country-label');
    const residenceCountryDropdown = document.getElementById('residence-country-dropdown');
    
    residenceCountryInput.value = label;
    residenceCountryCode.value = code;
    residenceCountryLabel.value = label;
    residenceCountryDropdown.classList.add('hidden');
    
    // 도시 입력 필드 활성화 및 초기화
    const residenceCityInput = document.getElementById('residence-city');
    const residenceCityName = document.getElementById('residence-city-name');
    residenceCityInput.disabled = false;
    residenceCityInput.value = '';
    residenceCityName.value = '';
    residenceCityInput.placeholder = '도시명을 입력하거나 선택하세요';
}

// 거주지 국가 입력값 자동 매칭
function autoSelectResidenceCountry(inputValue) {
    const filteredCountries = filterCountries(inputValue);
    if (filteredCountries.length === 1) {
        const country = filteredCountries[0];
        selectResidenceCountry(country.code, country.label);
        return true;
    }
    return false;
}

// 거주지 도시 선택 처리
function selectResidenceCity(name, enName) {
    const residenceCityInput = document.getElementById('residence-city');
    const residenceCityName = document.getElementById('residence-city-name');
    const residenceCityDropdown = document.getElementById('residence-city-dropdown');
    
    residenceCityInput.value = name;
    residenceCityName.value = name;
    residenceCityDropdown.classList.add('hidden');
}

// 거주지 도시 입력값 자동 매칭
function autoSelectResidenceCity(inputValue, countryCode) {
    const filteredCities = filterCities(inputValue, countryCode);
    if (filteredCities.length === 1) {
        const city = filteredCities[0];
        selectResidenceCity(city.name, city.enName);
        return true;
    }
    return false;
}

// 자동완성 이벤트 리스너 초기화
function initializeAutocompleteEventListeners() {
    // 국가 자동완성 이벤트 리스너들
    const countryInput = document.getElementById('country-input');
    const countryDropdown = document.getElementById('country-dropdown');
    
    // 디바운싱된 국가 필터링 함수
    const debouncedCountryFilter = debounce(function(query) {
        const filteredCountries = filterCountries(query);
        renderCountryDropdown(filteredCountries);
    }, 300);

    countryInput.addEventListener('input', function() {
        const query = this.value;
        debouncedCountryFilter(query);
    });
    
    countryInput.addEventListener('focus', function() {
        if (this.value) {
            const filteredCountries = filterCountries(this.value);
            renderCountryDropdown(filteredCountries);
        } else {
            renderCountryDropdown(countries);
        }
    });
    
    countryInput.addEventListener('blur', function() {
        setTimeout(() => {
            countryDropdown.classList.add('hidden');
            
            if (!document.getElementById('country-code').value && this.value.trim()) {
                autoSelectCountry(this.value.trim());
            }
        }, 200);
    });
    
    countryInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!document.getElementById('country-code').value && this.value.trim()) {
                autoSelectCountry(this.value.trim());
            }
        }
    });
    
    // 국가 옵션 클릭 이벤트 (이벤트 위임 사용)
    countryDropdown.addEventListener('click', function(e) {
        if (e.target.closest('.country-option')) {
            const option = e.target.closest('.country-option');
            const code = option.dataset.code;
            const label = option.dataset.label;
            selectCountry(code, label);
        }
    });
    
    // 도시 자동완성 이벤트 리스너들
    const cityInput = document.getElementById('city-input');
    const cityDropdown = document.getElementById('city-dropdown');
    
    // 디바운싱된 하이브리드 도시 검색 함수
    const debouncedCitySearch = debounce(async function(query, countryCode) {
        if (query.length >= 3) {
            showCityLoadingIndicator(true);
            const filteredCities = await searchCitiesHybrid(query, countryCode);
            showCityLoadingIndicator(false);
            renderCityDropdown(filteredCities);
        } else {
            const filteredCities = filterCities(query, countryCode);
            renderCityDropdown(filteredCities);
        }
    }, 500); // 500ms 디바운싱

    cityInput.addEventListener('input', function() {
        const query = this.value;
        const selectedCountryCode = document.getElementById('country-code').value;
        debouncedCitySearch(query, selectedCountryCode);
    });
    
    cityInput.addEventListener('focus', function() {
        const selectedCountryCode = document.getElementById('country-code').value;
        if (!selectedCountryCode) {
            cityInput.placeholder = '먼저 국가를 선택해주세요';
            return;
        }
        
        if (this.value) {
            const filteredCities = filterCities(this.value, selectedCountryCode);
            renderCityDropdown(filteredCities);
        } else {
            renderCityDropdown(cities[selectedCountryCode] || []);
        }
    });
    
    cityInput.addEventListener('blur', function() {
        setTimeout(() => {
            cityDropdown.classList.add('hidden');
            
            const selectedCountryCode = document.getElementById('country-code').value;
            if (!document.getElementById('city-name').value && this.value.trim() && selectedCountryCode) {
                autoSelectCity(this.value.trim(), selectedCountryCode);
            }
        }, 200);
    });
    
    cityInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const selectedCountryCode = document.getElementById('country-code').value;
            if (!document.getElementById('city-name').value && this.value.trim() && selectedCountryCode) {
                autoSelectCity(this.value.trim(), selectedCountryCode);
            }
        }
    });
    
    // 도시 옵션 클릭 이벤트 (이벤트 위임 사용)
    cityDropdown.addEventListener('click', function(e) {
        if (e.target.closest('.city-option')) {
            const option = e.target.closest('.city-option');
            const name = option.dataset.name;
            const enName = option.dataset.enName;
            selectCity(name, enName);
        }
    });
    
    // 거주지 설정 관련 요소들
    const residenceCountryInput = document.getElementById('residence-country');
    const residenceCountryDropdown = document.getElementById('residence-country-dropdown');
    const residenceCityInput = document.getElementById('residence-city');
    const residenceCityDropdown = document.getElementById('residence-city-dropdown');
    
    // 거주지 국가 자동완성 이벤트 리스너들
    // 디바운싱된 거주지 국가 필터링 함수
    const debouncedResidenceCountryFilter = debounce(function(query) {
        const filteredCountries = filterCountries(query);
        renderResidenceCountryDropdown(filteredCountries);
    }, 300);

    residenceCountryInput.addEventListener('input', function() {
        const query = this.value;
        debouncedResidenceCountryFilter(query);
    });
    
    residenceCountryInput.addEventListener('focus', function() {
        if (this.value) {
            const filteredCountries = filterCountries(this.value);
            renderResidenceCountryDropdown(filteredCountries);
        } else {
            renderResidenceCountryDropdown(countries);
        }
    });
    
    residenceCountryInput.addEventListener('blur', function() {
        setTimeout(() => {
            residenceCountryDropdown.classList.add('hidden');
            
            if (!document.getElementById('residence-country-code').value && this.value.trim()) {
                autoSelectResidenceCountry(this.value.trim());
            }
        }, 200);
    });
    
    residenceCountryInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!document.getElementById('residence-country-code').value && this.value.trim()) {
                autoSelectResidenceCountry(this.value.trim());
            }
        }
    });
    
    // 거주지 국가 옵션 클릭 이벤트
    residenceCountryDropdown.addEventListener('click', function(e) {
        if (e.target.closest('.residence-country-option')) {
            const option = e.target.closest('.residence-country-option');
            const code = option.dataset.code;
            const label = option.dataset.label;
            selectResidenceCountry(code, label);
        }
    });
    
    // 거주지 도시 자동완성 이벤트 리스너들
    // 디바운싱된 하이브리드 거주지 도시 검색 함수
    const debouncedResidenceCitySearch = debounce(async function(query, countryCode) {
        if (query.length >= 3) {
            showCityLoadingIndicator(true);
            const filteredCities = await searchCitiesHybrid(query, countryCode);
            showCityLoadingIndicator(false);
            renderResidenceCityDropdown(filteredCities);
        } else {
            const filteredCities = filterCities(query, countryCode);
            renderResidenceCityDropdown(filteredCities);
        }
    }, 500); // 500ms 디바운싱

    residenceCityInput.addEventListener('input', function() {
        const query = this.value;
        const selectedCountryCode = document.getElementById('residence-country-code').value;
        debouncedResidenceCitySearch(query, selectedCountryCode);
    });
    
    residenceCityInput.addEventListener('focus', function() {
        const selectedCountryCode = document.getElementById('residence-country-code').value;
        if (!selectedCountryCode) {
            residenceCityInput.placeholder = '먼저 국가를 선택해주세요';
            return;
        }
        
        if (this.value) {
            const filteredCities = filterCities(this.value, selectedCountryCode);
            renderResidenceCityDropdown(filteredCities);
        } else {
            renderResidenceCityDropdown(cities[selectedCountryCode] || []);
        }
    });
    
    residenceCityInput.addEventListener('blur', function() {
        setTimeout(() => {
            residenceCityDropdown.classList.add('hidden');
            
            const selectedCountryCode = document.getElementById('residence-country-code').value;
            if (!document.getElementById('residence-city-name').value && this.value.trim() && selectedCountryCode) {
                autoSelectResidenceCity(this.value.trim(), selectedCountryCode);
            }
        }, 200);
    });
    
    residenceCityInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const selectedCountryCode = document.getElementById('residence-country-code').value;
            if (!document.getElementById('residence-city-name').value && this.value.trim() && selectedCountryCode) {
                autoSelectResidenceCity(this.value.trim(), selectedCountryCode);
            }
        }
    });
    
    // 거주지 도시 옵션 클릭 이벤트
    residenceCityDropdown.addEventListener('click', function(e) {
        if (e.target.closest('.residence-city-option')) {
            const option = e.target.closest('.residence-city-option');
            const name = option.dataset.name;
            const enName = option.dataset.enName;
            selectResidenceCity(name, enName);
        }
    });
} 

/**
 * 보안 유틸리티 함수들 - XSS 방지 및 사용자 입력 정제
 */

/**
 * HTML 이스케이핑 함수 - 기본 XSS 방지
 */
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * 사용자 입력 정제 함수 - 향후 확장성 고려
 */
function sanitizeUserInput(input, options = {}) {
    if (typeof input !== 'string') return '';
    
    let sanitized = input.trim();
    
    // 기본 HTML 이스케이핑
    sanitized = escapeHTML(sanitized);
    
    // 옵션별 추가 처리
    if (options.maxLength) {
        sanitized = sanitized.substring(0, options.maxLength);
    }
    
    if (options.allowedTags && options.allowedTags.length > 0) {
        // 향후 허용된 태그만 남기는 로직 (DOMPurify 등 라이브러리 고려)
        // 현재는 모든 HTML 태그 제거
    }
    
    return sanitized;
}

/**
 * 동행자 입력 처리 함수 - 향후 사용자 ID 연동 대비
 */
function sanitizeCompanions(companionsString) {
    if (!companionsString) return '';
    
    // 현재: 단순 텍스트 정제
    let sanitized = sanitizeUserInput(companionsString, { maxLength: 200 });
    
    // 향후 확장 대비: 사용자 ID 패턴 감지 및 처리 준비
    // 예: @username 형태나 ID:숫자 형태 감지
    // const userIdPattern = /@[\w\d]+|ID:\d+/g;
    // 현재는 일반 텍스트로만 처리
    
    return sanitized;
}

/**
 * 메모 입력 처리 함수
 */
function sanitizeMemo(memoString) {
    if (!memoString) return '';
    
    return sanitizeUserInput(memoString, { 
        maxLength: 1000  // 메모 최대 길이 제한
    });
}

/**
 * 폼 검증 함수 - 클라이언트 측 검증 강화
 */
function validateTravelForm(formData) {
    const errors = [];
    
    // 메모 길이 체크
    if (formData.memo && formData.memo.length > 1000) {
        errors.push('메모는 1000자를 초과할 수 없습니다.');
    }
    
    // 동행자 길이 체크 (기존 string과 새 객체 구조 모두 지원)
    if (formData.companions && typeof formData.companions === 'string' && formData.companions.length > 200) {
        errors.push('동행자 정보는 200자를 초과할 수 없습니다.');
    }
    
    return { isValid: errors.length === 0, errors };
}

/**
 * 향후 동행자 기능 확장을 위한 데이터 구조 설계
 */
const companionDataStructure = {
    // 현재: 단순 문자열
    companions: "김철수, 이영희",
    
    // 향후: 객체 배열로 확장 예정
    companionsList: [
        { type: 'text', value: '김철수' },
        { type: 'user_id', value: 'user123', displayName: '이영희' },
        { type: 'email', value: 'friend@example.com', displayName: '박민수' }
    ]
};

/**
 * 이벤트 리스너 중앙 관리 클래스
 * 메모리 누수 방지 및 이벤트 생명주기 관리
 */
class EventManager {
    constructor() {
        this.listeners = new Map();
        this.timers = new Map();
        this.abortController = new AbortController();
    }

    /**
     * 이벤트 리스너 등록 (자동 정리 지원)
     */
    addEventListener(element, event, handler, options = {}) {
        const elementId = element.id || `anonymous-${Date.now()}-${Math.random()}`;
        const key = `${elementId}-${event}`;
        
        // 기존 리스너가 있으면 제거
        this.removeEventListener(key);
        
        // AbortController를 사용한 자동 정리 지원
        const finalOptions = {
            ...options,
            signal: this.abortController.signal
        };
        
        element.addEventListener(event, handler, finalOptions);
        
        // 리스너 정보 저장
        this.listeners.set(key, {
            element,
            event,
            handler,
            options: finalOptions
        });
        
        return key; // 수동 제거를 위한 키 반환
    }

    /**
     * 특정 이벤트 리스너 제거
     */
    removeEventListener(key) {
        if (this.listeners.has(key)) {
            const { element, event, handler } = this.listeners.get(key);
            element.removeEventListener(event, handler);
            this.listeners.delete(key);
        }
    }

    /**
     * 타이머 관리 (메모리 누수 방지)
     */
    setTimeout(callback, delay, timerName = null) {
        const key = timerName || `timer-${Date.now()}-${Math.random()}`;
        
        // 기존 타이머가 있으면 제거
        this.clearTimeout(key);
        
        const timerId = setTimeout(() => {
            callback();
            this.timers.delete(key); // 완료된 타이머 정리
        }, delay);
        
        this.timers.set(key, timerId);
        return key;
    }

    /**
     * 특정 타이머 제거
     */
    clearTimeout(key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
    }

    /**
     * 일회성 이벤트 리스너 등록
     */
    addEventListenerOnce(element, event, handler, options = {}) {
        const onceHandler = (e) => {
            handler(e);
            // 자동으로 리스너 제거는 브라우저가 처리
        };
        
        return this.addEventListener(element, event, onceHandler, {
            ...options,
            once: true
        });
    }

    /**
     * 모든 이벤트 리스너 및 타이머 정리
     */
    cleanup() {
        // 모든 타이머 정리
        this.timers.forEach((timerId, key) => {
            clearTimeout(timerId);
        });
        this.timers.clear();
        
        // AbortController로 모든 이벤트 리스너 일괄 정리
        this.abortController.abort();
        this.listeners.clear();
        
        // 새로운 AbortController 생성
        this.abortController = new AbortController();
    }

    /**
     * 현재 등록된 리스너 수 반환 (디버깅용)
     */
    getActiveListenersCount() {
        return this.listeners.size;
    }

    /**
     * 현재 활성 타이머 수 반환 (디버깅용)
     */
    getActiveTimersCount() {
        return this.timers.size;
    }
}

// 전역 이벤트 관리자 인스턴스
window.globalEventManager = new EventManager();

/**
 * 개발 환경용 메모리 사용량 체크 함수
 */
function checkMemoryUsage() {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        console.log({
            used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
            total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
            limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
            activeListeners: globalEventManager.getActiveListenersCount(),
            activeTimers: globalEventManager.getActiveTimersCount()
        });
    }
}

// 전역으로 노출 (개발 환경에서만)
if (typeof window !== 'undefined') {
    window.checkMemoryUsage = checkMemoryUsage;
}

/**
 * 자동 정리 장치 - 일정 시간마다 불필요한 리스너 정리
 */
function initializeAutoCleanup() {
    globalEventManager.addEventListener(
        window,
        'load',
        () => {
            setInterval(() => {
                // DOM에서 제거된 요소들의 이벤트 리스너 정리
                const listenersToRemove = [];
                
                globalEventManager.listeners.forEach((listener, key) => {
                    // window 객체나 다른 non-Element 노드들은 제외하고 실제 DOM Element만 체크
                    if (listener.element && listener.element.nodeType === Node.ELEMENT_NODE && !document.contains(listener.element)) {
                        listenersToRemove.push(key);
                    }
                });
                
                listenersToRemove.forEach(key => {
                    globalEventManager.removeEventListener(key);
                });
                
                if (listenersToRemove.length > 0) {
                    console.log(`Cleaned up ${listenersToRemove.length} orphaned listeners`);
                }
            }, 30000); // 30초마다 정리
        }
    );
}

// 자동 정리 장치 초기화
initializeAutoCleanup(); 

/**
 * 에러 처리 시스템 - 앱 안정성 강화
 */

/**
 * 에러 타입 정의
 */
const ErrorTypes = {
    STORAGE: 'storage',
    DOM: 'dom',
    NETWORK: 'network',
    JSON: 'json',
    VALIDATION: 'validation',
    UNKNOWN: 'unknown'
};

/**
 * 에러 심각도 정의
 */
const ErrorSeverity = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

/**
 * 중앙 에러 처리 클래스
 */
class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.notificationTimeout = 5000;
        this.isNotificationVisible = false;
    }

    /**
     * 에러 로깅 및 처리
     */
    handleError(error, context = {}, severity = ErrorSeverity.MEDIUM) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            message: error.message || 'Unknown error',
            stack: error.stack,
            type: this.getErrorType(error),
            severity,
            context: this.sanitizeContext(context),
            userAgent: navigator.userAgent
        };

        // 에러 로그에 추가
        this.addToLog(errorInfo);

        // 콘솔에 로깅 (개발 환경)
        if (this.isDevelopment()) {
            console.error('Error occurred:', errorInfo);
        }

        // 사용자에게 알림 (중요한 에러만)
        if (severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL) {
            this.showUserNotification(errorInfo);
        }

        return errorInfo;
    }

    /**
     * 에러 타입 판별
     */
    getErrorType(error) {
        if (error.name === 'QuotaExceededError' || error.message.includes('QuotaExceeded')) {
            return ErrorTypes.STORAGE;
        }
        if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
            return ErrorTypes.JSON;
        }
        if (error.name === 'TypeError' && error.message.includes('DOM')) {
            return ErrorTypes.DOM;
        }
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            return ErrorTypes.NETWORK;
        }
        return ErrorTypes.UNKNOWN;
    }

    /**
     * 컨텍스트 정보 정제 (개인정보 보호)
     */
    sanitizeContext(context) {
        const sanitized = {};
        for (const [key, value] of Object.entries(context)) {
            if (typeof value === 'string' && value.length > 50) {
                sanitized[key] = value.substring(0, 50) + '...';
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = '[Object]';
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }

    /**
     * 에러 로그에 추가
     */
    addToLog(errorInfo) {
        this.errorLog.push(errorInfo);
        
        // 로그 크기 제한
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(-this.maxLogSize);
        }
    }

    /**
     * 사용자 알림 표시
     */
    showUserNotification(errorInfo) {
        if (this.isNotificationVisible) return;

        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <div class="font-semibold">오류가 발생했습니다</div>
                    <div class="text-sm opacity-90">${this.getUserFriendlyMessage(errorInfo)}</div>
                </div>
                <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);
        this.isNotificationVisible = true;

        // 자동 제거
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
                this.isNotificationVisible = false;
            }
        }, this.notificationTimeout);
    }

    /**
     * 사용자 친화적 에러 메시지 생성
     */
    getUserFriendlyMessage(errorInfo) {
        switch (errorInfo.type) {
            case ErrorTypes.STORAGE:
                return '저장 공간이 부족합니다. 브라우저 설정을 확인해주세요.';
            case ErrorTypes.JSON:
                return '데이터 형식에 문제가 있습니다. 페이지를 새로고침해주세요.';
            case ErrorTypes.DOM:
                return '페이지 요소를 찾을 수 없습니다. 페이지를 새로고침해주세요.';
            case ErrorTypes.NETWORK:
                return '네트워크 연결을 확인해주세요.';
            default:
                return '예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.';
        }
    }

    /**
     * 개발 환경 확인
     */
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('dev');
    }

    /**
     * 에러 로그 조회
     */
    getErrorLog() {
        return [...this.errorLog];
    }

    /**
     * 에러 로그 초기화
     */
    clearErrorLog() {
        this.errorLog = [];
    }
}

// 전역 에러 핸들러 인스턴스
window.errorHandler = new ErrorHandler();

/**
 * 안전한 localStorage 래퍼 함수들
 */
const SafeStorage = {
    /**
     * 안전한 localStorage.getItem
     */
    getItem(key, defaultValue = null) {
        try {
            if (!this.isStorageAvailable()) {
                throw new Error('localStorage is not available');
            }
            const value = localStorage.getItem(key);
            return value !== null ? value : defaultValue;
        } catch (error) {
            errorHandler.handleError(error, { key }, ErrorSeverity.MEDIUM);
            return defaultValue;
        }
    },

    /**
     * 안전한 localStorage.setItem
     */
    setItem(key, value) {
        try {
            if (!this.isStorageAvailable()) {
                throw new Error('localStorage is not available');
            }
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            errorHandler.handleError(error, { key, valueLength: String(value).length }, ErrorSeverity.HIGH);
            return false;
        }
    },

    /**
     * 안전한 localStorage.removeItem
     */
    removeItem(key) {
        try {
            if (!this.isStorageAvailable()) {
                throw new Error('localStorage is not available');
            }
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            errorHandler.handleError(error, { key }, ErrorSeverity.MEDIUM);
            return false;
        }
    },

    /**
     * localStorage 사용 가능 여부 확인
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * 저장 공간 사용량 확인
     */
    getStorageUsage() {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return total;
        } catch (error) {
            errorHandler.handleError(error, {}, ErrorSeverity.LOW);
            return 0;
        }
    }
};

/**
 * 안전한 JSON 파싱/직렬화 함수들
 */
const SafeJSON = {
    /**
     * 안전한 JSON.parse
     */
    parse(str, defaultValue = null) {
        try {
            if (typeof str !== 'string') {
                throw new Error('Input is not a string');
            }
            return JSON.parse(str);
        } catch (error) {
            errorHandler.handleError(error, { 
                inputLength: str.length,
                inputPreview: str.substring(0, 100)
            }, ErrorSeverity.MEDIUM);
            return defaultValue;
        }
    },

    /**
     * 안전한 JSON.stringify
     */
    stringify(obj, defaultValue = '{}') {
        try {
            return JSON.stringify(obj);
        } catch (error) {
            errorHandler.handleError(error, { 
                objectType: typeof obj,
                objectKeys: obj ? Object.keys(obj) : []
            }, ErrorSeverity.MEDIUM);
            return defaultValue;
        }
    }
};

/**
 * 안전한 DOM 조작 함수들
 */
const SafeDOM = {
    /**
     * 안전한 요소 선택
     */
    getElement(selector, parent = document) {
        try {
            const element = parent.querySelector(selector);
            if (!element) {
                throw new Error(`Element not found: ${selector}`);
            }
            return element;
        } catch (error) {
            errorHandler.handleError(error, { selector }, ErrorSeverity.MEDIUM);
            return null;
        }
    },

    /**
     * 안전한 innerHTML 설정
     */
    setInnerHTML(element, html) {
        try {
            if (!element || typeof element.innerHTML === 'undefined') {
                throw new Error('Invalid element');
            }
            element.innerHTML = html;
            return true;
        } catch (error) {
            errorHandler.handleError(error, { 
                elementType: element ? element.tagName : 'null',
                htmlLength: html.length
            }, ErrorSeverity.MEDIUM);
            return false;
        }
    },

    /**
     * 안전한 요소 생성
     */
    createElement(tagName, attributes = {}) {
        try {
            const element = document.createElement(tagName);
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            return element;
        } catch (error) {
            errorHandler.handleError(error, { tagName, attributes }, ErrorSeverity.MEDIUM);
            return null;
        }
    },

    /**
     * 안전한 요소 추가
     */
    appendChild(parent, child) {
        try {
            if (!parent || !child) {
                throw new Error('Invalid parent or child element');
            }
            parent.appendChild(child);
            return true;
        } catch (error) {
            errorHandler.handleError(error, { 
                parentType: parent ? parent.tagName : 'null',
                childType: child ? child.tagName : 'null'
            }, ErrorSeverity.MEDIUM);
            return false;
        }
    }
};

/**
 * 안전한 함수 실행 래퍼
 */
function safeExecute(fn, context = {}, fallback = null) {
    try {
        return fn();
    } catch (error) {
        errorHandler.handleError(error, context, ErrorSeverity.MEDIUM);
        return fallback;
    }
}

/**
 * 비동기 함수 안전 실행 래퍼
 */
async function safeExecuteAsync(fn, context = {}, fallback = null) {
    try {
        return await fn();
    } catch (error) {
        errorHandler.handleError(error, context, ErrorSeverity.MEDIUM);
        return fallback;
    }
}

// 전역으로 노출
if (typeof window !== 'undefined') {
    window.SafeStorage = SafeStorage;
    window.SafeJSON = SafeJSON;
    window.SafeDOM = SafeDOM;
    window.safeExecute = safeExecute;
    window.safeExecuteAsync = safeExecuteAsync;
} 
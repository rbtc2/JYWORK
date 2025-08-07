/**
 * utils.js - 자동완성 및 유틸리티 함수들
 * 국가/도시 자동완성, 필터링, 드롭다운 렌더링 등을 담당
 */

// 국가 필터링 함수
function filterCountries(query) {
    if (!query) return countries;
    const lowerQuery = query.toLowerCase();
    return countries.filter(country => 
        country.label.toLowerCase().includes(lowerQuery) ||
        country.enLabel.toLowerCase().includes(lowerQuery) ||
        country.code.toLowerCase().includes(lowerQuery) ||
        country.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
    );
}

// 도시 필터링 함수
function filterCities(query, countryCode) {
    if (!countryCode || !cities[countryCode]) return [];
    if (!query) return cities[countryCode];
    
    const lowerQuery = query.toLowerCase();
    return cities[countryCode].filter(city => 
        city.name.toLowerCase().includes(lowerQuery) ||
        city.enName.toLowerCase().includes(lowerQuery) ||
        city.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
    );
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

// 도시 드롭다운 렌더링
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
    
    countryInput.addEventListener('input', function() {
        const query = this.value;
        const filteredCountries = filterCountries(query);
        renderCountryDropdown(filteredCountries);
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
    
    cityInput.addEventListener('input', function() {
        const query = this.value;
        const selectedCountryCode = document.getElementById('country-code').value;
        const filteredCities = filterCities(query, selectedCountryCode);
        renderCityDropdown(filteredCities);
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
    residenceCountryInput.addEventListener('input', function() {
        const query = this.value;
        const filteredCountries = filterCountries(query);
        renderResidenceCountryDropdown(filteredCountries);
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
    residenceCityInput.addEventListener('input', function() {
        const query = this.value;
        const selectedCountryCode = document.getElementById('residence-country-code').value;
        const filteredCities = filterCities(query, selectedCountryCode);
        renderResidenceCityDropdown(filteredCities);
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
    
    // 동행자 길이 체크
    if (formData.companions && formData.companions.length > 200) {
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
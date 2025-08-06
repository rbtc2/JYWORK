/**
 * settings.js - 설정 탭의 UI 구성 및 동작 처리
 * 사용자 인터페이스 관리, 로그인/로그아웃, 거주지 설정 등을 담당
 */

// 사용자 인터페이스 업데이트
function updateUserInterface() {
    const userInfo = document.getElementById('user-info');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginStatus = document.getElementById('login-status');
    const usernameElement = document.getElementById('username');
    const userInitial = document.getElementById('user-initial');

    if (currentUser.isLoggedIn) {
        // 로그인된 상태
        userInfo.classList.remove('hidden');
        userInfo.classList.add('flex');
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        loginStatus.textContent = `로그인됨 (${currentUser.username})`;
        usernameElement.textContent = currentUser.username;
        userInitial.textContent = currentUser.username.charAt(0).toUpperCase();
    } else {
        // 로그인되지 않은 상태
        userInfo.classList.add('hidden');
        userInfo.classList.remove('flex');
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        loginStatus.textContent = '로그인되지 않음';
    }
}

// 데모 로그인 함수
function demoLogin() {
    currentUser = {
        id: 'demo_user_001',
        username: '데모 사용자',
        isLoggedIn: true
    };
    
    // 사용자별 데이터 로드
    loadUserData();
    loadResidenceData();
    updateUserInterface();
    updateResidenceUI();
    updateAllSections();
    
    alert('데모 로그인이 완료되었습니다!');
}

// 로그아웃 함수
function logout() {
    if (confirm('로그아웃하시겠습니까? 현재 데이터는 로컬에 저장됩니다.')) {
        currentUser = {
            id: null,
            username: null,
            isLoggedIn: false
        };
        
        // 비로그인 사용자용 데이터 로드
        loadUserData();
        loadResidenceData();
        updateUserInterface();
        updateResidenceUI();
        updateAllSections();
        
        alert('로그아웃되었습니다.');
    }
}

// 거주지 설정 UI 업데이트
function updateResidenceUI() {
    const residenceCountryInput = document.getElementById('residence-country');
    const residenceCityInput = document.getElementById('residence-city');
    const currentResidenceElement = document.getElementById('current-residence');
    
    if (userResidence.country && userResidence.city) {
        residenceCountryInput.value = userResidence.countryLabel || userResidence.country;
        residenceCityInput.value = userResidence.cityName || userResidence.city;
        currentResidenceElement.textContent = `${userResidence.country} / ${userResidence.city}`;
    } else {
        residenceCountryInput.value = '';
        residenceCityInput.value = '';
        currentResidenceElement.textContent = '설정되지 않음';
    }
}

// 거주지 저장 함수
function saveResidence() {
    const residenceCountryInput = document.getElementById('residence-country');
    const residenceCountryCode = document.getElementById('residence-country-code');
    const residenceCountryLabel = document.getElementById('residence-country-label');
    const residenceCityInput = document.getElementById('residence-city');
    const residenceCityName = document.getElementById('residence-city-name');
    
    if (!residenceCountryCode.value || !residenceCityName.value) {
        alert('국가와 도시를 모두 선택해주세요.');
        return;
    }
    
    userResidence = {
        country: residenceCountryInput.value,
        countryCode: residenceCountryCode.value,
        countryLabel: residenceCountryLabel.value,
        city: residenceCityInput.value,
        cityName: residenceCityName.value,
        coordinates: cityCoordinates[residenceCityName.value] || null
    };
    
    saveResidenceData();
    updateResidenceUI();
    updateAllSections();
    
    alert('거주지가 성공적으로 저장되었습니다!');
}

// 설정 페이지 이벤트 리스너 초기화
function initializeSettingsEventListeners() {
    // 로그인/로그아웃 버튼 이벤트 리스너
    document.getElementById('login-btn').addEventListener('click', function() {
        // 향후 실제 로그인 시스템 연동 예정
        alert('로그인 기능은 향후 Firebase Auth 또는 Supabase Auth로 구현 예정입니다.');
    });
    
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // 설정 페이지 버튼 이벤트 리스너
    document.getElementById('demo-login-btn').addEventListener('click', demoLogin);
    document.getElementById('export-data-btn').addEventListener('click', exportData);
    document.getElementById('backup-data-btn').addEventListener('click', exportData);
    document.getElementById('reset-data-btn').addEventListener('click', resetData);
    document.getElementById('save-residence-btn').addEventListener('click', saveResidence);
    
    // 준비 중인 기능들
    document.getElementById('dark-mode-toggle').addEventListener('click', function() {
        alert('다크 모드 기능은 향후 구현 예정입니다.');
    });
    
    document.getElementById('language-toggle').addEventListener('click', function() {
        alert('언어 설정 기능은 향후 구현 예정입니다.');
    });
} 
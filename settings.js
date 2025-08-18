/**
 * settings.js - 설정 탭의 UI 구성 및 동작 처리
 * 사용자 인터페이스 관리, 로그인/로그아웃, 거주지 설정 등을 담당
 */

// 앱 설정 객체
let appSettings = {
    darkMode: false,
    pushNotifications: false,
    soundEffects: false
};

// 앱 설정 초기화
function initializeAppSettings() {
    console.log('🔧 앱 설정 초기화 시작...');
    
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        try {
            appSettings = { ...appSettings, ...JSON.parse(savedSettings) };
            console.log('📋 저장된 설정 로드됨:', appSettings);
        } catch (e) {
            console.error('❌ 앱 설정 로드 실패:', e);
        }
    } else {
        console.log('📋 저장된 설정 없음, 기본값 사용');
    }
    
    // 설정 적용
    applyAppSettings();
    updateAppSettingsUI();
    
    console.log('✅ 앱 설정 초기화 완료');
}

// 앱 설정 적용
function applyAppSettings() {
    // 다크 모드 적용
    if (appSettings.darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// 앱 설정 UI 업데이트
function updateAppSettingsUI() {
    console.log('🔧 앱 설정 UI 업데이트 시작...');
    
    // 다크 모드 토글
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    console.log('🔍 다크 모드 토글 버튼:', {
        found: !!darkModeToggle,
        id: 'dark-mode-toggle',
        element: darkModeToggle
    });
    
    if (darkModeToggle) {
        if (appSettings.darkMode) {
            darkModeToggle.textContent = '🌙 다크모드';
            darkModeToggle.className = 'toggle-btn px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm min-h-[40px] w-full sm:w-auto';
        } else {
            darkModeToggle.textContent = '☀️ 라이트모드';
            darkModeToggle.className = 'toggle-btn px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm min-h-[40px] w-full sm:w-auto';
        }
        console.log('✅ 다크 모드 토글 업데이트 완료');
    } else {
        console.error('❌ 다크 모드 토글 버튼을 찾을 수 없습니다');
    }
    
    // 푸시 알림 토글
    const pushNotificationToggle = document.getElementById('push-notification-toggle');
    console.log('🔍 푸시 알림 토글 버튼:', {
        found: !!pushNotificationToggle,
        id: 'push-notification-toggle',
        element: pushNotificationToggle
    });
    
    if (pushNotificationToggle) {
        if (appSettings.pushNotifications) {
            pushNotificationToggle.textContent = '🔔 On';
            pushNotificationToggle.className = 'toggle-btn px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm min-h-[40px] w-full sm:w-auto';
        } else {
            pushNotificationToggle.textContent = '🔕 Off';
            pushNotificationToggle.className = 'toggle-btn px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm min-h-[40px] w-full sm:w-auto';
        }
    }
    
    // 효과음 토글
    const soundEffectsToggle = document.getElementById('sound-effects-toggle');
    console.log('🔍 효과음 토글 버튼:', {
        found: !!soundEffectsToggle,
        id: 'sound-effects-toggle',
        element: soundEffectsToggle
    });
    
    if (soundEffectsToggle) {
        if (appSettings.soundEffects) {
            soundEffectsToggle.textContent = '🔊 On';
            soundEffectsToggle.className = 'toggle-btn px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm min-h-[40px] w-full sm:w-auto';
        } else {
            soundEffectsToggle.textContent = '🔇 Off';
            soundEffectsToggle.className = 'toggle-btn px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm min-h-[40px] w-full sm:w-auto';
        }
    }
    

    
    console.log('🔍 앱 설정 div 상태:', {
        appSettingsDiv: document.getElementById('app-settings'),
        className: document.getElementById('app-settings')?.className,
        hidden: document.getElementById('app-settings')?.classList.contains('hidden'),
        display: document.getElementById('app-settings') ? window.getComputedStyle(document.getElementById('app-settings')).display : 'N/A'
    });
}

// 앱 설정 저장
function saveAppSettings() {
    try {
        localStorage.setItem('appSettings', JSON.stringify(appSettings));
    } catch (e) {
        console.error('앱 설정 저장 실패:', e);
    }
}

// 다크 모드 토글
function toggleDarkMode() {
    appSettings.darkMode = !appSettings.darkMode;
    applyAppSettings();
    updateAppSettingsUI();
    saveAppSettings();
    
    // 효과음 재생
    if (appSettings.soundEffects) {
        playToggleSound();
    }
}

// 푸시 알림 토글
function togglePushNotifications() {
    if (!appSettings.pushNotifications) {
        // 알림 권한 요청
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    appSettings.pushNotifications = true;
                    updateAppSettingsUI();
                    saveAppSettings();
                    
                    // 테스트 알림
                    new Notification('알림 설정 완료', {
                        body: '여행 일정 알림을 받을 수 있습니다.',
                        icon: '🌍'
                    });
                } else {
                    alert('알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
                }
            });
        } else {
            alert('이 브라우저는 알림을 지원하지 않습니다.');
        }
    } else {
        appSettings.pushNotifications = false;
        updateAppSettingsUI();
        saveAppSettings();
    }
    
    // 효과음 재생
    if (appSettings.soundEffects) {
        playToggleSound();
    }
}

// 효과음 토글
function toggleSoundEffects() {
    appSettings.soundEffects = !appSettings.soundEffects;
    updateAppSettingsUI();
    saveAppSettings();
    
    // 효과음 재생 (끄는 중에도 재생)
    playToggleSound();
}



// 토글 효과음 재생
function playToggleSound() {
    try {
        // 간단한 오디오 컨텍스트 생성
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log('효과음 재생 실패:', e);
    }
}

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
    
    // 앱 설정 토글 버튼들
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('push-notification-toggle').addEventListener('click', togglePushNotifications);
    document.getElementById('sound-effects-toggle').addEventListener('click', toggleSoundEffects);
    
    // 언어 설정 (향후 구현 예정)
    document.getElementById('language-toggle').addEventListener('click', function() {
        alert('언어 설정 기능은 향후 구현 예정입니다.');
    });
} 
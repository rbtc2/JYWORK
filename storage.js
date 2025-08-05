/**
 * storage.js - localStorage 저장/불러오기 유틸리티 함수들
 * 사용자별 데이터 저장, 거주지 정보 관리 등을 담당
 */

// 사용자별 데이터 불러오기 (향후 로그인 시스템 대비)
function loadUserData() {
    if (currentUser.isLoggedIn && currentUser.id) {
        const userDataKey = `user_${currentUser.id}_travelEntries`;
        const savedEntries = localStorage.getItem(userDataKey);
        entries = savedEntries ? JSON.parse(savedEntries) : [];
    } else {
        // 현재는 기존 방식 유지 (비로그인 사용자용)
        const savedEntries = localStorage.getItem('travelEntries');
        entries = savedEntries ? JSON.parse(savedEntries) : [];
    }
    
    // 기존 entries에 ID가 없는 경우 ID 추가
    entries.forEach(entry => {
        if (!entry.id) {
            entry.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
    });
    
    // ID가 추가된 경우 localStorage 업데이트
    if (entries.length > 0) {
        saveUserData();
    }
}

// 사용자별 데이터 저장 (향후 로그인 시스템 대비)
function saveUserData() {
    if (currentUser.isLoggedIn && currentUser.id) {
        const userDataKey = `user_${currentUser.id}_travelEntries`;
        localStorage.setItem(userDataKey, JSON.stringify(entries));
        
        // 거주지 정보도 저장
        const residenceKey = `user_${currentUser.id}_residence`;
        localStorage.setItem(residenceKey, JSON.stringify(userResidence));
    } else {
        // 현재는 기존 방식 유지 (비로그인 사용자용)
        localStorage.setItem('travelEntries', JSON.stringify(entries));
        localStorage.setItem('userResidence', JSON.stringify(userResidence));
    }
}

// 거주지 정보 불러오기
function loadResidenceData() {
    if (currentUser.isLoggedIn && currentUser.id) {
        const residenceKey = `user_${currentUser.id}_residence`;
        const savedResidence = localStorage.getItem(residenceKey);
        userResidence = savedResidence ? JSON.parse(savedResidence) : {
            country: null,
            countryCode: null,
            countryLabel: null,
            city: null,
            cityName: null,
            coordinates: null
        };
    } else {
        const savedResidence = localStorage.getItem('userResidence');
        userResidence = savedResidence ? JSON.parse(savedResidence) : {
            country: null,
            countryCode: null,
            countryLabel: null,
            city: null,
            cityName: null,
            coordinates: null
        };
    }
}

// 거주지 정보 저장
function saveResidenceData() {
    if (currentUser.isLoggedIn && currentUser.id) {
        const residenceKey = `user_${currentUser.id}_residence`;
        localStorage.setItem(residenceKey, JSON.stringify(userResidence));
    } else {
        localStorage.setItem('userResidence', JSON.stringify(userResidence));
    }
}

// 데이터 내보내기 함수
function exportData() {
    const data = {
        user: currentUser,
        entries: entries,
        residence: userResidence,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `travel_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('데이터가 성공적으로 내보내졌습니다!');
}

// 데이터 초기화 함수
function resetData() {
    if (confirm('모든 여행 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        entries = [];
        saveUserData();
        updateAllSections();
        alert('모든 데이터가 초기화되었습니다.');
    }
} 
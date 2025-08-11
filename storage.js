/**
 * storage.js - localStorage 저장/불러오기 유틸리티 함수들
 * 사용자별 데이터 저장, 거주지 정보 관리 등을 담당
 */

// 사용자별 데이터 불러오기 (향후 로그인 시스템 대비)
function loadUserData() {
    try {
        if (currentUser.isLoggedIn && currentUser.id) {
            const userDataKey = `user_${currentUser.id}_travelEntries`;
            const savedEntries = SafeStorage.getItem(userDataKey);
            entries = SafeJSON.parse(savedEntries, []);
        } else {
            // 현재는 기존 방식 유지 (비로그인 사용자용)
            const savedEntries = SafeStorage.getItem('travelEntries');
            entries = SafeJSON.parse(savedEntries, []);
        }
        
        // 전역 변수 동기화
        if (typeof window !== 'undefined') {
            window.entries = entries;
        }
        
        // 기존 entries에 ID가 없는 경우 ID 추가 및 companions 구조 마이그레이션
        if (Array.isArray(entries)) {
            let needsUpdate = false;
            
            entries.forEach(entry => {
                if (!entry.id) {
                    entry.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                    needsUpdate = true;
                }
                
                // companions 구조 마이그레이션
                if (entry.companions && typeof entry.companions === 'string') {
                    // 기존 string companions를 새 구조로 변환
                    if (entry.companions.trim() === '') {
                        entry.companionType = 'solo';
                        entry.companions = '';
                        console.log('마이그레이션: 빈 companions를 solo로 설정', entry.id);
                    } else {
                        entry.companionType = 'custom';
                        // 기존 companions 문자열 유지
                        console.log('마이그레이션: 기존 companions를 custom으로 설정', entry.id, entry.companions);
                    }
                    needsUpdate = true;
                } else if (!entry.companionType) {
                    // companions가 없거나 이미 객체인 경우 기본값 설정
                    entry.companionType = 'solo';
                    entry.companions = entry.companions || '';
                    console.log('마이그레이션: companionType이 없어서 solo로 설정', entry.id);
                    needsUpdate = true;
                }
            });
            
            // 업데이트가 필요한 경우 localStorage 업데이트
            if (needsUpdate && entries.length > 0) {
                saveUserData();
            }
        } else {
            // 잘못된 데이터 형식인 경우 초기화
            entries = [];
            errorHandler.handleError(new Error('Invalid entries data format'), {}, ErrorSeverity.MEDIUM);
        }
    } catch (error) {
        errorHandler.handleError(error, { function: 'loadUserData' }, ErrorSeverity.HIGH);
        entries = [];
    }
}

// 사용자별 데이터 저장 (향후 로그인 시스템 대비)
function saveUserData() {
    try {
        const entriesJson = SafeJSON.stringify(entries);
        if (!entriesJson) {
            throw new Error('Failed to stringify entries');
        }

        if (currentUser.isLoggedIn && currentUser.id) {
            const userDataKey = `user_${currentUser.id}_travelEntries`;
            const success = SafeStorage.setItem(userDataKey, entriesJson);
            if (!success) {
                throw new Error('Failed to save user data');
            }
            
            // 거주지 정보도 저장
            const residenceKey = `user_${currentUser.id}_residence`;
            const residenceJson = SafeJSON.stringify(userResidence);
            SafeStorage.setItem(residenceKey, residenceJson);
        } else {
            // 현재는 기존 방식 유지 (비로그인 사용자용)
            const success = SafeStorage.setItem('travelEntries', entriesJson);
            if (!success) {
                throw new Error('Failed to save travel entries');
            }
            SafeStorage.setItem('userResidence', SafeJSON.stringify(userResidence));
        }
    } catch (error) {
        errorHandler.handleError(error, { function: 'saveUserData' }, ErrorSeverity.HIGH);
    }
}

// 거주지 정보 불러오기
function loadResidenceData() {
    try {
        const defaultResidence = {
            country: null,
            countryCode: null,
            countryLabel: null,
            city: null,
            cityName: null,
            coordinates: null
        };

        if (currentUser.isLoggedIn && currentUser.id) {
            const residenceKey = `user_${currentUser.id}_residence`;
            const savedResidence = SafeStorage.getItem(residenceKey);
            userResidence = SafeJSON.parse(savedResidence, defaultResidence);
        } else {
            const savedResidence = SafeStorage.getItem('userResidence');
            userResidence = SafeJSON.parse(savedResidence, defaultResidence);
        }

        // 데이터 유효성 검증
        if (!userResidence || typeof userResidence !== 'object') {
            userResidence = defaultResidence;
        }
    } catch (error) {
        errorHandler.handleError(error, { function: 'loadResidenceData' }, ErrorSeverity.MEDIUM);
        userResidence = {
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
    try {
        const residenceJson = SafeJSON.stringify(userResidence);
        if (!residenceJson) {
            throw new Error('Failed to stringify residence data');
        }

        if (currentUser.isLoggedIn && currentUser.id) {
            const residenceKey = `user_${currentUser.id}_residence`;
            const success = SafeStorage.setItem(residenceKey, residenceJson);
            if (!success) {
                throw new Error('Failed to save residence data');
            }
        } else {
            const success = SafeStorage.setItem('userResidence', residenceJson);
            if (!success) {
                throw new Error('Failed to save residence data');
            }
        }
    } catch (error) {
        errorHandler.handleError(error, { function: 'saveResidenceData' }, ErrorSeverity.MEDIUM);
    }
}

// 데이터 내보내기 함수
function exportData() {
    try {
        const data = {
            user: currentUser,
            entries: entries,
            residence: userResidence,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = SafeJSON.stringify(data, null, 2);
        if (!dataStr) {
            throw new Error('Failed to stringify export data');
        }

        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = SafeDOM.createElement('a', {
            href: url,
            download: `travel_data_${new Date().toISOString().split('T')[0]}.json`
        });
        
        if (link) {
            link.click();
            URL.revokeObjectURL(url);
            alert('데이터가 성공적으로 내보내졌습니다!');
        } else {
            throw new Error('Failed to create download link');
        }
    } catch (error) {
        errorHandler.handleError(error, { function: 'exportData' }, ErrorSeverity.MEDIUM);
        alert('데이터 내보내기에 실패했습니다. 다시 시도해주세요.');
    }
}

// 정렬 상태 저장
function saveSortSettings() {
    try {
        const sortSettings = {
            timelineSortType: timelineSortType || 'newest',
            ratingSortType: ratingSortType || 'rating-high'
        };
        
        const sortJson = SafeJSON.stringify(sortSettings);
        if (!sortJson) {
            throw new Error('Failed to stringify sort settings');
        }

        if (currentUser.isLoggedIn && currentUser.id) {
            const sortKey = `user_${currentUser.id}_sortSettings`;
            const success = SafeStorage.setItem(sortKey, sortJson);
            if (!success) {
                throw new Error('Failed to save sort settings');
            }
        } else {
            const success = SafeStorage.setItem('sortSettings', sortJson);
            if (!success) {
                throw new Error('Failed to save sort settings');
            }
        }
    } catch (error) {
        errorHandler.handleError(error, { function: 'saveSortSettings' }, ErrorSeverity.MEDIUM);
    }
}

// 정렬 상태 불러오기
function loadSortSettings() {
    try {
        let savedSettings;
        
        if (currentUser.isLoggedIn && currentUser.id) {
            const sortKey = `user_${currentUser.id}_sortSettings`;
            const savedData = SafeStorage.getItem(sortKey);
            savedSettings = SafeJSON.parse(savedData, null);
        } else {
            const savedData = SafeStorage.getItem('sortSettings');
            savedSettings = SafeJSON.parse(savedData, null);
        }
        
        if (savedSettings && typeof savedSettings === 'object') {
            timelineSortType = savedSettings.timelineSortType || 'newest';
            ratingSortType = savedSettings.ratingSortType || 'rating-high';
        }
    } catch (error) {
        errorHandler.handleError(error, { function: 'loadSortSettings' }, ErrorSeverity.MEDIUM);
        // 기본값 설정
        timelineSortType = 'newest';
        ratingSortType = 'rating-high';
    }
}

// 데이터 초기화 함수
function resetData() {
    try {
        if (confirm('모든 여행 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            entries = [];
            const success = saveUserData();
            if (success !== false) {
                updateAllSections();
                alert('모든 데이터가 초기화되었습니다.');
            } else {
                alert('데이터 초기화 중 오류가 발생했습니다.');
            }
        }
    } catch (error) {
        errorHandler.handleError(error, { function: 'resetData' }, ErrorSeverity.HIGH);
        alert('데이터 초기화 중 오류가 발생했습니다.');
    }
} 
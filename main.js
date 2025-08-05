/**
 * main.js - 메인 애플리케이션 초기화 및 전체 관리
 * 전역 변수, 데이터 구조, 탭 전환, 모듈 초기화를 담당
 */

// 전역 변수들
let entries = [];
let currentDate = new Date();

// 사용자 관련 변수들
let currentUser = {
    id: null,
    username: null,
    isLoggedIn: false
};

// 거주지 관련 변수
let userResidence = {
    country: null,
    countryCode: null,
    countryLabel: null,
    city: null,
    cityName: null,
    coordinates: null
};

// 수정 모드 변수
let isEditMode = false;
let editingEntryId = null;

// 날짜 차이 계산 (체류일 수)
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 시작일 포함
}

// 통계 계산
function calculateStats() {
    if (entries.length === 0) {
        document.getElementById('total-countries').textContent = '0';
        document.getElementById('total-cities').textContent = '0';
        document.getElementById('total-days').textContent = '0';
        document.getElementById('travel-summary').innerHTML = '<p class="text-gray-500">아직 등록된 여행이 없습니다.</p>';
        return;
    }

    // 거주지 관련 필터링
    let filteredEntries = entries;
    let countries = [...new Set(entries.map(entry => entry.country))];
    let cities = [...new Set(entries.map(entry => entry.city))];
    
    // 거주지가 설정된 경우 통계에서 제외
    if (userResidence.country && userResidence.city) {
        // 거주 국가의 체류 기록이 없는 경우 국가 통계에서 제외
        const hasResidenceCountryEntry = entries.some(entry => entry.country === userResidence.country);
        if (!hasResidenceCountryEntry) {
            countries = countries.filter(country => country !== userResidence.country);
        }
        
        // 거주 도시가 아닌 다른 도시의 체류 일자는 포함
        // (거주 도시 자체는 제외하되, 같은 국가의 다른 도시는 포함)
    }
    
    // 총 체류일 계산
    const totalDays = entries.reduce((sum, entry) => {
        return sum + calculateDays(entry.startDate, entry.endDate);
    }, 0);

    // 통계 업데이트
    document.getElementById('total-countries').textContent = countries.length;
    document.getElementById('total-cities').textContent = cities.length;
    document.getElementById('total-days').textContent = totalDays;

    // 요약 정보 생성
    let summaryHTML = `
        <div class="space-y-2">
            <p><strong>총 여행 횟수:</strong> ${entries.length}회</p>
            <p><strong>방문 국가:</strong> ${countries.join(', ')}</p>
            <p><strong>방문 도시:</strong> ${cities.join(', ')}</p>
            <p><strong>평균 체류일:</strong> ${Math.round(totalDays / entries.length)}일</p>
    `;
    
    // 거주지 정보 추가
    if (userResidence.country && userResidence.city) {
        summaryHTML += `
            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm font-medium text-blue-800">🏠 현재 거주지: ${userResidence.country} / ${userResidence.city}</p>
            </div>
        `;
    }
    
    summaryHTML += '</div>';
    document.getElementById('travel-summary').innerHTML = summaryHTML;
}

// 모든 섹션 업데이트
function updateAllSections() {
    calculateStats();
    renderTimeline();
    renderCalendar();
    updateMap();
    
    // Countries 컬렉션 업데이트 (모달이 열려있는 경우)
    if (typeof renderCountriesCollection === 'function') {
        renderCountriesCollection();
    }
}

// 탭 클릭 이벤트 처리
function initializeTabNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 모든 탭에서 active 클래스 제거
            document.querySelectorAll('.nav-tab').forEach(t => {
                t.classList.remove('active');
                t.classList.add('text-gray-600');
            });
            
            // 클릭된 탭에 active 클래스 추가
            this.classList.add('active');
            this.classList.remove('text-gray-600');
            
            // 모든 섹션 숨기기
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // 해당 섹션 보이기
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.remove('hidden');
                targetElement.classList.add('block');
            }

            // 캘린더 섹션으로 이동할 때 캘린더 다시 렌더링
            if (targetSection === 'calendar') {
                updateDropdownsFromCurrentDate();
                renderCalendar();
            }
            
            // 세계지도 섹션으로 이동할 때 지도 업데이트
            if (targetSection === 'world-map') {
                setTimeout(() => {
                    if (map) {
                        map.invalidateSize();
                        createMarkers();
                    }
                }, 100);
            }
        });
    });
}

// 모달 관련 함수들
function initializeModal() {
    const floatingBtn = document.getElementById('floating-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModal = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const travelForm = document.getElementById('travel-form');

    // 모달 열기
    floatingBtn.addEventListener('click', function() {
        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });

    // 모달 닫기 함수
    function closeModalFunction() {
        modalOverlay.classList.add('hidden');
        modalOverlay.classList.remove('flex');
        document.body.style.overflow = '';
        travelForm.reset();
        
        // 수정 모드 리셋
        isEditMode = false;
        editingEntryId = null;
        
        // 모달 제목과 버튼 텍스트 원래대로 복원
        document.querySelector('#modal-overlay h2').textContent = '새 여행 추가';
        const submitBtn = document.querySelector('#travel-form button[type="submit"]');
        submitBtn.textContent = '추가';
        
        // 도시 입력 필드 비활성화
        document.getElementById('city-input').disabled = true;
        document.getElementById('city-input').placeholder = '국가를 먼저 선택한 후 도시명을 입력하세요';
    }

    // X 버튼으로 모달 닫기
    closeModal.addEventListener('click', closeModalFunction);

    // 취소 버튼으로 모달 닫기
    cancelBtn.addEventListener('click', closeModalFunction);

    // 오버레이 클릭으로 모달 닫기
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModalFunction();
        }
    });

    // 폼 제출 처리
    travelForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 날짜 유효성 검사
        if (!validateDates()) {
            return;
        }
        
        const formData = {
            country: document.getElementById('country-input').value,
            countryCode: document.getElementById('country-code').value,
            countryLabel: document.getElementById('country-label').value,
            city: document.getElementById('city-input').value,
            cityName: document.getElementById('city-name').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            purpose: document.getElementById('purpose').value,
            companions: document.getElementById('companions').value,
            memo: document.getElementById('memo').value
        };

        if (isEditMode && editingEntryId) {
            // 수정 모드: 기존 entry 업데이트
            const index = entries.findIndex(e => e.id === editingEntryId);
            if (index !== -1) {
                formData.id = editingEntryId; // 기존 ID 유지
                entries[index] = formData;
                saveUserData();
                updateAllSections();
                console.log('수정된 여행 데이터:', JSON.stringify(formData, null, 2));
                closeModalFunction();
                alert('여행이 성공적으로 수정되었습니다!');
            }
        } else {
            // 추가 모드: 새 entry 추가
            formData.id = Date.now().toString(); // 고유 ID 추가
            entries.push(formData);
            saveUserData();
            updateAllSections();
            console.log('여행 데이터:', JSON.stringify(formData, null, 2));
            closeModalFunction();
            alert('여행이 성공적으로 추가되었습니다!');
        }
    });
}

// 날짜 유효성 검사 함수
function validateDates() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
            alert('체류 종료일은 체류 시작일보다 이전일 수 없습니다.');
            return false;
        }
    }
    return true;
}

// 날짜 입력 필드 이벤트 리스너 초기화
function initializeDateValidation() {
    // 시작일 변경 시 종료일 최소값 설정
    document.getElementById('start-date').addEventListener('change', function() {
        const startDate = this.value;
        const endDateInput = document.getElementById('end-date');
        
        if (startDate) {
            endDateInput.min = startDate;
            
            // 현재 종료일이 시작일보다 이전이면 종료일을 시작일로 설정
            if (endDateInput.value && endDateInput.value < startDate) {
                endDateInput.value = startDate;
            }
        }
    });

    // 종료일 변경 시 유효성 검사
    document.getElementById('end-date').addEventListener('change', function() {
        const startDate = document.getElementById('start-date').value;
        const endDate = this.value;
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (end < start) {
                alert('체류 종료일은 체류 시작일보다 이전일 수 없습니다.');
                this.value = startDate; // 종료일을 시작일로 설정
            }
        }
    });
}

// 애플리케이션 초기화
function initializeApp() {
    // 데이터 로드
    loadUserData();
    loadResidenceData();
    
    // 샘플 데이터 추가 (개발용 - 실제 배포 시 제거)
    if (entries.length === 0) {
        const sampleEntries = [
            {
                id: '1',
                country: '일본',
                countryCode: 'JP',
                countryLabel: '일본',
                city: '도쿄',
                cityName: '도쿄',
                startDate: '2023-03-15',
                endDate: '2023-03-20',
                purpose: 'travel',
                companions: '김철수',
                memo: '벚꽃 구경'
            },
            {
                id: '2',
                country: '미국',
                countryCode: 'US',
                countryLabel: '미국',
                city: '뉴욕',
                cityName: '뉴욕',
                startDate: '2023-06-10',
                endDate: '2023-06-15',
                purpose: 'business',
                companions: '',
                memo: '출장'
            },
            {
                id: '3',
                country: '프랑스',
                countryCode: 'FR',
                countryLabel: '프랑스',
                city: '파리',
                cityName: '파리',
                startDate: '2023-09-05',
                endDate: '2023-09-12',
                purpose: 'travel',
                companions: '이영희',
                memo: '에펠탑 관광'
            },
            {
                id: '4',
                country: '일본',
                countryCode: 'JP',
                countryLabel: '일본',
                city: '오사카',
                cityName: '오사카',
                startDate: '2023-12-20',
                endDate: '2023-12-25',
                purpose: 'travel',
                companions: '박민수',
                memo: '겨울 여행'
            },
            {
                id: '5',
                country: '영국',
                countryCode: 'GB',
                countryLabel: '영국',
                city: '런던',
                cityName: '런던',
                startDate: '2024-01-10',
                endDate: '2024-01-15',
                purpose: 'study',
                companions: '',
                memo: '어학 연수'
            }
        ];
        
        entries.push(...sampleEntries);
        saveUserData();
    }
    
    // UI 업데이트
    updateAllSections();
    updateUserInterface();
    updateResidenceUI();
    
    // 캘린더 드롭다운 초기화
    initializeCalendarDropdowns();
    
    // 지도 초기화 (약간의 지연을 두어 DOM이 완전히 로드된 후 실행)
    setTimeout(() => {
        initializeMap();
        createMarkers();
    }, 100);
    
    // 이벤트 리스너 초기화
    initializeTabNavigation();
    initializeModal();
    initializeDateValidation();
    initializeCalendarEventListeners();
    initializeSettingsEventListeners();
    initializeAutocompleteEventListeners();
    
    // Countries 모듈 초기화
    if (typeof initializeCountriesModule === 'function') {
        initializeCountriesModule();
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeApp); 
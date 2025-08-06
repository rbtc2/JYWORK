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
    renderCollectionTimeline();
    renderCalendar();
    updateMap();
    
    // Countries 컬렉션 업데이트 (모달이 열려있는 경우)
    if (typeof renderCountriesCollection === 'function') {
        renderCountriesCollection();
    }
    
    // 별점별 보기 업데이트 (별점별 보기 탭이 활성화된 경우)
    const ratingSubsection = document.getElementById('rating-subsection');
    if (ratingSubsection && !ratingSubsection.classList.contains('hidden')) {
        renderRatingTimeline();
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
            
            // 콜렉션 섹션으로 이동할 때 기본 탭 설정
            if (targetSection === 'collection') {
                initializeCollectionTabs();
            }
        });
    });
}

// 콜렉션 하위 탭 초기화
function initializeCollectionTabs() {
    // 모든 콜렉션 탭에서 active 클래스 제거
    document.querySelectorAll('.collection-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.remove('bg-blue-500', 'text-white');
        tab.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    // 첫 번째 탭(타임라인)을 기본으로 활성화
    const firstTab = document.querySelector('.collection-tab[data-subsection="timeline"]');
    if (firstTab) {
        firstTab.classList.add('active', 'bg-blue-500', 'text-white');
        firstTab.classList.remove('bg-gray-200', 'text-gray-700');
    }
    
    // 모든 하위 섹션 숨기기
    document.querySelectorAll('.collection-subsection').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('block');
    });
    
    // 타임라인 하위 섹션 보이기
    const timelineSubsection = document.getElementById('timeline-subsection');
    if (timelineSubsection) {
        timelineSubsection.classList.remove('hidden');
        timelineSubsection.classList.add('block');
    }
    
    // 페이지네이션 초기화
    if (typeof resetPagination === 'function') {
        resetPagination();
    }
    
    // 타임라인 렌더링
    renderCollectionTimeline();
    initializeTimelineSortButtons();
    
    // 정렬 버튼 상태 업데이트
    if (typeof updateSortButtonStates === 'function') {
        updateSortButtonStates();
    }
    
    // 콜렉션 탭 클릭 이벤트 리스너 추가
    document.querySelectorAll('.collection-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetSubsection = this.getAttribute('data-subsection');
            
            // 모든 콜렉션 탭에서 active 클래스 제거
            document.querySelectorAll('.collection-tab').forEach(t => {
                t.classList.remove('active', 'bg-blue-500', 'text-white');
                t.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            // 클릭된 탭에 active 클래스 추가
            this.classList.add('active', 'bg-blue-500', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // 모든 하위 섹션 숨기기
            document.querySelectorAll('.collection-subsection').forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('block');
            });
            
            // 해당 하위 섹션 보이기
            const targetElement = document.getElementById(targetSubsection + '-subsection');
            if (targetElement) {
                targetElement.classList.remove('hidden');
                targetElement.classList.add('block');
            }
            
            // 타임라인 탭 클릭 시 타임라인 렌더링
            if (targetSubsection === 'timeline') {
                // 페이지네이션 초기화
                if (typeof resetPagination === 'function') {
                    resetPagination();
                }
                renderCollectionTimeline();
                initializeTimelineSortButtons();
                
                // 정렬 버튼 상태 업데이트
                if (typeof updateSortButtonStates === 'function') {
                    updateSortButtonStates();
                }
            }
            
            // 별점별 보기 탭 클릭 시 별점별 보기 렌더링
            if (targetSubsection === 'rating') {
                // 페이지네이션 초기화
                if (typeof resetPagination === 'function') {
                    resetPagination();
                }
                renderRatingTimeline();
                initializeRatingSortButtons();
                
                // 정렬 버튼 상태 업데이트
                if (typeof updateSortButtonStates === 'function') {
                    updateSortButtonStates();
                }
            }
        });
    });
}

// 별점별 보기 초기화
function initializeRatingView() {
    renderRatingTimeline();
    initializeRatingSortButtons();
    
    // 정렬 버튼 상태 업데이트
    if (typeof updateSortButtonStates === 'function') {
        updateSortButtonStates();
    }
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
        
        // 별점 초기화
        if (window.resetRating) {
            window.resetRating();
        }
        
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
        
        // 별점 검증
        const rating = document.getElementById('rating').value;
        if (!rating || rating === '') {
            alert('별점을 선택해주세요.');
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
            rating: document.getElementById('rating').value,
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
}

// 별점 시스템 초기화
function initializeRatingSystem() {
    const starIcons = document.querySelectorAll('.star-icon');
    const ratingInput = document.getElementById('rating');
    const ratingText = document.getElementById('rating-text');
    let currentRating = 0;
    let hoverRating = 0;

    // 별점 초기화 함수
    function resetRating() {
        starIcons.forEach((star, index) => {
            star.classList.remove('text-yellow-400', 'text-gray-300');
            star.classList.add('text-gray-300');
            star.style.fill = 'none';
        });
        currentRating = 0;
        ratingInput.value = '';
        ratingText.textContent = '별점을 선택해주세요';
        
        // 컨테이너 클래스 제거
        const ratingContainer = document.getElementById('rating-container');
        ratingContainer.classList.remove('has-rating');
    }

    // 별점 업데이트 함수
    function updateStars(rating) {
        starIcons.forEach((star, index) => {
            const starRating = index + 1;
            if (starRating <= rating) {
                star.classList.remove('text-gray-300');
                star.classList.add('text-yellow-400');
                star.style.fill = 'currentColor';
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-300');
                star.style.fill = 'none';
            }
        });
        
        // 컨테이너 클래스 업데이트
        const ratingContainer = document.getElementById('rating-container');
        if (rating > 0) {
            ratingContainer.classList.add('has-rating');
        } else {
            ratingContainer.classList.remove('has-rating');
        }
    }

    // 별점 텍스트 업데이트 함수
    function updateRatingText(rating) {
        const ratingTexts = {
            1: '매우 나쁨',
            2: '나쁨',
            3: '보통',
            4: '좋음',
            5: '매우 좋음'
        };
        ratingText.textContent = rating > 0 ? `${rating}점 - ${ratingTexts[rating]}` : '별점을 선택해주세요';
    }

    // 각 별에 이벤트 리스너 추가
    starIcons.forEach((star, index) => {
        const starRating = index + 1;

        // 클릭 이벤트
        star.addEventListener('click', function() {
            currentRating = starRating;
            ratingInput.value = currentRating;
            updateStars(currentRating);
            updateRatingText(currentRating);
        });

        // 터치 이벤트 (모바일 지원)
        star.addEventListener('touchstart', function(e) {
            e.preventDefault();
            currentRating = starRating;
            ratingInput.value = currentRating;
            updateStars(currentRating);
            updateRatingText(currentRating);
        });

        // 호버 이벤트 (마우스 진입)
        star.addEventListener('mouseenter', function() {
            hoverRating = starRating;
            updateStars(hoverRating);
        });

        // 호버 이벤트 (마우스 나감)
        star.addEventListener('mouseleave', function() {
            hoverRating = 0;
            updateStars(currentRating);
        });
    });

    // 별점 컨테이너에 호버 이벤트 추가 (전체 영역)
    const ratingContainer = document.getElementById('rating-container');
    ratingContainer.addEventListener('mouseleave', function() {
        hoverRating = 0;
        updateStars(currentRating);
    });

    // 별점 초기화 함수를 전역에서 접근 가능하도록 설정
    window.resetRating = resetRating;
    window.getCurrentRating = () => currentRating;
    window.setRating = (rating) => {
        currentRating = rating;
        ratingInput.value = rating;
        updateStars(rating);
        updateRatingText(rating);
    };
}

// 애플리케이션 초기화
function initializeApp() {
    // 데이터 로드
    loadUserData();
    loadResidenceData();
    
    // 정렬 설정 로드
    if (typeof loadSortSettings === 'function') {
        loadSortSettings();
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
    initializeCollectionTabs();
    initializeModal();
    initializeDateValidation();
    initializeRatingSystem();
    initializeCalendarEventListeners();
    initializeSettingsEventListeners();
    initializeAutocompleteEventListeners();
    
    // 페이지네이션 초기화
    if (typeof initializePaginationButtons === 'function') {
        initializePaginationButtons();
    }
    
    // Countries 모듈 초기화
    if (typeof initializeCountriesModule === 'function') {
        initializeCountriesModule();
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeApp); 
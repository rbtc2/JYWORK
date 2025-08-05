/**
 * timeline.js - 타임라인 생성, 수정, 삭제 기능
 * 여행 일정의 CRUD 작업과 타임라인 렌더링을 담당
 */

// 타임라인 렌더링
function renderTimeline() {
    const timelineList = document.getElementById('timeline-list');
    const timelineEmpty = document.getElementById('timeline-empty');

    if (entries.length === 0) {
        timelineList.style.display = 'none';
        timelineEmpty.style.display = 'block';
        return;
    }

    timelineList.style.display = 'block';
    timelineEmpty.style.display = 'none';

    // 날짜순으로 정렬 (최신순)
    const sortedEntries = [...entries].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    timelineList.innerHTML = sortedEntries.map(entry => {
        const days = calculateDays(entry.startDate, entry.endDate);
        const purposeText = getPurposeText(entry.purpose);

        return `
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">${entry.country} / ${entry.city}</h3>
                        <p class="text-sm text-gray-600">${purposeText}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            ${days}일
                        </span>
                        <div class="flex space-x-1">
                            <button onclick="modifyEntry('${entry.id}')" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 transition-colors">
                                수정
                            </button>
                            <button onclick="deleteEntry('${entry.id}')" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
                <div class="text-sm text-gray-500 mb-3">
                    📅 ${entry.startDate} ~ ${entry.endDate}
                </div>
                ${entry.memo ? `<p class="text-sm text-gray-600 bg-gray-50 p-3 rounded">📝 ${entry.memo}</p>` : ''}
            </div>
        `;
    }).join('');
}

// 수정 함수
function modifyEntry(entryId) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    // 수정 모드 설정
    isEditMode = true;
    editingEntryId = entryId;

    // 모달 제목 변경
    document.querySelector('#modal-overlay h2').textContent = '여행 수정';

    // 폼에 기존 데이터 채우기
    document.getElementById('country-input').value = entry.country;
    document.getElementById('country-code').value = entry.countryCode;
    document.getElementById('country-label').value = entry.countryLabel;
    document.getElementById('city-input').value = entry.city;
    document.getElementById('city-name').value = entry.cityName;
    document.getElementById('start-date').value = entry.startDate;
    document.getElementById('end-date').value = entry.endDate;
    document.getElementById('purpose').value = entry.purpose;
    document.getElementById('memo').value = entry.memo || '';

    // 도시 입력 필드 활성화
    document.getElementById('city-input').disabled = false;

    // 제출 버튼 텍스트 변경
    const submitBtn = document.querySelector('#travel-form button[type="submit"]');
    submitBtn.textContent = '수정';

    // 모달 열기
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// 삭제 함수
function deleteEntry(entryId) {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
        entries = entries.filter(entry => entry.id !== entryId);
        saveUserData();
        updateAllSections();
        alert('일정이 삭제되었습니다.');
    }
}

// 목적 텍스트 변환 함수
function getPurposeText(purpose) {
    const textMap = {
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
    return textMap[purpose] || purpose;
} 
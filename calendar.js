/**
 * calendar.js - 캘린더 초기화 및 일정 표시
 * 월별 캘린더 렌더링, 이벤트 표시, 네비게이션 등을 담당
 */

// 캘린더 렌더링
function renderCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    const calendarEmpty = document.getElementById('calendar-empty');
    const currentMonthElement = document.getElementById('current-month');

    if (entries.length === 0) {
        calendarBody.style.display = 'none';
        calendarEmpty.style.display = 'block';
        return;
    }

    calendarBody.style.display = 'table-row-group';
    calendarEmpty.style.display = 'none';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthElement.textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    let calendarHTML = '';
    let currentRow = '';

    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        if (i % 7 === 0 && i > 0) {
            calendarHTML += `<tr>${currentRow}</tr>`;
            currentRow = '';
        }

        const isCurrentMonth = currentDate.getMonth() === month;
        const isToday = currentDate.toDateString() === new Date().toDateString();
        
        // 해당 날짜의 일정 찾기
        const dayEvents = entries.filter(entry => {
            const eventStart = new Date(entry.startDate);
            const eventEnd = new Date(entry.endDate);
            return currentDate >= eventStart && currentDate <= eventEnd;
        });

        let dayContent = `<div class="text-xs sm:text-sm font-medium">${currentDate.getDate()}</div>`;
        
        if (dayEvents.length > 0) {
            dayContent += `<div class="mt-1 space-y-0.5 sm:space-y-1">`;
            dayEvents.forEach((event, index) => {
                const purposeText = getPurposeText(event.purpose);
                
                // 툴팁 내용을 안전하게 생성
                const tooltipText = `${event.country} / ${event.city}\\n${purposeText}\\n📅 ${event.startDate} ~ ${event.endDate}${event.memo ? '\\n📝 ' + event.memo : ''}`;
                
                // 이벤트 색상 클래스 결정 (순환)
                const colorClass = `event-${(index % 8) + 1}`;
                
                dayContent += `
                    <div class="calendar-event ${colorClass}"
                         data-event-index="${index}"
                         data-tooltip="${tooltipText.replace(/"/g, '&quot;')}"
                         data-entry-id="${event.id}"
                         onmouseenter="createTooltip(event, this.dataset.tooltip)"
                         onmouseleave="removeTooltip()"
                         ontouchstart="handleTouchEvent(event, this.dataset.tooltip)"
                         ontouchend="handleTouchEnd(event)"
                         onclick="showEntryDetail('${event.id}')"
                         title="${event.country}"
                         style="cursor: pointer;">
                        <span class="hidden sm:inline">${event.country}</span>
                        <span class="sm:hidden">${event.country.substring(0, 2)}</span>
                    </div>
                `;
            });
            dayContent += `</div>`;
        }

        const cellClass = `
            border border-gray-200 p-1 sm:p-2 h-20 sm:h-28 align-top
            ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
            ${isToday ? 'bg-blue-50 border-blue-200' : ''}
        `;

        currentRow += `<td class="${cellClass}">${dayContent}</td>`;
    }

    if (currentRow) {
        calendarHTML += `<tr>${currentRow}</tr>`;
    }

    calendarBody.innerHTML = calendarHTML;
}

// 툴팁 생성 함수
function createTooltip(event, tooltipContent) {
    // 기존 툴팁 제거
    const existingTooltip = document.querySelector('.calendar-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'calendar-tooltip fixed z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-xs pointer-events-none space-y-1';
    
    // 텍스트를 줄바꿈으로 분리하여 HTML로 변환
    const lines = tooltipContent.split('\\n');
    const htmlContent = lines.map((line, index) => {
        const escapedLine = line.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        if (index === 0) {
            return `<div class="font-semibold">${escapedLine}</div>`;
        } else {
            return `<div class="text-gray-300">${escapedLine}</div>`;
        }
    }).join('');
    tooltip.innerHTML = htmlContent;
    
    document.body.appendChild(tooltip);

    // 툴팁 위치 계산
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.bottom + 8;

    // 화면 경계 체크
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top + tooltipRect.height > window.innerHeight - 8) {
        top = rect.top - tooltipRect.height - 8;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// 툴팁 제거 함수
function removeTooltip() {
    const tooltip = document.querySelector('.calendar-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// 모바일 터치 이벤트 처리
let touchTimeout = null;
let activeTooltip = null;

function handleTouchEvent(event, tooltipContent) {
    event.preventDefault();
    
    // 터치 시작 시 타이머 설정
    touchTimeout = setTimeout(() => {
        if (activeTooltip) {
            // 이미 열린 툴팁이 있으면 닫기
            removeTooltip();
            activeTooltip = null;
        } else {
            // 툴팁 열기
            createTooltip(event, tooltipContent);
            activeTooltip = event.target;
            
            // 다른 곳 터치 시 툴팁 닫기
            setTimeout(() => {
                document.addEventListener('touchstart', function closeTooltip(e) {
                    if (!event.target.contains(e.target)) {
                        removeTooltip();
                        activeTooltip = null;
                        document.removeEventListener('touchstart', closeTooltip);
                    }
                }, { once: true });
            }, 100);
        }
    }, 200); // 200ms 지연으로 클릭과 구분
}

// 터치 종료 시 타이머 취소
function handleTouchEnd(event) {
    if (touchTimeout) {
        clearTimeout(touchTimeout);
        touchTimeout = null;
    }
}

// 연도/월 드롭다운 초기화
function initializeCalendarDropdowns() {
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    
    // 연도 옵션 생성 (현재 연도 기준 전후 10년)
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '년';
        yearSelect.appendChild(option);
    }
    
    // 현재 연도/월로 설정
    yearSelect.value = currentDate.getFullYear();
    monthSelect.value = currentDate.getMonth();
}

// 연도/월 선택 시 캘린더 업데이트
function updateCalendarFromDropdowns() {
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    
    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = parseInt(monthSelect.value);
    
    currentDate.setFullYear(selectedYear);
    currentDate.setMonth(selectedMonth);
    renderCalendar();
}

// 현재 날짜에 맞춰 드롭다운 값 업데이트
function updateDropdownsFromCurrentDate() {
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    
    yearSelect.value = currentDate.getFullYear();
    monthSelect.value = currentDate.getMonth();
}

// 캘린더 이벤트 리스너 초기화
function initializeCalendarEventListeners() {
    // 캘린더 네비게이션
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateDropdownsFromCurrentDate();
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateDropdownsFromCurrentDate();
        renderCalendar();
    });

    // 드롭다운 값 변경 이벤트 리스너
    document.getElementById('year-select').addEventListener('change', updateCalendarFromDropdowns);
    document.getElementById('month-select').addEventListener('change', updateCalendarFromDropdowns);
} 
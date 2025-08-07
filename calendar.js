/**
 * calendar.js - 캘린더 초기화 및 일정 표시
 * 월별 캘린더 렌더링, 이벤트 표시, 네비게이션 등을 담당
 */

// 국가별 대륙 매핑
const countryToContinent = {
    // 아시아 (Asia)
    'KR': 'asia', 'JP': 'asia', 'CN': 'asia', 'TW': 'asia', 'HK': 'asia', 'MO': 'asia',
    'TH': 'asia', 'VN': 'asia', 'MY': 'asia', 'SG': 'asia', 'ID': 'asia', 'PH': 'asia',
    'MM': 'asia', 'LA': 'asia', 'KH': 'asia', 'BD': 'asia', 'LK': 'asia', 'NP': 'asia',
    'BT': 'asia', 'MV': 'asia', 'PK': 'asia', 'AF': 'asia', 'IR': 'asia', 'IQ': 'asia',
    'SA': 'asia', 'AE': 'asia', 'OM': 'asia', 'YE': 'asia', 'JO': 'asia', 'LB': 'asia',
    'SY': 'asia', 'IL': 'asia', 'PS': 'asia', 'TR': 'asia', 'GE': 'asia', 'AM': 'asia',
    'AZ': 'asia', 'KZ': 'asia', 'UZ': 'asia', 'TM': 'asia', 'KG': 'asia', 'TJ': 'asia',
    'MN': 'asia', 'KP': 'asia', 'IN': 'asia', 'BN': 'asia', 'KH': 'asia', 'LA': 'asia',
    'MM': 'asia', 'MY': 'asia', 'PH': 'asia', 'SG': 'asia', 'TH': 'asia', 'VN': 'asia',
    'BD': 'asia', 'BT': 'asia', 'IN': 'asia', 'LK': 'asia', 'MV': 'asia', 'NP': 'asia',
    'PK': 'asia', 'AF': 'asia', 'IR': 'asia', 'IQ': 'asia', 'JO': 'asia', 'KW': 'asia',
    'LB': 'asia', 'OM': 'asia', 'QA': 'asia', 'SA': 'asia', 'SY': 'asia', 'AE': 'asia',
    'YE': 'asia', 'AM': 'asia', 'AZ': 'asia', 'BH': 'asia', 'CY': 'asia', 'GE': 'asia',
    'IL': 'asia', 'JO': 'asia', 'KW': 'asia', 'LB': 'asia', 'OM': 'asia', 'PS': 'asia',
    'QA': 'asia', 'SA': 'asia', 'SY': 'asia', 'TR': 'asia', 'AE': 'asia', 'YE': 'asia',
    
    // 유럽 (Europe)
    'GB': 'europe', 'DE': 'europe', 'FR': 'europe', 'IT': 'europe', 'ES': 'europe',
    'NL': 'europe', 'SE': 'europe', 'NO': 'europe', 'DK': 'europe', 'FI': 'europe',
    'CH': 'europe', 'AT': 'europe', 'BE': 'europe', 'IE': 'europe', 'PT': 'europe',
    'GR': 'europe', 'PL': 'europe', 'CZ': 'europe', 'HU': 'europe', 'RO': 'europe',
    'BG': 'europe', 'HR': 'europe', 'SI': 'europe', 'SK': 'europe', 'LT': 'europe',
    'LV': 'europe', 'EE': 'europe', 'MT': 'europe', 'CY': 'europe', 'LU': 'europe',
    'IS': 'europe', 'LI': 'europe', 'MC': 'europe', 'SM': 'europe', 'VA': 'europe',
    'AD': 'europe', 'AL': 'europe', 'BA': 'europe', 'ME': 'europe', 'MK': 'europe',
    'RS': 'europe', 'XK': 'europe', 'BY': 'europe', 'MD': 'europe', 'UA': 'europe',
    'RU': 'europe', 'KZ': 'europe', 'UZ': 'europe', 'TM': 'europe', 'KG': 'europe',
    'TJ': 'europe', 'AZ': 'europe', 'GE': 'europe', 'AM': 'europe',
    
    // 북아메리카 (North America)
    'US': 'north-america', 'CA': 'north-america', 'MX': 'north-america',
    'GT': 'north-america', 'BZ': 'north-america', 'SV': 'north-america',
    'HN': 'north-america', 'NI': 'north-america', 'CR': 'north-america',
    'PA': 'north-america', 'CU': 'north-america', 'JM': 'north-america',
    'HT': 'north-america', 'DO': 'north-america', 'PR': 'north-america',
    'TT': 'north-america', 'BB': 'north-america', 'GD': 'north-america',
    'LC': 'north-america', 'VC': 'north-america', 'AG': 'north-america',
    'KN': 'north-america', 'DM': 'north-america', 'BS': 'north-america',
    'TC': 'north-america', 'AI': 'north-america', 'VG': 'north-america',
    'VI': 'north-america', 'AW': 'north-america', 'CW': 'north-america',
    'SX': 'north-america', 'BL': 'north-america', 'MF': 'north-america',
    'GP': 'north-america', 'MQ': 'north-america', 'RE': 'north-america',
    'YT': 'north-america', 'PM': 'north-america', 'ST': 'north-america',
    
    // 남아메리카 (South America)
    'BR': 'south-america', 'AR': 'south-america', 'CL': 'south-america',
    'CO': 'south-america', 'PE': 'south-america', 'VE': 'south-america',
    'EC': 'south-america', 'BO': 'south-america', 'PY': 'south-america',
    'UY': 'south-america', 'GY': 'south-america', 'SR': 'south-america',
    'GF': 'south-america', 'FK': 'south-america', 'PE': 'south-america',
    'CO': 'south-america', 'VE': 'south-america', 'EC': 'south-america',
    'BO': 'south-america', 'PY': 'south-america', 'UY': 'south-america',
    'GY': 'south-america', 'SR': 'south-america', 'GF': 'south-america',
    'FK': 'south-america',
    
    // 아프리카 (Africa)
    'ZA': 'africa', 'EG': 'africa', 'NG': 'africa', 'KE': 'africa', 'GH': 'africa',
    'UG': 'africa', 'TZ': 'africa', 'ET': 'africa', 'SD': 'africa', 'DZ': 'africa',
    'MA': 'africa', 'TN': 'africa', 'LY': 'africa', 'TD': 'africa', 'NE': 'africa',
    'ML': 'africa', 'BF': 'africa', 'CI': 'africa', 'SN': 'africa', 'GN': 'africa',
    'SL': 'africa', 'LR': 'africa', 'TG': 'africa', 'BJ': 'africa', 'GW': 'africa',
    'CV': 'africa', 'GM': 'africa', 'MR': 'africa', 'AO': 'africa', 'MZ': 'africa',
    'ZW': 'africa', 'BW': 'africa', 'NA': 'africa', 'SZ': 'africa', 'LS': 'africa',
    'MW': 'africa', 'ZM': 'africa', 'MG': 'africa', 'MU': 'africa', 'SC': 'africa',
    'KM': 'africa', 'DJ': 'africa', 'SO': 'africa', 'ER': 'africa', 'CF': 'africa',
    'CM': 'africa', 'GQ': 'africa', 'GA': 'africa', 'CG': 'africa', 'CD': 'africa',
    'RW': 'africa', 'BI': 'africa', 'SS': 'africa', 'CF': 'africa', 'TD': 'africa',
    'NE': 'africa', 'ML': 'africa', 'BF': 'africa', 'CI': 'africa', 'SN': 'africa',
    'GN': 'africa', 'SL': 'africa', 'LR': 'africa', 'TG': 'africa', 'BJ': 'africa',
    'GW': 'africa', 'CV': 'africa', 'GM': 'africa', 'MR': 'africa',
    
    // 오세아니아 (Oceania)
    'AU': 'oceania', 'NZ': 'oceania', 'FJ': 'oceania', 'PG': 'oceania',
    'SB': 'oceania', 'VU': 'oceania', 'NC': 'oceania', 'PF': 'oceania',
    'TO': 'oceania', 'WS': 'oceania', 'KI': 'oceania', 'TV': 'oceania',
    'NR': 'oceania', 'PW': 'oceania', 'MH': 'oceania', 'FM': 'oceania',
    'CK': 'oceania', 'NU': 'oceania', 'TK': 'oceania', 'WF': 'oceania',
    'AS': 'oceania', 'GU': 'oceania', 'MP': 'oceania', 'PR': 'oceania',
    'VI': 'oceania', 'BL': 'oceania', 'MF': 'oceania', 'GP': 'oceania',
    'MQ': 'oceania', 'RE': 'oceania', 'YT': 'oceania', 'PM': 'oceania',
    'ST': 'oceania'
};

// 대륙별 색상 매핑
const continentColors = {
    'asia': { bg: '#3B82F6', border: '#1D4ED8', text: 'white' },        // Blue
    'europe': { bg: '#F97316', border: '#EA580C', text: 'white' },       // Orange
    'north-america': { bg: '#EF4444', border: '#DC2626', text: 'white' }, // Red
    'south-america': { bg: '#10B981', border: '#059669', text: 'white' }, // Green
    'africa': { bg: '#8B5CF6', border: '#7C3AED', text: 'white' },       // Purple
    'oceania': { bg: '#EAB308', border: '#CA8A04', text: 'white' }        // Yellow
};

// 국가 코드를 국기 이모지로 변환하는 함수
function getCountryFlag(countryCode) {
    if (!countryCode) return null;
    
    // 국가 코드를 대문자로 변환
    const code = countryCode.toUpperCase();
    
    // 주요 국가들의 국기 이모지 매핑
    const flagMap = {
        'KR': '🇰🇷', 'US': '🇺🇸', 'JP': '🇯🇵', 'CN': '🇨🇳', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
        'IT': '🇮🇹', 'ES': '🇪🇸', 'CA': '🇨🇦', 'AU': '🇦🇺', 'BR': '🇧🇷', 'IN': '🇮🇳', 'RU': '🇷🇺',
        'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'CH': '🇨🇭', 'AT': '🇦🇹',
        'BE': '🇧🇪', 'IE': '🇮🇪', 'PT': '🇵🇹', 'GR': '🇬🇷', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺',
        'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰', 'LT': '🇱🇹', 'LV': '🇱🇻',
        'EE': '🇪🇪', 'MT': '🇲🇹', 'CY': '🇨🇾', 'LU': '🇱🇺', 'IS': '🇮🇸', 'LI': '🇱🇮', 'MC': '🇲🇨',
        'SM': '🇸🇲', 'VA': '🇻🇦', 'AD': '🇦🇩', 'MX': '🇲🇽', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴',
        'PE': '🇵🇪', 'VE': '🇻🇪', 'EC': '🇪🇨', 'BO': '🇧🇴', 'PY': '🇵🇾', 'UY': '🇺🇾', 'GY': '🇬🇾',
        'SR': '🇸🇷', 'GF': '🇬🇫', 'FK': '🇫🇰', 'ZA': '🇿🇦', 'EG': '🇪🇬', 'NG': '🇳🇬', 'KE': '🇰🇪',
        'GH': '🇬🇭', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'ET': '🇪🇹', 'SD': '🇸🇩', 'DZ': '🇩🇿', 'MA': '🇲🇦',
        'TN': '🇹🇳', 'LY': '🇱🇾', 'TD': '🇹🇩', 'NE': '🇳🇪', 'ML': '🇲🇱', 'BF': '🇧🇫', 'CI': '🇨🇮',
        'SN': '🇸🇳', 'GN': '🇬🇳', 'SL': '🇸🇱', 'LR': '🇱🇷', 'TG': '🇹🇬', 'BJ': '🇧🇯', 'GW': '🇬🇼',
        'CV': '🇨🇻', 'GM': '🇬🇲', 'MR': '🇲🇷', 'ML': '🇲🇱', 'TH': '🇹🇭', 'VN': '🇻🇳', 'MY': '🇲🇾',
        'SG': '🇸🇬', 'ID': '🇮🇩', 'PH': '🇵🇭', 'MM': '🇲🇲', 'LA': '🇱🇦', 'KH': '🇰🇭', 'BD': '🇧🇩',
        'LK': '🇱🇰', 'NP': '🇳🇵', 'BT': '🇧🇹', 'MV': '🇲🇻', 'PK': '🇵🇰', 'AF': '🇦🇫', 'IR': '🇮🇷',
        'IQ': '🇮🇶', 'SA': '🇸🇦', 'AE': '🇦🇪', 'OM': '🇴🇲', 'YE': '🇾🇪', 'JO': '🇯🇴', 'LB': '🇱🇧',
        'SY': '🇸🇾', 'IL': '🇮🇱', 'PS': '🇵🇸', 'TR': '🇹🇷', 'GE': '🇬🇪', 'AM': '🇦🇲', 'AZ': '🇦🇿',
        'KZ': '🇰🇿', 'UZ': '🇺🇿', 'TM': '🇹🇲', 'KG': '🇰🇬', 'TJ': '🇹🇯', 'MN': '🇲🇳', 'KP': '🇰🇵',
        'TW': '🇹🇼', 'HK': '🇭🇰', 'MO': '🇲🇴', 'NZ': '🇳🇿', 'FJ': '🇫🇯', 'PG': '🇵🇬', 'SB': '🇸🇧',
        'VU': '🇻🇺', 'NC': '🇳🇨', 'PF': '🇵🇫', 'TO': '🇹🇴', 'WS': '🇼🇸', 'KI': '🇰🇮', 'TV': '🇹🇻',
        'NR': '🇳🇷', 'PW': '🇵🇼', 'MH': '🇲🇭', 'FM': '🇫🇲', 'CK': '🇨🇰', 'NU': '🇳🇺', 'TK': '🇹🇰',
        'WF': '🇼🇫', 'AS': '🇦🇸', 'GU': '🇬🇺', 'MP': '🇲🇵', 'PR': '🇵🇷', 'VI': '🇻🇮', 'BL': '🇧🇱',
        'MF': '🇲🇫', 'GP': '🇬🇵', 'MQ': '🇲🇶', 'RE': '🇷🇪', 'YT': '🇾🇹', 'PM': '🇵🇲', 'ST': '🇸🇹',
        'AO': '🇦🇴', 'MZ': '🇲🇿', 'ZW': '🇿🇼', 'BW': '🇧🇼', 'NA': '🇳🇦', 'SZ': '🇸🇿', 'LS': '🇱🇸',
        'MW': '🇲🇼', 'ZM': '🇿🇲', 'MG': '🇲🇬', 'MU': '🇲🇺', 'SC': '🇸🇨', 'KM': '🇰🇲', 'DJ': '🇩🇯',
        'SO': '🇸🇴', 'ER': '🇪🇷', 'CF': '🇨🇫', 'CM': '🇨🇲', 'GQ': '🇬🇶', 'GA': '🇬🇦', 'CG': '🇨🇬',
        'CD': '🇨🇩', 'RW': '🇷🇼', 'BI': '🇧🇮', 'SS': '🇸🇸', 'CF': '🇨🇫', 'TD': '🇹🇩', 'NE': '🇳🇪',
        'ML': '🇲🇱', 'BF': '🇧🇫', 'CI': '🇨🇮', 'SN': '🇸🇳', 'GN': '🇬🇳', 'SL': '🇸🇱', 'LR': '🇱🇷',
        'TG': '🇹🇬', 'BJ': '🇧🇯', 'GW': '🇬🇼', 'CV': '🇨🇻', 'GM': '🇬🇲', 'MR': '🇲🇷', 'ML': '🇲🇱'
    };
    
    return flagMap[code] || null;
}

// 국가 코드로 대륙을 가져오는 함수
function getContinentFromCountryCode(countryCode) {
    if (!countryCode) return 'unknown';
    return countryToContinent[countryCode.toUpperCase()] || 'unknown';
}

// 대륙별 색상을 가져오는 함수
function getContinentColor(continent) {
    return continentColors[continent] || { bg: '#6B7280', border: '#4B5563', text: 'white' };
}

// 텍스트를 축약하는 함수
function truncateText(text, maxLength = 6) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '..';
}

// 일정 표시 텍스트 생성 함수
function getEventDisplayText(entry) {
    // 국기 이모지가 있는 경우 우선 사용
    const flag = getCountryFlag(entry.countryCode);
    if (flag) {
        return flag;
    }
    
    // 국기 이모지가 없는 경우 2글자 국가 코드 사용
    if (entry.countryCode) {
        return entry.countryCode.toUpperCase();
    }
    
    // 국가 코드도 없는 경우 텍스트 축약
    return truncateText(entry.country, 6);
}

// 캘린더 렌더링
function renderCalendar() {
    try {
        const calendarBody = SafeDOM.getElement('#calendar-body');
        const calendarEmpty = SafeDOM.getElement('#calendar-empty');
        const currentMonthElement = SafeDOM.getElement('#current-month');

        if (!calendarBody || !calendarEmpty || !currentMonthElement) {
            throw new Error('캘린더 요소를 찾을 수 없습니다.');
        }

        if (entries.length === 0) {
            safeExecute(() => {
                calendarBody.style.display = 'none';
                calendarEmpty.style.display = 'block';
            }, { function: 'calendar.empty.display' });
            return;
        }

        safeExecute(() => {
            calendarBody.style.display = 'table-row-group';
            calendarEmpty.style.display = 'none';
        }, { function: 'calendar.body.display' });

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        safeExecute(() => {
            currentMonthElement.textContent = `${year}년 ${month + 1}월`;
        }, { function: 'currentMonth.textContent' });

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
                try {
                    const eventStart = new Date(entry.startDate);
                    const eventEnd = new Date(entry.endDate);
                    
                    // 날짜 비교를 위해 시간을 제거하고 날짜만 비교
                    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                    const eventStartOnly = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
                    const eventEndOnly = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
                    
                    return currentDateOnly >= eventStartOnly && currentDateOnly <= eventEndOnly;
                } catch (error) {
                    errorHandler.handleError(error, { 
                        entryId: entry.id,
                        startDate: entry.startDate,
                        endDate: entry.endDate
                    }, ErrorSeverity.LOW);
                    return false;
                }
            });

            let dayContent = `<div class="text-xs sm:text-sm font-medium">${currentDate.getDate()}</div>`;
            
            if (dayEvents.length > 0) {
                dayContent += `<div class="mt-1 space-y-0.5 sm:space-y-1">`;
                dayEvents.forEach((event, index) => {
                    try {
                        const purposeText = safeExecute(() => getPurposeText(event.purpose), { purpose: event.purpose });
                        
                        // 툴팁 내용을 안전하게 생성
                        const tooltipText = `${sanitizeMemo(event.country)} / ${sanitizeMemo(event.city)}\\n${purposeText}\\n📅 ${event.startDate} ~ ${event.endDate}${event.memo ? '\\n📝 ' + sanitizeMemo(event.memo) : ''}`;
                        
                        // 대륙별 색상 결정
                        const continent = safeExecute(() => getContinentFromCountryCode(event.countryCode), { countryCode: event.countryCode });
                        const continentColor = safeExecute(() => getContinentColor(continent), { continent });
                        
                        // 일정 표시 텍스트 생성
                        const displayText = safeExecute(() => getEventDisplayText(event), { entryId: event.id });
                        
                        if (continentColor && displayText) {
                            dayContent += `
                                <div class="calendar-event text-xs overflow-hidden whitespace-nowrap"
                                     data-event-index="${index}"
                                     data-tooltip="${tooltipText.replace(/"/g, '&quot;')}"
                                     data-entry-id="${event.id}"
                                     data-continent="${continent}"
                                     onmouseenter="createTooltip(event, this.dataset.tooltip)"
                                     onmouseleave="removeTooltip()"
                                     onclick="showEntryDetail('${event.id}')"
                                     title="${sanitizeMemo(event.country)}"
                                     style="cursor: pointer; max-height: 1.2em; line-height: 1.2em; max-width: 100%; background-color: ${continentColor.bg}; border-left-color: ${continentColor.border}; color: ${continentColor.text};">
                                    <span class="truncate block w-full">${sanitizeMemo(displayText)}</span>
                                </div>
                            `;
                        }
                    } catch (error) {
                        errorHandler.handleError(error, { 
                            entryId: event.id,
                            index: index
                        }, ErrorSeverity.LOW);
                    }
                });
                dayContent += `</div>`;
            }

            const cellClass = `
                border border-gray-200 p-1 sm:p-2 h-20 sm:h-28 align-top overflow-hidden
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                ${isToday ? 'bg-blue-50 border-blue-200' : ''}
            `;

            currentRow += `<td class="${cellClass}">${dayContent}</td>`;
        }

        if (currentRow) {
            calendarHTML += `<tr>${currentRow}</tr>`;
        }

        const success = SafeDOM.setInnerHTML(calendarBody, calendarHTML);
        if (!success) {
            throw new Error('캘린더 HTML 설정에 실패했습니다.');
        }
        
    } catch (error) {
        errorHandler.handleError(error, { function: 'renderCalendar' }, ErrorSeverity.MEDIUM);
    }
}

// 툴팁 생성 함수
function createTooltip(event, tooltipContent) {
    try {
        // 기존 툴팁 제거
        const existingTooltip = SafeDOM.getElement('.calendar-tooltip');
        if (existingTooltip) {
            safeExecute(() => existingTooltip.remove(), { function: 'existingTooltip.remove' });
        }

        const tooltip = SafeDOM.createElement('div', {
            class: 'calendar-tooltip fixed z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-xs pointer-events-none space-y-1'
        });
        
        if (!tooltip) {
            throw new Error('툴팁 요소 생성에 실패했습니다.');
        }
        
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
        
        const success = SafeDOM.setInnerHTML(tooltip, htmlContent);
        if (!success) {
            throw new Error('툴팁 HTML 설정에 실패했습니다.');
        }
        
        const bodyAppendSuccess = SafeDOM.appendChild(document.body, tooltip);
        if (!bodyAppendSuccess) {
            throw new Error('툴팁을 body에 추가하는데 실패했습니다.');
        }

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

        safeExecute(() => {
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        }, { function: 'tooltip.position' });
        
    } catch (error) {
        errorHandler.handleError(error, { function: 'createTooltip' }, ErrorSeverity.MEDIUM);
    }
}

// 툴팁 제거 함수
function removeTooltip() {
    const tooltip = document.querySelector('.calendar-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
    // 관련 타이머들 정리
    globalEventManager.clearTimeout('tooltip-outside-click-delay');
    globalEventManager.clearTimeout('touch-tooltip-delay');
}

// 툴팁 관련 변수
let activeTooltip = null;

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
    globalEventManager.addEventListener(
        document.getElementById('prev-month'),
        'click',
        function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateDropdownsFromCurrentDate();
            renderCalendar();
        }
    );

    globalEventManager.addEventListener(
        document.getElementById('next-month'),
        'click',
        function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateDropdownsFromCurrentDate();
            renderCalendar();
        }
    );

    // 드롭다운 값 변경 이벤트 리스너
    globalEventManager.addEventListener(
        document.getElementById('year-select'),
        'change',
        updateCalendarFromDropdowns
    );
    
    globalEventManager.addEventListener(
        document.getElementById('month-select'),
        'change',
        updateCalendarFromDropdowns
    );
} 
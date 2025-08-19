/**
 * major-cities-tier2-europe.js - Tier 2 유럽 도시 데이터
 * 유럽 20개국의 주요 도시 데이터 (Tier 2)
 */

// Tier 2 유럽 국가 목록 (20개)
const tier2EuropeCountries = [
    'GR', 'PT', 'PL', 'HU', 'CZ', 'SK', 'SI', 'HR', 'RS', 'BG',
    'RO', 'UA', 'BY', 'LT', 'LV', 'EE', 'IS', 'LU', 'MT', 'CY'
];

// Tier 2 유럽 도시 데이터
const tier2EuropeCities = {
    // 그리스 (GR)
    'GR': [
        { name: '아테네', enName: 'Athens', aliases: ['Athens', '아테네', 'Αθήνα'] },
        { name: '테살로니키', enName: 'Thessaloniki', aliases: ['Thessaloniki', '테살로니키', 'Θεσσαλονίκη'] },
        { name: '파트라', enName: 'Patras', aliases: ['Patras', '파트라', 'Πάτρα'] },
        { name: '피레아스', enName: 'Piraeus', aliases: ['Piraeus', '피레아스', 'Πειραιάς'] },
        { name: '라리사', enName: 'Larissa', aliases: ['Larissa', '라리사', 'Λάρισα'] },
        { name: '헤라클리온', enName: 'Heraklion', aliases: ['Heraklion', '헤라클리온', 'Ηράκλειο'] },
        { name: '페리스트리', enName: 'Peristeri', aliases: ['Peristeri', '페리스트리', 'Περιστέρι'] },
        { name: '칼리테아', enName: 'Kallithea', aliases: ['Kallithea', '칼리테아', 'Καλλιθέα'] },
        { name: '아카르나니아', enName: 'Acharnes', aliases: ['Acharnes', '아카르나니아', 'Αχαρνές'] },
        { name: '카테리니', enName: 'Katerini', aliases: ['Katerini', '카테리니', 'Κατερίνη'] }
    ],

    // 포르투갈 (PT)
    'PT': [
        { name: '리스본', enName: 'Lisbon', aliases: ['Lisbon', '리스본', 'Lisboa'] },
        { name: '포르투', enName: 'Porto', aliases: ['Porto', '포르투'] },
        { name: '브라가', enName: 'Braga', aliases: ['Braga', '브라가'] },
        { name: '파티마', enName: 'Fatima', aliases: ['Fatima', '파티마', 'Fátima'] },
        { name: '코임브라', enName: 'Coimbra', aliases: ['Coimbra', '코임브라'] },
        { name: '세투발', enName: 'Setubal', aliases: ['Setubal', '세투발', 'Setúbal'] },
        { name: '아마도라', enName: 'Amadora', aliases: ['Amadora', '아마도라'] },
        { name: '알마다', enName: 'Almada', aliases: ['Almada', '알마다'] },
        { name: '아구알바카셈', enName: 'Agualva-Cacem', aliases: ['Agualva-Cacem', '아구알바카셈'] },
        { name: '바르셀로스', enName: 'Barcelos', aliases: ['Barcelos', '바르셀로스'] }
    ],

    // 폴란드 (PL)
    'PL': [
        { name: '바르샤바', enName: 'Warsaw', aliases: ['Warsaw', '바르샤바', 'Warszawa'] },
        { name: '크라쿠프', enName: 'Krakow', aliases: ['Krakow', '크라쿠프', 'Kraków'] },
        { name: '로츠', enName: 'Lodz', aliases: ['Lodz', '로츠', 'Łódź'] },
        { name: '브로츠와프', enName: 'Wroclaw', aliases: ['Wroclaw', '브로츠와프', 'Wrocław'] },
        { name: '포즈난', enName: 'Poznan', aliases: ['Poznan', '포즈난', 'Poznań'] },
        { name: '그단스크', enName: 'Gdansk', aliases: ['Gdansk', '그단스크', 'Gdańsk'] },
        { name: '슈체친', enName: 'Szczecin', aliases: ['Szczecin', '슈체친'] },
        { name: '비드고슈치', enName: 'Bydgoszcz', aliases: ['Bydgoszcz', '비드고슈치'] },
        { name: '루블린', enName: 'Lublin', aliases: ['Lublin', '루블린'] },
        { name: '카토비체', enName: 'Katowice', aliases: ['Katowice', '카토비체'] }
    ],

    // 헝가리 (HU)
    'HU': [
        { name: '부다페스트', enName: 'Budapest', aliases: ['Budapest', '부다페스트'] },
        { name: '데브레첸', enName: 'Debrecen', aliases: ['Debrecen', '데브레첸'] },
        { name: '세게드', enName: 'Szeged', aliases: ['Szeged', '세게드'] },
        { name: '미슈콜츠', enName: 'Miskolc', aliases: ['Miskolc', '미슈콜츠'] },
        { name: '페치', enName: 'Pecs', aliases: ['Pecs', '페치', 'Pécs'] },
        { name: '죄르', enName: 'Gyor', aliases: ['Gyor', '죄르', 'Győr'] },
        { name: '니레지하저', enName: 'Nyiregyhaza', aliases: ['Nyiregyhaza', '니레지하저', 'Nyíregyháza'] },
        { name: '케치케메트', enName: 'Kecskemet', aliases: ['Kecskemet', '케치케메트', 'Kecskemét'] },
        { name: '소프론', enName: 'Sopron', aliases: ['Sopron', '소프론'] },
        { name: '에게르', enName: 'Eger', aliases: ['Eger', '에게르'] }
    ],

    // 체코 (CZ)
    'CZ': [
        { name: '프라하', enName: 'Prague', aliases: ['Prague', '프라하', 'Praha'] },
        { name: '브르노', enName: 'Brno', aliases: ['Brno', '브르노'] },
        { name: '오스트라바', enName: 'Ostrava', aliases: ['Ostrava', '오스트라바'] },
        { name: '플젠', enName: 'Plzen', aliases: ['Plzen', '플젠', 'Plzeň'] },
        { name: '올로모우츠', enName: 'Olomouc', aliases: ['Olomouc', '올로모우츠'] },
        { name: '리베레츠', enName: 'Liberec', aliases: ['Liberec', '리베레츠'] },
        { name: '체스케부데요비체', enName: 'Ceske Budejovice', aliases: ['Ceske Budejovice', '체스케부데요비체', 'České Budějovice'] },
        { name: '우스티나드라벰', enName: 'Usti nad Labem', aliases: ['Usti nad Labem', '우스티나드라벰', 'Ústí nad Labem'] },
        { name: '파르두비체', enName: 'Pardubice', aliases: ['Pardubice', '파르두비체'] },
        { name: '하라드크랄로베', enName: 'Hradec Kralove', aliases: ['Hradec Kralove', '하라드크랄로베', 'Hradec Králové'] }
    ]
};

// Tier 2 유럽 도시 좌표 데이터
const tier2EuropeCityCoordinates = {
    // 그리스 도시들
    "아테네": { lat: 37.9838, lng: 23.7275 },
    "테살로니키": { lat: 40.6401, lng: 22.9444 },
    "파트라": { lat: 38.2466, lng: 21.7346 },
    "피레아스": { lat: 37.9485, lng: 23.6425 },
    "라리사": { lat: 39.6390, lng: 22.4191 },
    "헤라클리온": { lat: 35.3387, lng: 25.1442 },
    "페리스트리": { lat: 38.0153, lng: 23.6919 },
    "칼리테아": { lat: 37.9550, lng: 23.7020 },
    "아카르나니아": { lat: 38.0833, lng: 23.7333 },
    "카테리니": { lat: 40.2719, lng: 22.5025 },

    // 포르투갈 도시들
    "리스본": { lat: 38.7223, lng: -9.1393 },
    "포르투": { lat: 41.1579, lng: -8.6291 },
    "브라가": { lat: 41.5454, lng: -8.4265 },
    "파티마": { lat: 39.6200, lng: -8.6667 },
    "코임브라": { lat: 40.2033, lng: -8.4103 },
    "세투발": { lat: 38.5243, lng: -8.8886 },
    "아마도라": { lat: 38.7548, lng: -9.2308 },
    "알마다": { lat: 38.6792, lng: -9.1569 },
    "아구알바카셈": { lat: 38.7667, lng: -9.3000 },
    "바르셀로스": { lat: 41.5333, lng: -8.6167 },

    // 폴란드 도시들
    "바르샤바": { lat: 52.2297, lng: 21.0122 },
    "크라쿠프": { lat: 50.0647, lng: 19.9450 },
    "로츠": { lat: 51.7592, lng: 19.4559 },
    "브로츠와프": { lat: 51.1079, lng: 17.0385 },
    "포즈난": { lat: 52.4064, lng: 16.9252 },
    "그단스크": { lat: 54.3520, lng: 18.6466 },
    "슈체친": { lat: 53.4285, lng: 14.5528 },
    "비드고슈치": { lat: 53.1235, lng: 18.0084 },
    "루블린": { lat: 51.2465, lng: 22.5684 },
    "카토비체": { lat: 50.2613, lng: 19.0237 },

    // 헝가리 도시들
    "부다페스트": { lat: 47.4979, lng: 19.0402 },
    "데브레첸": { lat: 47.5299, lng: 21.6392 },
    "세게드": { lat: 46.2530, lng: 20.1414 },
    "미슈콜츠": { lat: 48.1031, lng: 20.7784 },
    "페치": { lat: 46.0727, lng: 18.2323 },
    "죄르": { lat: 47.6875, lng: 17.6504 },
    "니레지하저": { lat: 47.9495, lng: 21.7244 },
    "케치케메트": { lat: 46.9061, lng: 19.6897 },
    "소프론": { lat: 47.6819, lng: 16.5845 },
    "에게르": { lat: 47.9029, lng: 20.3772 },

    // 체코 도시들
    "프라하": { lat: 50.0755, lng: 14.4378 },
    "브르노": { lat: 49.1951, lng: 16.6078 },
    "오스트라바": { lat: 49.8209, lng: 18.2625 },
    "플젠": { lat: 49.7475, lng: 13.3776 },
    "올로모우츠": { lat: 49.5938, lng: 17.2508 },
    "리베레츠": { lat: 50.7663, lng: 15.0543 },
    "체스케부데요비체": { lat: 48.9745, lng: 14.4740 },
    "우스티나드라벰": { lat: 50.6611, lng: 14.0322 },
    "파르두비체": { lat: 50.0343, lng: 15.7812 },
    "하라드크랄로베": { lat: 50.2092, lng: 15.8327 }
};

// 전역 객체에 할당
window.tier2EuropeCountries = tier2EuropeCountries;
window.tier2EuropeCities = tier2EuropeCities;
window.tier2EuropeCityCoordinates = tier2EuropeCityCoordinates;

console.log('Tier 2 유럽 도시 데이터 로드 완료 (20개 국가)');

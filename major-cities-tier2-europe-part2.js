/**
 * major-cities-tier2-europe-part2.js - Tier 2 유럽 도시 데이터 (Part 2)
 * 유럽 나머지 15개국의 주요 도시 데이터 (Tier 2)
 */

// Tier 2 유럽 Part 2 도시 데이터
const tier2EuropeCitiesPart2 = {
    // 슬로바키아 (SK)
    'SK': [
        { name: '브라티슬라바', enName: 'Bratislava', aliases: ['Bratislava', '브라티슬라바'] },
        { name: '코시체', enName: 'Kosice', aliases: ['Kosice', '코시체', 'Košice'] },
        { name: '프레소프', enName: 'Presov', aliases: ['Presov', '프레소프', 'Prešov'] },
        { name: '니트라', enName: 'Nitra', aliases: ['Nitra', '니트라'] },
        { name: '질리나', enName: 'Zilina', aliases: ['Zilina', '질리나', 'Žilina'] },
        { name: '반스카비스트리차', enName: 'Banska Bystrica', aliases: ['Banska Bystrica', '반스카비스트리차', 'Banská Bystrica'] },
        { name: '트르나바', enName: 'Trnava', aliases: ['Trnava', '트르나바'] },
        { name: '트렌친', enName: 'Trencin', aliases: ['Trencin', '트렌친', 'Trenčín'] },
        { name: '마르틴', enName: 'Martin', aliases: ['Martin', '마르틴'] },
        { name: '포프라드', enName: 'Poprad', aliases: ['Poprad', '포프라드'] }
    ],

    // 슬로베니아 (SI)
    'SI': [
        { name: '류블랴나', enName: 'Ljubljana', aliases: ['Ljubljana', '류블랴나'] },
        { name: '마리보르', enName: 'Maribor', aliases: ['Maribor', '마리보르'] },
        { name: '첼레', enName: 'Celje', aliases: ['Celje', '첼레'] },
        { name: '크라니', enName: 'Kranj', aliases: ['Kranj', '크라니'] },
        { name: '벨레네', enName: 'Velenje', aliases: ['Velenje', '벨레네'] },
        { name: '코페르', enName: 'Koper', aliases: ['Koper', '코페르'] },
        { name: '노보메스토', enName: 'Novo Mesto', aliases: ['Novo Mesto', '노보메스토'] },
        { name: '프투이', enName: 'Ptuj', aliases: ['Ptuj', '프투이'] },
        { name: '트르보블레', enName: 'Trbovlje', aliases: ['Trbovlje', '트르보블레'] },
        { name: '카멘', enName: 'Kamnik', aliases: ['Kamnik', '카멘'] }
    ],

    // 크로아티아 (HR)
    'HR': [
        { name: '자그레브', enName: 'Zagreb', aliases: ['Zagreb', '자그레브'] },
        { name: '스플리트', enName: 'Split', aliases: ['Split', '스플리트'] },
        { name: '리예카', enName: 'Rijeka', aliases: ['Rijeka', '리예카'] },
        { name: '오시예크', enName: 'Osijek', aliases: ['Osijek', '오시예크'] },
        { name: '자다르', enName: 'Zadar', aliases: ['Zadar', '자다르'] },
        { name: '슬라본스키브로드', enName: 'Slavonski Brod', aliases: ['Slavonski Brod', '슬라본스키브로드'] },
        { name: '카를로바츠', enName: 'Karlovac', aliases: ['Karlovac', '카를로바츠'] },
        { name: '바라주딘', enName: 'Varazdin', aliases: ['Varazdin', '바라주딘', 'Varaždin'] },
        { name: '시베니크', enName: 'Sibenik', aliases: ['Sibenik', '시베니크', 'Šibenik'] },
        { name: '두브로브니크', enName: 'Dubrovnik', aliases: ['Dubrovnik', '두브로브니크'] }
    ],

    // 세르비아 (RS)
    'RS': [
        { name: '베오그라드', enName: 'Belgrade', aliases: ['Belgrade', '베오그라드', 'Beograd'] },
        { name: '노비사드', enName: 'Novi Sad', aliases: ['Novi Sad', '노비사드'] },
        { name: '니시', enName: 'Nis', aliases: ['Nis', '니시', 'Niš'] },
        { name: '크라구예바츠', enName: 'Kragujevac', aliases: ['Kragujevac', '크라구예바츠'] },
        { name: '수보티차', enName: 'Subotica', aliases: ['Subotica', '수보티차'] },
        { name: '즈레냐닌', enName: 'Zrenjanin', aliases: ['Zrenjanin', '즈레냐닌'] },
        { name: '파네보', enName: 'Pancevo', aliases: ['Pancevo', '파네보', 'Pančevo'] },
        { name: '차차크', enName: 'Cacak', aliases: ['Cacak', '차차크', 'Čačak'] },
        { name: '노비파자르', enName: 'Novi Pazar', aliases: ['Novi Pazar', '노비파자르'] },
        { name: '크랄레보', enName: 'Kraljevo', aliases: ['Kraljevo', '크랄레보'] }
    ],

    // 불가리아 (BG)
    'BG': [
        { name: '소피아', enName: 'Sofia', aliases: ['Sofia', '소피아', 'София'] },
        { name: '플로브디프', enName: 'Plovdiv', aliases: ['Plovdiv', '플로브디프', 'Пловдив'] },
        { name: '바르나', enName: 'Varna', aliases: ['Varna', '바르나', 'Варна'] },
        { name: '부르가스', enName: 'Burgas', aliases: ['Burgas', '부르가스', 'Бургас'] },
        { name: '루세', enName: 'Ruse', aliases: ['Ruse', '루세', 'Русе'] },
        { name: '스타라자고라', enName: 'Stara Zagora', aliases: ['Stara Zagora', '스타라자고라', 'Стара Загора'] },
        { name: '플레벤', enName: 'Pleven', aliases: ['Pleven', '플레벤', 'Плевен'] },
        { name: '슬리벤', enName: 'Sliven', aliases: ['Sliven', '슬리벤', 'Сливен'] },
        { name: '도브리치', enName: 'Dobrich', aliases: ['Dobrich', '도브리치', 'Добрич'] },
        { name: '슈멘', enName: 'Shumen', aliases: ['Shumen', '슈멘', 'Шумен'] }
    ]
};

// Tier 2 유럽 Part 2 도시 좌표 데이터
const tier2EuropeCityCoordinatesPart2 = {
    // 슬로바키아 도시들
    "브라티슬라바": { lat: 48.1486, lng: 17.1077 },
    "코시체": { lat: 48.7164, lng: 21.2611 },
    "프레소프": { lat: 48.9984, lng: 21.2339 },
    "니트라": { lat: 48.3069, lng: 18.0863 },
    "질리나": { lat: 49.2231, lng: 18.7394 },
    "반스카비스트리차": { lat: 48.7353, lng: 19.1458 },
    "트르나바": { lat: 48.3774, lng: 17.5880 },
    "트렌친": { lat: 48.8945, lng: 18.0444 },
    "마르틴": { lat: 49.0665, lng: 18.9235 },
    "포프라드": { lat: 49.0554, lng: 20.2984 },

    // 슬로베니아 도시들
    "류블랴나": { lat: 46.0569, lng: 14.5058 },
    "마리보르": { lat: 46.5547, lng: 15.6467 },
    "첼레": { lat: 46.2309, lng: 15.2604 },
    "크라니": { lat: 46.2389, lng: 14.3556 },
    "벨레네": { lat: 46.3625, lng: 15.1144 },
    "코페르": { lat: 45.5481, lng: 13.7302 },
    "노보메스토": { lat: 45.8035, lng: 15.1689 },
    "프투이": { lat: 46.4203, lng: 15.8700 },
    "트르보블레": { lat: 46.1590, lng: 15.0533 },
    "카멘": { lat: 46.2259, lng: 14.6081 },

    // 크로아티아 도시들
    "자그레브": { lat: 45.8150, lng: 15.9819 },
    "스플리트": { lat: 43.5081, lng: 16.4402 },
    "리예카": { lat: 45.3271, lng: 14.4422 },
    "오시예크": { lat: 45.5556, lng: 18.6955 },
    "자다르": { lat: 44.1194, lng: 15.2314 },
    "슬라본스키브로드": { lat: 45.1603, lng: 18.0156 },
    "카를로바츠": { lat: 45.4929, lng: 15.5553 },
    "바라주딘": { lat: 46.3057, lng: 16.3366 },
    "시베니크": { lat: 43.7350, lng: 15.8950 },
    "두브로브니크": { lat: 42.6507, lng: 18.0944 },

    // 세르비아 도시들
    "베오그라드": { lat: 44.7866, lng: 20.4489 },
    "노비사드": { lat: 45.2551, lng: 19.8452 },
    "니시": { lat: 43.3247, lng: 21.9033 },
    "크라구예바츠": { lat: 44.0167, lng: 20.9167 },
    "수보티차": { lat: 46.1000, lng: 19.6667 },
    "즈레냐닌": { lat: 45.3833, lng: 20.3833 },
    "파네보": { lat: 44.8667, lng: 20.6500 },
    "차차크": { lat: 43.8833, lng: 20.3500 },
    "노비파자르": { lat: 43.1500, lng: 20.5167 },
    "크랄레보": { lat: 43.7167, lng: 20.6833 },

    // 불가리아 도시들
    "소피아": { lat: 42.6977, lng: 23.3219 },
    "플로브디프": { lat: 42.1354, lng: 24.7453 },
    "바르나": { lat: 43.2141, lng: 27.9147 },
    "부르가스": { lat: 42.5048, lng: 27.4626 },
    "루세": { lat: 43.8564, lng: 25.9708 },
    "스타라자고라": { lat: 42.4328, lng: 25.6419 },
    "플레벤": { lat: 43.4167, lng: 24.6167 },
    "슬리벤": { lat: 42.6833, lng: 26.3333 },
    "도브리치": { lat: 43.5667, lng: 27.8333 },
    "슈멘": { lat: 43.2667, lng: 26.9333 }
};

// 전역 객체에 할당
window.tier2EuropeCitiesPart2 = tier2EuropeCitiesPart2;
window.tier2EuropeCityCoordinatesPart2 = tier2EuropeCityCoordinatesPart2;

console.log('Tier 2 유럽 Part 2 도시 데이터 로드 완료 (15개 국가)');

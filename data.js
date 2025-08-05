/**
 * data.js - 국가, 도시, 좌표 데이터
 * 애플리케이션에서 사용하는 모든 정적 데이터를 포함
 */

// 국가 데이터 (code, label, aliases, enLabel 구조)
const countries = [
    { code: 'KR', label: '대한민국', enLabel: 'South Korea', aliases: ['Korea', 'South Korea', '한국', '대한민국', 'Republic of Korea'] },
    { code: 'JP', label: '일본', enLabel: 'Japan', aliases: ['Japan', '일본', 'Nippon'] },
    { code: 'US', label: '미국', enLabel: 'United States', aliases: ['USA', 'United States', '미국', 'America'] },
    { code: 'GB', label: '영국', enLabel: 'United Kingdom', aliases: ['UK', 'United Kingdom', '영국', 'Great Britain'] },
    { code: 'FR', label: '프랑스', enLabel: 'France', aliases: ['France', '프랑스'] },
    { code: 'DE', label: '독일', enLabel: 'Germany', aliases: ['Germany', '독일', 'Deutschland'] }
];

// 도시 좌표 매핑 테이블
const cityCoordinates = {
    // 한국 도시들
    "서울": { lat: 37.5665, lng: 126.9780 },
    "부산": { lat: 35.1796, lng: 129.0756 },
    "대구": { lat: 35.8714, lng: 128.6014 },
    "인천": { lat: 37.4563, lng: 126.7052 },
    "광주": { lat: 35.1595, lng: 126.8526 },
    "대전": { lat: 36.3504, lng: 127.3845 },
    "울산": { lat: 35.5384, lng: 129.3114 },
    "제주": { lat: 33.4996, lng: 126.5312 },
    
    // 일본 도시들
    "도쿄": { lat: 35.6895, lng: 139.6917 },
    "오사카": { lat: 34.6937, lng: 135.5023 },
    "교토": { lat: 35.0116, lng: 135.7681 },
    "요코하마": { lat: 35.4437, lng: 139.6380 },
    "나고야": { lat: 35.1815, lng: 136.9066 },
    "삿포로": { lat: 43.0618, lng: 141.3545 },
    
    // 미국 도시들
    "뉴욕": { lat: 40.7128, lng: -74.0060 },
    "로스앤젤레스": { lat: 34.0522, lng: -118.2437 },
    "시카고": { lat: 41.8781, lng: -87.6298 },
    "휴스턴": { lat: 29.7604, lng: -95.3698 },
    "피닉스": { lat: 33.4484, lng: -112.0740 },
    "필라델피아": { lat: 39.9526, lng: -75.1652 },
    
    // 영국 도시들
    "런던": { lat: 51.5074, lng: -0.1278 },
    "버밍엄": { lat: 52.4862, lng: -1.8904 },
    "리즈": { lat: 53.8008, lng: -1.5491 },
    "글래스고": { lat: 55.8642, lng: -4.2518 },
    "셰필드": { lat: 53.3811, lng: -1.4701 },
    "브래드포드": { lat: 53.7958, lng: -1.7594 },
    
    // 프랑스 도시들
    "파리": { lat: 48.8566, lng: 2.3522 },
    "마르세유": { lat: 43.2965, lng: 5.3698 },
    "리옹": { lat: 45.7578, lng: 4.8320 },
    "툴루즈": { lat: 43.6047, lng: 1.4442 },
    "니스": { lat: 43.7102, lng: 7.2620 },
    "낭트": { lat: 47.2184, lng: -1.5536 },
    
    // 독일 도시들
    "베를린": { lat: 52.5200, lng: 13.4050 },
    "함부르크": { lat: 53.5511, lng: 9.9937 },
    "뮌헨": { lat: 48.1351, lng: 11.5820 },
    "쾰른": { lat: 50.9375, lng: 6.9603 },
    "프랑크푸르트": { lat: 50.1109, lng: 8.6821 },
    "슈투트가르트": { lat: 48.7758, lng: 9.1829 }
};

// 도시 데이터 (국가별 도시 목록)
const cities = {
    'KR': [
        { name: '서울', enName: 'Seoul', aliases: ['Seoul', '서울', '서울특별시'] },
        { name: '부산', enName: 'Busan', aliases: ['Busan', '부산', '부산광역시'] },
        { name: '대구', enName: 'Daegu', aliases: ['Daegu', '대구', '대구광역시'] },
        { name: '인천', enName: 'Incheon', aliases: ['Incheon', '인천', '인천광역시'] },
        { name: '광주', enName: 'Gwangju', aliases: ['Gwangju', '광주', '광주광역시'] },
        { name: '대전', enName: 'Daejeon', aliases: ['Daejeon', '대전', '대전광역시'] },
        { name: '울산', enName: 'Ulsan', aliases: ['Ulsan', '울산', '울산광역시'] },
        { name: '제주', enName: 'Jeju', aliases: ['Jeju', '제주', '제주특별자치도'] }
    ],
    'JP': [
        { name: '도쿄', enName: 'Tokyo', aliases: ['Tokyo', '도쿄', '東京'] },
        { name: '오사카', enName: 'Osaka', aliases: ['Osaka', '오사카', '大阪'] },
        { name: '교토', enName: 'Kyoto', aliases: ['Kyoto', '교토', '京都'] },
        { name: '요코하마', enName: 'Yokohama', aliases: ['Yokohama', '요코하마', '横浜'] },
        { name: '나고야', enName: 'Nagoya', aliases: ['Nagoya', '나고야', '名古屋'] },
        { name: '삿포로', enName: 'Sapporo', aliases: ['Sapporo', '삿포로', '札幌'] }
    ],
    'US': [
        { name: '뉴욕', enName: 'New York', aliases: ['New York', '뉴욕', 'NYC'] },
        { name: '로스앤젤레스', enName: 'Los Angeles', aliases: ['Los Angeles', '로스앤젤레스', 'LA'] },
        { name: '시카고', enName: 'Chicago', aliases: ['Chicago', '시카고'] },
        { name: '휴스턴', enName: 'Houston', aliases: ['Houston', '휴스턴'] },
        { name: '피닉스', enName: 'Phoenix', aliases: ['Phoenix', '피닉스'] },
        { name: '필라델피아', enName: 'Philadelphia', aliases: ['Philadelphia', '필라델피아'] }
    ],
    'GB': [
        { name: '런던', enName: 'London', aliases: ['London', '런던'] },
        { name: '버밍엄', enName: 'Birmingham', aliases: ['Birmingham', '버밍엄'] },
        { name: '리즈', enName: 'Leeds', aliases: ['Leeds', '리즈'] },
        { name: '글래스고', enName: 'Glasgow', aliases: ['Glasgow', '글래스고'] },
        { name: '셰필드', enName: 'Sheffield', aliases: ['Sheffield', '셰필드'] },
        { name: '브래드포드', enName: 'Bradford', aliases: ['Bradford', '브래드포드'] }
    ],
    'FR': [
        { name: '파리', enName: 'Paris', aliases: ['Paris', '파리'] },
        { name: '마르세유', enName: 'Marseille', aliases: ['Marseille', '마르세유'] },
        { name: '리옹', enName: 'Lyon', aliases: ['Lyon', '리옹'] },
        { name: '툴루즈', enName: 'Toulouse', aliases: ['Toulouse', '툴루즈'] },
        { name: '니스', enName: 'Nice', aliases: ['Nice', '니스'] },
        { name: '낭트', enName: 'Nantes', aliases: ['Nantes', '낭트'] }
    ],
    'DE': [
        { name: '베를린', enName: 'Berlin', aliases: ['Berlin', '베를린'] },
        { name: '함부르크', enName: 'Hamburg', aliases: ['Hamburg', '함부르크'] },
        { name: '뮌헨', enName: 'Munich', aliases: ['Munich', '뮌헨', 'München'] },
        { name: '쾰른', enName: 'Cologne', aliases: ['Cologne', '쾰른', 'Köln'] },
        { name: '프랑크푸르트', enName: 'Frankfurt', aliases: ['Frankfurt', '프랑크푸르트'] },
        { name: '슈투트가르트', enName: 'Stuttgart', aliases: ['Stuttgart', '슈투트가르트'] }
    ]
}; 
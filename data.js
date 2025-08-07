/**
 * data.js - 국가, 도시, 좌표 데이터
 * 애플리케이션에서 사용하는 모든 정적 데이터를 포함
 */

// 검증된 국가 데이터 라이브러리 로드
let countriesData = null;
let countryFlags = {};

// 기존 6개 국가 데이터 (하위 호환성 유지)
const originalCountries = [
    { code: 'KR', label: '대한민국', enLabel: 'South Korea', aliases: ['Korea', 'South Korea', '한국', '대한민국', 'Republic of Korea'] },
    { code: 'JP', label: '일본', enLabel: 'Japan', aliases: ['Japan', '일본', 'Nippon'] },
    { code: 'US', label: '미국', enLabel: 'United States', aliases: ['USA', 'United States', '미국', 'America'] },
    { code: 'GB', label: '영국', enLabel: 'United Kingdom', aliases: ['UK', 'United Kingdom', '영국', 'Great Britain'] },
    { code: 'FR', label: '프랑스', enLabel: 'France', aliases: ['France', '프랑스'] },
    { code: 'DE', label: '독일', enLabel: 'Germany', aliases: ['Germany', '독일', 'Deutschland'] }
];

// 국가 데이터 초기화 함수
async function initializeCountriesData() {
    try {
        // 정적 국가 데이터 (195개 국가)
        const staticCountries = [
            { code: 'AF', label: '아프가니스탄', enLabel: 'Afghanistan', aliases: ['Afghanistan', '아프가니스탄'] },
            { code: 'AL', label: '알바니아', enLabel: 'Albania', aliases: ['Albania', '알바니아'] },
            { code: 'DZ', label: '알제리', enLabel: 'Algeria', aliases: ['Algeria', '알제리'] },
            { code: 'AD', label: '안도라', enLabel: 'Andorra', aliases: ['Andorra', '안도라'] },
            { code: 'AO', label: '앙골라', enLabel: 'Angola', aliases: ['Angola', '앙골라'] },
            { code: 'AG', label: '앤티가 바부다', enLabel: 'Antigua and Barbuda', aliases: ['Antigua and Barbuda', '앤티가 바부다'] },
            { code: 'AR', label: '아르헨티나', enLabel: 'Argentina', aliases: ['Argentina', '아르헨티나'] },
            { code: 'AM', label: '아르메니아', enLabel: 'Armenia', aliases: ['Armenia', '아르메니아'] },
            { code: 'AU', label: '호주', enLabel: 'Australia', aliases: ['Australia', '호주'] },
            { code: 'AT', label: '오스트리아', enLabel: 'Austria', aliases: ['Austria', '오스트리아', 'Österreich'] },
            { code: 'AZ', label: '아제르바이잔', enLabel: 'Azerbaijan', aliases: ['Azerbaijan', '아제르바이잔'] },
            { code: 'BS', label: '바하마', enLabel: 'Bahamas', aliases: ['Bahamas', '바하마'] },
            { code: 'BH', label: '바레인', enLabel: 'Bahrain', aliases: ['Bahrain', '바레인'] },
            { code: 'BD', label: '방글라데시', enLabel: 'Bangladesh', aliases: ['Bangladesh', '방글라데시'] },
            { code: 'BB', label: '바베이도스', enLabel: 'Barbados', aliases: ['Barbados', '바베이도스'] },
            { code: 'BY', label: '벨라루스', enLabel: 'Belarus', aliases: ['Belarus', '벨라루스'] },
            { code: 'BE', label: '벨기에', enLabel: 'Belgium', aliases: ['Belgium', '벨기에'] },
            { code: 'BZ', label: '벨리즈', enLabel: 'Belize', aliases: ['Belize', '벨리즈'] },
            { code: 'BJ', label: '베냉', enLabel: 'Benin', aliases: ['Benin', '베냉'] },
            { code: 'BT', label: '부탄', enLabel: 'Bhutan', aliases: ['Bhutan', '부탄'] },
            { code: 'BO', label: '볼리비아', enLabel: 'Bolivia', aliases: ['Bolivia', '볼리비아'] },
            { code: 'BA', label: '보스니아 헤르체고비나', enLabel: 'Bosnia and Herzegovina', aliases: ['Bosnia and Herzegovina', '보스니아 헤르체고비나'] },
            { code: 'BW', label: '보츠와나', enLabel: 'Botswana', aliases: ['Botswana', '보츠와나'] },
            { code: 'BR', label: '브라질', enLabel: 'Brazil', aliases: ['Brazil', '브라질'] },
            { code: 'BN', label: '브루나이', enLabel: 'Brunei', aliases: ['Brunei', '브루나이'] },
            { code: 'BG', label: '불가리아', enLabel: 'Bulgaria', aliases: ['Bulgaria', '불가리아'] },
            { code: 'BF', label: '부르키나파소', enLabel: 'Burkina Faso', aliases: ['Burkina Faso', '부르키나파소'] },
            { code: 'BI', label: '부룬디', enLabel: 'Burundi', aliases: ['Burundi', '부룬디'] },
            { code: 'KH', label: '캄보디아', enLabel: 'Cambodia', aliases: ['Cambodia', '캄보디아'] },
            { code: 'CM', label: '카메룬', enLabel: 'Cameroon', aliases: ['Cameroon', '카메룬'] },
            { code: 'CA', label: '캐나다', enLabel: 'Canada', aliases: ['Canada', '캐나다'] },
            { code: 'CV', label: '카보베르데', enLabel: 'Cape Verde', aliases: ['Cape Verde', '카보베르데'] },
            { code: 'CF', label: '중앙아프리카공화국', enLabel: 'Central African Republic', aliases: ['Central African Republic', '중앙아프리카공화국'] },
            { code: 'TD', label: '차드', enLabel: 'Chad', aliases: ['Chad', '차드'] },
            { code: 'CL', label: '칠레', enLabel: 'Chile', aliases: ['Chile', '칠레'] },
            { code: 'CN', label: '중국', enLabel: 'China', aliases: ['China', '중국', 'People\'s Republic of China'] },
            { code: 'CO', label: '콜롬비아', enLabel: 'Colombia', aliases: ['Colombia', '콜롬비아'] },
            { code: 'KM', label: '코모로', enLabel: 'Comoros', aliases: ['Comoros', '코모로'] },
            { code: 'CG', label: '콩고', enLabel: 'Congo', aliases: ['Congo', '콩고'] },
            { code: 'CR', label: '코스타리카', enLabel: 'Costa Rica', aliases: ['Costa Rica', '코스타리카'] },
            { code: 'HR', label: '크로아티아', enLabel: 'Croatia', aliases: ['Croatia', '크로아티아', 'Hrvatska'] },
            { code: 'CU', label: '쿠바', enLabel: 'Cuba', aliases: ['Cuba', '쿠바'] },
            { code: 'CY', label: '키프로스', enLabel: 'Cyprus', aliases: ['Cyprus', '키프로스'] },
            { code: 'CZ', label: '체코', enLabel: 'Czech Republic', aliases: ['Czech Republic', 'Czechia', '체코'] },
            { code: 'DK', label: '덴마크', enLabel: 'Denmark', aliases: ['Denmark', '덴마크'] },
            { code: 'DJ', label: '지부티', enLabel: 'Djibouti', aliases: ['Djibouti', '지부티'] },
            { code: 'DM', label: '도미니카', enLabel: 'Dominica', aliases: ['Dominica', '도미니카'] },
            { code: 'DO', label: '도미니카공화국', enLabel: 'Dominican Republic', aliases: ['Dominican Republic', '도미니카공화국'] },
            { code: 'EC', label: '에콰도르', enLabel: 'Ecuador', aliases: ['Ecuador', '에콰도르'] },
            { code: 'EG', label: '이집트', enLabel: 'Egypt', aliases: ['Egypt', '이집트'] },
            { code: 'SV', label: '엘살바도르', enLabel: 'El Salvador', aliases: ['El Salvador', '엘살바도르'] },
            { code: 'GQ', label: '적도기니', enLabel: 'Equatorial Guinea', aliases: ['Equatorial Guinea', '적도기니'] },
            { code: 'ER', label: '에리트레아', enLabel: 'Eritrea', aliases: ['Eritrea', '에리트레아'] },
            { code: 'EE', label: '에스토니아', enLabel: 'Estonia', aliases: ['Estonia', '에스토니아', 'Eesti'] },
            { code: 'ET', label: '에티오피아', enLabel: 'Ethiopia', aliases: ['Ethiopia', '에티오피아'] },
            { code: 'FJ', label: '피지', enLabel: 'Fiji', aliases: ['Fiji', '피지'] },
            { code: 'FI', label: '핀란드', enLabel: 'Finland', aliases: ['Finland', '핀란드'] },
            { code: 'FR', label: '프랑스', enLabel: 'France', aliases: ['France', '프랑스'] },
            { code: 'GA', label: '가봉', enLabel: 'Gabon', aliases: ['Gabon', '가봉'] },
            { code: 'GM', label: '감비아', enLabel: 'Gambia', aliases: ['Gambia', '감비아'] },
            { code: 'GE', label: '조지아', enLabel: 'Georgia', aliases: ['Georgia', '조지아'] },
            { code: 'DE', label: '독일', enLabel: 'Germany', aliases: ['Germany', '독일', 'Deutschland'] },
            { code: 'GH', label: '가나', enLabel: 'Ghana', aliases: ['Ghana', '가나'] },
            { code: 'GR', label: '그리스', enLabel: 'Greece', aliases: ['Greece', '그리스', 'Ελλάδα'] },
            { code: 'GD', label: '그레나다', enLabel: 'Grenada', aliases: ['Grenada', '그레나다'] },
            { code: 'GT', label: '과테말라', enLabel: 'Guatemala', aliases: ['Guatemala', '과테말라'] },
            { code: 'GN', label: '기니', enLabel: 'Guinea', aliases: ['Guinea', '기니'] },
            { code: 'GW', label: '기니비사우', enLabel: 'Guinea-Bissau', aliases: ['Guinea-Bissau', '기니비사우'] },
            { code: 'GY', label: '가이아나', enLabel: 'Guyana', aliases: ['Guyana', '가이아나'] },
            { code: 'HT', label: '아이티', enLabel: 'Haiti', aliases: ['Haiti', '아이티'] },
            { code: 'HN', label: '온두라스', enLabel: 'Honduras', aliases: ['Honduras', '온두라스'] },
            { code: 'HU', label: '헝가리', enLabel: 'Hungary', aliases: ['Hungary', '헝가리', 'Magyarország'] },
            { code: 'IS', label: '아이슬란드', enLabel: 'Iceland', aliases: ['Iceland', '아이슬란드', 'Ísland'] },
            { code: 'IN', label: '인도', enLabel: 'India', aliases: ['India', '인도'] },
            { code: 'ID', label: '인도네시아', enLabel: 'Indonesia', aliases: ['Indonesia', '인도네시아'] },
            { code: 'IR', label: '이란', enLabel: 'Iran', aliases: ['Iran', '이란'] },
            { code: 'IQ', label: '이라크', enLabel: 'Iraq', aliases: ['Iraq', '이라크'] },
            { code: 'IE', label: '아일랜드', enLabel: 'Ireland', aliases: ['Ireland', '아일랜드', 'Éire'] },
            { code: 'IL', label: '이스라엘', enLabel: 'Israel', aliases: ['Israel', '이스라엘'] },
            { code: 'IT', label: '이탈리아', enLabel: 'Italy', aliases: ['Italy', '이탈리아'] },
            { code: 'JM', label: '자메이카', enLabel: 'Jamaica', aliases: ['Jamaica', '자메이카'] },
            { code: 'JP', label: '일본', enLabel: 'Japan', aliases: ['Japan', '일본', 'Nippon'] },
            { code: 'JO', label: '요르단', enLabel: 'Jordan', aliases: ['Jordan', '요르단'] },
            { code: 'KZ', label: '카자흐스탄', enLabel: 'Kazakhstan', aliases: ['Kazakhstan', '카자흐스탄'] },
            { code: 'KE', label: '케냐', enLabel: 'Kenya', aliases: ['Kenya', '케냐'] },
            { code: 'KI', label: '키리바시', enLabel: 'Kiribati', aliases: ['Kiribati', '키리바시'] },
            { code: 'KP', label: '북한', enLabel: 'North Korea', aliases: ['North Korea', '북한', 'Democratic People\'s Republic of Korea'] },
            { code: 'KR', label: '대한민국', enLabel: 'South Korea', aliases: ['Korea', 'South Korea', '한국', '대한민국', 'Republic of Korea'] },
            { code: 'KW', label: '쿠웨이트', enLabel: 'Kuwait', aliases: ['Kuwait', '쿠웨이트'] },
            { code: 'KG', label: '키르기스스탄', enLabel: 'Kyrgyzstan', aliases: ['Kyrgyzstan', '키르기스스탄'] },
            { code: 'LA', label: '라오스', enLabel: 'Laos', aliases: ['Laos', '라오스'] },
            { code: 'LV', label: '라트비아', enLabel: 'Latvia', aliases: ['Latvia', '라트비아', 'Latvija'] },
            { code: 'LB', label: '레바논', enLabel: 'Lebanon', aliases: ['Lebanon', '레바논'] },
            { code: 'LS', label: '레소토', enLabel: 'Lesotho', aliases: ['Lesotho', '레소토'] },
            { code: 'LR', label: '라이베리아', enLabel: 'Liberia', aliases: ['Liberia', '라이베리아'] },
            { code: 'LY', label: '리비아', enLabel: 'Libya', aliases: ['Libya', '리비아'] },
            { code: 'LI', label: '리히텐슈타인', enLabel: 'Liechtenstein', aliases: ['Liechtenstein', '리히텐슈타인'] },
            { code: 'LT', label: '리투아니아', enLabel: 'Lithuania', aliases: ['Lithuania', '리투아니아', 'Lietuva'] },
            { code: 'LU', label: '룩셈부르크', enLabel: 'Luxembourg', aliases: ['Luxembourg', '룩셈부르크'] },
            { code: 'MG', label: '마다가스카르', enLabel: 'Madagascar', aliases: ['Madagascar', '마다가스카르'] },
            { code: 'MW', label: '말라위', enLabel: 'Malawi', aliases: ['Malawi', '말라위'] },
            { code: 'MY', label: '말레이시아', enLabel: 'Malaysia', aliases: ['Malaysia', '말레이시아'] },
            { code: 'MV', label: '몰디브', enLabel: 'Maldives', aliases: ['Maldives', '몰디브'] },
            { code: 'ML', label: '말리', enLabel: 'Mali', aliases: ['Mali', '말리'] },
            { code: 'MT', label: '몰타', enLabel: 'Malta', aliases: ['Malta', '몰타'] },
            { code: 'MH', label: '마셜 제도', enLabel: 'Marshall Islands', aliases: ['Marshall Islands', '마셜 제도'] },
            { code: 'MR', label: '모리타니', enLabel: 'Mauritania', aliases: ['Mauritania', '모리타니'] },
            { code: 'MU', label: '모리셔스', enLabel: 'Mauritius', aliases: ['Mauritius', '모리셔스'] },
            { code: 'MX', label: '멕시코', enLabel: 'Mexico', aliases: ['Mexico', '멕시코'] },
            { code: 'FM', label: '미크로네시아', enLabel: 'Micronesia', aliases: ['Micronesia', '미크로네시아'] },
            { code: 'MD', label: '몰도바', enLabel: 'Moldova', aliases: ['Moldova', '몰도바'] },
            { code: 'MC', label: '모나코', enLabel: 'Monaco', aliases: ['Monaco', '모나코'] },
            { code: 'MN', label: '몽골', enLabel: 'Mongolia', aliases: ['Mongolia', '몽골'] },
            { code: 'ME', label: '몬테네그로', enLabel: 'Montenegro', aliases: ['Montenegro', '몬테네그로'] },
            { code: 'MA', label: '모로코', enLabel: 'Morocco', aliases: ['Morocco', '모로코'] },
            { code: 'MZ', label: '모잠비크', enLabel: 'Mozambique', aliases: ['Mozambique', '모잠비크'] },
            { code: 'MM', label: '미얀마', enLabel: 'Myanmar', aliases: ['Myanmar', '미얀마'] },
            { code: 'NA', label: '나미비아', enLabel: 'Namibia', aliases: ['Namibia', '나미비아'] },
            { code: 'NR', label: '나우루', enLabel: 'Nauru', aliases: ['Nauru', '나우루'] },
            { code: 'NP', label: '네팔', enLabel: 'Nepal', aliases: ['Nepal', '네팔'] },
            { code: 'NL', label: '네덜란드', enLabel: 'Netherlands', aliases: ['Netherlands', 'Holland', '네덜란드'] },
            { code: 'NZ', label: '뉴질랜드', enLabel: 'New Zealand', aliases: ['New Zealand', '뉴질랜드'] },
            { code: 'NI', label: '니카라과', enLabel: 'Nicaragua', aliases: ['Nicaragua', '니카라과'] },
            { code: 'NE', label: '니제르', enLabel: 'Niger', aliases: ['Niger', '니제르'] },
            { code: 'NG', label: '나이지리아', enLabel: 'Nigeria', aliases: ['Nigeria', '나이지리아'] },
            { code: 'NO', label: '노르웨이', enLabel: 'Norway', aliases: ['Norway', '노르웨이'] },
            { code: 'OM', label: '오만', enLabel: 'Oman', aliases: ['Oman', '오만'] },
            { code: 'PK', label: '파키스탄', enLabel: 'Pakistan', aliases: ['Pakistan', '파키스탄'] },
            { code: 'PW', label: '팔라우', enLabel: 'Palau', aliases: ['Palau', '팔라우'] },
            { code: 'PA', label: '파나마', enLabel: 'Panama', aliases: ['Panama', '파나마'] },
            { code: 'PG', label: '파푸아뉴기니', enLabel: 'Papua New Guinea', aliases: ['Papua New Guinea', '파푸아뉴기니'] },
            { code: 'PY', label: '파라과이', enLabel: 'Paraguay', aliases: ['Paraguay', '파라과이'] },
            { code: 'PE', label: '페루', enLabel: 'Peru', aliases: ['Peru', '페루'] },
            { code: 'PH', label: '필리핀', enLabel: 'Philippines', aliases: ['Philippines', '필리핀'] },
            { code: 'PL', label: '폴란드', enLabel: 'Poland', aliases: ['Poland', '폴란드', 'Polska'] },
            { code: 'PT', label: '포르투갈', enLabel: 'Portugal', aliases: ['Portugal', '포르투갈'] },
            { code: 'QA', label: '카타르', enLabel: 'Qatar', aliases: ['Qatar', '카타르'] },
            { code: 'RO', label: '루마니아', enLabel: 'Romania', aliases: ['Romania', '루마니아'] },
            { code: 'RU', label: '러시아', enLabel: 'Russia', aliases: ['Russia', '러시아', 'Russian Federation'] },
            { code: 'RW', label: '르완다', enLabel: 'Rwanda', aliases: ['Rwanda', '르완다'] },
            { code: 'KN', label: '세인트키츠 네비스', enLabel: 'Saint Kitts and Nevis', aliases: ['Saint Kitts and Nevis', '세인트키츠 네비스'] },
            { code: 'LC', label: '세인트루시아', enLabel: 'Saint Lucia', aliases: ['Saint Lucia', '세인트루시아'] },
            { code: 'VC', label: '세인트빈센트 그레나딘', enLabel: 'Saint Vincent and the Grenadines', aliases: ['Saint Vincent and the Grenadines', '세인트빈센트 그레나딘'] },
            { code: 'WS', label: '사모아', enLabel: 'Samoa', aliases: ['Samoa', '사모아'] },
            { code: 'SM', label: '산마리노', enLabel: 'San Marino', aliases: ['San Marino', '산마리노'] },
            { code: 'ST', label: '상투메 프린시페', enLabel: 'Sao Tome and Principe', aliases: ['Sao Tome and Principe', '상투메 프린시페'] },
            { code: 'SA', label: '사우디아라비아', enLabel: 'Saudi Arabia', aliases: ['Saudi Arabia', '사우디아라비아'] },
            { code: 'SN', label: '세네갈', enLabel: 'Senegal', aliases: ['Senegal', '세네갈'] },
            { code: 'RS', label: '세르비아', enLabel: 'Serbia', aliases: ['Serbia', '세르비아'] },
            { code: 'SC', label: '세이셸', enLabel: 'Seychelles', aliases: ['Seychelles', '세이셸'] },
            { code: 'SL', label: '시에라리온', enLabel: 'Sierra Leone', aliases: ['Sierra Leone', '시에라리온'] },
            { code: 'SG', label: '싱가포르', enLabel: 'Singapore', aliases: ['Singapore', '싱가포르'] },
            { code: 'SK', label: '슬로바키아', enLabel: 'Slovakia', aliases: ['Slovakia', '슬로바키아', 'Slovensko'] },
            { code: 'SI', label: '슬로베니아', enLabel: 'Slovenia', aliases: ['Slovenia', '슬로베니아', 'Slovenija'] },
            { code: 'SB', label: '솔로몬 제도', enLabel: 'Solomon Islands', aliases: ['Solomon Islands', '솔로몬 제도'] },
            { code: 'SO', label: '소말리아', enLabel: 'Somalia', aliases: ['Somalia', '소말리아'] },
            { code: 'ZA', label: '남아프리카공화국', enLabel: 'South Africa', aliases: ['South Africa', '남아프리카공화국'] },
            { code: 'SS', label: '남수단', enLabel: 'South Sudan', aliases: ['South Sudan', '남수단'] },
            { code: 'ES', label: '스페인', enLabel: 'Spain', aliases: ['Spain', '스페인'] },
            { code: 'LK', label: '스리랑카', enLabel: 'Sri Lanka', aliases: ['Sri Lanka', '스리랑카'] },
            { code: 'SD', label: '수단', enLabel: 'Sudan', aliases: ['Sudan', '수단'] },
            { code: 'SR', label: '수리남', enLabel: 'Suriname', aliases: ['Suriname', '수리남'] },
            { code: 'SZ', label: '에스와티니', enLabel: 'Eswatini', aliases: ['Eswatini', '에스와티니'] },
            { code: 'SE', label: '스웨덴', enLabel: 'Sweden', aliases: ['Sweden', '스웨덴'] },
            { code: 'CH', label: '스위스', enLabel: 'Switzerland', aliases: ['Switzerland', '스위스', 'Schweiz', 'Suisse'] },
            { code: 'SY', label: '시리아', enLabel: 'Syria', aliases: ['Syria', '시리아'] },
            { code: 'TW', label: '대만', enLabel: 'Taiwan', aliases: ['Taiwan', '대만'] },
            { code: 'TJ', label: '타지키스탄', enLabel: 'Tajikistan', aliases: ['Tajikistan', '타지키스탄'] },
            { code: 'TZ', label: '탄자니아', enLabel: 'Tanzania', aliases: ['Tanzania', '탄자니아'] },
            { code: 'TH', label: '태국', enLabel: 'Thailand', aliases: ['Thailand', '태국'] },
            { code: 'TL', label: '동티모르', enLabel: 'Timor-Leste', aliases: ['Timor-Leste', '동티모르'] },
            { code: 'TG', label: '토고', enLabel: 'Togo', aliases: ['Togo', '토고'] },
            { code: 'TO', label: '통가', enLabel: 'Tonga', aliases: ['Tonga', '통가'] },
            { code: 'TT', label: '트리니다드 토바고', enLabel: 'Trinidad and Tobago', aliases: ['Trinidad and Tobago', '트리니다드 토바고'] },
            { code: 'TN', label: '튀니지', enLabel: 'Tunisia', aliases: ['Tunisia', '튀니지'] },
            { code: 'TR', label: '터키', enLabel: 'Turkey', aliases: ['Turkey', '터키', 'Türkiye'] },
            { code: 'TM', label: '투르크메니스탄', enLabel: 'Turkmenistan', aliases: ['Turkmenistan', '투르크메니스탄'] },
            { code: 'TV', label: '투발루', enLabel: 'Tuvalu', aliases: ['Tuvalu', '투발루'] },
            { code: 'UG', label: '우간다', enLabel: 'Uganda', aliases: ['Uganda', '우간다'] },
            { code: 'UA', label: '우크라이나', enLabel: 'Ukraine', aliases: ['Ukraine', '우크라이나'] },
            { code: 'AE', label: '아랍에미리트', enLabel: 'United Arab Emirates', aliases: ['UAE', 'United Arab Emirates', '아랍에미리트'] },
            { code: 'GB', label: '영국', enLabel: 'United Kingdom', aliases: ['UK', 'United Kingdom', '영국', 'Great Britain', 'England'] },
            { code: 'US', label: '미국', enLabel: 'United States', aliases: ['USA', 'United States', '미국', 'America', 'United States of America'] },
            { code: 'UY', label: '우루과이', enLabel: 'Uruguay', aliases: ['Uruguay', '우루과이'] },
            { code: 'UZ', label: '우즈베키스탄', enLabel: 'Uzbekistan', aliases: ['Uzbekistan', '우즈베키스탄'] },
            { code: 'VU', label: '바누아투', enLabel: 'Vanuatu', aliases: ['Vanuatu', '바누아투'] },
            { code: 'VA', label: '바티칸', enLabel: 'Vatican City', aliases: ['Vatican City', 'Holy See', '바티칸'] },
            { code: 'VE', label: '베네수엘라', enLabel: 'Venezuela', aliases: ['Venezuela', '베네수엘라'] },
            { code: 'VN', label: '베트남', enLabel: 'Vietnam', aliases: ['Vietnam', '베트남'] },
            { code: 'YE', label: '예멘', enLabel: 'Yemen', aliases: ['Yemen', '예멘'] },
            { code: 'ZM', label: '잠비아', enLabel: 'Zambia', aliases: ['Zambia', '잠비아'] },
            { code: 'ZW', label: '짐바브웨', enLabel: 'Zimbabwe', aliases: ['Zimbabwe', '짐바브웨'] }
        ];

        // 기존 6개국 데이터를 맨 앞에 추가 (우선순위)
        countries = [...originalCountries, ...staticCountries.filter(c => 
            !originalCountries.some(orig => orig.code === c.code)
        )];

        // 국기 이모지 매핑
        countries.forEach(country => {
            countryFlags[country.code] = getCountryFlag(country.code);
        });

        console.log(`국가 데이터 초기화 완료: ${countries.length}개 국가`);
        
    } catch (error) {
        console.error('국가 데이터 초기화 실패:', error);
        // 실패 시 기존 데이터 사용
        countries = [...originalCountries];
        
        // 기본 국기 이모지도 설정
        originalCountries.forEach(country => {
            countryFlags[country.code] = getCountryFlag(country.code);
        });
    }
}

// 한국어 국가 이름 매핑
function getKoreanName(code) {
    const koreanNames = {
        'KR': '대한민국', 'JP': '일본', 'US': '미국', 'GB': '영국', 'FR': '프랑스', 'DE': '독일',
        'CN': '중국', 'RU': '러시아', 'CA': '캐나다', 'AU': '호주', 'BR': '브라질', 'IN': '인도',
        'IT': '이탈리아', 'ES': '스페인', 'NL': '네덜란드', 'SE': '스웨덴', 'NO': '노르웨이', 'DK': '덴마크',
        'FI': '핀란드', 'CH': '스위스', 'AT': '오스트리아', 'BE': '벨기에', 'IE': '아일랜드', 'PT': '포르투갈',
        'GR': '그리스', 'PL': '폴란드', 'CZ': '체코', 'HU': '헝가리', 'RO': '루마니아', 'BG': '불가리아',
        'HR': '크로아티아', 'SI': '슬로베니아', 'SK': '슬로바키아', 'LT': '리투아니아', 'LV': '라트비아', 'EE': '에스토니아',
        'MX': '멕시코', 'AR': '아르헨티나', 'CL': '칠레', 'PE': '페루', 'CO': '콜롬비아', 'VE': '베네수엘라',
        'ZA': '남아프리카공화국', 'EG': '이집트', 'NG': '나이지리아', 'KE': '케냐', 'GH': '가나', 'MA': '모로코',
        'TH': '태국', 'VN': '베트남', 'MY': '말레이시아', 'SG': '싱가포르', 'ID': '인도네시아', 'PH': '필리핀',
        'TR': '터키', 'IL': '이스라엘', 'SA': '사우디아라비아', 'AE': '아랍에미리트', 'QA': '카타르', 'KW': '쿠웨이트',
        'NZ': '뉴질랜드', 'IS': '아이슬란드', 'LU': '룩셈부르크', 'MT': '몰타', 'CY': '키프로스', 'MC': '모나코',
        'LI': '리히텐슈타인', 'SM': '산마리노', 'VA': '바티칸', 'AD': '안도라', 'FO': '페로 제도', 'GL': '그린란드'
    };
    
    return koreanNames[code] || code; // 매핑이 없으면 코드 반환
}

// 국가별 별칭 생성
function generateAliases(code, englishName) {
    const aliases = [englishName];
    
    // 일반적인 별칭들
    const commonAliases = {
        'US': ['USA', 'America', 'United States of America'],
        'GB': ['UK', 'United Kingdom', 'Great Britain', 'England'],
        'KR': ['Korea', 'South Korea', 'Republic of Korea'],
        'CN': ['China', 'People\'s Republic of China'],
        'RU': ['Russia', 'Russian Federation'],
        'CA': ['Canada'],
        'AU': ['Australia'],
        'BR': ['Brazil'],
        'IN': ['India'],
        'IT': ['Italy'],
        'ES': ['Spain'],
        'DE': ['Germany', 'Deutschland'],
        'FR': ['France'],
        'JP': ['Japan', 'Nippon'],
        'NL': ['Netherlands', 'Holland'],
        'SE': ['Sweden'],
        'NO': ['Norway'],
        'DK': ['Denmark'],
        'FI': ['Finland'],
        'CH': ['Switzerland', 'Schweiz', 'Suisse'],
        'AT': ['Austria', 'Österreich'],
        'BE': ['Belgium'],
        'IE': ['Ireland', 'Éire'],
        'PT': ['Portugal'],
        'GR': ['Greece', 'Ελλάδα'],
        'PL': ['Poland', 'Polska'],
        'CZ': ['Czech Republic', 'Czechia'],
        'HU': ['Hungary', 'Magyarország'],
        'RO': ['Romania'],
        'BG': ['Bulgaria'],
        'HR': ['Croatia', 'Hrvatska'],
        'SI': ['Slovenia', 'Slovenija'],
        'SK': ['Slovakia', 'Slovensko'],
        'LT': ['Lithuania', 'Lietuva'],
        'LV': ['Latvia', 'Latvija'],
        'EE': ['Estonia', 'Eesti'],
        'MX': ['Mexico'],
        'AR': ['Argentina'],
        'CL': ['Chile'],
        'PE': ['Peru'],
        'CO': ['Colombia'],
        'VE': ['Venezuela'],
        'ZA': ['South Africa'],
        'EG': ['Egypt'],
        'NG': ['Nigeria'],
        'KE': ['Kenya'],
        'GH': ['Ghana'],
        'MA': ['Morocco'],
        'TH': ['Thailand'],
        'VN': ['Vietnam'],
        'MY': ['Malaysia'],
        'SG': ['Singapore'],
        'ID': ['Indonesia'],
        'PH': ['Philippines'],
        'TR': ['Turkey', 'Türkiye'],
        'IL': ['Israel'],
        'SA': ['Saudi Arabia'],
        'AE': ['UAE', 'United Arab Emirates'],
        'QA': ['Qatar'],
        'KW': ['Kuwait'],
        'NZ': ['New Zealand'],
        'IS': ['Iceland', 'Ísland'],
        'LU': ['Luxembourg'],
        'MT': ['Malta'],
        'CY': ['Cyprus'],
        'MC': ['Monaco'],
        'LI': ['Liechtenstein'],
        'SM': ['San Marino'],
        'VA': ['Vatican City', 'Holy See'],
        'AD': ['Andorra'],
        'FO': ['Faroe Islands'],
        'GL': ['Greenland']
    };
    
    if (commonAliases[code]) {
        aliases.push(...commonAliases[code]);
    }
    
    return aliases;
}

// 국기 이모지 매핑
function getCountryFlag(code) {
    const flagEmojis = {
        'KR': '🇰🇷', 'JP': '🇯🇵', 'US': '🇺🇸', 'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪',
        'CN': '🇨🇳', 'RU': '🇷🇺', 'CA': '🇨🇦', 'AU': '🇦🇺', 'BR': '🇧🇷', 'IN': '🇮🇳',
        'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰',
        'FI': '🇫🇮', 'CH': '🇨🇭', 'AT': '🇦🇹', 'BE': '🇧🇪', 'IE': '🇮🇪', 'PT': '🇵🇹',
        'GR': '🇬🇷', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬',
        'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰', 'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪',
        'MX': '🇲🇽', 'AR': '🇦🇷', 'CL': '🇨🇱', 'PE': '🇵🇪', 'CO': '🇨🇴', 'VE': '🇻🇪',
        'ZA': '🇿🇦', 'EG': '🇪🇬', 'NG': '🇳🇬', 'KE': '🇰🇪', 'GH': '🇬🇭', 'MA': '🇲🇦',
        'TH': '🇹🇭', 'VN': '🇻🇳', 'MY': '🇲🇾', 'SG': '🇸🇬', 'ID': '🇮🇩', 'PH': '🇵🇭',
        'TR': '🇹🇷', 'IL': '🇮🇱', 'SA': '🇸🇦', 'AE': '🇦🇪', 'QA': '🇶🇦', 'KW': '🇰🇼',
        'NZ': '🇳🇿', 'IS': '🇮🇸', 'LU': '🇱🇺', 'MT': '🇲🇹', 'CY': '🇨🇾', 'MC': '🇲🇨',
        'LI': '🇱🇮', 'SM': '🇸🇲', 'VA': '🇻🇦', 'AD': '🇦🇩', 'FO': '🇫🇴', 'GL': '🇬🇱'
    };
    
    return flagEmojis[code] || '🏳️'; // 기본값
}

// 초기 국가 배열 (로딩 전 기본값)
let countries = [...originalCountries];

// 도시 좌표 매핑 테이블
// 도시 좌표 데이터 - 확장된 데이터 사용
let cityCoordinates = {};

// 도시 좌표 데이터 초기화 함수
function initializeCityCoordinates() {
    // Tier 1 도시 좌표 데이터가 있으면 사용
    if (window.tier1CityCoordinates) {
        cityCoordinates = { ...window.tier1CityCoordinates };
        console.log('Tier 1 도시 좌표 데이터 로드 완료');
    } else if (window.expandedCityCoordinates) {
        // 기존 확장된 도시 좌표 데이터가 있으면 사용
        cityCoordinates = { ...window.expandedCityCoordinates };
        console.log('확장된 도시 좌표 데이터 로드 완료');
    } else {
        // 기본 도시 좌표 데이터 (하위 호환성)
        cityCoordinates = {
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
        console.log('기본 도시 좌표 데이터 사용');
    }
}

// 도시 데이터 (국가별 도시 목록) - 확장된 데이터 사용
let cities = {};

// 도시 데이터 초기화 함수
function initializeCityData() {
    // Tier 1 도시 데이터가 있으면 사용
    if (window.tier1Cities) {
        cities = { ...window.tier1Cities };
        console.log('Tier 1 도시 데이터 로드 완료 (30개 국가)');
        
        // Part 2 데이터가 있으면 추가
        if (window.tier1CitiesPart2) {
            cities = { ...cities, ...window.tier1CitiesPart2 };
            console.log('Tier 1 Part 2 도시 데이터 로드 완료 (8개 국가 추가)');
        }
    } else if (window.expandedCities) {
        // 기존 확장된 도시 데이터가 있으면 사용
        cities = { ...window.expandedCities };
        console.log('확장된 도시 데이터 로드 완료');
    } else {
        // 기본 도시 데이터 (하위 호환성)
        cities = {
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
        console.log('기본 도시 데이터 사용');
    }
}

// 데이터 초기화 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeCountriesData();
    initializeCityData();
    initializeCityCoordinates();
});

// 전역으로 노출 (다른 모듈에서 사용할 수 있도록)
window.countries = countries;
window.cities = cities;
window.cityCoordinates = cityCoordinates;
window.countryFlags = countryFlags;
window.initializeCountriesData = initializeCountriesData; 
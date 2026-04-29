# 원주 신림 전원주택 원페이지 홈페이지

정적 사이트라서 도메인 구매 후 GitHub Pages, Netlify, Vercel 같은 무료 호스팅에 올릴 수 있습니다.

## 파일 구조

- `index.html`: 원페이지 화면
- `styles.css`: 디자인
- `script.js`: 상담 신청 폼과 알림 설정
- `image/`: 홈페이지 이미지 폴더

## 이미지 교체

이미지는 `image` 폴더에 넣고 `index.html`의 `src`만 바꾸면 됩니다.

- 메인 이미지: `image/main1.jpg`, `image/main2.jpg`
- 건물 외부: `image/outside_1.jpg`, `image/ousdie.jpg`
- 건물 외부 추가: `image/outside_2.jpg`
- 건물 내부: `image/inside_first_floor.jpg`, `image/inside_second_floor.jpg`, `image/inside_second_floor (2).jpg`
- 내부 마감: `image/inside_roof.jpg`
- 욕실: `image/inside_bathroom.jpg`
- 조망: `image/view.jpg`, `image/view2.jpg`

카카오톡 원본 파일명(`KakaoTalk_...`)은 코드에서 직접 쓰지 않았습니다.

## 무료 상담 알림 연결

카카오톡 알림톡과 SMS 자동 발송은 보통 유료 API 또는 사업자 채널 심사가 필요합니다. 무료로 진행하려면 Google Apps Script를 웹훅처럼 쓰는 방식이 가장 현실적입니다. 이 사이트는 `script.js`의 `webhookUrl`에 주소만 넣으면 상담 신청 내용을 전송하도록 만들어두었습니다.

### Google Apps Script 예시

1. Google Drive에서 Apps Script 프로젝트를 새로 만듭니다.
2. 아래 코드를 붙여넣고 `OPERATOR_EMAIL`을 운영자 이메일로 바꿉니다.
3. 배포 > 새 배포 > 웹 앱으로 배포합니다.
4. 액세스 권한은 `모든 사용자`로 설정합니다.
5. 발급된 웹 앱 URL을 `script.js`의 `webhookUrl`에 넣습니다.

```js
const OPERATOR_EMAIL = "operator@example.com";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const subject = `[상담 신청] ${data.siteName || "전원주택 홈페이지"}`;
  const body = `
이름: ${data.name}
연락처: ${data.phone}
상담 방식: ${data.contactType}
문의 내용: ${data.message || "없음"}
주소: ${data.address}
접수 시간: ${data.createdAt}
`;

  MailApp.sendEmail(OPERATOR_EMAIL, subject, body);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

웹훅을 넣기 전에는 폼 제출 시 운영자 문자 작성 화면으로 연결됩니다. `script.js`의 `operatorPhone`도 실제 번호로 바꿔주세요.

## 카카오맵 설정 위치

이 프로젝트는 React/Vue가 아니라 순수 HTML 정적 사이트입니다. 카카오맵 퍼가기 코드는 `<script>`를 `index.html`에 바로 붙여넣지 않고, 아래처럼 분리해두었습니다.

- `index.html`: `#daumRoughmapContainer1777444943797` 지도 노드만 둡니다.
- `script.js`: `loadKakaoRoughMap()` 함수가 카카오맵 로더 스크립트를 동적으로 불러오고, 로드 완료 후 `new daum.roughmap.Lander(...).render()`를 실행합니다.
- `styles.css`: `.map-wrap`과 `.root_daum_roughmap` 크기를 반응형으로 잡습니다.

카카오맵이 로컬 `file://` 주소에서 비어 보일 때는 외부 스크립트 로드나 렌더 타이밍 문제일 수 있습니다. GitHub/Vercel에 배포된 HTTPS 주소에서 확인하면 정상 렌더링 여부를 더 정확히 볼 수 있습니다.

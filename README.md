# 원주 신림 전원주택 원페이지 홈페이지

Next.js App Router 기반 원페이지 홈페이지입니다. GitHub 저장소를 Vercel에 연결하면 무료 배포로 미리보기 URL을 만들 수 있습니다.

## 파일 구조

- `app/page.tsx`: 원페이지 화면
- `app/layout.tsx`: 메타데이터와 전역 레이아웃
- `app/globals.css`: 디자인
- `components/KakaoRoughMap.tsx`: 카카오맵 지도 컴포넌트
- `public/image/`: 홈페이지 이미지 폴더

## 이미지 교체

배포에 쓰는 이미지는 `public/image` 폴더에 넣고 `app/page.tsx`의 `src`만 바꾸면 됩니다.

- 메인 이미지: `public/image/main1.jpg`, `public/image/main2.jpg`
- 건물 외부: `public/image/outside_1.jpg`, `public/image/ousdie.jpg`
- 건물 외부 추가: `public/image/outside_2.jpg`
- 건물 내부: `public/image/inside_first_floor.jpg`, `public/image/inside_second_floor.jpg`, `public/image/inside_second_floor (2).jpg`
- 내부 마감: `public/image/inside_roof.jpg`
- 욕실: `public/image/inside_bathroom.jpg`
- 조망: `public/image/view.jpg`, `public/image/view2.jpg`

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

웹훅을 넣기 전에는 폼 제출 시 운영자 문자 작성 화면으로 연결됩니다. 현재 임시 운영자 번호는 `app/page.tsx`의 `sms:010-0000-0000` 부분에서 교체하면 됩니다.

## 카카오맵 설정 위치

카카오맵 퍼가기 코드는 JSX에 직접 붙이지 않고 클라이언트 컴포넌트로 분리했습니다.

- `components/KakaoRoughMap.tsx`: 파일 상단에 `"use client"`를 두고 `useEffect` 안에서 `document.createElement("script")`로 `roughmapLoader.js`를 한 번만 로드합니다.
- 스크립트 `onload` 이후 `new daum.roughmap.Lander(...).render()`를 실행합니다.
- container id는 `daumRoughmapContainer1777444943797`, timestamp는 `1777444943797`, key는 `mwfdh3z3d4h`입니다.
- `app/page.tsx`: 오시는 길 섹션에서 `<KakaoRoughMap />`을 사용합니다.

Vercel 배포 주소에서 브라우저 개발자도구 Network 탭을 열고 `roughmapLoader.js`가 `200 OK`로 로드되는지 확인하세요. `ERR_BLOCKED_BY_CLIENT`, CSP 차단, `daum is not defined`가 보이면 외부 스크립트가 막힌 상태입니다.

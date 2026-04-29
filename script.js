const reservationConfig = {
  // Google Apps Script Web App URL을 넣으면 무료로 상담 신청을 받을 수 있습니다.
  // 예: https://script.google.com/macros/s/AKfycb.../exec
  webhookUrl: "",

  // 문자 알림 fallback에 사용할 운영자 연락처입니다. 실제 번호로 교체하세요.
  operatorPhone: "010-0000-0000",

  siteName: "원주 신림 전원주택",
};

const header = document.querySelector(".site-header");
const reservationForm = document.querySelector("#reservationForm");
const formStatus = document.querySelector("#formStatus");
const galleryItems = Array.from(document.querySelectorAll(".photo-grid figure"));
let activeGalleryIndex = 0;

const kakaoMapConfig = {
  containerId: "daumRoughmapContainer1777444943797",
  loaderSrc: "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js",
};

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
});

function onPageReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
    return;
  }

  callback();
}

function loadKakaoRoughMap() {
  const mapContainer = document.querySelector(`#${kakaoMapConfig.containerId}`);

  if (!mapContainer) {
    return;
  }

  const renderMap = () => {
    if (!window.daum?.roughmap?.Lander) {
      return;
    }

    mapContainer.innerHTML = "";

    new window.daum.roughmap.Lander({
      timestamp: mapContainer.dataset.timestamp,
      key: mapContainer.dataset.key,
      mapWidth: String(Math.max(mapContainer.clientWidth || 640, 320)),
      mapHeight: "470",
    }).render();

    mapContainer.closest(".map-wrap")?.classList.add("is-loaded");
  };

  const renderMapAfterLayout = () => {
    window.requestAnimationFrame(renderMap);
  };

  if (window.daum?.roughmap?.Lander) {
    renderMapAfterLayout();
    return;
  }

  const existingLoader = document.querySelector(`script[src="${kakaoMapConfig.loaderSrc}"]`);

  if (existingLoader) {
    existingLoader.addEventListener("load", renderMapAfterLayout, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = kakaoMapConfig.loaderSrc;
  script.charset = "UTF-8";
  script.async = true;
  script.onload = renderMapAfterLayout;
  document.head.appendChild(script);
}

onPageReady(loadKakaoRoughMap);

reservationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.classList.remove("error");
  formStatus.textContent = "상담 신청을 접수하는 중입니다.";

  const formData = new FormData(reservationForm);
  const payload = Object.fromEntries(formData.entries());
  payload.createdAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  payload.siteName = reservationConfig.siteName;
  payload.address = "강원특별자치도 원주시 신림면 연봉정길 59-6";

  if (!reservationConfig.webhookUrl) {
    const text = `[${payload.siteName} 상담 신청]\n이름: ${payload.name}\n연락처: ${payload.phone}\n상담 방식: ${payload.contactType}\n문의: ${payload.message || "없음"}`;
    const smsUrl = `sms:${reservationConfig.operatorPhone}?body=${encodeURIComponent(text)}`;
    formStatus.textContent =
      "웹훅 주소가 아직 비어 있어 운영자 문자 작성 화면으로 연결합니다. README에서 무료 알림 설정을 완료하세요.";
    window.location.href = smsUrl;
    return;
  }

  try {
    await fetch(reservationConfig.webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    reservationForm.reset();
    formStatus.textContent = "상담 신청이 접수되었습니다. 담당자가 확인 후 연락드립니다.";
  } catch (error) {
    formStatus.classList.add("error");
    formStatus.textContent = "전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
});

document.body.insertAdjacentHTML(
  "beforeend",
  `
    <div class="gallery-modal" id="galleryModal" aria-hidden="true">
      <div class="gallery-dialog" role="dialog" aria-modal="true" aria-label="현장 사진 크게 보기">
        <button class="gallery-close" type="button" aria-label="닫기">×</button>
        <button class="gallery-nav gallery-prev" type="button" aria-label="이전 사진">‹</button>
        <img src="" alt="" />
        <p class="gallery-caption"></p>
        <button class="gallery-nav gallery-next" type="button" aria-label="다음 사진">›</button>
      </div>
    </div>
  `
);

const galleryModal = document.querySelector("#galleryModal");
const galleryImage = galleryModal.querySelector("img");
const galleryCaption = galleryModal.querySelector(".gallery-caption");
const galleryClose = galleryModal.querySelector(".gallery-close");
const galleryPrev = galleryModal.querySelector(".gallery-prev");
const galleryNext = galleryModal.querySelector(".gallery-next");

function openGallery(index) {
  const item = galleryItems[index];
  const image = item.querySelector("img");
  const caption = item.querySelector("figcaption");

  activeGalleryIndex = index;
  galleryImage.src = image.currentSrc || image.src;
  galleryImage.alt = image.alt;
  galleryCaption.textContent = caption?.textContent || "";
  galleryModal.classList.add("is-open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeGallery() {
  galleryModal.classList.remove("is-open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function moveGallery(direction) {
  const nextIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
  openGallery(nextIndex);
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openGallery(index));
});

galleryClose.addEventListener("click", closeGallery);
galleryPrev.addEventListener("click", () => moveGallery(-1));
galleryNext.addEventListener("click", () => moveGallery(1));

galleryModal.addEventListener("click", (event) => {
  if (event.target === galleryModal) {
    closeGallery();
  }
});

document.addEventListener("keydown", (event) => {
  if (!galleryModal.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeGallery();
  }

  if (event.key === "ArrowLeft") {
    moveGallery(-1);
  }

  if (event.key === "ArrowRight") {
    moveGallery(1);
  }
});

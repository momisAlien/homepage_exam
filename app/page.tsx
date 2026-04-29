"use client";

import { FormEvent, useEffect, useState } from "react";
import KakaoRoughMap from "@/components/KakaoRoughMap";

const photos = [
  { src: "/image/main2.jpg", alt: "원주 신림 전원주택 단지 조감도", caption: "단지 조감도", large: true },
  { src: "/image/outside_1.jpg", alt: "건물 외부 사진", caption: "건물 외부" },
  { src: "/image/ousdie.jpg", alt: "건물 외부 전경 사진", caption: "건물 외부" },
  { src: "/image/outside_2.jpg", alt: "건물 외부 측면 사진", caption: "건물 외부" },
  { src: "/image/inside_first_floor.jpg", alt: "건물 내부 1층 사진", caption: "건물 내부 1층" },
  { src: "/image/inside_second_floor.jpg", alt: "건물 내부 2층 사진", caption: "건물 내부 2층" },
  { src: "/image/inside_second_floor%20(2).jpg", alt: "건물 내부 복층 사진", caption: "복층 내부" },
  { src: "/image/inside_roof.jpg", alt: "건물 내부 천장 사진", caption: "내부 마감" },
  { src: "/image/inside_bathroom.jpg", alt: "욕실 내부 사진", caption: "욕실" },
  { src: "/image/view.jpg", alt: "창밖 조망 사진", caption: "창밖 조망" },
  { src: "/image/view2.jpg", alt: "창밖 조망 추가 사진", caption: "창밖 조망" },
];

const kakaoMapUrl =
  "https://map.kakao.com/link/search/%EA%B0%95%EC%9B%90%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EB%8F%84%20%EC%9B%90%EC%A3%BC%EC%8B%9C%20%EC%8B%A0%EB%A6%BC%EB%A9%B4%20%EC%97%B0%EB%B4%89%EC%A0%95%EA%B8%B8%2059-6";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", activePhoto !== null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (activePhoto === null) return;
      if (event.key === "Escape") setActivePhoto(null);
      if (event.key === "ArrowLeft") movePhoto(-1);
      if (event.key === "ArrowRight") movePhoto(1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto]);

  const movePhoto = (direction: number) => {
    setActivePhoto((current) => {
      if (current === null) return current;
      return (current + direction + photos.length) % photos.length;
    });
  };

  const handleReservationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(false);
    setFormStatus("상담 신청을 접수하는 중입니다.");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const text = `[원주 신림 전원주택 상담 신청]\n이름: ${payload.name}\n연락처: ${payload.phone}\n상담 방식: ${payload.contactType}\n문의: ${payload.message || "없음"}`;

    setFormStatus("상담 신청 내용이 준비되었습니다. 문자 화면에서 운영자 번호를 실제 번호로 교체해 주세요.");
    window.location.href = `sms:010-0000-0000?body=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`} aria-label="주요 메뉴">
        <a className="brand" href="#top" aria-label="처음으로 이동">
          <span className="brand-mark">WJ</span>
          <span>원주 신림 전원주택</span>
        </a>
        <nav className="desktop-nav" aria-label="페이지 이동">
          <a href="#about">About</a>
          <a href="#photos">현장 사진</a>
          <a href="#location">오시는 길</a>
        </nav>
        <a className="header-cta" href="#reservation">
          상담 신청
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-label="원주 신림 전원주택 소개">
          <div className="hero-bg" aria-hidden="true">
            <img src="/image/main1.jpg" alt="" />
            <img src="/image/main2.jpg" alt="" />
          </div>
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">강원 원주 신림 · 자연 속 단독형 주택</p>
            <h1>
              원주 신림 전원주택
              <br />
              8세대 한정 분양
            </h1>
            <p className="hero-copy">
              숲과 산세가 가까운 조용한 입지에서 누리는 단독주택의 여유. 실거주, 세컨하우스,
              은퇴 후 주거까지 고려한 원페이지 분양 안내입니다.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#reservation">
                방문 상담 예약
              </a>
              <a className="ghost-button" href="#photos">
                사진 먼저 보기
              </a>
            </div>
          </div>
          <aside className="hero-panel" aria-label="핵심 분양 정보">
            <dl>
              <div>
                <dt>위치</dt>
                <dd>강원특별자치도 원주시 신림면 연봉정길 59-6</dd>
              </div>
              <div>
                <dt>세대</dt>
                <dd>총 8세대 한정</dd>
              </div>
              <div>
                <dt>상담</dt>
                <dd>사전 예약 후 방문 가능</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="quick-info" aria-label="단지 핵심 장점">
          <article>
            <span>01</span>
            <h2>자연 조망</h2>
            <p>창밖으로 열리는 산세와 조용한 마을 풍경을 가까이 누립니다.</p>
          </article>
          <article>
            <span>02</span>
            <h2>단독형 구조</h2>
            <p>각 세대의 독립감과 실용적인 생활 동선을 고려한 계획입니다.</p>
          </article>
          <article>
            <span>03</span>
            <h2>방문 예약제</h2>
            <p>상담 번호를 남기면 담당자가 확인 후 일정 안내를 드립니다.</p>
          </article>
        </section>

        <section className="section about-section" id="about">
          <div className="section-heading about-heading">
            <p className="eyebrow">About the Village</p>
            <h2>
              도심에서 조금 벗어나,
              <br />
              일상이 쉬어가는 전원주택
            </h2>
          </div>
          <div className="about-grid">
            <div className="about-copy">
              <p>
                원주 신림 전원주택은 자연과 가까운 생활을 원하는 분들을 위한 소규모 주거
                단지입니다. 단정한 외관, 밝은 내부, 마당과 테라스가 어우러지는 구성으로 조용하고
                실용적인 전원생활을 제안합니다.
              </p>
              <ul className="check-list">
                <li>강원특별자치도 원주시 신림면 연봉정길 59-6</li>
                <li>총 8세대 규모의 프라이빗 단지</li>
                <li>내부, 외부, 조망 사진으로 현장 분위기 확인 가능</li>
                <li>상담 신청 후 담당자 방문 일정 안내</li>
              </ul>
            </div>
            <div className="feature-board" aria-label="분양 특징">
              <div>
                <strong>Private</strong>
                <span>단독형 주거</span>
              </div>
              <div>
                <strong>Garden</strong>
                <span>마당과 테라스</span>
              </div>
              <div>
                <strong>Nature</strong>
                <span>산세와 조망</span>
              </div>
              <div>
                <strong>Visit</strong>
                <span>예약 상담</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section photo-section" id="photos">
          <div className="section-heading compact">
            <p className="eyebrow">Site Photos</p>
            <h2>현장 사진</h2>
            <p>실제 현장과 내부 공간, 창밖 조망을 사진으로 확인해 보세요.</p>
          </div>
          <div className="photo-grid">
            {photos.map((photo, index) => (
              <figure
                className={photo.large ? "photo-large" : ""}
                key={photo.src}
                onClick={() => setActivePhoto(index)}
              >
                <img src={photo.src} alt={photo.alt} />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section location-section" id="location">
          <div className="section-heading">
            <p className="eyebrow">Location</p>
            <h2>오시는 길</h2>
            <p>강원특별자치도 원주시 신림면 연봉정길 59-6</p>
          </div>
          <div className="location-layout">
            <div className="map-wrap">
              <KakaoRoughMap />
              <p className="map-fallback">
                지도를 불러오는 중입니다. 지도가 보이지 않으면{" "}
                <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer">
                  카카오맵에서 위치 보기
                </a>
              </p>
            </div>
            <div className="location-card">
              <h3>방문 상담 안내</h3>
              <p>
                현장 방문은 사전 예약제로 운영됩니다. 상담 신청을 남기시면 담당자가 확인 후
                연락드립니다.
              </p>
              <a className="outline-button" href={kakaoMapUrl} target="_blank" rel="noopener noreferrer">
                카카오맵에서 보기
              </a>
            </div>
          </div>
        </section>

        <section className="reservation-section" id="reservation">
          <div className="reservation-copy">
            <p className="eyebrow">Reservation</p>
            <h2>상담받을 연락처를 남겨주세요</h2>
            <p>이름과 연락처를 남기시면 담당자가 확인 후 방문 일정과 분양 상담을 안내드립니다.</p>
            <div className="contact-box">
              <span>상담 주소</span>
              <strong>강원특별자치도 원주시 신림면 연봉정길 59-6</strong>
            </div>
          </div>
          <form className="reservation-form" onSubmit={handleReservationSubmit}>
            <label>
              이름
              <input type="text" name="name" placeholder="홍길동" autoComplete="name" required />
            </label>
            <label>
              연락처
              <input type="tel" name="phone" placeholder="010-0000-0000" autoComplete="tel" required />
            </label>
            <label>
              희망 상담 방식
              <select name="contactType" required defaultValue="전화 상담">
                <option value="전화 상담">전화 상담</option>
                <option value="문자 상담">문자 상담</option>
                <option value="카카오톡 상담">카카오톡 상담</option>
                <option value="방문 상담">방문 상담</option>
              </select>
            </label>
            <label>
              문의 내용
              <textarea
                name="message"
                rows={5}
                placeholder="방문 희망일, 궁금한 평형, 상담 가능 시간 등을 적어주세요."
              />
            </label>
            <label className="privacy">
              <input type="checkbox" name="privacy" required />
              <span>[필수] 개인정보 수집 및 이용에 동의합니다.</span>
            </label>
            <p className="privacy-note">
              수집 항목: 이름, 연락처, 문의 내용 · 이용 목적: 분양 상담 및 방문 안내 · 보유 기간:
              상담 종료 후 1년
            </p>
            <button className="primary-button submit-button" type="submit">
              상담 신청하기
            </button>
            <p className={`form-status ${formError ? "error" : ""}`} role="status" aria-live="polite">
              {formStatus}
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>원주 신림 전원주택</strong>
          <p>강원특별자치도 원주시 신림면 연봉정길 59-6</p>
        </div>
        <a href="#reservation">상담 예약</a>
      </footer>

      {activePhoto !== null && (
        <div className="gallery-modal is-open" aria-hidden="false" onClick={() => setActivePhoto(null)}>
          <div
            className="gallery-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="현장 사진 크게 보기"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="gallery-close" type="button" aria-label="닫기" onClick={() => setActivePhoto(null)}>
              ×
            </button>
            <button className="gallery-nav gallery-prev" type="button" aria-label="이전 사진" onClick={() => movePhoto(-1)}>
              ‹
            </button>
            <img src={photos[activePhoto].src} alt={photos[activePhoto].alt} />
            <p className="gallery-caption">{photos[activePhoto].caption}</p>
            <button className="gallery-nav gallery-next" type="button" aria-label="다음 사진" onClick={() => movePhoto(1)}>
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}

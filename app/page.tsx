"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
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

const slidePhotos = photos.slice(1, 7);

const aboutFeatureItems = [
  "세대 별 프라이빗 테라스",
  "전용 주차 공간",
  "방 3개 구성",
  "활용도 높은 복층 구조",
  "20평 규모 다용도실",
];

const aboutImages = [
  { src: "/image/about_1.jpg", alt: "세대 별 프라이빗 테라스" },
  { src: "/image/about_2.jpg", alt: "전원주택 내부 공간" },
  { src: "/image/about_3.jpg", alt: "창밖 조망" },
  { src: "/image/about_4.jpg", alt: "복층 구조 내부" },
];

const checkPointItems = [
  {
    title: "배론성지까지 차로 10분",
    text: "한국 천주교 전파의 진원지를 바로 옆에서 만나보세요.",
    image: "/image/check_1.jpg",
  },
  {
    title: "원주 및 제천 시내까지 차로 20분",
    text: "조용한 입지이면서도 생활권 이동이 부담스럽지 않습니다.",
    image: "/image/check_2.png",
  },
  {
    title: "용소막 성당까지 차로 5분",
    text: "원주 8경 중 7경으로 꼽히는 명소가 가까운 입지입니다.",
    image: "/image/check_3.jpg",
  },
  {
    title: "산과 물, 조망이 좋은 전원 생활",
    text: "경치 좋고 산 좋고 물 좋은 환경에서 여유로운 일상을 제안합니다.",
    image: "/image/check_4.png",
  },
];

const promoSlides = [
  {
    title: "발코니 확장 무상 · 전용 테라스",
    text: "세대별 프라이빗 야외 공간까지 부담 없이 확인해 보세요.",
    image: "/image/promo_1.jpg",
  },
  {
    title: "방 3개와 복층 구조",
    text: "실거주, 서재, 취미 공간까지 나누기 좋은 구성을 갖췄습니다.",
    image: "/image/promo_2.jpg",
  },
  {
    title: "20평 규모 다용도실",
    text: "수납, 작업, 취미 공간으로 활용도 높은 여유 공간을 제공합니다.",
    image: "/image/promo_3.jpg",
  },
];

const kakaoMapUrl =
  "https://map.kakao.com/link/search/%EA%B0%95%EC%9B%90%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EB%8F%84%20%EC%9B%90%EC%A3%BC%EC%8B%9C%20%EC%8B%A0%EB%A6%BC%EB%A9%B4%20%EC%97%B0%EB%B4%89%EC%A0%95%EA%B8%B8%2059-6";

type ReservationApiResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [activeCheckPoint, setActiveCheckPoint] = useState(0);
  const [activePromo, setActivePromo] = useState(0);
  const [formStatus, setFormStatus] = useState("");
  const [formError, setFormError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePromo((current) => (current + 1) % promoSlides.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  const movePhoto = (direction: number) => {
    setActivePhoto((current) => {
      if (current === null) return current;
      return (current + direction + photos.length) % photos.length;
    });
  };

  const scrollPhotoSlider = (visualDirection: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (maxScroll <= 0) return;

    const cards = Array.from(slider.querySelectorAll("figure"));
    const positions = cards.map((card) => card.offsetLeft - slider.offsetLeft);
    const currentIndex = positions.reduce((closestIndex, position, index) => {
      const closestDistance = Math.abs(positions[closestIndex] - slider.scrollLeft);
      const distance = Math.abs(position - slider.scrollLeft);
      return distance < closestDistance ? index : closestIndex;
    }, 0);

    const isAtStart = slider.scrollLeft <= 8;
    const isAtEnd = slider.scrollLeft >= maxScroll - 8;
    let targetIndex = visualDirection === "right" ? currentIndex + 2 : currentIndex - 2;

    if (visualDirection === "right" && isAtEnd) {
      targetIndex = 0;
    } else if (visualDirection === "left" && isAtStart) {
      targetIndex = positions.length - 1;
    }

    const boundedIndex = Math.max(0, Math.min(targetIndex, positions.length - 1));
    const nextLeft = Math.max(0, Math.min(positions[boundedIndex], maxScroll));

    slider.scrollTo({
      left: nextLeft,
      behavior: "smooth",
    });
  };

  const handleReservationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(false);
    setIsSubmitting(true);
    setFormStatus("상담 신청을 접수하는 중입니다.");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      contactType: String(formData.get("contactType") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ReservationApiResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "상담 신청 중 문제가 발생했습니다." : result.error);
      }

      form.reset();
      setFormStatus(result.message);
    } catch (error) {
      setFormError(true);
      setFormStatus(error instanceof Error ? error.message : "상담 신청 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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
              숲이 품은 고요한 자연 속에서 누리는 단독주택의 여유를 누려보세요. 
              실거주, 세컨하우스, 은퇴 후 주거까지 고려한 원페이지 분양 안내입니다.
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

        <section className="photo-strip" aria-label="현장 사진 슬라이드">
          <div className="strip-heading">
            <p className="eyebrow">Photo Preview</p>
            <h2>사진으로 먼저 보는 현장</h2>
            <a href="#photos">전체 사진 보기</a>
          </div>
          <div className="photo-slider" ref={sliderRef}>
            {slidePhotos.map((photo, index) => (
              <figure key={photo.src} onClick={() => setActivePhoto(index + 1)}>
                <img src={photo.src} alt={photo.alt} />
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{photo.caption}</strong>
                  <small>현장 사진 미리보기</small>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="slider-controls" aria-label="현장 사진 슬라이드 이동">
            <button type="button" onClick={() => scrollPhotoSlider("left")} aria-label="이전 사진 보기">
              ‹
            </button>
            <button type="button" onClick={() => scrollPhotoSlider("right")} aria-label="다음 사진 보기">
              ›
            </button>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="block-heading">
            <p className="eyebrow">About the Village</p>
            <h2>
              도심에서 벗어나,
              <br />
              일상이 쉬어가는 전원주택
            </h2>
            <p>
              독립적인 야외 공간과 실용적인 내부 구성을 갖춘 소규모 전원주택 단지입니다.
            </p>
          </div>
          <div className="about-grid">
            <div className="about-copy">
              <p>
                자연의 헤리티지를 품은 원주 신림, 그곳에 안목 있는 소수만을 위한 
                프라이빗 빌리지가 있습니다.절제된 미학의 건축물과 따스한 빛으로 채워진 공간, 
                그리고 자연과 경계를 허무는 테라스까지. 단순한 머무름을 넘어,
                일상이 예술이 되는 가장 우아한 전원의 삶을 선사합니다."
              </p>
              <ul className="blue-bullet-list">
                {aboutFeatureItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="about-media-grid" aria-label="전원주택 현장 이미지">
              {aboutImages.map((image) => (
                <img key={image.src} src={image.src} alt={image.alt} />
              ))}
            </div>
          </div>
        </section>

        <section className="promo-slideshow" aria-label="전원주택 특별 혜택">
          {promoSlides.map((slide, index) => (
            <article
              className={`promo-slide ${activePromo === index ? "is-active" : ""}`}
              key={slide.title}
              aria-hidden={activePromo !== index}
            >
              <img src={slide.image} alt="" />
              <div className="promo-overlay" aria-hidden="true" />
              <div className="promo-content">
                <p className="eyebrow">Special Benefit</p>
                <h2>{slide.title}</h2>
                <p>{slide.text}</p>
                <a className="promo-button" href="#reservation">
                  특별혜택 확인하기
                </a>
              </div>
            </article>
          ))}
          <div className="promo-dots" aria-label="혜택 슬라이드 선택">
            {promoSlides.map((slide, index) => (
              <button
                className={activePromo === index ? "is-active" : ""}
                key={slide.title}
                type="button"
                onClick={() => setActivePromo(index)}
                aria-label={`${index + 1}번째 혜택 보기`}
              />
            ))}
          </div>
        </section>

        <section className="blue-check-section" aria-label="위치와 단지 장점">
          <div className="block-heading">
            <p className="eyebrow">Check Point</p>
            <h2>프리미엄 전원생활의 조건</h2>
            <p> 자연과 역사가 어우러진 일상을 확인해보세요..</p>
          </div>
          <div className="check-showcase">
            <div className="check-list-panel" role="list">
              {checkPointItems.map((item, index) => (
                <button
                  className={activeCheckPoint === index ? "is-active" : ""}
                  key={item.title}
                  onClick={() => setActiveCheckPoint(index)}
                  type="button"
                >
                  <span>check {String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </button>
              ))}
            </div>
            <div className="check-visual">
              <img src={checkPointItems[activeCheckPoint].image} alt={checkPointItems[activeCheckPoint].title} />
              <div className="check-thumbs" aria-label="체크 포인트 이미지 선택">
                {checkPointItems.map((item, index) => (
                  <button
                    className={activeCheckPoint === index ? "is-active" : ""}
                    key={item.image}
                    onClick={() => setActiveCheckPoint(index)}
                    type="button"
                  >
                    <img src={item.image} alt="" />
                  </button>
                ))}
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
            <button className="primary-button submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "접수 중..." : "상담 신청하기"}
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

"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    daum?: {
      roughmap?: {
        Lander: new (options: {
          timestamp: string;
          key: string;
          mapWidth?: string;
          mapHeight?: string;
        }) => {
          render: () => void;
        };
      };
    };
  }
}

const SCRIPT_ID = "kakao-roughmap-loader";
const MAP_ID = "daumRoughmapContainer1777444943797";

export default function KakaoRoughMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const renderMap = (retry = 0) => {
      if (cancelled || renderedRef.current) return;

      const container = containerRef.current ?? document.getElementById(MAP_ID);
      const Lander = window.daum?.roughmap?.Lander;

      if (!container || !Lander) {
        if (retry < 20) {
          window.setTimeout(() => renderMap(retry + 1), 100);
        }
        return;
      }

      renderedRef.current = true;
      container.innerHTML = "";

      new Lander({
        timestamp: "1777444943797",
        key: "mwfdh3z3d4h",
        mapWidth: "100%",
        mapHeight: "360",
      }).render();

      container.closest(".map-wrap")?.classList.add("is-loaded");
    };

    const loadScriptAndRender = () => {
      const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

      if (existingScript) {
        renderMap();
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";
      script.charset = "UTF-8";
      script.async = true;
      script.onload = () => renderMap();
      script.onerror = () => {
        console.error("카카오맵 roughmapLoader.js 로드 실패");
      };

      document.body.appendChild(script);
    };

    const container = containerRef.current;

    if (!container || typeof IntersectionObserver === "undefined") {
      loadScriptAndRender();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer?.disconnect();
          loadScriptAndRender();
        },
        { threshold: 0.1 }
      );

      observer.observe(container);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id={MAP_ID}
      className="root_daum_roughmap root_daum_roughmap_landing"
      style={{
        width: "100%",
        minHeight: 360,
      }}
    />
  );
}

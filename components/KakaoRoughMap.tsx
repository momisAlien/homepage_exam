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
const SCRIPT_SRC = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";

let roughMapLoaderPromise: Promise<void> | null = null;

function loadRoughMapScript() {
  if (window.daum?.roughmap?.Lander) {
    return Promise.resolve();
  }

  if (roughMapLoaderPromise) {
    return roughMapLoaderPromise;
  }

  roughMapLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("카카오맵 roughmapLoader.js 로드 실패")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.charset = "UTF-8";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("카카오맵 roughmapLoader.js 로드 실패"));

    document.body.appendChild(script);
  });

  return roughMapLoaderPromise;
}

export default function KakaoRoughMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const renderMap = (retry = 0) => {
      if (cancelled || renderedRef.current) return;

      const container = containerRef.current ?? document.getElementById(MAP_ID);
      const Lander = window.daum?.roughmap?.Lander;

      if (!container || !Lander) {
        if (retry < 30) {
          window.setTimeout(() => renderMap(retry + 1), 100);
        } else {
          console.error("카카오맵 Lander 준비 실패");
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

    loadRoughMapScript()
      .then(() => window.requestAnimationFrame(() => renderMap()))
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
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

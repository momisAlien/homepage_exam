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

    const originalWrite = document.write.bind(document);
    const originalWriteln = document.writeln.bind(document);

    const restoreDocumentWrite = () => {
      document.write = originalWrite;
      document.writeln = originalWriteln;
    };

    const appendScriptFromDocumentWrite = (markup: string) => {
      const src = markup.match(/src=["']([^"']+)["']/i)?.[1];

      if (!src) {
        originalWrite(markup);
        return;
      }

      const landerScript = document.createElement("script");
      landerScript.charset = "UTF-8";
      landerScript.src = src;
      landerScript.async = true;
      landerScript.onload = () => {
        restoreDocumentWrite();
        resolve();
      };
      landerScript.onerror = () => {
        restoreDocumentWrite();
        reject(new Error("카카오맵 roughmapLander.js 로드 실패"));
      };

      document.body.appendChild(landerScript);
    };

    document.write = appendScriptFromDocumentWrite;
    document.writeln = appendScriptFromDocumentWrite;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.charset = "UTF-8";
    script.async = true;
    script.onload = () => {
      if (window.daum?.roughmap?.Lander) {
        restoreDocumentWrite();
        resolve();
      }
    };
    script.onerror = () => {
      restoreDocumentWrite();
      reject(new Error("카카오맵 roughmapLoader.js 로드 실패"));
    };

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

      const mapWidth = String(Math.max(Math.round(container.getBoundingClientRect().width || 640), 320));

      new Lander({
        timestamp: "1777444943797",
        key: "mwfdh3z3d4h",
        mapWidth,
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

"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LMap, LayerGroup } from "leaflet";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  tone: "visited" | "wishlist" | "selected";
  hasPhoto?: boolean;
  popupHtml?: string;
}

const KOREA_CENTER: [number, number] = [36.35, 127.8];

/**
 * OpenStreetMap 타일 기반 한국 지도 (API 키 불필요).
 * onPick 이 있으면 지도를 눌러 좌표를 고를 수 있습니다.
 */
export function KoreaMap({
  points,
  onSelect,
  onPick,
  pick,
  height = 460,
  fit = true,
}: {
  points: MapPoint[];
  onSelect?: (id: string) => void;
  onPick?: (lat: number, lng: number) => void;
  pick?: { lat: number; lng: number } | null;
  height?: number;
  fit?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const pickLayer = useRef<LayerGroup | null>(null);
  const L = useRef<typeof import("leaflet") | null>(null);
  const cb = useRef({ onSelect, onPick });
  useEffect(() => {
    cb.current = { onSelect, onPick };
  });

  useEffect(() => {
    let disposed = false;
    void import("leaflet").then((mod) => {
      if (disposed || !el.current || map.current) return;
      L.current = mod;
      const m = mod.map(el.current, { zoomControl: true, scrollWheelZoom: false }).setView(KOREA_CENTER, 7);
      mod
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(m);
      layer.current = mod.layerGroup().addTo(m);
      pickLayer.current = mod.layerGroup().addTo(m);
      m.on("click", (e) => cb.current.onPick?.(e.latlng.lat, e.latlng.lng));
      map.current = m;
      draw();
      drawPick();
    });
    return () => {
      disposed = true;
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map is created once
  }, []);

  function draw() {
    const mod = L.current;
    if (!mod || !map.current || !layer.current) return;
    layer.current.clearLayers();
    for (const p of points) {
      const color = p.tone === "visited" ? "#1b2540" : p.tone === "selected" ? "#b97f84" : "#b97f84";
      const marker = mod.circleMarker([p.lat, p.lng], {
        radius: p.tone === "selected" ? 10 : p.hasPhoto ? 8 : 6,
        color,
        weight: 2,
        fillColor: p.tone === "wishlist" ? "#fbf8f2" : color,
        fillOpacity: p.tone === "wishlist" ? 0.9 : 0.85,
      });
      marker.bindTooltip(p.label, { direction: "top", offset: [0, -6] });
      if (p.popupHtml) marker.bindPopup(p.popupHtml, { maxWidth: 260 });
      marker.on("click", () => cb.current.onSelect?.(p.id));
      marker.addTo(layer.current);
    }
    if (fit && points.length) {
      const b = mod.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
      map.current.fitBounds(b.pad(0.25), { maxZoom: 13 });
    }
  }

  function drawPick() {
    const mod = L.current;
    if (!mod || !pickLayer.current) return;
    pickLayer.current.clearLayers();
    if (pick) {
      mod.circleMarker([pick.lat, pick.lng], { radius: 9, color: "#b97f84", weight: 3, fillColor: "#d8aeb0", fillOpacity: 0.9 }).addTo(pickLayer.current);
      map.current?.setView([pick.lat, pick.lng], Math.max(map.current.getZoom(), 13));
    }
  }

  const pointsKey = JSON.stringify(points.map((p) => [p.id, p.lat, p.lng, p.tone, p.hasPhoto, p.popupHtml]));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- redraw when point data changes
  useEffect(() => draw(), [pointsKey]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => drawPick(), [pick?.lat, pick?.lng]);

  return <div ref={el} style={{ height }} className="z-0 w-full overflow-hidden rounded-[4px] border hairline" />;
}

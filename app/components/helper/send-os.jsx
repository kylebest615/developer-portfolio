"use client";
import { useEffect } from "react";

function detectOS(ua = "", platform = "") {
  ua = ua.toLowerCase();
  if (/windows nt/.test(ua) || platform.toLowerCase().includes("win")) return "Windows";
  if (/android/.test(ua)) return "Android";
  if (/iphone|ipad|ipod/.test(ua)) return "iOS";
  if (/macintosh|mac os x/.test(ua) || platform.toLowerCase().includes("mac")) return "macOS";
  if (/linux/.test(ua) || platform.toLowerCase().includes("linux")) return "Linux";
  return "Unknown";
}

export default function SendOS() {
  useEffect(() => {
    try {
      const alreadySent = localStorage.getItem("portfolio_os_report_sent");
      if (alreadySent) return;

      const ua = navigator.userAgent || "";
      const platform = navigator.platform || "";
      const os = detectOS(ua, platform);
      const payload = {
        os,
        userAgent: ua,
        platform,
        url: location.href,
        timestamp: new Date().toISOString(),
      };

      // Send to our API route (fire-and-forget)
      fetch("/api/report-os", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(() => localStorage.setItem("portfolio_os_report_sent", "1"))
        .catch(() => {});
    } catch (e) {}
  }, []);

  return null;
}

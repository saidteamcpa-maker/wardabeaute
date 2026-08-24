"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

const NAMES = [
  "Fatima de Casablanca",
  "Wiam de Rabat",
  "Salma de Marrakech",
  "Nora de Fès",
  "Imane de Agadir",
  "Hiba de Tanger",
  "Sanaa de Meknès",
];

export function SocialProofToast() {
  useEffect(() => {
    const t = setInterval(() => {
      const n = NAMES[Math.floor(Math.random() * NAMES.length)];
      toast(`📦 ${n} vient de commander il y a quelques minutes`, { duration: 4000, position: "bottom-right" });
    }, 45000);
    return () => clearInterval(t);
  }, []);
  return null;
}

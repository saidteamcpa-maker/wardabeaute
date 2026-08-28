import {
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";
import Image from "next/image";

export default async function ContactPage({ searchParams }: { searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const ov = await getPageOverride("contact", lang, searchParams?.preview === "1");
  const T = (k: string) => ov?.[k] ?? t(lang, k);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
  const ig = "https://instagram.com/wardabeaute";
  const tiktok = "https://tiktok.com/@wardabeaute";
  return (
    <div className="section">
      {ov?.["contact.bannerImage"] && (
        <div className="container-page mb-6">
          <div className="relative w-full aspect-[21/9]">
            <Image src={ov["contact.bannerImage"]} alt="" fill sizes="(max-width: 768px) 100vw, 1000px" className="object-cover rounded-3xl" />
          </div>
        </div>
      )}
      <div className="container-page max-w-2xl">
        <h1 className="text-4xl text-profond mb-4">{T("contact.title")}</h1>
        <p className="font-body text-brun mb-6">{T("contact.sub")}</p>
        <div className="space-y-4 font-body text-brun">
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-brume p-5 hover:border-warda"
          >
            <FaWhatsapp className="w-6 h-6 text-[#25D366]" />
            <span>{T("contact.whatsapp")}</span>
          </a>

          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-brume p-5 hover:border-warda"
          >
            <FaInstagram className="w-6 h-6" />
            <span>{T("contact.instagram")}</span>
          </a>

          <a
            href={tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-brume p-5 hover:border-warda"
          >
            <FaTiktok className="w-6 h-6" />
            <span>{T("contact.tiktok")}</span>
          </a>

          <a
            href="mailto:hello@wardabeaute.com"
            className="flex items-center gap-3 rounded-2xl border border-brume p-5 hover:border-warda"
          >
            <FaEnvelope className="w-6 h-6 text-warda" />
            <span>{T("contact.email")}</span>
          </a>

          <div className="rounded-2xl border border-brume p-5 space-y-3">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="w-6 h-6 text-profond" />
              <span>{T("contact.address")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

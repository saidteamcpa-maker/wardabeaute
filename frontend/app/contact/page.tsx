import {
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";

export default function ContactPage() {
  const lang = getLangServer();
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
  const ig = "https://instagram.com/wardabeaute";
  const tiktok = "https://tiktok.com/@wardabeaute";
  return (
    <div className="section">
      <div className="container-page max-w-2xl">
        <h1 className="text-4xl text-profond mb-4">{t(lang, "contact.title")}</h1>
        <p className="font-body text-brun mb-6">{t(lang, "contact.sub")}</p>
        <div className="space-y-4 font-body text-brun">
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-brume p-5 hover:border-warda"
          >
            <FaWhatsapp className="w-6 h-6 text-[#25D366]" />
            <span>{t(lang, "contact.whatsapp")}</span>
          </a>

          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-brume p-5 hover:border-warda"
          >
            <FaInstagram className="w-6 h-6" />
            <span>{t(lang, "contact.instagram")}</span>
          </a>

          <a
            href={tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-brume p-5 hover:border-warda"
          >
            <FaTiktok className="w-6 h-6" />
            <span>{t(lang, "contact.tiktok")}</span>
          </a>

          <a
            href="mailto:hello@wardabeaute.com"
            className="flex items-center gap-3 rounded-2xl border border-brume p-5 hover:border-warda"
          >
            <FaEnvelope className="w-6 h-6 text-warda" />
            <span>{t(lang, "contact.email")}</span>
          </a>

          <div className="rounded-2xl border border-brume p-5 space-y-3">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="w-6 h-6 text-profond" />
              <span>{t(lang, "contact.address")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

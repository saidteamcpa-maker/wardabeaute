export default function ContactPage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
  return (
    <div className="section">
      <div className="container-page max-w-2xl">
        <h1 className="text-4xl text-profond mb-4">Contact</h1>
        <p className="font-body text-brun mb-6">Une question? On répond sur WhatsApp en quelques minutes. 🌹</p>
        <div className="space-y-4 font-body text-brun">
          <a href={`https://wa.me/${wa}`} target="_blank" className="block rounded-2xl border border-brume p-5 hover:border-warda">
            💬 WhatsApp — réponse rapide
          </a>
          <div className="rounded-2xl border border-brume p-5">✉️ Email: hello@wardabeaute.com</div>
          <div className="rounded-2xl border border-brume p-5">📍 Casablanca, Maroc · 🚚 Livraison 24–48h partout au Maroc</div>
          <div className="rounded-2xl border border-brume p-5">📸 Instagram / TikTok / Facebook: @wardabeaute</div>
        </div>
      </div>
    </div>
  );
}

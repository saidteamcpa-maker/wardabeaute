export default function SuiviCommande() {
  return (
    <div className="section">
      <div className="container-page max-w-2xl font-body text-brun">
        <h1 className="text-4xl text-profond mb-4">Suivi de commande</h1>
        <p className="mb-4">Entrez votre numéro de commande (reçu par WhatsApp) pour suivre votre livraison.</p>
        <div className="rounded-2xl border border-brume p-5">
          <p>📦 Statut typique : <span className="text-profond">Confirmée → Expédiée → Livrée (24–48h)</span></p>
          <p className="mt-2">Besoin d'aide? Contactez-nous sur WhatsApp.</p>
        </div>
      </div>
    </div>
  );
}

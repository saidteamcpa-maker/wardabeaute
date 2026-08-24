import { Section } from "@/components/Section";

export default function NotreHistoirePage() {
  return (
    <div>
      <section className="section">
        <div className="container-page max-w-3xl">
          <h1 className="text-5xl text-profond mb-4">Notre Histoire</h1>
          <p className="font-arabic text-xl text-warda mb-6">وردة بيوتي ماشي غير ماركة — هي الجواب ديالك</p>
          <p className="font-body text-brun mb-4">
            Warda Beauté est née d'un constat simple : les femmes marocaines méritent des produits efficaces,
            fabriqués ici, à des prix justes. Pas d'importation. Pas d'intermédiaire. Juste la science et les
            ingrédients que votre peau réclame.
          </p>
          <p className="font-body text-brun mb-4">
            🇲🇦 Fabriqué au Maroc · 🔬 Testé dermatologiquement · 💳 الدفع عند الاستلام · 🚚 Livraison 24–48h
          </p>
        </div>
      </section>
      <Section eyebrow="Conviction" title="La science au service de la femme marocaine" imageLabel="Lab Casablanca" imageSide="right">
        <p>Trois produits. Trois réponses à trois problèmes réels : vergetures, repousse des poils, et perte de collagène.</p>
        <p>Pas de catalogue infini. Pas de marketing vide. Juste de l'efficacité — livrée chez toi, payée à la réception.</p>
      </Section>
    </div>
  );
}

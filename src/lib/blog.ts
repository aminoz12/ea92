// Blog / advice articles — single source of truth for the homepage section,
// the /blog index and the /blog/[slug] pages.

export type BlogIconName = 'brake' | 'filter' | 'battery' | 'belt' | 'road' | 'sun'

export interface ArticleSection {
  heading: string
  body: string[]
}

export interface Article {
  slug: string
  category: string
  title: string
  excerpt: string
  readTime: string
  accent: string // gradient for the card / hero header
  icon: BlogIconName
  intro: string
  sections: ArticleSection[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'plaquettes-de-frein-quand-changer',
    category: 'Freinage',
    title: 'Plaquettes de frein : quand faut-il vraiment les changer ?',
    excerpt:
      "Bruit de grincement, pédale molle, distance de freinage qui s'allonge… Les signes qui ne trompent pas et le kilométrage moyen avant remplacement.",
    readTime: '4 min',
    accent: 'from-red-600 to-red-800',
    icon: 'brake',
    intro:
      "Les plaquettes de frein sont une pièce d'usure essentielle à votre sécurité. Les remplacer au bon moment évite un freinage dégradé et protège vos disques. Voici comment savoir quand agir.",
    sections: [
      {
        heading: 'Les signes qui doivent vous alerter',
        body: [
          "Un grincement ou un couinement métallique au freinage est souvent le premier signal : c'est le témoin d'usure qui frotte sur le disque.",
          "Méfiez-vous aussi d'une pédale qui devient molle ou spongieuse, de vibrations au freinage, d'une distance d'arrêt qui s'allonge ou d'un témoin allumé au tableau de bord.",
        ],
      },
      {
        heading: 'Tous les combien les remplacer ?',
        body: [
          "En moyenne, des plaquettes se changent tous les 30 000 à 40 000 km, mais cela varie fortement selon votre conduite (ville ou autoroute), la charge du véhicule et votre style de freinage.",
          "La règle sûre : si l'épaisseur de garniture passe sous 3 mm, il est temps de les remplacer sans attendre.",
        ],
      },
      {
        heading: 'Ne changez pas que les plaquettes',
        body: [
          "Profitez-en pour contrôler l'état des disques : s'ils sont rayés, voilés ou trop usés, il faut les remplacer en même temps.",
          "Changez toujours les plaquettes par essieu (les deux côtés en même temps) pour garder un freinage équilibré.",
        ],
      },
    ],
  },
  {
    slug: 'filtres-auto-frequence-remplacement',
    category: 'Filtration',
    title: 'Filtres auto : à quelle fréquence les remplacer ?',
    excerpt:
      "Huile, air, carburant, habitacle : chaque filtre a son rythme. Un guide simple pour préserver votre moteur et l'air que vous respirez à bord.",
    readTime: '3 min',
    accent: 'from-sky-600 to-sky-800',
    icon: 'filter',
    intro:
      "Souvent oubliés, les filtres protègent pourtant votre moteur, votre système d'injection et votre confort à bord. Voici les bons intervalles pour chacun.",
    sections: [
      {
        heading: 'Le filtre à huile',
        body: [
          "Il se remplace systématiquement à chaque vidange, soit environ tous les 10 000 à 15 000 km ou une fois par an. Un filtre encrassé laisse circuler des impuretés qui usent le moteur.",
        ],
      },
      {
        heading: "Le filtre à air",
        body: [
          "Comptez tous les 15 000 à 30 000 km, et plus souvent si vous roulez sur des routes poussiéreuses. Un filtre bouché fait surconsommer et perd de la puissance.",
        ],
      },
      {
        heading: "Filtre à carburant et filtre d'habitacle",
        body: [
          "Le filtre à carburant se change en général tous les 20 000 à 40 000 km selon le moteur (essence ou diesel).",
          "Le filtre d'habitacle, lui, se remplace au moins une fois par an : c'est lui qui filtre l'air de la ventilation et de la climatisation. Essentiel contre les pollens et les mauvaises odeurs.",
        ],
      },
    ],
  },
  {
    slug: 'batterie-signes-de-faiblesse',
    category: 'Électricité',
    title: 'Batterie : reconnaître les signes de faiblesse avant la panne',
    excerpt:
      'Démarrage poussif, voyant allumé, batterie de plus de 4 ans… Apprenez à anticiper le remplacement pour ne jamais rester en rade.',
    readTime: '3 min',
    accent: 'from-amber-500 to-amber-700',
    icon: 'battery',
    intro:
      "Une batterie ne tombe presque jamais en panne sans prévenir. En repérant les premiers signes, vous évitez le classique démarrage impossible un matin d'hiver.",
    sections: [
      {
        heading: 'Les symptômes à surveiller',
        body: [
          "Un démarreur qui tourne lentement, des phares qui faiblissent au ralenti, des équipements électriques capricieux ou le voyant batterie allumé sont autant de signaux d'alerte.",
        ],
      },
      {
        heading: 'Une durée de vie limitée',
        body: [
          "Une batterie dure en moyenne 4 à 5 ans. Le froid comme la forte chaleur l'usent prématurément, et les trajets courts répétés l'empêchent de se recharger complètement.",
        ],
      },
      {
        heading: 'Comment prolonger sa vie',
        body: [
          "Roulez régulièrement, vérifiez que les cosses sont propres et bien serrées, et faites contrôler la charge lors de vos entretiens.",
          "Au moindre doute, mieux vaut remplacer la batterie de façon préventive plutôt que de risquer l'immobilisation.",
        ],
      },
    ],
  },
  {
    slug: 'kit-de-distribution-ne-pas-attendre',
    category: 'Distribution',
    title: 'Kit de distribution : pourquoi ne jamais repousser le changement',
    excerpt:
      "Une courroie qui casse, c'est le moteur qui casse. Intervalles constructeur, pièces à changer ensemble et bons réflexes d'entretien.",
    readTime: '5 min',
    accent: 'from-gray-700 to-gray-900',
    icon: 'belt',
    intro:
      "La courroie de distribution est l'une des pièces les plus critiques du moteur. Négliger son remplacement peut coûter très cher. Voici pourquoi et quand intervenir.",
    sections: [
      {
        heading: 'Un enjeu moteur majeur',
        body: [
          "Si la courroie de distribution casse, les soupapes et les pistons ne sont plus synchronisés : la casse moteur est quasi immédiate, avec une réparation souvent très coûteuse, voire un moteur à remplacer.",
        ],
      },
      {
        heading: 'Les intervalles à respecter',
        body: [
          "Chaque constructeur fixe un intervalle, généralement entre 60 000 et 160 000 km, ou tous les 5 à 10 ans — la première échéance atteinte faisant foi.",
          "Consultez le carnet d'entretien de votre véhicule : c'est la référence à suivre à la lettre.",
        ],
      },
      {
        heading: 'Toujours changer le kit complet',
        body: [
          "On ne remplace jamais la courroie seule : le kit comprend aussi les galets et le tendeur, qui s'usent en même temps.",
          "Il est fortement recommandé de changer la pompe à eau dans la foulée quand elle est entraînée par la courroie : la main-d'œuvre est déjà engagée.",
        ],
      },
    ],
  },
  {
    slug: 'check-up-pieces-avant-les-vacances',
    category: 'Voyage été',
    title: 'Grand départ en vacances : le check-up pièces avant de prendre la route',
    excerpt:
      'Freins, pneus, filtres, niveaux, éclairage : la check-list complète des pièces à vérifier avant un long trajet chargé sous la chaleur.',
    readTime: '6 min',
    accent: 'from-orange-500 to-red-600',
    icon: 'road',
    intro:
      "Long trajet, voiture chargée et fortes chaleurs mettent la mécanique à rude épreuve. Un contrôle des pièces d'usure avant le départ vous évite bien des mauvaises surprises sur l'autoroute.",
    sections: [
      {
        heading: 'Freinage et pneus en priorité',
        body: [
          "Vérifiez l'usure des plaquettes et l'état des disques : avec une voiture chargée, les distances de freinage augmentent.",
          "Contrôlez la pression et l'usure des pneus (y compris la roue de secours). La chaleur et la charge sollicitent énormément les pneumatiques.",
        ],
      },
      {
        heading: 'Refroidissement et niveaux',
        body: [
          "Faites le plein de liquide de refroidissement, vérifiez le niveau d'huile et le lave-glace : la surchauffe est l'ennemi n°1 des longs trajets estivaux.",
        ],
      },
      {
        heading: 'Filtres, éclairage et essuie-glaces',
        body: [
          "Un filtre d'habitacle propre améliore la clim et l'air à bord pendant les longues heures de route.",
          "Contrôlez toutes les ampoules et l'état des balais d'essuie-glace : les orages d'été arrivent vite et la visibilité est primordiale.",
        ],
      },
    ],
  },
  {
    slug: 'preparer-climatisation-et-refroidissement-ete',
    category: 'Été & confort',
    title: 'Fortes chaleurs : préparer la climatisation et le refroidissement',
    excerpt:
      "Filtre d'habitacle, gaz de clim, radiateur et liquide de refroidissement : les pièces qui protègent votre auto (et vous) quand le thermomètre grimpe.",
    readTime: '4 min',
    accent: 'from-teal-500 to-cyan-700',
    icon: 'sun',
    intro:
      "Quand les températures grimpent, la climatisation et le circuit de refroidissement deviennent essentiels — pour votre confort comme pour la santé du moteur.",
    sections: [
      {
        heading: 'Une climatisation efficace',
        body: [
          "Commencez par le filtre d'habitacle : encrassé, il réduit le débit d'air et laisse passer les odeurs. Si l'air souffle moins froid, une recharge de gaz peut être nécessaire.",
          "Un entretien anti-bactérien du circuit élimine les mauvaises odeurs et assainit l'air que vous respirez.",
        ],
      },
      {
        heading: 'Protéger le moteur de la surchauffe',
        body: [
          "Vérifiez le radiateur, le ventilateur, le thermostat et surtout le niveau de liquide de refroidissement : ce sont eux qui empêchent le moteur de monter en température dans les embouteillages sous le soleil.",
        ],
      },
      {
        heading: 'Les bons réflexes',
        body: [
          "Stationnez à l'ombre quand c'est possible, aérez l'habitacle avant de lancer la clim, et faites contrôler vos niveaux avant les périodes de forte chaleur.",
        ],
      },
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

import type { L } from '../i18n'

type Programme = { name: L; level: L; price?: L; text: L }

// Prices and dates still to confirm with the team. Leave `price` out to show "Price to be announced".
export const programmes: Programme[] = [
  {
    name: { en: 'Open masterclass', sw: 'Darasa la wazi' },
    level: { en: 'Start here', sw: 'Anza hapa' },
    price: { en: 'Free', sw: 'Bure' },
    text: {
      en: 'A taster session in walk, posing and confidence. Meet the coaches and see if modeling is for you.',
      sw: 'Kipindi cha majaribio cha mwendo, kupozi na kujiamini. Kutana na walimu na ujue kama uanamitindo ni wako.',
    },
  },
  {
    name: { en: 'Weekend bootcamp', sw: 'Mafunzo ya wikendi' },
    level: { en: 'Foundations', sw: 'Misingi' },
    text: {
      en: 'An intensive in runway, posing, grooming and camera basics, ending with your first test shoot.',
      sw: 'Mafunzo makali ya jukwaa, kupozi, kujipamba na misingi ya kamera, yakihitimishwa na upigaji picha wako wa kwanza.',
    },
  },
  {
    name: { en: 'Full academy programme', sw: 'Programu kamili ya chuo' },
    level: { en: 'Career track', sw: 'Njia ya kitaaluma' },
    text: {
      en: 'The complete path to professional work: portfolio, castings, contracts and a direct route onto our boards.',
      sw: 'Njia kamili ya kazi ya kitaaluma: albamu ya picha, usaili, mikataba na nafasi ya moja kwa moja kwenye orodha zetu.',
    },
  },
]

export const curriculum: { title: L; text: L }[] = [
  {
    title: { en: 'Runway walk', sw: 'Mwendo wa jukwaani' },
    text: { en: 'Posture, pace, turns and confidence on any stage.', sw: 'Mkao, kasi, kugeuka na kujiamini kwenye jukwaa lolote.' },
  },
  {
    title: { en: 'Posing for camera', sw: 'Kupozi mbele ya kamera' },
    text: {
      en: 'Angles, expression and movement for commercial and editorial shoots.',
      sw: 'Pembe, sura na miondoko kwa picha za matangazo na majarida.',
    },
  },
  {
    title: { en: 'Grooming & style', sw: 'Kujipamba na mtindo' },
    text: {
      en: 'Skin, hair, nails and wardrobe basics for castings and jobs.',
      sw: 'Misingi ya ngozi, nywele, kucha na mavazi kwa usaili na kazi.',
    },
  },
  {
    title: { en: 'Portfolio shoot', sw: 'Picha za albamu' },
    text: {
      en: 'A professional test shoot to start your book and comp card.',
      sw: 'Upigaji picha wa kitaalamu kuanzisha albamu yako na kadi ya utambulisho.',
    },
  },
  {
    title: { en: 'Castings & auditions', sw: 'Usaili na majaribio' },
    text: {
      en: 'How to present yourself, take direction and stand out.',
      sw: 'Jinsi ya kujitambulisha, kufuata maelekezo na kujitofautisha.',
    },
  },
  {
    title: { en: 'Contracts & safety', sw: 'Mikataba na usalama' },
    text: {
      en: 'Rates, usage rights, payment terms and how to spot a scam.',
      sw: 'Bei, haki za matumizi, masharti ya malipo na jinsi ya kutambua utapeli.',
    },
  },
]

export const faqs: { q: L; a: L }[] = [
  {
    q: { en: 'Is applying really free?', sw: 'Je, kuomba ni bure kweli?' },
    a: {
      en: 'Yes. Scouting and agency applications cost nothing. Only the academy has a fee, and it is published on this site.',
      sw: 'Ndiyo. Usaili na maombi ya wakala hayalipiwi. Chuo pekee ndicho chenye ada, na imewekwa wazi kwenye tovuti hii.',
    },
  },
  {
    q: { en: 'Does finishing the academy guarantee work?', sw: 'Je, kumaliza chuo kunahakikisha kazi?' },
    a: {
      en: 'No agency can honestly promise bookings. Our strongest graduates are invited onto our boards and put forward for real jobs.',
      sw: 'Hakuna wakala anayeweza kuahidi kazi kwa uaminifu. Wahitimu wetu bora hualikwa kwenye orodha zetu na kupendekezwa kwa kazi halisi.',
    },
  },
  {
    q: { en: 'My child is under 18. Can they join?', sw: 'Mtoto wangu ana chini ya miaka 18. Anaweza kujiunga?' },
    a: {
      en: 'Yes, with a parent or guardian’s consent. Guardians are welcome at classes, and minors are always chaperoned at jobs.',
      sw: 'Ndiyo, kwa ridhaa ya mzazi au mlezi. Walezi wanakaribishwa darasani, na watoto husimamiwa kila wakati kazini.',
    },
  },
  {
    q: { en: 'How do I pay?', sw: 'Nalipaje?' },
    a: {
      en: 'Only to Blackhood Africa’s official accounts, and you always get a receipt. Never pay anyone personally in our name.',
      sw: 'Kwenye akaunti rasmi za Blackhood Africa pekee, na utapewa risiti kila mara. Usimlipe mtu yeyote binafsi kwa jina letu.',
    },
  },
]

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

// Blackhood Africa help chat: rule-based, no API keys, no network calls.
// Usage: <ChatWidget /> once in the app layout. Pass lang="sw" | "en" to follow the site toggle.

type Lang = "en" | "sw";
type Msg = { from: "bot" | "user"; text: string; wa?: string; apply?: boolean };

const WA_NUMBER = "255711505927";
const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

type Topic = {
  id: string;
  label: Record<Lang, string>;
  keywords: string[];
  answer: Record<Lang, string>;
  wa?: Record<Lang, string>;
  apply?: boolean; // show an "Apply now" button that opens the /apply form
};

const TOPICS: Topic[] = [
  {
    id: "apply",
    label: { en: "How do I apply?", sw: "Ninaombaje?" },
    keywords: ["apply", "join", "become", "model", "omba", "jiunga", "kujiunga", "mwanamitindo"],
    answer: {
      en: "Applying is FREE and takes about 5 minutes. Fill in our online application form: your details plus 3 photos with no filters (face close-up, full body, side profile). You'll get a reference number and a confirmation email.",
      sw: "Kuomba ni BURE na inachukua takriban dakika 5. Jaza fomu yetu ya maombi mtandaoni: taarifa zako pamoja na picha 3 bila filter (uso karibu, mwili mzima, ubavuni). Utapata namba ya ombi na barua pepe ya uthibitisho.",
    },
    apply: true,
  },
  {
    id: "free",
    label: { en: "Is it free?", sw: "Ni bure?" },
    keywords: ["free", "pay", "cost", "money", "charge", "bure", "lipa", "pesa", "gharama", "bei"],
    answer: {
      en: "Yes. Applying and attending our castings are FREE. Blackhood never charges you to join the agency. If anyone asks for money to apply in our name, it isn't us. Only use +255 711 505 927.",
      sw: "Ndiyo. Kuomba na kuhudhuria casting ni BURE. Blackhood haitozi pesa kujiunga na agency. Mtu akikuomba pesa kwa jina letu, si sisi. Tumia +255 711 505 927 pekee.",
    },
    apply: true,
  },
  {
    id: "academy",
    label: { en: "Academy & fees", sw: "Academy na ada" },
    keywords: ["academy", "train", "training", "class", "course", "fee", "fees", "mafunzo", "darasa", "ada", "chuo"],
    answer: {
      en: "The Blackhood Academy is optional and separate from the free agency application. The academy application is TZS 60,000, paid in full or in 2 instalments of TZS 30,000. Message us for the next intake.",
      sw: "Blackhood Academy ni hiari na ni tofauti na maombi ya bure ya agency. Ada ya kuomba academy ni TZS 60,000, kulipa yote au kwa awamu 2 za TZS 30,000. Tuandikie kujua intake ijayo.",
    },
    wa: { en: "Hi Blackhood! I'd like to know about the Academy.", sw: "Habari Blackhood! Nataka kujua kuhusu Academy." },
  },
  {
    id: "under18",
    label: { en: "I'm under 18", sw: "Nina chini ya miaka 18" },
    keywords: ["under 18", " age ", " old ", "young", "teen", "kid", "child", "parent", "umri", "mtoto", "mzazi", "miaka"],
    answer: {
      en: "Under 18? You're welcome to apply. The application form will ask for your parent's or guardian's name and phone. A parent or guardian must be involved in every step.",
      sw: "Una chini ya miaka 18? Unakaribishwa kuomba. Fomu ya maombi itauliza jina na simu ya mzazi au mlezi wako. Mzazi au mlezi lazima ahusike kila hatua.",
    },
    apply: true,
  },
  {
    id: "casting",
    label: { en: "Next casting", sw: "Casting ijayo" },
    keywords: ["casting", "audition", "when", "where", "date", "venue", "lini", "wapi", "tarehe", "ukaguzi"],
    answer: {
      en: "We're announcing our open casting date and venue in Dar es Salaam soon. Apply online now and we'll message you the details first. Follow @blackhoodafrica on Instagram and TikTok for updates.",
      sw: "Tutatangaza tarehe na mahali pa open casting Dar es Salaam hivi karibuni. Omba sasa mtandaoni na tutakutumia taarifa kwanza. Tufuate @blackhoodafrica Instagram na TikTok.",
    },
    apply: true,
  },
  {
    id: "brands",
    label: { en: "Book models (brands)", sw: "Kodi wanamitindo (makampuni)" },
    keywords: ["book", "booking", "brand", "client", "event", "advert", " ad ", " ads ", "hire", "company", "kodi", "tangazo", "kampuni", "tukio"],
    answer: {
      en: "We supply models, hosts and creators for ads, events, activations and content. Tell us the date, location, how many people and the type of work, and we'll send options.",
      sw: "Tunatoa wanamitindo, ma-host na creators kwa matangazo, matukio na content. Tuambie tarehe, mahali, idadi ya watu na aina ya kazi, tutakutumia machaguo.",
    },
    wa: { en: "Hi Blackhood! I'd like to book talent for a project.", sw: "Habari Blackhood! Nataka kukodi wanamitindo kwa kazi." },
  },
];

const UI = {
  en: {
    title: "Blackhood Africa",
    subtitle: "Usually replies on WhatsApp",
    hello: "Karibu! 🖤 I can answer common questions about applying, the academy and bookings. Pick a topic or type a question.",
    placeholder: "Type your question…",
    fallback: "I'm not sure about that one. Our team can help you directly on WhatsApp.",
    openWa: "Continue on WhatsApp",
    applyNow: "Open the application form",
    open: "Chat with us",
    close: "Close chat",
    send: "Send",
  },
  sw: {
    title: "Blackhood Africa",
    subtitle: "Tunajibu kupitia WhatsApp",
    hello: "Karibu! 🖤 Naweza kujibu maswali kuhusu kuomba, academy na booking. Chagua mada au andika swali.",
    placeholder: "Andika swali lako…",
    fallback: "Sina uhakika na hilo. Timu yetu itakusaidia moja kwa moja kwenye WhatsApp.",
    openWa: "Endelea WhatsApp",
    applyNow: "Fungua fomu ya maombi",
    open: "Ongea nasi",
    close: "Funga",
    send: "Tuma",
  },
} as const;

function findTopic(input: string): Topic | undefined {
  const q = ` ${input.toLowerCase()} `;
  let best: Topic | undefined;
  let bestScore = 0;
  for (const t of TOPICS) {
    const score = t.keywords.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      best = t;
      bestScore = score;
    }
  }
  return best;
}

export default function ChatWidget({ lang: langProp }: { lang?: Lang }) {
  const [lang, setLang] = useState<Lang>(langProp ?? "en");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const t = UI[lang];

  useEffect(() => {
    if (langProp) setLang(langProp);
  }, [langProp]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const reply = (userText: string, topic?: Topic) => {
    const bot: Msg = topic
      ? { from: "bot", text: topic.answer[lang], wa: topic.wa?.[lang], apply: topic.apply }
      : { from: "bot", text: t.fallback, wa: userText };
    setMsgs((m) => [...m, { from: "user", text: userText }, bot]);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    reply(text, findTopic(text));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label={t.title}
          className="flex h-[min(560px,calc(100dvh-6rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink text-white shadow-2xl"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-ink px-4 py-3">
            <div>
              <p className="font-semibold">{t.title}</p>
              <p className="text-xs text-white/60">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-1">
              {!langProp && (
                <button
                  type="button"
                  onClick={() => setLang(lang === "en" ? "sw" : "en")}
                  className="rounded-full border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                >
                  {lang === "en" ? "SW" : "EN"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            <Bubble from="bot" text={t.hello} />
            {msgs.map((m, i) => (
              <div key={i} className="space-y-2">
                <Bubble from={m.from} text={m.text} />
                {m.apply && (
                  <Link
                    to="/apply"
                    onClick={() => setOpen(false)}
                    className="mr-2 inline-block rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink hover:brightness-110"
                  >
                    {t.applyNow} →
                  </Link>
                )}
                {m.wa !== undefined && (
                  <a
                    href={waLink(m.wa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-black hover:brightness-110"
                  >
                    {t.openWa} →
                  </a>
                )}
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => reply(topic.label[lang], topic)}
                  className="rounded-full border border-gold/40 px-3 py-1.5 text-xs text-gold hover:bg-gold/10"
                >
                  {topic.label[lang]}
                </button>
              ))}
            </div>
            <div ref={endRef} />
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <button
              type="submit"
              className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
            >
              {t.send}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? t.close : t.open}
        className="flex h-14 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white shadow-xl ring-1 ring-gold/50 hover:ring-gold"
      >
        <span aria-hidden className="text-xl">{open ? "✕" : "💬"}</span>
        {!open && <span className="hidden text-sm sm:inline">{t.open}</span>}
      </button>
    </div>
  );
}

function Bubble({ from, text }: { from: "bot" | "user"; text: string }) {
  return (
    <div className={from === "user" ? "flex justify-end" : "flex justify-start"}>
      <p
        className={
          "max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 " +
          (from === "user" ? "bg-gold text-black" : "bg-white/10 text-white")
        }
      >
        {text}
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Flower2,
  Headphones,
  MapPin,
  Menu,
  Music2,
  Play,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";

const imagePaths = {
  singers: "/images/quan-ho-singers.jpg",
  festival: "/images/di-san-van-hoa-la-gi-9.webp",
  practitioner: "/images/hatquanho.jpg",
  hat: "/images/images.jpg",
  map: "/images/vietnam-map.webp",
};

const navItems = [
  ["01", "Listen", "hero"],
  ["02", "Where", "where"],
  ["03", "Exchange", "exchange"],
  ["04", "Wear", "costumes"],
  ["05", "Keep", "why"],
];

const regions = {
  bacninh: {
    name: "Bắc Ninh",
    kicker: "The heart of Kinh Bắc",
    body: "A province in the Red River Delta, known for villages where Quan Họ remains part of community life.",
    note: "Many traditional villages are twinned with villages in Bắc Giang.",
  },
  bacgiang: {
    name: "Bắc Giang",
    kicker: "The neighboring voice",
    body: "Across the Cầu River, Bắc Giang shares the Kinh Bắc cultural landscape and the custom of singing exchanges.",
    note: "Quan Họ is associated with both provinces in northern Viet Nam.",
  },
};

type RegionKey = keyof typeof regions;

type CostumeKey = "hat" | "scarf" | "tunic" | "male";

const costumeDetails: Record<CostumeKey, { label: string; detail: string }> = {
  hat: {
    label: "nón quai thao",
    detail: "The large round palm hat is a visual symbol of the female Quan Họ singer.",
  },
  scarf: {
    label: "khăn mỏ quạ",
    detail: "A dark head scarf frames the face and is worn with the traditional outfit.",
  },
  tunic: {
    label: "áo tứ thân",
    detail: "The four-panel tunic is layered over a bodice, skirt and colorful sash.",
  },
  male: {
    label: "áo the + khăn xếp",
    detail: "Men traditionally wear a dark tunic with a wrapped turban; umbrellas can complete the festival look.",
  },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("bacninh");
  const [exchangeStep, setExchangeStep] = useState(0);
  const [selectedCostume, setSelectedCostume] = useState<CostumeKey>("hat");
  const [openingPhase, setOpeningPhase] = useState<1 | 2>(1);
  const [openingDone, setOpeningDone] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.3, 0.6] },
    );
    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const phaseTimer = window.setTimeout(() => setOpeningPhase(2), 1900);
    const finishTimer = window.setTimeout(() => setOpeningDone(true), 5200);
    return () => {
      window.clearTimeout(phaseTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    if (openingDone) return;
    const handleOpeningKey = (event: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        if (openingPhase === 1) setOpeningPhase(2);
        else setOpeningDone(true);
      }
      if (["ArrowLeft", "ArrowUp"].includes(event.key) && openingPhase === 2) {
        event.preventDefault();
        setOpeningPhase(1);
      }
    };
    window.addEventListener("keydown", handleOpeningKey);
    return () => window.removeEventListener("keydown", handleOpeningKey);
  }, [openingDone, openingPhase]);

  const advanceOpening = () => {
    if (openingPhase === 1) setOpeningPhase(2);
    else setOpeningDone(true);
  };

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const playExchange = () => {
    setExchangeStep((step) => (step + 1) % 3);
  };

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />
      {!openingDone && (
        <div className={`opening-sequence phase-${openingPhase}`} role="dialog" aria-label="Presentation opening" onClick={advanceOpening}>
          <div className="opening-inner">
            <div className="opening-kicker"><span /> English 10 / Global Success</div>
            <div className="opening-stage opening-stage-one">
              <span className="opening-unit">UNIT 3</span>
              <h2>Music</h2>
              <p>Traditional Music Project</p>
            </div>
            <div className="opening-stage opening-stage-two">
              <span className="opening-unit">PRESENTED BY</span>
              <h2>Group <i>3</i></h2>
              <div className="opening-members">
                <span><b>Cam Ngọc Khánh Linh</b><em>Leader</em></span>
                <span><b>Trần Trường Giang</b></span>
                <span><b>Đào Bích Hường</b></span>
                <span><b>Đặng Tiến Chung</b></span>
              </div>
              <p className="opening-roles">Presentation · Image / content research · Computer control</p>
            </div>
            <div className="opening-footer"><span>Quan Họ Bắc Ninh</span><span className="opening-hint">Click or use ← ↑ → ↓</span><button onClick={(event) => { event.stopPropagation(); setOpeningDone(true); }}>Enter presentation <ArrowRight size={15} /></button></div>
          </div>
        </div>
      )}
      <header className="topbar">
        <button className="brand" onClick={() => goTo("hero")} aria-label="Back to the beginning">
          <span className="brand-mark"><Flower2 size={15} strokeWidth={1.7} /></span>
          <span><strong>KINH BẮC</strong><em>field notes / 01</em></span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([number, label, id]) => (
            <button key={id} className={activeSection === id ? "active" : ""} onClick={() => goTo(id)}>
              <small>{number}</small>{label}
            </button>
          ))}
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        {menuOpen && (
          <div className="mobile-nav">
            {navItems.map(([number, label, id]) => (
              <button key={id} onClick={() => goTo(id)}><small>{number}</small>{label}<ArrowRight size={16} /></button>
            ))}
          </div>
        )}
      </header>

      <aside className="progress-rail" aria-label="Presentation progress">
        {navItems.map(([number, , id]) => (
          <button key={id} className={activeSection === id ? "active" : ""} onClick={() => goTo(id)} aria-label={`Go to section ${number}`}>
            <span>{number}</span><i />
          </button>
        ))}
      </aside>

      <main>
        <section id="hero" className="hero section-dark">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-copy reveal">
            <p className="eyebrow light"><span /> Traditional music / Viet Nam</p>
            <h1>Two groups.<br /><i>One melody.</i><br />A conversation<br />without speaking.</h1>
            <p className="hero-lede">Step into <strong>Quan Họ Bắc Ninh</strong> — a living folk-singing tradition from the Kinh Bắc region, where a verse is answered with another verse.</p>
            <div className="hero-actions">
              <button className="button button-brass" onClick={() => goTo("what-is")}>Begin the journey <ArrowDown size={17} /></button>
              <span className="time-note"><Headphones size={15} /> 5–7 min presentation</span>
            </div>
          </div>
          <div className="hero-image-wrap reveal delay-2">
            <div className="hero-image-frame"><img src={imagePaths.singers} alt="Quan Họ singers holding traditional hats during a performance" /></div>
            <div className="hero-caption"><span>01 / 08</span><span>voices of Kinh Bắc</span></div>
          </div>
          <div className="scroll-cue"><span>scroll to listen</span><ArrowDown size={15} /></div>
        </section>

        <section id="what-is" className="intro section-paper section-pad">
          <div className="section-index">01 <span>/</span> 08</div>
          <div className="intro-grid content-width">
            <div>
              <p className="eyebrow red"><span /> Start with the idea</p>
              <h2>What is<br /><i>Quan Họ?</i></h2>
            </div>
            <div className="intro-text">
              <p className="big-copy">It is not a solo performance. It is a musical relationship.</p>
              <p>Traditionally, groups of women and men sing alternating verses. One side begins; the other responds with a similar melody and different lyrics. The exchange turns a song into a social conversation.</p>
              <div className="stat-row">
                <div><strong>400+</strong><span>known song lyrics</span></div>
                <div><strong>213</strong><span>melody variations</span></div>
                <div><strong>2009</strong><span>UNESCO inscription</span></div>
              </div>
            </div>
          </div>
          <div className="melody-line" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        </section>

        <section id="where" className="where section-indigo section-pad">
          <div className="content-width">
            <div className="section-heading split-heading">
              <div><p className="eyebrow brass"><span /> The landscape</p><h2>Born in<br /><i>Kinh Bắc.</i></h2></div>
              <p className="heading-note">A region is more than a point on a map. It is the villages, rivers and relationships that let a tradition stay alive.</p>
            </div>
            <div className="map-layout">
              <figure className="map-card">
                <div className="map-title">VIET NAM / KINH BẮC</div>
                <div className="map-image-wrap">
                  <img src={imagePaths.map} width={624} height={468} alt="Outline map of Viet Nam, with Bắc Ninh and Bắc Giang marked in the north" />
                  {/* Approximate city centers on this 624 × 468 raster: Bắc Ninh
                      21°11′N 106°03′E; Bắc Giang 21°17′N 106°14′E.
                      Keep points and leader lines in image coordinates when resizing. */}
                  <svg className="map-markers" viewBox="0 0 624 468" aria-hidden="true">
                    <g className={selectedRegion === "bacninh" ? "selected" : ""}>
                      <polyline points="322,89 275,120 165,120" />
                      <circle cx="322" cy="89" r="2.5" />
                    </g>
                    <g className={selectedRegion === "bacgiang" ? "selected" : ""}>
                      <polyline points="327,86 375,60 440,60" />
                      <circle cx="327" cy="86" r="2.5" />
                    </g>
                  </svg>
                  <button className={`map-pin pin-bacninh ${selectedRegion === "bacninh" ? "selected" : ""}`} aria-pressed={selectedRegion === "bacninh"} onClick={() => setSelectedRegion("bacninh")}>Bắc Ninh</button>
                  <button className={`map-pin pin-bacgiang ${selectedRegion === "bacgiang" ? "selected" : ""}`} aria-pressed={selectedRegion === "bacgiang"} onClick={() => setSelectedRegion("bacgiang")}>Bắc Giang</button>
                </div>
                <figcaption className="map-legend"><MapPin size={13} /> Northern Viet Nam · approximate city locations</figcaption>
              </figure>
              <div className="region-detail">
                <span className="detail-number">0{selectedRegion === "bacninh" ? 1 : 2}</span>
                <p className="eyebrow brass">{regions[selectedRegion].kicker}</p>
                <h3>{regions[selectedRegion].name}</h3>
                <p>{regions[selectedRegion].body}</p>
                <div className="detail-note"><Sparkles size={16} /><span>{regions[selectedRegion].note}</span></div>
                <div className="region-switcher"><button className={selectedRegion === "bacninh" ? "selected" : ""} onClick={() => setSelectedRegion("bacninh")}>Bắc Ninh</button><button className={selectedRegion === "bacgiang" ? "selected" : ""} onClick={() => setSelectedRegion("bacgiang")}>Bắc Giang</button></div>
              </div>
            </div>
            <div className="origin-strip"><span>ORIGIN NOTE</span><p>Quan Họ is <em>believed to have developed</em> in the Kinh Bắc region over time. Traditional legends exist, but historians do not agree on one exact founding year.</p></div>
          </div>
        </section>

        <section id="exchange" className="exchange section-paper section-pad">
          <div className="content-width">
            <div className="section-heading split-heading">
              <div><p className="eyebrow red"><span /> The central gesture</p><h2>Music as<br /><i>conversation.</i></h2></div>
              <p className="heading-note dark-note">Press play to see the call-and-response unfold. The point is not competition — it is the pleasure of answering well.</p>
            </div>
            <div className="exchange-stage">
              <div className={`singer-card female ${exchangeStep === 1 ? "speaking" : ""}`}><div className="avatar avatar-female">L</div><div><span className="role-tag">liền chị</span><h3>“Câu ra”</h3><p>female singers open with a challenge verse</p></div><span className="voice-wave" /></div>
              <div className="exchange-center"><button className="play-button" onClick={playExchange} aria-label="Play the next exchange"><Play size={18} fill="currentColor" /></button><div className="exchange-status">{exchangeStep === 0 ? "ready to listen" : exchangeStep === 1 ? "the verse travels" : "the answer returns"}</div><div className="exchange-dots"><i className={exchangeStep === 0 ? "on" : ""} /><i className={exchangeStep === 1 ? "on" : ""} /><i className={exchangeStep === 2 ? "on" : ""} /></div></div>
              <div className={`singer-card male ${exchangeStep === 2 ? "speaking" : ""}`}><div className="avatar avatar-male">A</div><div><span className="role-tag">liền anh</span><h3>“Câu đối”</h3><p>male singers answer with the same melody</p></div><span className="voice-wave" /></div>
            </div>
            <div className="exchange-foot"><span>Unison <b>→</b> response</span><p>The words can change, but the melody must meet — creating a shared musical memory.</p></div>
          </div>
        </section>

        <section id="sound" className="sound section-warm section-pad">
          <div className="content-width sound-grid">
            <div><p className="eyebrow red"><span /> Listen closely</p><h2>How does<br /><i>it sound?</i></h2><p className="sound-lede">Quan Họ is first and foremost vocal music. Its signature is the human voice passing a melody between people.</p><div className="technique-list"><span><b>01</b> restrained</span><span><b>02</b> resonant</span><span><b>03</b> ringing</span><span><b>04</b> staccato</span></div></div>
            <div className="sound-note"><div className="sound-note-icon"><Music2 size={23} /></div><p className="eyebrow red">A useful distinction</p><h3>Voices first.<br />Instruments later.</h3><p>Traditional Quan Họ singing can be performed without instrumental accompaniment. Instruments may appear in later stage or festival contexts, but they are not what defines the original singing exchange.</p><div className="sound-rule" /><span>listen for the breath between lines</span></div>
          </div>
        </section>

        <section id="performers" className="performers section-paper section-pad">
          <div className="content-width">
            <div className="section-heading split-heading"><div><p className="eyebrow red"><span /> The people</p><h2>Who carries<br /><i>the tradition?</i></h2></div><p className="heading-note dark-note">Quan Họ lives through relationships: the people who learn, remember, host, answer and pass the melody on.</p></div>
            <div className="performer-grid">
              <div className="performer-card performer-female"><span className="role-index">01</span><span className="role-tag">female singer</span><h3>liền chị</h3><p>A female Quan Họ singer, often singing in a group and leading or joining the exchange.</p><div className="card-line" /><span className="vietnamese">chị cả / chị hai / chị ba</span></div>
              <div className="performer-card performer-male"><span className="role-index">02</span><span className="role-tag">male singer</span><h3>liền anh</h3><p>A male Quan Họ singer, responding to the liền chị with a matching melody and new lyrics.</p><div className="card-line" /><span className="vietnamese">anh cả / anh hai / anh ba</span></div>
              <div className="performer-photo"><img src={imagePaths.practitioner} alt="Quan Họ singers performing on a boat in traditional clothing" /><div className="photo-label"><span>living archive</span><strong>One voice<br />becomes many.</strong></div></div>
            </div>
          </div>
        </section>

        <section id="costumes" className="costumes section-indigo section-pad">
          <div className="content-width">
            <div className="section-heading split-heading"><div><p className="eyebrow brass"><span /> A visual language</p><h2>What do<br /><i>they wear?</i></h2></div><p className="heading-note">Costume does not sit beside the music. It helps the audience recognize the role, place and care inside the performance.</p></div>
            <div className="costume-layout">
              <div className="costume-photo"><img src={imagePaths.hat} alt="Traditional áo tứ thân and nón quai thao costume" /><div className="photo-wash" /><button className={`hotspot hotspot-hat ${selectedCostume === "hat" ? "selected" : ""}`} onClick={() => setSelectedCostume("hat")} aria-label="Explore nón quai thao"><span>01</span></button><button className={`hotspot hotspot-scarf ${selectedCostume === "scarf" ? "selected" : ""}`} onClick={() => setSelectedCostume("scarf")} aria-label="Explore khăn mỏ quạ"><span>02</span></button><button className={`hotspot hotspot-tunic ${selectedCostume === "tunic" ? "selected" : ""}`} onClick={() => setSelectedCostume("tunic")} aria-label="Explore áo tứ thân"><span>03</span></button><span className="costume-credit">visual reference / traditional costume</span></div>
              <div className="costume-detail"><p className="eyebrow brass">Costume explorer</p><div className="costume-number">{selectedCostume === "male" ? "04" : selectedCostume === "hat" ? "01" : selectedCostume === "scarf" ? "02" : "03"}</div><h3>{costumeDetails[selectedCostume].label}</h3><p>{costumeDetails[selectedCostume].detail}</p><div className="costume-tabs"><button className={selectedCostume === "hat" ? "selected" : ""} onClick={() => setSelectedCostume("hat")}>hat</button><button className={selectedCostume === "scarf" ? "selected" : ""} onClick={() => setSelectedCostume("scarf")}>scarf</button><button className={selectedCostume === "tunic" ? "selected" : ""} onClick={() => setSelectedCostume("tunic")}>tunic</button><button className={selectedCostume === "male" ? "selected" : ""} onClick={() => setSelectedCostume("male")}>male look</button></div><div className="male-look"><div className="male-symbol">A</div><div><strong>liền anh</strong><span>áo the · khăn xếp · traditional trousers</span></div></div></div>
            </div>
          </div>
        </section>

        <section id="festival" className="festival section-paper section-pad">
          <div className="content-width festival-grid"><div className="festival-copy"><p className="eyebrow red"><span /> When the song travels</p><h2>From village<br /><i>to festival.</i></h2><p>Quan Họ is heard at rituals, spring festivals, competitions and informal gatherings. Guests sing verses for their hosts, then answer with a farewell.</p><div className="context-list"><span><b>rituals</b><small>shared memory</small></span><span><b>festivals</b><small>public joy</small></span><span><b>gatherings</b><small>new friendships</small></span></div><button className="text-link" onClick={() => goTo("why")}>Why it still matters <ArrowRight size={16} /></button></div><div className="festival-image"><img src={imagePaths.festival} alt="Quan Họ performance at a spring festival" /><div className="festival-stamp"><Sun size={17} /><span>SPRING<br />FESTIVAL</span></div><span className="image-caption">singing in community / Bắc Ninh</span></div></div>
        </section>

        <section id="why" className="why section-red section-pad"><div className="content-width why-content"><div><p className="eyebrow light"><span /> The living legacy</p><h2>Why does<br /><i>it matter?</i></h2></div><div className="why-quote"><div className="quote-mark">“</div><blockquote>Quan Họ is not just a collection of songs. It is a way for villages to practice care, memory and connection — one response at a time.</blockquote><div className="why-points"><span><Users size={17} /><b>social bonds</b></span><span><Music2 size={17} /><b>local identity</b></span><span><Sparkles size={17} /><b>living heritage</b></span></div></div></div></section>

        <section id="sources" className="sources section-dark section-pad"><div className="content-width sources-grid"><div><p className="eyebrow brass"><span /> Keep exploring</p><h2>A tradition<br /><i>in response.</i></h2><p className="sources-lede">When one voice makes space for another, a community can hear itself.</p><button className="button button-brass" onClick={() => goTo("hero")}>Replay from the top <ArrowDown size={17} className="rotate-up" /></button></div><div className="sources-list"><p className="eyebrow light">Sources / references</p><a href="https://ich.unesco.org/en/RL/quan-h-bc-ninh-folk-songs-00183" target="_blank" rel="noreferrer"><span><b>01</b> UNESCO — Quan Họ Bắc Ninh folk songs</span><ExternalLink size={14} /></a><a href="https://vietnamtourism.gov.vn/en/post/8701" target="_blank" rel="noreferrer"><span><b>02</b> Viet Nam National Authority of Tourism — Quan Ho Bac Ninh</span><ExternalLink size={14} /></a><div className="source-note"><span>Research note</span><p>The exact origin date is uncertain, so this presentation uses “is believed to have developed” rather than inventing a founding year.</p></div><div className="group-card"><div className="group-card-heading"><span className="eyebrow brass"><span /> Presentation team</span><strong>Group 3</strong></div><div className="member-list"><div><span>01</span><strong>Cam Ngọc Khánh Linh</strong><em>Leader</em></div><div><span>02</span><strong>Trần Trường Giang</strong></div><div><span>03</span><strong>Đào Bích Hường</strong></div><div><span>04</span><strong>Đặng Tiến Chung</strong></div></div><p className="team-tasks"><span>Team roles</span> Presentation · Image / content research · Computer control</p></div></div></div><footer><span>Grade 10 English / Traditional Music project</span><span>Made for listening, not just looking.</span></footer></section>
      </main>
    </div>
  );
}

import React from 'react';

// ===== Pas To Kima — One‑pager (React, plain JS) =====
export default function PasToKimaSite() {
  // ====== DATA (verbatim from script) ======
  const beliefs = [
    { title: 'Philoxenia', body: 'Real hospitality; everyone at our tables is a guest of honor.', icon: '🤝' },
    { title: 'From‑scratch cooking', body: 'Dips, dressings and sauces made fresh daily.', icon: '🥣' },
    { title: 'Local first', body: 'We prioritise seasonal produce and Cypriot makers whenever possible.', icon: '🌿' },
    { title: 'Charcoal & flame', body: 'Simple grilling that lets quality speak for itself.', icon: '🔥' },
    { title: 'Honest portions', body: 'Generous plates designed for sharing.', icon: '🍽️' },
    { title: 'Consistency', body: 'The same care at lunchtime or late into the evening.', icon: '⏰' },
  ];

  const menu = {
    Starters: [
      { n: 'Italian bruschetta', d: 'fresh tomatoes, onions, garlic, fresh basil & grated parmesan', p: 9.5 },
      { n: 'Burrata on bruschetta', d: 'tomato, rucola & green pesto', p: 11.5 },
      { n: 'Melanzane alla Parmigiana', d: 'eggplant stuffed with tomato sauce & grated parmesan', p: 11.5 },
      { n: 'Nachos', d: 'served with guacamole & sour cream', p: 10.5 },
      { n: 'Garlic bread with cheese', d: '', p: 5.5 },
      { n: 'Mussels with garlic butter', d: '', p: 10.5 },
      { n: 'King prawns in garlic butter', d: '', p: 13.0 },
      { n: 'Fresh fried crispy calamari', d: 'with tartar sauce', p: 9.5 },
      { n: 'Sweet chilli prawns', d: '', p: 12.5 },
      { n: 'Feta saganaki', d: 'filo pastry, feta, honey & sesame', p: 9.5 },
      { n: 'Crispy fried halloumi', d: 'with honey & fruit jam', p: 9.5 },
      { n: 'Vegetable spring roll', d: 'with sweet chili sauce', p: 9.5 },
      { n: 'Stuffed mushroom', d: 'mixed cheeses & fresh herbs', p: 9.5 },
      { n: 'Falafel with tahini', d: '', p: 9.5 },
      { n: 'Zucchini balls with tzatziki', d: '', p: 9.0 },
      { n: 'Dips (each)', d: 'Tzatziki, Tahini, Taramosalata, Hummus, Olives', p: 4.0 },
    ],
    Salads: [
      { n: 'Village salad', d: 'lettuce, cabbage, tomato, cucumber, capers, onion, feta, olive oil & vinegar', p: 9.0 },
      { n: 'Greek salad', d: 'tomato, cucumber, green pepper, onion, feta & olive oil', p: 11.0 },
      { n: 'Caesar salad', d: 'lettuce, bacon, grilled chicken, croutons, parmesan flakes, Caesar dressing', p: 13.0 },
      { n: 'Rucola salad', d: 'baby rucola, dried fruits, cherry tomatoes, goat’s cheese, balsamic vinaigrette & parmesan flakes', p: 13.5 },
    ],
    Grill: [
      { n: 'Pork souvlaki', d: 'served with chips & salad', p: 13.5 },
      { n: 'Chicken souvlaki', d: 'served with chips & salad', p: 14.5 },
      { n: 'Sheftalia', d: 'served with chips & salad', p: 14.0 },
      { n: 'Mixed pork souvlaki with sheftalia', d: 'served with chips & salad', p: 14.0 },
      { n: 'Mixed chicken souvlaki with sheftalia', d: 'served with chips & salad', p: 14.5 },
      { n: 'Pork chop', d: 'served with chips & salad', p: 17.5 },
      { n: 'Meat platter for 2', d: 'halloumi, sausage, mushroom, chicken souvlaki, pork souvlaki, sheftalies, lamb chops, chips & tzatziki', p: 44.0 },
    ],
    Burgers: [
      { n: 'Beefburger with chips', d: 'tomato, lettuce, onion, pickle & Pas To Kima sauce (2×125g)', p: 14.5 },
      { n: 'Cheeseburger with chips', d: 'tomato, lettuce, onion, pickle & Pas To Kima sauce (2×125g)', p: 15.5 },
      { n: 'Egg & bacon burger with chips', d: 'tomato, lettuce, onion, pickle & Pas To Kima sauce (2×125g)', p: 16.5 },
      { n: 'Mexican burger with chips', d: '(2×125g)', p: 17.5 },
    ],
    Pasta: [
      { n: 'Seafood pasta', d: 'black linguine, king prawns & mussels, fresh cream, tomato & ouzo', p: 22.5 },
      { n: 'Fresh ravioli', d: 'stuffed with crab & lobster meat, red pesto', p: 22.5 },
      { n: 'Vegan spaghetti', d: 'peppers, mushrooms, onion, garlic & tomato sauce', p: 14.5 },
    ],
    International: [
      { n: 'Pork fillet teriyaki', d: 'with rice', p: 17.5 },
      { n: 'Chicken fajitas', d: 'with rice', p: 17.5 },
      { n: 'Grilled chicken fillet', d: 'with rice & vegetables', p: 16.5 },
    ],
    Fish: [
      { n: 'Sea bream', d: 'served with vegetables & rice', p: 18.5 },
      { n: 'Sea bass', d: 'served with vegetables & rice', p: 18.5 },
      { n: 'Salmon', d: 'teriyaki OR olive & garlic; served with vegetables & rice', p: 19.5 },
      { n: 'Fresh fried calamari', d: 'with chips', p: 19.0 },
      { n: 'Grilled king prawns', d: 'garlic butter, vegetables & rice', p: 27.5 },
      { n: 'Seafood platter for 2', d: 'king prawns, mussels, fresh fried calamari, rice & chips', p: 46.0 },
    ],
    Kids: [
      { n: 'Beefburger with chips', d: 'tomato & lettuce (125g)', p: 10.0 },
      { n: 'Cheeseburger with chips', d: 'tomato & lettuce (125g)', p: 10.5 },
      { n: 'Spaghetti Bolognese', d: '', p: 10.0 },
      { n: 'Spaghetti Napolitano', d: 'pepper, garlic, onion & tomato sauce', p: 9.5 },
      { n: 'Spaghetti with cheese', d: '', p: 9.0 },
      { n: 'Nuggets with chips', d: '', p: 8.5 },
    ],
    Desserts: [
      { n: 'Apple pie', d: '', p: 6.5 },
      { n: 'Carrot cake', d: '', p: 6.0 },
      { n: 'Cheesecake', d: '', p: 6.5 },
      { n: 'Chocolate cake', d: '', p: 6.5 },
      { n: 'Panacota', d: '', p: 6.5 },
      { n: 'Sweet of the day', d: '', p: 6.5 },
      { n: 'Seasonal fruits', d: '', p: 6.0 },
    ],
  };

  const drinks = {
    'Softs & Water': [
      { n: 'Soft drinks', d: 'Coca‑Cola, Zero Cola, 7up, 7up diet, Fanta, Ice Tea peach, Ice Tea lemon', p: 2.5 },
      { n: 'Juices', d: 'apple, orange, pineapple, cranberry', p: 2.5 },
      { n: 'Still water 0.5L / 1L', d: '', p: 2.0, p2: 2.5 },
      { n: 'Sparkling water', d: '', p: 2.5 },
    ],
    'Beer & Cider': [
      { n: 'Half pint (Keo, Carlsberg, Leon)', p: 2.75 },
      { n: 'Pint (Keo, Carlsberg, Leon)', p: 3.75 },
      { n: 'Small beer 330ml', d: 'Μηλίτσα apple; strawberry & lime; Corona; Somersby; Budweiser; Heineken', p: 3.5 },
      { n: 'Beer can 500ml', d: 'Guinness, Strongbow, Kopparberg, John Smith’s', p: 5.0 },
      { n: 'Large bottle 630ml (Keo, Carlsberg, Leon)', p: 4.0 },
      { n: 'Carlsberg 0% 330ml', p: 3.5 },
      { n: 'Mixer (soft drinks, juices)', p: 1.5 },
    ],
    Coffees: [
      { n: 'Cyprus coffee', p: 2.0 },
      { n: 'Frappe', p: 2.5 },
      { n: 'Filter coffee', p: 3.0 },
      { n: 'Espresso', p: 2.2 },
      { n: 'Cappuccino', p: 3.8 },
      { n: 'Latte', p: 3.8 },
      { n: 'Americano', p: 3.0 },
      { n: 'Freddo espresso', p: 3.0 },
      { n: 'Freddo cappuccino', p: 3.8 },
      { n: 'Iced latte', p: 3.8 },
      { n: 'Iced americano', p: 3.0 },
      { n: 'Tea', p: 3.0 },
    ],
    Spirits: [
      { n: 'Vodka', d: 'Stoli, Smirnoff, Absolut, Bombay', p: 5.0 },
      { n: 'Premium vodka', d: 'Belvedere, Grey Goose, Beluga', p: 7.0 },
      { n: 'Gin', d: 'Gordons, Gordons Pink, Bombay Sapphire', p: 5.0 },
      { n: 'Premium gin', d: 'Hendricks, Tanqueray, Bulldog, Whitley Neill', p: 7.0 },
      { n: 'Whisky', d: 'Famous Grouse', p: 5.0 },
      { n: 'Premium whisky', d: 'Jack Daniel’s, Black Label, Chivas, Jameson', p: 7.0 },
      { n: 'Rum', d: 'Captain Morgan White / Dark / Spiced, Bacardi', p: 5.0 },
      { n: 'Tequila', d: 'Silver, Gold', p: 5.0 },
      { n: 'Liqueurs', d: 'Coffee, Tia Maria, Baileys, Malibu, Aperol, Campari, Limoncello, Disaronno, Cointreau, Benedictine, Amaretto, Orange, Triple Sec, Peach Schnapps, Cherry, Elderflower, Strawberry, Banana, Blue Curacao, North Smirnoff', p: 5.0 },
      { n: 'Ouzo 1/4', p: 13.0 },
      { n: 'Zivania 1/4', p: 13.0 },
    ],
    Prosecco: [
      { n: 'Glass (white/rosé)', p: 5.0 },
      { n: 'Bottle white (dry)', p: 23.0 },
      { n: 'Bottle white (extra dry)', p: 27.0 },
      { n: 'Bottle rosé', p: 23.0 },
    ],
    Wines: [
      { n: 'House wine by the glass (white/rosé/red)', p: 3.5 },
      { n: 'Small bottle 187ml (white/rosé)', p: 4.0 },
      { n: 'Carafe (white/rosé/red)', p: 10.5 },
      { n: 'White — Xynisteri', d: 'Vasilikon 22 · Kalamos (dry) 21 · Kalamos (medium sweet) 21 · Kolios ‘Persefoni’ 22 · Kyperounta ‘Petritis’ 28 · Tsangarides 21' },
      { n: 'Vasilissa', d: 'Tsangarides Organic 28' },
      { n: 'Chardonnay', d: 'Tsangarides Organic 28 · Kyperounta ‘Alimos’ 38' },
      { n: 'Sauvignon Blanc', d: 'Tsiakkas 36 · Vasilikon ‘Omma’ 32' },
      { n: 'Rosé', d: 'Tsangarides Shiraz 21 · Kalamos ‘Demetra’ Dry Cab Sauv 21 · Kalamos ‘Demetra’ Medium Dry Cab Sauv 21 · Vasilikon ‘Enalia’ Maratheftiko Shiraz 21' },
      { n: 'Red — Cabernet Sauvignon', d: 'Vasilikon ‘Methi’ 38' },
      { n: 'Red — Merlot', d: 'Kalamos 25 · Vlassides 36' },
      { n: 'Red — Shiraz', d: 'Kyperounta ‘Skopos’ 38' },
      { n: 'Red — Maratheftiko', d: 'Tsangarides Organic 32 · Kolios ‘Agios Fotios’ 22' },
      { n: 'Red — Blends', d: 'Vasilikon ‘Agios Onoufrios’ 21 · Tsangarides ‘Agios Efraim’ 21' },
    ],
  };

  const categories = Object.keys(menu);

  // Icons for Menu tabs & Drinks groups
  const menuIcons = {
    Starters: '🍽️',
    Salads: '🥗',
    Grill: '🔥',
    Burgers: '🍔',
    Pasta: '🍝',
    International: '🌍',
    Fish: '🐟',
    Kids: '🧒',
    Desserts: '🍰',
  };

  const drinkIcons = {
    'Softs & Water': '🥤',
    'Beer & Cider': '🍺',
    Coffees: '☕️',
    Spirits: '🥃',
    Prosecco: '🥂',
    Wines: '🍷',
  };


  // === Auto-detect gallery images in /public/gallery ===
  // Looks for files named 01..15 with common extensions
  // ---- Gallery auto-load from /public/gallery ----
// Looks for 01..15 with .jpg/.jpeg/.png/.webp
const gallerySeeds = Array.from({ length: 12 }, (_, i) => String(i + 1));
const galleryExts = ['.jpg', '.jpeg', '.png', '.webp'];

const [galleryImages, setGalleryImages] = React.useState([]);
React.useEffect(() => {
  let mounted = true;
  const tryOne = (seed) =>
    new Promise((resolve) => {
      let k = 0;
      const next = () => {
        if (k >= galleryExts.length) return resolve(null);
        const src = `/gallery/${seed}${galleryExts[k++]}`;
        const img = new Image();
        img.onload = () => resolve({ src, alt: `Photo ${seed}` });
        img.onerror = next; // try next extension
        img.src = src;
      };
      next();
    });

    

  Promise.all(gallerySeeds.map(tryOne)).then((list) => {
    if (mounted) setGalleryImages(list.filter(Boolean));
  });
  return () => { mounted = false; };
}, []);


  // Hours data (12:00–22:00; Tuesday closed)
  const hoursData = [
    ['Mon', '12:00–22:00'],
    ['Tue', 'Closed'],
    ['Wed', '12:00–22:00'],
    ['Thu', '12:00–22:00'],
    ['Fri', '12:00–22:00'],
    ['Sat', '12:00–22:00'],
    ['Sun', '12:00–22:00'],
  ];

  // Address & Map — lock to place name to avoid road label like "E704"
  const addressStr = 'Pas To Kima, E704, Argaka 8873, Cyprus';
  const mapQuery = encodeURIComponent(addressStr);
  const mapSrc = `https://www.google.com/maps?hl=en&q=${mapQuery}&z=16&output=embed`;
  const mapUrl = `https://www.google.com/maps?hl=en&q=${mapQuery}&z=16`;

  // UI State
  const [active, setActive] = React.useState('Starters');
  // --- Mobile menu state (compact popover) ---
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  // Close with ESC
  React.useEffect(() => {
    if (!menuOpen) return;
    const onEsc = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [menuOpen]);

  // Close when clicking/tapping outside
  React.useEffect(() => {
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, []);

  // Helpers
  const currency = (n) => `€${n.toFixed(2)}`;

  // ==== Self-tests (JS) ====  (These only run in the browser)
  React.useEffect(() => {
    try {
      console.assert(currency(2.5) === '€2.50', 'currency() formats two decimals');
      console.assert(categories.includes('Starters'), "Menu includes 'Starters'");
      console.assert(Object.keys(drinks).length > 0, 'Drinks not empty');
      console.assert(hoursData.find(([d]) => d === 'Tue')[1] === 'Closed', 'Tuesday Closed');
      console.assert(typeof mapSrc === 'string' && mapSrc.includes('google.com/maps'), 'Map src looks valid');
      console.assert(menu.Starters.length > 0 && drinks.Coffees.length >= 1, 'Menu & Drinks contain items');
      // Added tests
      console.assert(categories.length >= 5, 'Expect multiple menu categories');
      console.assert(hoursData.length === 7, 'Hours table should list 7 days');
      console.assert(Array.isArray(menu[active]), 'Active category resolves to an array of items');
      console.assert(typeof addressStr === 'string' && addressStr.includes('Argaka'), 'Address includes locality');
      console.log('Self-tests passed: Pas To Kima UI (JS)');
    } catch (e) {
      console.error('Self-tests error', e);
    }
  }, [active]);

  // Smooth scroll for in-page links
  React.useEffect(() => {
    const handler = (e) => {
      const anchor = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#' || hash.length < 2) return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', hash);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Elevate header on scroll
  React.useEffect(() => {
    const onScroll = () => {
      document.body.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--sand)] text-[var(--navy)]">
      <span id="top" />
      <HeadBits />
      <Style />

      {/* NAV */}
      <header className="site-header sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--shell)/.75] bg-[var(--shell)]/85 border-b border-black/5">
        <div className="mx-auto max-w-[1200px] px-4 site-header__inner flex items-center justify-between gap-3">
          {/* Brand (single line, clearer) */}
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Primary">
            <a className="nav-link" href="#menu">Menu</a>
            <a className="nav-link" href="#hours">Hours &amp; Location</a>
            <a className="nav-link" href="#gallery">Gallery</a>
          </nav>

          {/* Mobile hamburger + small dropdown */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              className={`hamburger ${menuOpen ? 'is-open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span></span><span></span><span></span>
            </button>

            <div
              id="mobile-menu"
              className={`menu-popover ${menuOpen ? 'open' : ''}`}
              role="menu"
            >
              <a href="#menu" onClick={()=>setMenuOpen(false)} role="menuitem">Menu</a>
              <a href="#hours" onClick={()=>setMenuOpen(false)} role="menuitem">Hours &amp; Location</a>
              <a href="#gallery" onClick={()=>setMenuOpen(false)} role="menuitem">Gallery</a>
            </div>
          </div>
        </div>
      </header>

      <ThursdayBanner />

      {/* HERO */}
      <section className="hero relative isolate overflow-hidden">
        <div className="hero-bg" aria-hidden />
        <div className="hero-scrim" aria-hidden />

        {/* Decorative sun & bubbles */}
        <div className="decor" aria-hidden>
          <div className="sun" />
          <div className="bubble b1" />
          <div className="bubble b2" />
          <div className="bubble b3" />
        </div>

        <div className="mx-auto max-w-[1200px] px-4 py-24 md:py-32 grid md:grid-cols-2 items-center gap-10">
          <div className="p-6 md:p-8 rounded-2xl bg-[var(--navy)]/70 text-white shadow-2xl backdrop-blur-sm">
            <p className="text-sm tracking-wider uppercase opacity-90">Pas To Kima • Argaka</p>
            <h1 className="font-heading font-semibold text-4xl md:text-6xl leading-[1.05] mt-2">Mediterranean cooking,<br className="hidden md:block"/> Cypriot heart.</h1>
            <p className="mt-4 text-base md:text-lg leading-relaxed max-w-prose">Seaside grills, vibrant salads and generous plates. Open <strong>12:00–22:00</strong> (Tue closed). Come hungry, leave happy.</p>

            {/* Chips */}
            <ul className="mt-5 list-disc pl-5 text-white/90 grid gap-1">
              <li>Charcoal grill</li>
              <li>Platters & Salads</li>
              <li>Seafood</li>
            </ul>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#menu" className="btn btn-primary hover:translate-y-[-1px]">View Menu</a>
              <a href="#hours" className="btn btn-secondary hover:translate-y-[-1px]">Hours & Location</a>
              <a href="#gallery" className="btn btn-ghost hover:translate-y-[-1px]">Gallery</a>
            </div>
          </div>

          <div className="hidden md:block" aria-hidden>
            <HeroMock />
          </div>
        </div>
        <WaveDivider />
      </section>

      {/* STORY */}
      <section id="story" className="section">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="card">
            <h2 className="h2">Our Story</h2>
              <p className="mt-4">
                Pas To Kima (“by the wave”) is a small, friendly restaurant in Argaka. We cook simple Mediterranean food with Cypriot soul: good olive oil, fresh herbs, bright salads, and meat or fish over charcoal. Generous portions, clean flavours, warm welcome.
              </p>
              <p className="mt-4">
                Every <strong>Thursday</strong> we host a <strong>Traditional Greek Night</strong> with live singers and dancers performing classic dances—come for the food, stay for the kefi!
              </p>
          </div>
          <div className="space-y-6">
            <blockquote className="card bg-[var(--shell)]">
              <p className="text-lg md:text-xl font-medium">“Good food, good mood — always by the wave.”</p>
              <footer className="mt-3 opacity-70">— The Pas To Kima Family</footer>
            </blockquote>
            <div className="card">
              <h3 className="font-semibold">At a glance</h3>
              <ul className="mt-3 grid gap-2 text-sm">
                <li>Open 12:00–22:00 (Tuesday closed)</li>
                <li><strong>Every Thursday: Traditional Greek Night</strong> (live singers & dancers)</li>
                <li>Charcoal grill, seafood, salads, burgers</li>
                <li>Seaside, relaxed & family-friendly</li>
                <li>Vegetarian options available</li>
                <li>Christenings & Weddings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BELIEFS */}
      <section className="section section--alt" aria-labelledby="beliefs">
        <div className="mx-auto max-w-[1200px] px-4">
          <h2 id="beliefs" className="h2">What We Believe</h2>
          <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beliefs.map((b, i) => (
              <li key={i} className="card flex gap-4 items-start">
                <div className="text-2xl" aria-hidden>{b.icon}</div>
                <div>
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="mt-1 text-sm leading-6">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="section" aria-labelledby="menu-heading">
        <h2 id="menu-heading" className="h2">Menu</h2>

        {/* Tabs */}
        <div role="tablist" aria-label="Menu categories" className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={`tab ${active === c ? 'tab-active' : ''}`}
            >
              <span className="emoji" aria-hidden>{menuIcons[c] || '🍽️'}</span>
              <span>{c}</span>
            </button>

          ))}
        </div>

        {/* Items */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu[active].map((m, i) => (
            <article key={i} className="menu-card" aria-label={m.n}>
              <div>
                <h3 className="font-semibold text-[var(--navy)]">{m.n}</h3>
                {m.d && <p className="mt-1 text-sm opacity-80">{m.d}</p>}
              </div>
              <div className="font-semibold text-[var(--deep-ocean)]">{typeof m.p === 'number' ? currency(m.p) : m.p}</div>
            </article>
          ))}
        </div>
      </section>

      {/* DRINKS */}
      <section className="section section--sea" aria-labelledby="drinks">
        <h2 id="drinks" className="h2">Drinks</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(drinks).map(([cat, items]) => (
            <details
              key={cat}
              className="group rounded-2xl border border-black/10 bg-white"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none p-4 md:p-5">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="emoji" aria-hidden>{drinkIcons[cat] || '🍹'}</span>
                  {cat}
                </span>
                <span className="transition-transform group-open:rotate-180" aria-hidden>⌄</span>
              </summary>

              <div className="px-4 pb-4 md:px-5 md:pb-5 grid sm:grid-cols-2 gap-3">
                {items.map((d, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 border-t pt-3">
                    <div>
                      <div className="font-medium">{d.n}</div>
                      {d.d && <div className="text-sm opacity-80">{d.d}</div>}
                    </div>
                    {d.p && <div className="font-semibold">{currency(d.p)}</div>}
                    {d.p2 && <div className="text-sm">/ {currency(d.p2)}</div>}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* HOURS & LOCATION */}
      <section id="hours" className="section" aria-labelledby="hours-heading">
        <h2 id="hours-heading" className="h2">Hours & Location</h2>
        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold">Address</h3>
            <p className="mt-2"><a className="link" href={mapUrl} target="_blank" rel="noopener">{addressStr}</a></p>
            <h3 className="mt-4 font-semibold">Phone</h3>
            <p className="mt-2">+357 97 717607</p>
            <h3 className="mt-4 font-semibold">Open Hours</h3>
            <table className="w-full mt-2 text-sm">
              <tbody>
                {hoursData.map(([d, h]) => (
                  <tr key={d} className="border-t">
                    <td className="py-2 pr-3 font-medium">{d}</td>
                    <td className="py-2">{h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm opacity-80">No online bookings — please call for table availability.</p>
          </div>
          <div className="card lg:col-span-2 p-0 map-card">
            <div className="w-full rounded-[inherit] overflow-hidden">
              <iframe
                title="Pas To Kima on Google Maps"
                src={mapSrc}
                className="map-embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="section bg-[var(--shell)]" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="h2">Photo Gallery</h2>

        <div className="mt-4 grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Left: photos (portrait) */}
          <Carousel images={galleryImages} variant="split" />

          {/* Right: video (portrait) */}
          <div className="media-card aspect-portrait">
            <video
              src="/gallery/greek.mov"
              controls
              playsInline
              muted
              loop
              className="w-full h-full object-cover"
            />

            <video controls playsInline muted loop class="w-full h-full object-cover">
  <source src="/gallery/greek.mp4" type="video/mp4" />
  <source src="/gallery/greek.mov" type="video/quicktime" />
</video>

          </div>
        </div>

        <p className="mt-3 text-sm opacity-80">Tip: swipe on mobile or use your keyboard arrows.</p>
      </section>





      {/* ACCESSIBILITY & ALLERGEN INFO */}
      <section className="section" aria-labelledby="accessibility">
        <div className="card card--dark">
          <h2 id="accessibility" className="h2 text-white">Accessibility & Allergen Info</h2>
          <p className="mt-3">We’re committed to welcoming every guest. Step‑free access is available to key areas. Please speak to us about allergens—many dishes can be prepared without gluten or dairy on request.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-black/10 bg-[var(--deep-ocean)] text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-8 grid md:grid-cols-3 gap-6 items-start">
          <div>
            <Logo invert />
            <p className="mt-3 text-sm text-white/80">Proudly serving Mediterranean flavours in Cyprus. Good food, good mood.</p>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <p className="mt-2 text-sm"><a className="link" href={mapUrl} target="_blank" rel="noopener">{addressStr}</a></p>
            <p className="mt-1 text-sm">+357 97 717607</p>
            <SocialLinks />
          </div>
          <div>
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="mt-2 flex flex-wrap gap-3 text-sm" aria-label="Footer">
              <a className="underline focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--seafoam)]" href="#menu">Menu</a>
              <a className="underline focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--seafoam)]" href="#hours">Hours & Location</a>
              <a className="underline focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--seafoam)]" href="#gallery">Gallery</a>
            </nav>
          </div>
        </div>
        <div className="text-center text-xs py-3 bg-black/20">© Pas To Kima</div>
      </footer>
    </main>
  );
}

// ===== Components & Styles =====
function HeadBits() {
  return (
    <>
      {/* No external fonts to avoid permission prompts */}
      <title>Pas To Kima — By the Wave</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0F4C5C" />
    </>
  );
}

function Style() {
  return (
    <style>{`
      :root{
        --navy:#0A2342; --ocean:#2E86AB; --deep-ocean:#0F4C5C; --coral:#FF6B6B; --apricot:#FFAF59; --seafoam:#66D6D1; --sand:#F5E6C4; --shell:#FFF8EF;
        --sunset-glow: linear-gradient(135deg,#FF6B6B,#FFAF59);
        --sea-breeze: linear-gradient(135deg,#2E86AB,#66D6D1);
      }
      html, body, #root{height:100%; min-height:100%;}
      #root{width:100% !important; max-width:none !important; margin:0 !important; padding:0 !important; text-align:initial !important;}
      body{
        margin:0;
        background:
          radial-gradient(1200px 700px at -10% -10%, rgba(255,175,89,.18) 0%, transparent 55%),
          radial-gradient(900px 600px  at 110% 0%,   rgba(102,214,209,.18) 0%, transparent 55%),
          radial-gradient(1000px 700px at 50% 120%,  rgba(46,134,171,.14) 0%, transparent 60%),
          var(--sand) !important;
        color:var(--navy) !important;
      }
      html{scroll-behavior:smooth}
      [id]{ scroll-margin-top: clamp(56px, 8vh, 80px); }

      .font-heading{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, 'Apple Color Emoji','Segoe UI Emoji';}
      body, .inter{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size: 16px; line-height: 1.6;}

      .section{padding: clamp(2.5rem, 5vw, 4rem) 1rem;}
      .section > *{max-width: 1200px; margin-inline: auto;}
      .h2{font-weight: 700; font-size: clamp(1.5rem, 2.5vw, 2rem);} 

      .btn{display:inline-flex; align-items:center; gap:.65rem; padding:.65rem 1.05rem; border-radius:999px; border:1px solid transparent; text-decoration:none; transition:transform .15s ease, box-shadow .15s ease;}
      .btn:focus-visible{outline:2px solid var(--seafoam); outline-offset:2px;}
      .btn-primary{background:var(--deep-ocean); color:#fff; box-shadow:0 6px 18px rgba(15,76,92,.25);} 
      .btn-secondary{background:var(--shell); color:var(--navy); border-color:var(--ocean);} 
      .btn-ghost{background:transparent; color:#fff; border-color:#ffffff55;}

      .site-header{transition: box-shadow .2s ease, background .2s ease, border-color .2s ease; font-size:.95rem;}
      body.scrolled .site-header{box-shadow:0 10px 30px rgba(0,0,0,.08); border-color:transparent;}
      .site-header__inner{ padding-block:6px; }
      .nav-link{ padding:.44rem .75rem; border-radius:999px; }
      .nav-link:hover{ background:#ffffff99; }
      .nav-link:focus-visible{ outline:2px solid var(--seafoam); outline-offset:2px; }
      .logo-img{ height:40px; width:40px; border-radius:999px; object-fit:cover; border:2px solid rgba(255,255,255,.8); box-shadow:0 2px 10px rgba(0,0,0,.2); }
      .logo-text{ font-size: clamp(16px, 3.8vw, 18px); letter-spacing:.2px; font-weight:700; line-height:1; white-space:nowrap; }
      @media (max-width:640px){
        .logo-img{ width:28px; height:28px; }
        .nav-link{ padding:.35rem .55rem; font-size:.9rem; }
      }
      /* Subtle patterned section (diagonal threads) */
      .section--alt{
        background:
          linear-gradient(180deg, rgba(255,248,239,.96), rgba(255,248,239,.96)),
          repeating-linear-gradient(45deg, rgba(10,35,66,.04) 0 2px, transparent 2px 18px);
      }

      /* Soft waves tint for sand sections */
      .section--sea{
        background:
          radial-gradient(800px 500px at 15% 20%, rgba(255,175,89,.12) 0%, transparent 60%),
          radial-gradient(700px 450px at 85% 10%, rgba(102,214,209,.12) 0%, transparent 58%),
          var(--sand);
      }

      /* Fancy headings: gradient ink (keeps accessibility) */
      .h2{
        background: linear-gradient(135deg, #0A2342 0%, #2E86AB 55%, #66D6D1 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;        /* falls back to gradient fill */
      }

      .hamburger{
        display:grid; place-items:center;
        width:40px; height:32px; border-radius:10px;
        background:rgba(255,255,255,.95);
        border:1px solid rgba(10,35,66,.14);
        box-shadow:0 2px 8px rgba(0,0,0,.08);
      }
      .hamburger span{
        display:block; width:22px; height:2px; background:var(--navy);
        border-radius:2px; margin:4px 0;
        transition:transform .22s cubic-bezier(.4,0,.2,1), opacity .16s ease;
        transform-origin:50% 50%;
      }
      .hamburger.is-open span:nth-child(1){transform:translateY(6px) rotate(45deg);}
      .hamburger.is-open span:nth-child(2){opacity:0;}
      .hamburger.is-open span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}

      .menu-popover{
        position:absolute; right:0; top:100%; margin-top:8px;
        min-width:180px; width:max-content; max-width:80vw;
        background:rgba(255,255,255,.98);
        border:1px solid rgba(10,35,66,.12);
        border-radius:14px;
        box-shadow:0 18px 40px rgba(0,0,0,.18);
        backdrop-filter:blur(6px);
        transform:scale(.98) translateY(-6px);
        opacity:0; pointer-events:none;
        transition:transform .18s ease, opacity .18s ease;
        z-index:60;
      }
      .menu-popover.open{opacity:1; pointer-events:auto; transform:scale(1) translateY(0);}
      .menu-popover a{
        display:block; padding:12px 14px; font-weight:600; letter-spacing:.2px;
        color:var(--navy); border-bottom:1px solid #00000010;
      }
      .menu-popover a:last-child{border-bottom:0;}

      .hero{min-height:clamp(560px,70vh,780px);} 
      .hero-bg{position:absolute; inset:0; background:
        radial-gradient(1200px 600px at 10% 20%, #FFAF59 0%, transparent 60%),
        radial-gradient(900px 500px at 90% 10%, #FF6B6B 0%, transparent 55%),
        radial-gradient(800px 500px at 70% 90%, #2E86AB 0%, transparent 55%),
        linear-gradient(135deg,#2E86AB,#66D6D1);
        filter:saturate(1.1);
        animation: drift 18s ease-in-out infinite alternate;
      }
      .hero-scrim{position:absolute; inset:0; background:rgba(10,35,66,.38);} 
      .decor{position:absolute; inset:0; pointer-events:none;}
      .sun{position:absolute; right:8%; top:12%; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle at 40% 40%, #FFEFBA 0%, #FFAF59 40%, rgba(255,175,89,.2) 70%, transparent 72%); filter:blur(2px); opacity:.9;}
      .bubble{position:absolute; border-radius:50%; background:rgba(255,255,255,.15); backdrop-filter: blur(2px); box-shadow: inset 0 0 30px rgba(255,255,255,.2); animation: float 12s ease-in-out infinite;}
      .b1{width:120px; height:120px; left:6%; bottom:18%; animation-delay:-2s}
      .b2{width:80px; height:80px; left:15%; top:18%; animation-delay:-6s}
      .b3{width:100px; height:100px; right:10%; bottom:22%; animation-delay:-10s}
      @keyframes drift{from{transform:translate3d(0,0,0)} to{transform:translate3d(0,-20px,0)}}
      @keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}

      .card{background:#fff; border:1px solid #00000010; border-radius:20px; padding:1rem; box-shadow:0 4px 14px rgba(0,0,0,.06);} 
      .card--dark{ background: linear-gradient(160deg, #0F4C5C 0%, #0A2342 100%) !important; color:#fff !important; position:relative; overflow:hidden; }
      .menu-card{display:flex; justify-content:space-between; gap:1rem; background:var(--shell); border:1px solid #00000010; border-radius:18px; padding:1rem;}
      .tab{padding:.55rem .9rem; border-radius:999px; border:1px solid #00000022; background:#fff; transition:transform .12s ease;}
      .tab-active{background: linear-gradient(135deg,#2E86AB,#66D6D1); color:#063141; border-color: transparent; box-shadow:0 6px 16px rgba(46,134,171,.25);} 
      .tab:focus-visible{outline:2px solid var(--seafoam); outline-offset:2px;}

      .map-card .map-embed{width:100%; height:clamp(380px,55vh,560px); border:0; display:block;}

      .carousel{position:relative;border-radius:20px;overflow:hidden;background:#000;box-shadow:0 10px 30px rgba(0,0,0,.12);} 
      .carousel-viewport{position:relative;height:clamp(320px,68vh,760px);} 
      .slide{position:absolute;inset:0; will-change: transform;}
      .slide>img{width:100%;height:100%;object-fit:cover;object-position:center center;display:block;-webkit-backface-visibility:hidden;backface-visibility:hidden;}
      .arrow{position:absolute;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:44px;height:44px;border-radius:999px;background:rgba(255,255,255,.92);color:var(--navy);box-shadow:0 6px 16px rgba(0,0,0,.22);border:1px solid rgba(0,0,0,.08);} 
      .arrow:hover{filter:brightness(.96);} 
      .arrow:focus-visible{outline:2px solid var(--seafoam);outline-offset:2px;} 
      .arrow.left{left:12px;} .arrow.right{right:12px;}
      .counter{position:absolute;right:12px;bottom:12px;padding:.35rem .6rem;border-radius:999px;background:rgba(0,0,0,.45);color:#fff;font-size:.85rem;backdrop-filter:blur(4px);} 

      .chip{padding:.35rem .7rem; border-radius:999px; background:#FFF8EF; border:1px solid #00000012; font-size:.9rem; font-weight:600; color:var(--navy);}
      
      .emoji{font-size:1.1rem; line-height:1; display:inline-block;}
      .tab .emoji{margin-right:.35rem;}


      /* Accessibility card color (targets the section by its aria-labelledby) */
      section[aria-labelledby="accessibility"] .card--dark {
        background: #0b2036 !important;   /* pick any solid you like */
        border-color: transparent !important;
      }

      /* Split (half-width) variant: force a horizontal frame */
      .carousel--split .carousel-viewport{
        height: auto;               /* ignore tall fixed height */
        aspect-ratio: 16 / 9;       /* landscape */
      }

      /* When squeezing portrait shots into a landscape box, favor the left side */
      .carousel--split .slide > img{
        object-position: left center;
      }

      /* Simple reusable card for video/media blocks */
      .media-card{
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        background: #000;
        box-shadow: 0 10px 30px rgba(0,0,0,.12);
      }

      /* Portrait aspect for split gallery tiles */
      .carousel--split .carousel-viewport{
        height: auto;
        aspect-ratio: 9 / 16;      /* phone screen vertical */
        max-height: 85vh;          /* don't grow beyond the viewport */
      }

      /* Center crop for portrait tiles */
      .carousel--split .slide > img{
        object-position: center center;
      }

      /* Portrait helper for the video on the right */
      .aspect-portrait{ aspect-ratio: 9 / 16; }

      /* Fullscreen / lightbox for photos */
      .fs-btn{
        position:absolute; top:12px; right:12px;
        width:40px; height:40px; border-radius:999px;
        background:rgba(255,255,255,.92);
        border:1px solid rgba(0,0,0,.08);
        display:grid; place-items:center;
        box-shadow:0 6px 16px rgba(0,0,0,.22);
      }
      .fs-btn:focus-visible{ outline:2px solid var(--seafoam); outline-offset:2px; }

      .lightbox{
        position:fixed; inset:0; z-index:1000;
        background:rgba(0,0,0,.92);
        display:flex; align-items:center; justify-content:center;
      }
      .lightbox-img{
        max-width:96vw; max-height:96vh; object-fit:contain; border-radius:12px;
      }
      .lightbox-close, .lightbox-arrow{
        position:absolute; display:grid; place-items:center;
        width:48px; height:48px; border-radius:999px; border:1px solid rgba(255,255,255,.25);
        background:rgba(255,255,255,.12); color:#fff;
        box-shadow:0 6px 16px rgba(0,0,0,.35);
      }
      .lightbox-close{ top:16px; right:16px; font-size:26px; line-height:1; }
      .lightbox-arrow{ top:50%; transform:translateY(-50%); font-size:28px; }
      .lightbox-arrow.left{ left:16px; } 
      .lightbox-arrow.right{ right:16px; }
      .lightbox-close:focus-visible, .lightbox-arrow:focus-visible{
        outline:2px solid var(--seafoam); outline-offset:2px;
      }

      /* --- Portrait gallery sizing ----------------------------------------- */
      /* Mobile/tablet: keep strict phone aspect (9:16) */
      @media (max-width: 1023.98px){
        .carousel--split .carousel-viewport{
          height: auto;
          aspect-ratio: 9 / 16;
          max-height: 85vh;           /* safety cap */
        }
        .aspect-portrait{ aspect-ratio: 9 / 16; }
      }

      /* Desktop: cap height to the viewport so it doesn't take too much space */
      @media (min-width: 1024px){
        .carousel--split .carousel-viewport{
          /* Drop strict aspect ratio and cap height instead */
          aspect-ratio: auto;
          height: clamp(520px, 82vh, 860px);  /* fits screen */
        }

        /* Make the video column match the same capped height */
        .aspect-portrait{
          aspect-ratio: auto;
          height: clamp(520px, 82vh, 860px);
        }
      }

      /* Keep photos centered in the portrait frame; change to 'left center' if you prefer */
      .carousel--split .slide > img{ object-position: left center; }
              object-position: center center;
            }
              /* Make hero bullets neat on dark card */
      .hero .list-disc {
        margin-top: .9rem; 
      }
      .hero .list-disc li {
        line-height: 1.5;
      }



      `}</style>
  );
}


function Logo({ invert }) {
  const [hasLogo, setHasLogo] = React.useState(true);
  return (
    <a href="#top" className="flex items-center gap-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--seafoam)]">
      {hasLogo ? (
        <img
          src="/logo.png"
          alt="Pas To Kima logo"
          className="logo-img"
          onError={() => setHasLogo(false)}
        />
      ) : (
        <span className={`inline-block h-8 w-8 rounded-full bg-[var(--sea-breeze)] ${invert ? 'ring-white/60' : 'ring-black/10'} ring-2`} aria-hidden />
      )}
      <span className={`font-heading font-semibold logo-text ${invert ? 'text-white' : ''}`}>
        Pas To Kima
      </span>

    </a>
  );
}

function SocialLinks(){
  return (
    <nav className="social mt-3 flex items-center gap-3" aria-label="Social links">
      <a className="social-link" href="https://www.instagram.com/pastokimarestaurant/?hl=en" target="_blank" rel="noopener" aria-label="Instagram">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
      </a>
      <a className="social-link" href="https://www.facebook.com/pastokima/" target="_blank" rel="noopener" aria-label="Facebook">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.07 5.66 21.2 10.44 22v-7.01H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.92h-2.34V22C18.34 21.2 22 17.07 22 12.07z"/></svg>
      </a>
      <a className="social-link" href="https://www.tiktok.com/@pastokimarestaurant" target="_blank" rel="noopener" aria-label="TikTok">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.63 2h2.38c.26 2.2 1.57 3.6 3.65 3.78V8c-1.22-.02-2.31-.38-3.38-1.06v6.42c0 3.04-2.28 5.64-5.47 5.64a5.53 5.53 0 0 1 0-11.06c.45 0 .88.06 1.29.17v2.46a3.12 3.12 0 1 0 2.24 2.99V2z"/></svg>
      </a>
    </nav>
  )
}

function ThursdayBanner() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const d = new Date();
    const isThursday = d.getDay() === 4; // 0=Sun ... 4=Thu
    const key = 'ptk_greeknight_' + d.toDateString();
    if (isThursday && !localStorage.getItem(key)) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('ptk_greeknight_' + new Date().toDateString(), '1');
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="bg-[var(--deep-ocean)] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-2 text-sm flex items-center gap-3">
        <span role="img" aria-label="music">🎶</span>
        <span><strong>Tonight:</strong> Traditional Greek Night — live singers & dancers!</span>
        <button className="ml-auto underline decoration-white/60 hover:opacity-80" onClick={dismiss}>Hide</button>
      </div>
    </div>
  );
}


function HeroMock() {
  const [hasHero, setHasHero] = React.useState(true);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl hover-lift">
      {hasHero ? (
        <img
          src="/gallery/hero.jpeg"
          alt="Mediterranean coast at golden hour"
          className="block h-[340px] w-full object-cover"
          onError={() => setHasHero(false)}
          loading="eager"
          fetchpriority="high"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      ) : (
        <div className="h-[340px] w-full bg-[var(--sunset-glow)]" />
      )}

      {/* slight tint so the caption stays readable */}
      <div className="absolute inset-0 bg-[var(--navy)]/25" aria-hidden />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm bg-gradient-to-t from-black/45 to-transparent">
        Golden-hour Mediterranean coast • soft waves • pastel sky
      </div>
    </div>
  );
}


function WaveDivider(){
  return (
    <svg viewBox="0 0 1440 100" className="block w-full text-[var(--sand)]" preserveAspectRatio="none" aria-hidden>
      <path d="M0,64L60,80C120,96,240,128,360,133.3C480,139,600,117,720,112C840,107,960,117,1080,106.7C1200,96,1320,64,1380,48L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" fill="currentColor"></path>
    </svg>
  )
}

function Carousel({ images = [], variant = 'full', className = '' }) {
  const valid = Array.isArray(images) ? images.filter(Boolean) : [];
  const [index, setIndex] = React.useState(0);
  const [anim, setAnim] = React.useState(null);   // 'next' | 'prev' | null
  const [prev, setPrev] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const len = valid.length;

  const go = (dir) => {
    if (len <= 1) return;
    setPrev(index);
    setAnim(dir);
    setIndex((index + (dir === 'next' ? 1 : -1) + len) % len);
    clearTimeout(window.__kima_anim);
    window.__kima_anim = setTimeout(() => setAnim(null), 560);
  };

  // Preload neighbors
  React.useEffect(() => {
    if (len > 1) {
      const n = new Image(); n.src = valid[(index + 1) % len]?.src || '';
      const p = new Image(); p.src = valid[(index - 1 + len) % len]?.src || '';
    }
  }, [index, len, valid]);

  // Keyboard: arrows to navigate; ESC to close lightbox
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && lightbox) setLightbox(false);
      if (e.key === 'ArrowRight') go('next');
      if (e.key === 'ArrowLeft')  go('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, index, len]);

  // Touch swipe
  const startX = React.useRef(0);
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 'next' : 'prev');
  };

  if (len === 0) {
    return (
      <div className="carousel">
        <div className="carousel-viewport grid place-items-center text-center text-[var(--navy)]/70 bg-[var(--sunset-glow)]">
          <div className="max-w-sm p-6 rounded-2xl bg-[var(--shell)]/85 border border-black/10">
            <p className="font-semibold">Add photos to /public/gallery</p>
            <p className="text-sm mt-2">Name them 1.jpeg, 2.jpeg, … and they’ll appear here automatically.</p>
          </div>
        </div>
      </div>
    );
  }

  const curr = valid[index];
  const prevImg = valid[prev];
  const showTransition = anim !== null && prev !== index;

  const imgCommon = {
    decoding: 'async',
    draggable: false,
    // keep original intrinsic resolution
    style: { imageRendering: 'auto' }
  };

  return (
    <section
      className={`carousel ${variant === 'split' ? 'carousel--split' : ''} ${className}`}
      role="region"
      aria-label="Photo gallery"
    >
      <div className="carousel-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* exiting slide */}
        {showTransition && (
          <figure className={`slide ${anim === 'next' ? 'exit-left' : 'exit-right'}`}>
            <img {...imgCommon} loading="eager" fetchpriority="high" src={prevImg.src} alt={prevImg.alt || 'Gallery image'} />
          </figure>
        )}
        {/* entering/current slide */}
        <figure className={`slide ${showTransition ? (anim === 'next' ? 'enter-right' : 'enter-left') : ''}`}>
          <img {...imgCommon} loading="lazy" src={curr.src} alt={curr.alt || 'Gallery image'} />
        </figure>
      </div>

      {len > 1 && (
        <>
          <button className="arrow left" onClick={() => go('prev')} aria-label="Previous photo">&#8249;</button>
          <button className="arrow right" onClick={() => go('next')} aria-label="Next photo">&#8250;</button>
        </>
      )}

      {/* Fullscreen (lightbox) toggle */}
      <button className="fs-btn" onClick={() => setLightbox(true)} aria-label="View photo full screen">⤢</button>

      <div className="counter" aria-live="polite">{index + 1} / {len}</div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen photo viewer"
          onClick={(e) => { if (e.target === e.currentTarget) setLightbox(false); }}
        >
          <button className="lightbox-close" onClick={() => setLightbox(false)} aria-label="Close">×</button>
          {len > 1 && (
            <>
              <button className="lightbox-arrow left" onClick={() => go('prev')} aria-label="Previous">‹</button>
              <button className="lightbox-arrow right" onClick={() => go('next')} aria-label="Next">›</button>
            </>
          )}
          <img className="lightbox-img" src={curr.src} alt={curr.alt || 'Gallery image'} />
        </div>
      )}
    </section>
  );
}




function GalleryPlaceholders({ count = 12 }){
  return (
    <>
      {Array.from({length:count}).map((_,i)=> (
        <div key={i} className="mb-4 break-inside-avoid rounded-xl overflow-hidden bg-white shadow hover-lift" role="img" aria-label="Gallery image placeholder">
          <div className="aspect-[4/3] w-full bg-[var(--sea-breeze)]" />
        </div>
      ))}
    </>
  )
}

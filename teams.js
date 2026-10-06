/* =====================================================================
   World Cup 2026 — Family Sweepstake
   SINGLE SOURCE OF TRUTH for all team data.

   Both index.html (wallchart + reveal) and print.html (A4 sheets) read
   from this file via window.WC. Edit a team once here and every page
   updates — no more keeping two copies in sync.

   Each team record carries every field any page needs:
     o         owner key (Mum | Dad | Eli | Isaac)
     n         display name
     code      short code for the print sheets (e.g. PT, SCO, ENG)
     iso       flagcdn code for real flag images (e.g. pt, gb-sct)
     emoji     flag emoji — fallback only (images are used when online)
     group     tournament group letter A–L
     player    key player
     factLong  richer fact for the on-screen cards
     factShort terse fact that fits the printed grid
     food      dish with parenthetical, for the on-screen cards
     dish      short dish name for the printed grid
   ===================================================================== */
(function (root) {
  "use strict";

  var OWNERS = {
    Mum:   { color: "#2563eb" },
    Dad:   { color: "#15803d" },
    Eli:   { color: "#d9881f", label: "Eli & Reachy" },
    Isaac: { color: "#d4322c" }
  };

  var TEAMS = [
    {o:"Mum",n:"Portugal",code:"PT",iso:"pt",emoji:"🇵🇹",group:"K",player:"Cristiano Ronaldo",factLong:"Ronaldo is the all-time leading goalscorer in men's international football.",factShort:"All-time top scorer in men's international football.",food:"Pastéis de nata (custard tarts)",dish:"Pastéis de nata"},
    {o:"Mum",n:"Mexico",code:"MX",iso:"mx",emoji:"🇲🇽",group:"A",player:"Santiago Giménez",factLong:"First nation ever to host the World Cup three times — 1970, 1986 and now 2026.",factShort:"First nation to host three World Cups (1970, 1986, 2026).",food:"Tacos al pastor",dish:"Tacos al pastor"},
    {o:"Mum",n:"Argentina",code:"AR",iso:"ar",emoji:"🇦🇷",group:"J",player:"Lionel Messi",factLong:"The reigning world champions, having lifted the trophy in 2022.",factShort:"Reigning world champions (2022).",food:"Asado (barbecue)",dish:"Asado"},
    {o:"Mum",n:"Senegal",code:"SN",iso:"sn",emoji:"🇸🇳",group:"I",player:"Sadio Mané",factLong:"Crowned African champions at the 2022 Cup of Nations.",factShort:"African champions in 2022.",food:"Thiéboudienne (national dish)",dish:"Thiéboudienne"},
    {o:"Mum",n:"Switzerland",code:"CH",iso:"ch",emoji:"🇨🇭",group:"B",player:"Granit Xhaka",factLong:"Home of FIFA itself, headquartered in Zurich.",factShort:"Home of FIFA, in Zurich.",food:"Fondue",dish:"Fondue"},
    {o:"Mum",n:"Austria",code:"AT",iso:"at",emoji:"🇦🇹",group:"J",player:"David Alaba",factLong:"Finished a remarkable third at the 1954 World Cup.",factShort:"Third at the 1954 World Cup.",food:"Wiener schnitzel",dish:"Wiener schnitzel"},
    {o:"Mum",n:"Egypt",code:"EG",iso:"eg",emoji:"🇪🇬",group:"G",player:"Mohamed Salah",factLong:"Record seven-time African Cup of Nations winners.",factShort:"Record 7-time African Cup winners.",food:"Koshari (national dish)",dish:"Koshari"},
    {o:"Mum",n:"Uzbekistan",code:"UZ",iso:"uz",emoji:"🇺🇿",group:"K",player:"Eldor Shomurodov",factLong:"Qualifying for their very first World Cup.",factShort:"Their very first World Cup.",food:"Plov (rice pilaf, national dish)",dish:"Plov"},
    {o:"Mum",n:"Saudi Arabia",code:"SA",iso:"sa",emoji:"🇸🇦",group:"H",player:"Salem Al-Dawsari",factLong:"Famously beat eventual champions Argentina in 2022.",factShort:"Beat Argentina in 2022.",food:"Kabsa",dish:"Kabsa"},
    {o:"Mum",n:"DR Congo",code:"CD",iso:"cd",emoji:"🇨🇩",group:"K",player:"Yoane Wissa",factLong:"First World Cup since 1974, when they played as Zaire.",factShort:"First World Cup since 1974.",food:"Moambe chicken (national dish)",dish:"Moambe chicken"},
    {o:"Mum",n:"Cape Verde",code:"CV",iso:"cv",emoji:"🇨🇻",group:"H",player:"Ryan Mendes",factLong:"An island nation of ~500,000 reaching its first-ever World Cup.",factShort:"Islands of ~500k at their first World Cup.",food:"Cachupa (national dish)",dish:"Cachupa"},
    {o:"Mum",n:"Czechia",code:"CZ",iso:"cz",emoji:"🇨🇿",group:"A",player:"Patrik Schick",factLong:"Twice World Cup runners-up as Czechoslovakia (1934 & 1962).",factShort:"Twice runners-up as Czechoslovakia.",food:"Svíčková (beef in cream sauce)",dish:"Svíčková"},

    {o:"Dad",n:"Germany",code:"DE",iso:"de",emoji:"🇩🇪",group:"E",player:"Jamal Musiala",factLong:"Four-time world champions.",factShort:"Four-time world champions.",food:"Bratwurst",dish:"Bratwurst"},
    {o:"Dad",n:"Brazil",code:"BR",iso:"br",emoji:"🇧🇷",group:"C",player:"Vinícius Júnior",factLong:"Hold the record with five World Cup titles.",factShort:"Record five World Cup titles.",food:"Feijoada (black bean stew)",dish:"Feijoada"},
    {o:"Dad",n:"Belgium",code:"BE",iso:"be",emoji:"🇧🇪",group:"G",player:"Kevin De Bruyne",factLong:"Their golden generation peaked at third place in 2018.",factShort:"Third place in 2018.",food:"Frites (fries were invented here, not France)",dish:"Frites"},
    {o:"Dad",n:"Australia",code:"AU",iso:"au",emoji:"🇦🇺",group:"D",player:"Mat Ryan",factLong:"Known the world over as the Socceroos.",factShort:"The Socceroos.",food:"Meat pie",dish:"Meat pie"},
    {o:"Dad",n:"Iran",code:"IR",iso:"ir",emoji:"🇮🇷",group:"G",player:"Mehdi Taremi",factLong:"Among the most experienced sides in Asian World Cup history.",factShort:"Among Asia's most experienced sides.",food:"Chelo kabab (national dish)",dish:"Chelo kabab"},
    {o:"Dad",n:"Colombia",code:"CO",iso:"co",emoji:"🇨🇴",group:"K",player:"Luis Díaz",factLong:"Reached the World Cup quarter-finals in 2014, their best run.",factShort:"Quarter-finalists in 2014.",food:"Bandeja paisa",dish:"Bandeja paisa"},
    {o:"Dad",n:"Scotland",code:"SCO",iso:"gb-sct",emoji:"🏴",group:"C",player:"Andrew Robertson",factLong:"Played in the world's first-ever international match (1872 vs England).",factShort:"Played the first-ever international (1872).",food:"Haggis",dish:"Haggis"},
    {o:"Dad",n:"Tunisia",code:"TN",iso:"tn",emoji:"🇹🇳",group:"F",player:"Hannibal Mejbri",factLong:"Beat reigning champions France in the 2022 group stage.",factShort:"Beat France in 2022.",food:"Brik (crispy egg pastry)",dish:"Brik"},
    {o:"Dad",n:"South Africa",code:"ZA",iso:"za",emoji:"🇿🇦",group:"A",player:"Percy Tau",factLong:"Hosted the first-ever African World Cup in 2010.",factShort:"Hosted the first African World Cup (2010).",food:"Bobotie",dish:"Bobotie"},
    {o:"Dad",n:"Iraq",code:"IQ",iso:"iq",emoji:"🇮🇶",group:"I",player:"Aymen Hussein",factLong:"Won the 2007 Asian Cup against extraordinary odds.",factShort:"Won the 2007 Asian Cup.",food:"Masgouf (grilled fish, national dish)",dish:"Masgouf"},
    {o:"Dad",n:"New Zealand",code:"NZ",iso:"nz",emoji:"🇳🇿",group:"G",player:"Chris Wood",factLong:"The only team unbeaten at the 2010 World Cup — yet still went out.",factShort:"Unbeaten at the 2010 World Cup.",food:"Hāngī (Māori earth-oven feast)",dish:"Hāngī"},
    {o:"Dad",n:"Bosnia & Herzegovina",code:"BA",iso:"ba",emoji:"🇧🇦",group:"B",player:"Edin Džeko",factLong:"Reached the World Cup for the first time in 2014.",factShort:"First World Cup in 2014.",food:"Ćevapi (grilled minced meat)",dish:"Ćevapi"},

    {o:"Eli",n:"Canada",code:"CA",iso:"ca",emoji:"🇨🇦",group:"B",player:"Alphonso Davies",factLong:"Only their third men's World Cup ever — and first as hosts.",factShort:"Co-hosts — only their 3rd World Cup.",food:"Poutine",dish:"Poutine"},
    {o:"Eli",n:"England",code:"ENG",iso:"gb-eng",emoji:"🏴",group:"L",player:"Jude Bellingham",factLong:"Codified modern football; last won the trophy in 1966.",factShort:"Last won the trophy in 1966.",food:"Fish and chips",dish:"Fish & chips"},
    {o:"Eli",n:"France",code:"FR",iso:"fr",emoji:"🇫🇷",group:"I",player:"Kylian Mbappé",factLong:"Champions in 2018, runners-up in 2022.",factShort:"Champions 2018, runners-up 2022.",food:"Coq au vin",dish:"Coq au vin"},
    {o:"Eli",n:"Morocco",code:"MA",iso:"ma",emoji:"🇲🇦",group:"C",player:"Achraf Hakimi",factLong:"First African and Arab nation to reach a World Cup semi-final (2022).",factShort:"First African semi-finalists (2022).",food:"Tagine",dish:"Tagine"},
    {o:"Eli",n:"Japan",code:"JP",iso:"jp",emoji:"🇯🇵",group:"F",player:"Kaoru Mitoma",factLong:"Their fans famously stay to clean the stadium after matches.",factShort:"Fans clean the stadium after games.",food:"Sushi",dish:"Sushi"},
    {o:"Eli",n:"Ecuador",code:"EC",iso:"ec",emoji:"🇪🇨",group:"E",player:"Moisés Caicedo",factLong:"Play home qualifiers way up at altitude in Quito (2,800m).",factShort:"Play home games at 2,800m altitude.",food:"Encebollado (national dish)",dish:"Encebollado"},
    {o:"Eli",n:"Norway",code:"NO",iso:"no",emoji:"🇳🇴",group:"I",player:"Erling Haaland",factLong:"Back at the World Cup for the first time since 1998.",factShort:"Back since 1998.",food:"Brunost (brown cheese)",dish:"Brunost"},
    {o:"Eli",n:"Ivory Coast",code:"CI",iso:"ci",emoji:"🇨🇮",group:"E",player:"Sébastien Haller",factLong:"Reigning African champions, winning the 2023 Cup of Nations.",factShort:"African champions 2023.",food:"Attiéké (cassava couscous)",dish:"Attiéké"},
    {o:"Eli",n:"Algeria",code:"DZ",iso:"dz",emoji:"🇩🇿",group:"J",player:"Riyad Mahrez",factLong:"Their 1982 side stunned West Germany in a famous upset.",factShort:"Stunned West Germany in 1982.",food:"Couscous",dish:"Couscous"},
    {o:"Eli",n:"Jordan",code:"JO",iso:"jo",emoji:"🇯🇴",group:"J",player:"Mousa Al-Tamari",factLong:"First-ever World Cup; were runners-up at the 2023 Asian Cup.",factShort:"First World Cup; 2023 Asian Cup finalists.",food:"Mansaf (national dish)",dish:"Mansaf"},
    {o:"Eli",n:"Curaçao",code:"CW",iso:"cw",emoji:"🇨🇼",group:"E",player:"Leandro Bacuna",factLong:"The smallest nation by population ever to qualify for a World Cup.",factShort:"Smallest nation ever to qualify.",food:"Keshi yena (stuffed cheese)",dish:"Keshi yena"},
    {o:"Eli",n:"Ghana",code:"GH",iso:"gh",emoji:"🇬🇭",group:"L",player:"Mohammed Kudus",factLong:"Came within a missed penalty of the 2010 semi-finals.",factShort:"A penalty from the 2010 semis.",food:"Jollof rice",dish:"Jollof rice"},

    {o:"Isaac",n:"Spain",code:"ES",iso:"es",emoji:"🇪🇸",group:"H",player:"Lamine Yamal",factLong:"Reigning European champions (Euro 2024).",factShort:"European champions (Euro 2024).",food:"Paella",dish:"Paella"},
    {o:"Isaac",n:"USA",code:"US",iso:"us",emoji:"🇺🇸",group:"D",player:"Christian Pulisic",factLong:"Co-hosting their first men's World Cup since 1994.",factShort:"Co-hosts; first men's WC since 1994.",food:"Cheeseburger",dish:"Cheeseburger"},
    {o:"Isaac",n:"Netherlands",code:"NL",iso:"nl",emoji:"🇳🇱",group:"F",player:"Virgil van Dijk",factLong:"Three-time runners-up who have never won the trophy.",factShort:"Three-time runners-up, never won.",food:"Stroopwafel",dish:"Stroopwafel"},
    {o:"Isaac",n:"Uruguay",code:"UY",iso:"uy",emoji:"🇺🇾",group:"H",player:"Federico Valverde",factLong:"Won the very first World Cup, in 1930.",factShort:"Won the first World Cup (1930).",food:"Chivito (steak sandwich)",dish:"Chivito"},
    {o:"Isaac",n:"Croatia",code:"HR",iso:"hr",emoji:"🇭🇷",group:"L",player:"Luka Modrić",factLong:"A nation under 4 million reached the 2018 final and 2022 semis.",factShort:"2018 finalists, 2022 semis.",food:"Peka (slow-roasted meat & veg)",dish:"Peka"},
    {o:"Isaac",n:"South Korea",code:"KR",iso:"kr",emoji:"🇰🇷",group:"A",player:"Son Heung-min",factLong:"Reached the semi-finals as co-hosts in 2002.",factShort:"Semi-finalists as hosts in 2002.",food:"Bibimbap",dish:"Bibimbap"},
    {o:"Isaac",n:"Panama",code:"PA",iso:"pa",emoji:"🇵🇦",group:"L",player:"Adalberto Carrasquilla",factLong:"Only their second-ever World Cup appearance.",factShort:"Only their 2nd-ever World Cup.",food:"Sancocho (chicken stew)",dish:"Sancocho"},
    {o:"Isaac",n:"Paraguay",code:"PY",iso:"py",emoji:"🇵🇾",group:"D",player:"Miguel Almirón",factLong:"Their dish 'sopa paraguaya' is actually a cornbread, not a soup.",factShort:"“Sopa paraguaya” is actually cornbread.",food:"Chipá (cheese bread)",dish:"Chipá"},
    {o:"Isaac",n:"Qatar",code:"QA",iso:"qa",emoji:"🇶🇦",group:"B",player:"Akram Afif",factLong:"Hosted the previous World Cup back in 2022.",factShort:"Hosted the 2022 World Cup.",food:"Machboos (spiced rice)",dish:"Machboos"},
    {o:"Isaac",n:"Haiti",code:"HT",iso:"ht",emoji:"🇭🇹",group:"C",player:"Frantzdy Pierrot",factLong:"Back at the World Cup for the first time since 1974.",factShort:"Back since 1974.",food:"Griot (fried pork)",dish:"Griot"},
    {o:"Isaac",n:"Sweden",code:"SE",iso:"se",emoji:"🇸🇪",group:"F",player:"Alexander Isak",factLong:"Finished third at both the 1950 and 1994 World Cups.",factShort:"Third in 1950 and 1994.",food:"Köttbullar (meatballs)",dish:"Köttbullar"},
    {o:"Isaac",n:"Türkiye",code:"TR",iso:"tr",emoji:"🇹🇷",group:"D",player:"Arda Güler",factLong:"Finished a surprise third at the 2002 World Cup.",factShort:"Surprise third place in 2002.",food:"Kebab & baklava",dish:"Kebab & baklava"}
  ];

  // Reveal order for the on-screen draw: weakest round first, strongest last.
  var ROUNDS = [
    {label:"The Longshots",      teams:["Curaçao","Haiti","Cape Verde","New Zealand"]},
    {label:"Rank Outsiders",     teams:["Jordan","Iraq","DR Congo","Panama"]},
    {label:"The Underdogs",      teams:["Ghana","Uzbekistan","South Africa","Qatar"]},
    {label:"Plucky Hopefuls",    teams:["Czechia","Bosnia & Herzegovina","Paraguay","Algeria"]},
    {label:"Punching Above",     teams:["Saudi Arabia","Tunisia","Canada","Türkiye"]},
    {label:"Dark Horses",        teams:["Scotland","Ivory Coast","Egypt","Sweden"]},
    {label:"Outside Bets",       teams:["Australia","Austria","Ecuador","USA"]},
    {label:"Gathering Steam",    teams:["Iran","Mexico","Norway","South Korea"]},
    {label:"Serious Contenders", teams:["Senegal","Japan","Colombia","Uruguay"]},
    {label:"The Heavyweights",   teams:["Switzerland","Morocco","Croatia","Belgium"]},
    {label:"The Big Guns",       teams:["Netherlands","Portugal","Germany","England"]},
    {label:"The Favourites 🏆",   teams:["Argentina","Brazil","France","Spain"]}
  ];

  // A short, family-friendly flavour hook per team — the savoury "thing" we'd
  // riff on for a fusion meal when two teams play (see fixtures.js). Edit freely.
  var FLAVOUR = {
    "Portugal":"piri-piri chicken","Mexico":"al pastor pork & lime","Argentina":"smoky grilled steak",
    "Senegal":"spiced fish & rice","Switzerland":"melted cheese","Austria":"crispy breaded schnitzel",
    "Egypt":"spiced lentils & rice","Uzbekistan":"lamb rice pilaf","Saudi Arabia":"spiced rice (kabsa)",
    "DR Congo":"peanutty chicken","Cape Verde":"hearty bean & corn stew","Czechia":"beef in creamy sauce",
    "Germany":"bratwurst sausage","Brazil":"black bean stew","Belgium":"crispy fries",
    "Australia":"savoury meat pie","Iran":"saffron rice & kebab","Colombia":"beans, rice & crispy pork",
    "Scotland":"savoury oaty haggis","Tunisia":"harissa & crispy brik","South Africa":"sweet-spiced mince",
    "Iraq":"grilled fish","New Zealand":"slow-cooked feast","Bosnia & Herzegovina":"grilled mince fingers",
    "Canada":"loaded fries, cheese & gravy","England":"fish & chips","France":"chicken in creamy wine sauce",
    "Morocco":"sweet-spiced tagine","Japan":"soy & teriyaki rice","Ecuador":"seafood & onion soup",
    "Norway":"salmon & brown cheese","Ivory Coast":"cassava couscous & fish","Algeria":"couscous & stew",
    "Jordan":"lamb & yogurt rice","Curaçao":"stuffed melty cheese","Ghana":"smoky jollof rice",
    "Spain":"saffron rice & seafood","USA":"cheeseburger","Netherlands":"cheese & stroopwafel",
    "Uruguay":"steak sandwich","Croatia":"slow-roasted meat & veg","South Korea":"gochujang rice bowl",
    "Panama":"chicken & veg stew","Paraguay":"cheesy cornbread","Qatar":"spiced rice & meat",
    "Haiti":"fried pork & rice","Sweden":"meatballs & lingonberry","Türkiye":"kebab & flatbread"
  };
  TEAMS.forEach(function (t) { t.flavour = FLAVOUR[t.n] || t.dish; });

  root.WC = {
    OWNERS: OWNERS,
    TEAMS: TEAMS,
    ROUNDS: ROUNDS,
    byName: TEAMS.reduce(function (m, t) { m[t.n] = t; return m; }, {}),
    ownerLabel: function (o) { return (OWNERS[o] && OWNERS[o].label) || o; }
  };
})(typeof window !== "undefined" ? window : this);

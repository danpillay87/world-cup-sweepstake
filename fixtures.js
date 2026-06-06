/* =====================================================================
   World Cup 2026 — Family Sweepstake : FIXTURES + FUSION MEALS
   Loaded after teams.js. Exposes window.FIX.

   ──────────────────────────────────────────────────────────────────
   HOW TO KEEP THIS UP TO DATE AS THE TOURNAMENT RUNS
   ──────────────────────────────────────────────────────────────────
   1. KICKOFF DATES/TIMES — the group games below are generated from the
      groups in teams.js. The dates are INDICATIVE (11–27 June window). To
      correct a specific game, add an entry to OVERRIDES keyed by its id
      (ids look like "A1", "A2"… shown on the Fixtures screen), e.g.
          OVERRIDES["A1"] = { date:"2026-06-12", time:"20:00" };
   2. KNOCKOUTS — once the groups finish, add the real ties to KNOCKOUTS
      (copy the example). Round of 32 → Final.
   3. RESULTS / ELIMINATIONS — the easiest way is in the app: open
      “Fixtures”, turn on Manager mode, tick games as played and tap a
      team to mark it knocked out. That’s saved on your device. To make a
      change everyone sees, list the team here in ELIMINATED instead.
   ===================================================================== */
(function (root) {
  "use strict";
  var WC = root.WC;
  if (!WC) { console.error("fixtures.js needs teams.js to load first"); return; }

  // Group-stage window. daySpread controls how matches fan out across dates.
  var GROUP_START = "2026-06-11";

  // Per-game corrections (see note 1). id -> {date?, time?, a?, b?}.
  var OVERRIDES = {
    // "A1": { date:"2026-06-12", time:"20:00" }
  };

  // Knockout ties — fill in as the tournament progresses (see note 2).
  // { id, date, time, stage, a, b }  — a/b are team names from teams.js.
  var KNOCKOUTS = [
    // { id:"R32-1", date:"2026-06-29", time:"21:00", stage:"Round of 32", a:"Spain", b:"Haiti" }
  ];

  // Teams everyone should see as knocked out (see note 3). Names from teams.js.
  var ELIMINATED = [
    // "Qatar"
  ];

  /* ---- build the group-stage schedule from teams.js groups ---- */
  function addDays(iso, n) {
    var d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  var TIMES = ["13:00", "16:00", "19:00", "21:00"];

  // collect the four teams in each group A–L
  var groups = {};
  WC.TEAMS.forEach(function (t) { (groups[t.group] = groups[t.group] || []).push(t.n); });
  var groupLetters = Object.keys(groups).sort();

  // round-robin pairings for a group of four
  var ROUND_PAIRS = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]];

  var FIXTURES = [];
  // emit round-by-round (matchday 1 for every group, then matchday 2…) like the real WC
  for (var r = 0; r < 3; r++) {
    var inRound = 0;
    groupLetters.forEach(function (g) {
      var teams = groups[g];
      ROUND_PAIRS[r].forEach(function (pair, p) {
        var seq = FIXTURES.length;
        var id = g + (r * 2 + p + 1);            // e.g. A1..A6
        var dayOffset = r * 6 + Math.floor(inRound / 4);
        FIXTURES.push({
          id: id, stage: "Group " + g, group: g,
          date: addDays(GROUP_START, dayOffset),
          time: TIMES[seq % TIMES.length],
          a: teams[pair[0]], b: teams[pair[1]]
        });
        inRound++;
      });
    });
  }

  // append knockouts, then apply per-game overrides
  KNOCKOUTS.forEach(function (k) { FIXTURES.push(k); });
  FIXTURES.forEach(function (fx) {
    var o = OVERRIDES[fx.id];
    if (o) { ["date", "time", "a", "b"].forEach(function (k) { if (o[k]) fx[k] = o[k]; }); }
    fx.when = new Date(fx.date + "T" + (fx.time || "12:00") + ":00");
  });
  FIXTURES.sort(function (x, y) { return x.when - y.when; });

  /* ---- FUSION MEALS ----------------------------------------------------
     Loose, family- and time-friendly mash-ups for each pairing. Curated for
     every group game; knockouts fall back to a generated idea from each
     team's flavour hook. kind = Lunch | Dinner.  [a, b, kind, idea]        */
  var FUSIONS_RAW = [
    // Group A — Mexico, Czechia, South Africa, South Korea
    ["Mexico","Czechia","Dinner","Beef-in-cream tacos — Czech svíčková-style beef piled into soft tortillas with a squeeze of lime"],
    ["Mexico","South Africa","Dinner","Spiced-mince tacos — bobotie mince (mince, curry powder, sultanas) in wraps with a fried egg on top"],
    ["Mexico","South Korea","Dinner","Korean-Mexican tacos — gochujang chicken or beef in tortillas with a quick crunchy slaw"],
    ["Czechia","South Africa","Dinner","Creamy spiced mince + mash traybake — comfort food, one dish"],
    ["Czechia","South Korea","Dinner","Creamy beef rice bowl with a gochujang kick and a fried egg"],
    ["South Africa","South Korea","Dinner","Bibimbap-style mince bowl — curried mince over rice, veg on the side, egg on top"],

    // Group B — Switzerland, Bosnia & Herzegovina, Canada, Qatar
    ["Switzerland","Bosnia & Herzegovina","Dinner","Grilled mince flatbreads with melted cheese and a dollop of yogurt"],
    ["Switzerland","Canada","Lunch","Cheesy poutine — chips loaded with melty cheese and gravy (kids' favourite)"],
    ["Switzerland","Qatar","Dinner","Cheesy spiced-rice bake — buttery rice, melted cheese on top"],
    ["Bosnia & Herzegovina","Canada","Dinner","Ćevapi poutine — grilled mince fingers over loaded fries and gravy"],
    ["Bosnia & Herzegovina","Qatar","Dinner","Spiced rice & grilled-mince platter with flatbreads"],
    ["Canada","Qatar","Lunch","Loaded fries topped with spiced chicken, cheese and a little gravy"],

    // Group C — Brazil, Scotland, Morocco, Haiti
    ["Brazil","Scotland","Dinner","Beans & sausage hotpot with jacket potatoes — hearty and cheap"],
    ["Brazil","Morocco","Dinner","Sweet-spiced black-bean stew with apricots, served over rice"],
    ["Brazil","Haiti","Dinner","Black-bean & crispy-pork rice bowls with lime"],
    ["Scotland","Morocco","Dinner","Spiced-lamb stuffed flatbreads with a sweet apricot kick"],
    ["Scotland","Haiti","Lunch","Pork & potato hash with a fried egg — fridge-clearout friendly"],
    ["Morocco","Haiti","Dinner","Sweet-spiced fried pork with fluffy couscous"],

    // Group D — Australia, USA, Paraguay, Türkiye
    ["Australia","USA","Lunch","Aussie cheeseburger sliders with beetroot and a fried egg"],
    ["Australia","Paraguay","Dinner","Mince-pie filling + cheesy cornbread topping, baked like a cottage pie"],
    ["Australia","Türkiye","Lunch","Meat-pie filling rolled into warm flatbread wraps"],
    ["USA","Paraguay","Lunch","Cheeseburgers with cheesy cornbread on the side"],
    ["USA","Türkiye","Dinner","Kebab cheeseburgers — spiced lamb patties in buns with flatbread chips"],
    ["Paraguay","Türkiye","Lunch","Cheesy cornbread + kebab wraps to share"],

    // Group E — Germany, Ecuador, Ivory Coast, Curaçao
    ["Germany","Ecuador","Dinner","Sausage & seafood chowder with crusty bread"],
    ["Germany","Ivory Coast","Dinner","Bratwurst with attiéké (cassava couscous) and a tomato relish"],
    ["Germany","Curaçao","Lunch","Cheesy sausage bake — sliced bratwurst, cheese, golden on top"],
    ["Ecuador","Ivory Coast","Dinner","Fish & couscous bowl with lime and herbs"],
    ["Ecuador","Curaçao","Dinner","Cheesy seafood bake with a crunchy crumb"],
    ["Ivory Coast","Curaçao","Dinner","Cheese-stuffed fish with couscous"],

    // Group F — Tunisia, Japan, Netherlands, Sweden
    ["Tunisia","Japan","Lunch","Harissa-soy rice bowls — quick, punchy and veg-friendly"],
    ["Tunisia","Netherlands","Lunch","Crispy egg brik with melted cheese — basically a posh toastie"],
    ["Tunisia","Sweden","Dinner","Harissa meatballs with couscous"],
    ["Japan","Netherlands","Dinner","Teriyaki chicken rice topped with melted Dutch cheese"],
    ["Japan","Sweden","Dinner","Teriyaki meatballs with sticky rice (a guaranteed kid-pleaser)"],
    ["Netherlands","Sweden","Lunch","Swedish-meatball loaded fries with cheese"],

    // Group G — Egypt, Belgium, Iran, New Zealand
    ["Egypt","Belgium","Lunch","Koshari loaded fries — spiced lentils & rice topped with crispy fries (veggie, cheap)"],
    ["Egypt","Iran","Dinner","Spiced lentils & saffron rice — fragrant and filling"],
    ["Egypt","New Zealand","Dinner","Lentil & rice traybake, slow-baked till sticky"],
    ["Belgium","Iran","Dinner","Saffron rice with crispy fries and a quick tomato stew"],
    ["Belgium","New Zealand","Dinner","Slow-cooked beef with proper chips"],
    ["Iran","New Zealand","Dinner","Slow-roast saffron lamb with rice"],

    // Group H — Saudi Arabia, Cape Verde, Spain, Uruguay
    ["Saudi Arabia","Cape Verde","Dinner","Spiced bean, corn & rice one-pot"],
    ["Saudi Arabia","Spain","Dinner","Saffron-spiced seafood rice — kabsa meets paella"],
    ["Saudi Arabia","Uruguay","Dinner","Spiced-rice steak bowls with a garlicky sauce"],
    ["Cape Verde","Spain","Dinner","Bean & seafood rice, all in one pan"],
    ["Cape Verde","Uruguay","Lunch","Bean-stew steak sandwiches — hearty doorstop rolls"],
    ["Spain","Uruguay","Dinner","Paella-style rice with seared steak strips"],

    // Group I — Senegal, Iraq, France, Norway
    ["Senegal","Iraq","Dinner","Spiced grilled fish with rice and a tomato-onion relish"],
    ["Senegal","France","Dinner","Spiced fish & rice (thieb) finished with a creamy sauce"],
    ["Senegal","Norway","Dinner","Spiced salmon traybake over rice"],
    ["Iraq","France","Dinner","Wine-braised grilled fish with crusty bread"],
    ["Iraq","Norway","Dinner","Grilled salmon with lemony rice"],
    ["France","Norway","Dinner","Creamy salmon traybake, coq-au-vin style, with new potatoes"],

    // Group J — Argentina, Austria, Algeria, Jordan
    ["Argentina","Austria","Lunch","Steak schnitzel sandwiches — crumbed steak, soft rolls, chimichurri"],
    ["Argentina","Algeria","Dinner","Grilled steak over fluffy couscous with chimichurri"],
    ["Argentina","Jordan","Dinner","Grilled steak over yogurt rice — asado meets mansaf"],
    ["Austria","Algeria","Dinner","Crispy schnitzel with couscous"],
    ["Austria","Jordan","Dinner","Crispy schnitzel with yogurt-y rice"],
    ["Algeria","Jordan","Dinner","Lamb couscous with a cooling yogurt drizzle"],

    // Group K — Portugal, Uzbekistan, DR Congo, Colombia
    ["Portugal","Uzbekistan","Dinner","Piri-piri chicken with lamb-y rice pilaf"],
    ["Portugal","DR Congo","Dinner","Peanut piri-piri chicken with rice"],
    ["Portugal","Colombia","Dinner","Piri-piri chicken with beans & rice"],
    ["Uzbekistan","DR Congo","Dinner","Peanut chicken pilaf — nutty, one-pan rice"],
    ["Uzbekistan","Colombia","Dinner","Lamb pilaf with crispy pork and beans"],
    ["DR Congo","Colombia","Dinner","Peanut chicken with beans & rice"],

    // Group L — England, Ghana, Panama, Croatia
    ["England","Ghana","Lunch","Jollof fish & chips — smoky tomato rice with crispy fish goujons"],
    ["England","Panama","Dinner","Fish & chips with a chicken-stew gravy to dunk"],
    ["England","Croatia","Dinner","Fish & chips with slow-roast veg on the side"],
    ["Ghana","Panama","Dinner","Smoky jollof with a chicken & veg stew"],
    ["Ghana","Croatia","Dinner","Smoky jollof rice with slow-roast meat"],
    ["Panama","Croatia","Dinner","Slow-cooked chicken & veg stew with crusty bread"]
  ];

  var FUSIONS = {};
  function key(a, b) { return [a, b].sort().join("|"); }
  FUSIONS_RAW.forEach(function (r) { FUSIONS[key(r[0], r[1])] = { kind: r[2], idea: r[3] }; });

  // Generated fallback for any uncovered pairing (e.g. knockouts).
  var VEHICLES = ["wraps", "loaded fries", "rice bowls", "a sharing traybake", "toasties", "a homemade pizza"];
  function fusionFor(aName, bName) {
    var hit = FUSIONS[key(aName, bName)];
    if (hit) return hit;
    var A = WC.byName[aName], B = WC.byName[bName];
    var fa = (A && A.flavour) || (A && A.dish) || aName;
    var fb = (B && B.flavour) || (B && B.dish) || bName;
    // deterministic pick so the suggestion is stable for a given pairing
    var h = 0, s = key(aName, bName);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return {
      kind: (h % 2) ? "Dinner" : "Lunch",
      idea: "Build-your-own " + VEHICLES[h % VEHICLES.length] + " night — " + fa +
            " on one side, " + fb + " on the other. Loose and ready in ~30 min."
    };
  }

  /* ---- helpers --------------------------------------------------------- */
  // Next game = earliest fixture that isn't done and isn't past, skipping any
  // tie involving an eliminated team. isDone/isOut are caller-supplied (the app
  // keeps live status in localStorage); ELIMINATED above is the shared baseline.
  function nextFixture(now, isDone, isOut) {
    now = now || new Date();
    isDone = isDone || function () { return false; };
    isOut = isOut || function (n) { return ELIMINATED.indexOf(n) !== -1; };
    for (var i = 0; i < FIXTURES.length; i++) {
      var fx = FIXTURES[i];
      if (isDone(fx.id)) continue;
      if (isOut(fx.a) || isOut(fx.b)) continue;
      if (fx.when >= now) return fx;
    }
    return null;
  }

  root.FIX = {
    FIXTURES: FIXTURES,
    KNOCKOUTS: KNOCKOUTS,
    ELIMINATED: ELIMINATED,
    fusionFor: fusionFor,
    nextFixture: nextFixture
  };
})(typeof window !== "undefined" ? window : this);

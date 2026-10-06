"""world_cup tool — Reachy answers questions about the family's World Cup 2026
sweepstake: who owns which team, group draw, key players, fun facts, national
dishes, and the tournament calendar. All data is embedded (no network needed)."""
from __future__ import annotations

from typing import Any, Dict, List

from reachy_mini_conversation_app.tools.core_tools import Tool, ToolDependencies

# ── Family sweepstake: 48 teams, 12 each. owner = who drew the team. ──────────
# owner values map to the family: Kim (= "Mum"), Dan (= "Dad"), Eli, Isaac.
TEAMS: List[Dict[str, str]] = [
    # KIM (Mum)
    {"team": "Portugal", "owner": "Kim", "group": "K", "player": "Cristiano Ronaldo", "dish": "Pastéis de nata (custard tarts)", "fact": "Ronaldo is the all-time leading goalscorer in men's international football."},
    {"team": "Mexico", "owner": "Kim", "group": "A", "player": "Santiago Giménez", "dish": "Tacos al pastor", "fact": "First nation ever to host the World Cup three times — 1970, 1986 and now 2026."},
    {"team": "Argentina", "owner": "Kim", "group": "J", "player": "Lionel Messi", "dish": "Asado (barbecue)", "fact": "The reigning world champions, having lifted the trophy in 2022."},
    {"team": "Senegal", "owner": "Kim", "group": "I", "player": "Sadio Mané", "dish": "Thiéboudienne", "fact": "Crowned African champions at the 2022 Cup of Nations."},
    {"team": "Switzerland", "owner": "Kim", "group": "B", "player": "Granit Xhaka", "dish": "Fondue", "fact": "Home of FIFA itself, headquartered in Zurich."},
    {"team": "Austria", "owner": "Kim", "group": "J", "player": "David Alaba", "dish": "Wiener schnitzel", "fact": "Finished a remarkable third at the 1954 World Cup."},
    {"team": "Egypt", "owner": "Kim", "group": "G", "player": "Mohamed Salah", "dish": "Koshari", "fact": "Record seven-time African Cup of Nations winners."},
    {"team": "Uzbekistan", "owner": "Kim", "group": "K", "player": "Eldor Shomurodov", "dish": "Plov (rice pilaf)", "fact": "Qualifying for their very first World Cup."},
    {"team": "Saudi Arabia", "owner": "Kim", "group": "H", "player": "Salem Al-Dawsari", "dish": "Kabsa", "fact": "Famously beat eventual champions Argentina in 2022."},
    {"team": "DR Congo", "owner": "Kim", "group": "K", "player": "Yoane Wissa", "dish": "Moambe chicken", "fact": "First World Cup since 1974, when they played as Zaire."},
    {"team": "Cape Verde", "owner": "Kim", "group": "H", "player": "Ryan Mendes", "dish": "Cachupa", "fact": "An island nation of ~500,000 reaching its first-ever World Cup."},
    {"team": "Czechia", "owner": "Kim", "group": "A", "player": "Patrik Schick", "dish": "Svíčková (beef in cream sauce)", "fact": "Twice World Cup runners-up as Czechoslovakia (1934 & 1962)."},
    # DAN (Dad)
    {"team": "Germany", "owner": "Dan", "group": "E", "player": "Jamal Musiala", "dish": "Bratwurst", "fact": "Four-time world champions."},
    {"team": "Brazil", "owner": "Dan", "group": "C", "player": "Vinícius Júnior", "dish": "Feijoada (black bean stew)", "fact": "Hold the record with five World Cup titles."},
    {"team": "Belgium", "owner": "Dan", "group": "G", "player": "Kevin De Bruyne", "dish": "Frites", "fact": "Their golden generation peaked at third place in 2018."},
    {"team": "Australia", "owner": "Dan", "group": "D", "player": "Mat Ryan", "dish": "Meat pie", "fact": "Known the world over as the Socceroos."},
    {"team": "Iran", "owner": "Dan", "group": "G", "player": "Mehdi Taremi", "dish": "Chelo kabab", "fact": "Among the most experienced sides in Asian World Cup history."},
    {"team": "Colombia", "owner": "Dan", "group": "K", "player": "Luis Díaz", "dish": "Bandeja paisa", "fact": "Reached the World Cup quarter-finals in 2014, their best run."},
    {"team": "Scotland", "owner": "Dan", "group": "C", "player": "Andrew Robertson", "dish": "Haggis", "fact": "Played in the world's first-ever international match (1872 vs England)."},
    {"team": "Tunisia", "owner": "Dan", "group": "F", "player": "Hannibal Mejbri", "dish": "Brik (crispy egg pastry)", "fact": "Beat reigning champions France in the 2022 group stage."},
    {"team": "South Africa", "owner": "Dan", "group": "A", "player": "Percy Tau", "dish": "Bobotie", "fact": "Hosted the first-ever African World Cup in 2010."},
    {"team": "Iraq", "owner": "Dan", "group": "I", "player": "Aymen Hussein", "dish": "Masgouf (grilled fish)", "fact": "Won the 2007 Asian Cup against extraordinary odds."},
    {"team": "New Zealand", "owner": "Dan", "group": "G", "player": "Chris Wood", "dish": "Hāngī (Māori earth-oven feast)", "fact": "The only team unbeaten at the 2010 World Cup — yet still went out."},
    {"team": "Bosnia & Herzegovina", "owner": "Dan", "group": "B", "player": "Edin Džeko", "dish": "Ćevapi (grilled minced meat)", "fact": "Reached the World Cup for the first time in 2014."},
    # ELI
    {"team": "Canada", "owner": "Eli", "group": "B", "player": "Alphonso Davies", "dish": "Poutine", "fact": "Only their third men's World Cup ever — and first as hosts."},
    {"team": "England", "owner": "Eli", "group": "L", "player": "Jude Bellingham", "dish": "Fish and chips", "fact": "Codified modern football; last won the trophy in 1966."},
    {"team": "France", "owner": "Eli", "group": "I", "player": "Kylian Mbappé", "dish": "Coq au vin", "fact": "Champions in 2018, runners-up in 2022."},
    {"team": "Morocco", "owner": "Eli", "group": "C", "player": "Achraf Hakimi", "dish": "Tagine", "fact": "First African and Arab nation to reach a World Cup semi-final (2022)."},
    {"team": "Japan", "owner": "Eli", "group": "F", "player": "Kaoru Mitoma", "dish": "Sushi", "fact": "Their fans famously stay to clean the stadium after matches."},
    {"team": "Ecuador", "owner": "Eli", "group": "E", "player": "Moisés Caicedo", "dish": "Encebollado", "fact": "Play home qualifiers way up at altitude in Quito (2,800m)."},
    {"team": "Norway", "owner": "Eli", "group": "I", "player": "Erling Haaland", "dish": "Brunost (brown cheese)", "fact": "Back at the World Cup for the first time since 1998."},
    {"team": "Ivory Coast", "owner": "Eli", "group": "E", "player": "Sébastien Haller", "dish": "Attiéké (cassava couscous)", "fact": "Reigning African champions, winning the 2023 Cup of Nations."},
    {"team": "Algeria", "owner": "Eli", "group": "J", "player": "Riyad Mahrez", "dish": "Couscous", "fact": "Their 1982 side stunned West Germany in a famous upset."},
    {"team": "Jordan", "owner": "Eli", "group": "J", "player": "Mousa Al-Tamari", "dish": "Mansaf", "fact": "First-ever World Cup; were runners-up at the 2023 Asian Cup."},
    {"team": "Curaçao", "owner": "Eli", "group": "E", "player": "Leandro Bacuna", "dish": "Keshi yena (stuffed cheese)", "fact": "The smallest nation by population ever to qualify for a World Cup."},
    {"team": "Ghana", "owner": "Eli", "group": "L", "player": "Mohammed Kudus", "dish": "Jollof rice", "fact": "Came within a missed penalty of the 2010 semi-finals."},
    # ISAAC
    {"team": "Spain", "owner": "Isaac", "group": "H", "player": "Lamine Yamal", "dish": "Paella", "fact": "Reigning European champions (Euro 2024)."},
    {"team": "USA", "owner": "Isaac", "group": "D", "player": "Christian Pulisic", "dish": "Cheeseburger", "fact": "Co-hosting their first men's World Cup since 1994."},
    {"team": "Netherlands", "owner": "Isaac", "group": "F", "player": "Virgil van Dijk", "dish": "Stroopwafel", "fact": "Three-time runners-up who have never won the trophy."},
    {"team": "Uruguay", "owner": "Isaac", "group": "H", "player": "Federico Valverde", "dish": "Chivito (steak sandwich)", "fact": "Won the very first World Cup, in 1930."},
    {"team": "Croatia", "owner": "Isaac", "group": "L", "player": "Luka Modrić", "dish": "Peka (slow-roasted meat & veg)", "fact": "A nation under 4 million reached the 2018 final and 2022 semis."},
    {"team": "South Korea", "owner": "Isaac", "group": "A", "player": "Son Heung-min", "dish": "Bibimbap", "fact": "Reached the semi-finals as co-hosts in 2002."},
    {"team": "Panama", "owner": "Isaac", "group": "L", "player": "Adalberto Carrasquilla", "dish": "Sancocho (chicken stew)", "fact": "Only their second-ever World Cup appearance."},
    {"team": "Paraguay", "owner": "Isaac", "group": "D", "player": "Miguel Almirón", "dish": "Chipá (cheese bread)", "fact": "Their 'sopa paraguaya' is actually a cornbread, not a soup."},
    {"team": "Qatar", "owner": "Isaac", "group": "B", "player": "Akram Afif", "dish": "Machboos (spiced rice)", "fact": "Hosted the previous World Cup back in 2022."},
    {"team": "Haiti", "owner": "Isaac", "group": "C", "player": "Frantzdy Pierrot", "dish": "Griot (fried pork)", "fact": "Back at the World Cup for the first time since 1974."},
    {"team": "Sweden", "owner": "Isaac", "group": "F", "player": "Alexander Isak", "dish": "Köttbullar (meatballs)", "fact": "Finished third at both the 1950 and 1994 World Cups."},
    {"team": "Türkiye", "owner": "Isaac", "group": "D", "player": "Arda Güler", "dish": "Kebab & baklava", "fact": "Finished a surprise third at the 2002 World Cup."},
]

# Person aliases → canonical owner name
ALIASES = {
    "kim": "Kim", "mum": "Kim", "mummy": "Kim", "mom": "Kim", "mama": "Kim",
    "dan": "Dan", "dad": "Dan", "daddy": "Dan", "papa": "Dan",
    "eli": "Eli", "elias": "Eli",
    "isaac": "Isaac", "izaac": "Isaac", "ike": "Isaac",
}

# Tournament calendar. Group-stage windows are accurate; knockout dates are the
# scheduled rounds (exact kickoff times: check FIFA — keep answers approximate).
TOURNAMENT = {
    "name": "2026 FIFA World Cup",
    "hosts": "United States, Canada & Mexico",
    "teams": 48,
    "opening_match": "11 June 2026 — Mexico at the Estadio Azteca, Mexico City",
    "group_stage": "11–27 June 2026",
    "round_of_32": "approx 28 June – 3 July 2026",
    "round_of_16": "approx 4–7 July 2026",
    "quarter_finals": "approx 9–11 July 2026",
    "semi_finals": "approx 14–15 July 2026",
    "third_place": "approx 18 July 2026",
    "final": "19 July 2026 — MetLife Stadium, New Jersey",
}

# Approx matchday windows by group (group stage runs 11–27 June).
GROUP_WINDOWS = {
    "A": "around 11–25 June (first wave)", "B": "around 11–25 June (first wave)",
    "C": "around 11–25 June (first wave)", "D": "around 11–25 June (first wave)",
    "E": "around 14–27 June (second wave)", "F": "around 14–27 June (second wave)",
    "G": "around 14–27 June (second wave)", "H": "around 14–27 June (second wave)",
    "I": "around 14–27 June (second wave)", "J": "around 14–27 June (second wave)",
    "K": "around 14–27 June (second wave)", "L": "around 14–27 June (second wave)",
}

_by_team = {t["team"].lower(): t for t in TEAMS}


def _find_team(q: str):
    q = (q or "").strip().lower()
    if not q:
        return None
    if q in _by_team:
        return _by_team[q]
    # forgiving contains-match (handles "the netherlands", "korea", "congo", "bosnia")
    for name, rec in _by_team.items():
        if q in name or name in q:
            return rec
    aka = {"holland": "Netherlands", "korea": "South Korea", "uae": None,
           "usa": "USA", "america": "USA", "congo": "DR Congo", "bosnia": "Bosnia & Herzegovina",
           "turkey": "Türkiye", "ivory": "Ivory Coast", "cape": "Cape Verde",
           "saudi": "Saudi Arabia", "czech": "Czechia", "uzbek": "Uzbekistan"}
    for k, v in aka.items():
        if v and k in q:
            return _by_team[v.lower()]
    return None


def _group_mates(rec):
    g = rec["group"]
    return [t for t in TEAMS if t["group"] == g and t["team"] != rec["team"]]


class WorldCup(Tool):
    name = "world_cup"
    description = (
        "Answer ANY question about the family's 2026 World Cup sweepstake. FIRE THIS "
        "whenever Dan, Kim, Eli or Isaac ask about: who owns/drew a team ('who's got "
        "Brazil?', 'whose is Spain?'), what teams a family member has ('what are Eli's "
        "teams?'), a team's group or group opponents ('who's in England's group?'), a "
        "team's star player / fun fact / national dish, or the World Cup calendar and "
        "fixtures ('when does it start?', 'when's the final?', 'when does Isaac's team "
        "play?'). Each family member drew 12 of the 48 teams. Call with the relevant "
        "field filled; with nothing filled it returns the tournament overview. Always "
        "answer warmly and briefly — it's a family game. Group-stage windows are "
        "approximate; don't invent exact kickoff times. NOTE: Reachy (you) is Eli's "
        "teammate — Eli's little, so you're on his team helping him follow his 12 teams. "
        "When his teams come up, be his enthusiastic teammate ('me and Eli have...')."
    )
    parameters_schema = {
        "type": "object",
        "properties": {
            "team": {"type": "string", "description": "A national team name, e.g. 'Brazil', 'the Netherlands', 'Korea'."},
            "person": {"type": "string", "description": "A family member: Kim/Mum, Dan/Dad, Eli, or Isaac."},
            "group": {"type": "string", "description": "A group letter A–L."},
            "topic": {"type": "string", "enum": ["schedule", "overview"], "description": "Use 'schedule' for calendar/fixtures questions, 'overview' for how the sweepstake works."},
        },
        "required": [],
    }

    async def __call__(self, deps: ToolDependencies, **kwargs: Any) -> Dict[str, Any]:
        team = (kwargs.get("team") or "").strip()
        person = (kwargs.get("person") or "").strip()
        group = (kwargs.get("group") or "").strip().upper()
        topic = (kwargs.get("topic") or "").strip().lower()

        # 1) Specific team
        if team:
            rec = _find_team(team)
            if not rec:
                return {"ok": False, "error": f"No team matching '{team}'.",
                        "hint": "48 teams are in the sweepstake — try the country's common name."}
            mates = _group_mates(rec)
            return {"ok": True, "kind": "team", "team": rec["team"], "owner": rec["owner"],
                    "owner_note": f"{rec['owner']} drew {rec['team']} in the sweepstake.",
                    "group": rec["group"], "group_mates": [m["team"] for m in mates],
                    "group_mates_owners": {m["team"]: m["owner"] for m in mates},
                    "key_player": rec["player"], "fun_fact": rec["fact"], "national_dish": rec["dish"],
                    "match_window": GROUP_WINDOWS.get(rec["group"], "during the group stage (11–27 June)")}

        # 2) A family member's teams
        if person:
            owner = ALIASES.get(person.lower())
            if not owner:
                return {"ok": False, "error": f"'{person}' isn't a player. It's Kim (Mum), Dan (Dad), Eli or Isaac."}
            mine = [t for t in TEAMS if t["owner"] == owner]
            result = {"ok": True, "kind": "person", "person": owner, "count": len(mine),
                      "teams": [{"team": t["team"], "group": t["group"], "star": t["player"]} for t in mine]}
            if owner == "Eli":
                # Reachy is Eli's teammate — he's little, so Reachy helps him follow his teams.
                result["teammate"] = "Reachy"
                result["note"] = ("Eli's teammate is Reachy (me!). Eli's little, so I'm on his team to help "
                                  "him cheer on and keep track of these teams. Say it warmly — 'me and Eli'.")
            return result

        # 3) A group
        if group:
            if group not in GROUP_WINDOWS:
                return {"ok": False, "error": f"Group '{group}' isn't valid — groups run A to L."}
            members = [t for t in TEAMS if t["group"] == group]
            return {"ok": True, "kind": "group", "group": group,
                    "teams": [{"team": t["team"], "owner": t["owner"], "star": t["player"]} for t in members],
                    "match_window": GROUP_WINDOWS[group]}

        # 4) Schedule / overview / default
        if topic == "schedule":
            return {"ok": True, "kind": "schedule", "tournament": TOURNAMENT,
                    "note": "Group-stage windows are approximate; check FIFA for exact kickoff times and venues."}

        owners = {}
        for t in TEAMS:
            owners.setdefault(t["owner"], []).append(t["team"])
        return {"ok": True, "kind": "overview",
                "tournament": TOURNAMENT,
                "how_it_works": "A family sweepstake: 48 teams shared out, 12 each between Kim (Mum), Dan (Dad), Eli and Isaac. Whoever owns the eventual winner wins the sweepstake.",
                "teams_per_person": {o: len(ts) for o, ts in owners.items()}}

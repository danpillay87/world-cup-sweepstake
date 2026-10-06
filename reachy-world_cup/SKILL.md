---
name: world_cup
description: Answer questions about the family's 2026 World Cup sweepstake — who owns which team, the group draw, key players, fun facts, national dishes, and the tournament calendar. All 48 teams shared 12 each between Kim, Dan, Eli and Isaac.
---

# world_cup

Reachy's knowledge of the family World Cup 2026 sweepstake. All data is embedded
in the tool (no network). Mirrors the family wallchart app at
`danpillay87.github.io/world-cup-sweepstake`.

## When to use

Fire whenever anyone asks about the sweepstake or the tournament:
- **Ownership** — "Who's got Brazil?", "Whose is Spain?", "Did I get France?"
- **A person's teams** — "What are Eli's teams?", "Which did Isaac draw?"
- **Groups** — "Who's in England's group?", "What's in Group D?"
- **Team detail** — star player, fun fact, national dish for any team
- **Calendar** — "When does it start?", "When's the final?", "When does Isaac's team play?"

## Parameters (all optional — fill the one that fits)

| name | type | notes |
|---|---|---|
| `team` | string | A country name; forgiving match ("the Netherlands", "Korea", "Congo"). |
| `person` | string | Kim/Mum, Dan/Dad, Eli or Isaac. |
| `group` | string | A group letter A–L. |
| `topic` | enum | `schedule` for calendar/fixtures, `overview` for how the sweepstake works. |

Call with nothing to get the tournament overview + who has how many.

## The sweepstake

48 teams, 12 each: **Kim** (Mum), **Dan** (Dad), **Eli**, **Isaac**. Whoever owns
the eventual champion wins. The eventual final flag on reveal night is Spain
(Isaac's) — but that's just the reveal order, not a prediction.

## Notes

- Group-stage match windows are **approximate** (group stage runs 11–27 June 2026).
  Don't state exact kickoff times — say "around" the window or suggest checking FIFA.
- Tournament: opens 11 June 2026 (Mexico, Estadio Azteca); final 19 July 2026
  (MetLife Stadium, New Jersey).
- Keep answers warm and short — it's a family game, often asked by the kids.

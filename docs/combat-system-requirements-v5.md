# Combat System & Economy — High-Level Requirements (v5)

> **Naming & feature definitions** (Cash/Clout/Stamina/Moves, Opps, Plugs, Crew/Lieutenants, Spots, The Hood, Player Profile, Monetization, and the code-migration map) live in [`oppsDefinitions.md`](oppsDefinitions.md). This doc covers the **combat system and economy mechanics**.

## Overview
An asynchronous, Mafia Wars–style combat game. Players scan a map for targets, attack them in instantly-resolved stat-comparison combat, and progress through an interlocking economy of **Cash** (spendable, always at risk), **Clout** (permanent progression), **Stamina** (fight pacing), and **Moves** (PvE pacing). Target selection is random within a **win-rate band** — targets the attacker would beat between 35% and 70% of the time — drawn from a hidden **blend of real players and bots**. Early-game matchmaking biases toward easier targets so the game feels good, tapering to genuine PvP difficulty as the player progresses.

---

## Economy

### Cash — the spendable, at-risk currency
- Earned by winning fights: **the winner takes 10% of the loser's Cash on hand** per fight.
- Lost by losing fights, whether attacking or defending.
- **All Cash is at risk at all times.** No bank in v1. The defense against loss is spending it on gear.
- Cash sinks: **gear** (from Plugs), **Spots** (buying/upgrading passive-income properties), and **target-search rerolls**. Premium/limited gear is a planned future sink — see Monetization (in the Definitions doc).
- **Passive income exists via Spots** (this reverses the earlier "no passive income" call): Spots generate Cash over time; you must log in to collect, and your **max offline accrual is gated by level/skills**.
- The 10% cap is self-limiting against farming: each successive hit yields 10% of a shrinking pile.

### Clout — permanent progression
- The overall progression stat. **Clout only ever goes up.**
- Fed by all systems: winning fights (large gain), losing fights (small consolation gain), completing **Moves**, and recruiting **Crew Lieutenants**.
- Clout thresholds define **player level**, which gates gear tiers, **Moves tiers**, and the **Spots offline-income cap**.
- **120 levels total.** Clout-per-level follows an **exponential curve** (4X-style progression): each level costs meaningfully more than the last, so early levels come fast and late levels are a long grind. Exact base/multiplier TBD.
- **Leveling up fully refills both Stamina and Moves.**

### Stamina & Moves — dual-track pacing (duplicated from Mafia Wars)
Values below mirror Mafia Wars' economy (from memory — treat as tunable defaults, verify against archived data if fidelity matters):

| | **Stamina** (fights) | **Moves** (PvE actions) |
|---|---|---|
| Starting pool | 3 | 10 |
| Regen rate | 1 per 3 minutes | 1 per 5 minutes |
| Cost per action | 1 per attack | Varies per Move (1–20+ by tier) |
| Refill on level-up | Full | Full |

**Pool growth — skill points (the Mafia Wars model):**
- Each level-up grants **5 skill points** the player allocates freely.
- Costs: **+1 max Moves = 1 point; +1 max Stamina = 2 points** (stamina is deliberately expensive); points can also go to base Attack/Defense (1 point each).
- **Confirmed:** growth is *player-allocated* via skill points (replaces v4's "pools grow automatically with level"). This creates build identity — fighter vs. grinder. Locked.

### Resource Flow Summary
```
Stamina ──spent──▶ Fight (Opp) ──win──▶ +10% of loser's Cash + Clout
                     │
                     └──lose──▶ −10% of own Cash, small Clout
Moves ──spent──▶ Moves (PvE) ──▶ Cash + Clout + gear items
Cash ──spent──▶ Gear (from Plugs) ──equipped──▶ Attack/Defense stats
Cash ──spent──▶ Spots ──generate──▶ Cash over time (offline cap gated by level)
Crew invites ──▶ Lieutenants ──▶ Gear-equip capacity in combat
Clout ──▶ Level-up ──▶ +5 skill points (pools & base stats), full Stamina/Moves refill,
                       gear tiers, Moves tiers, Spots offline cap
```

---

## Combat System

### Core Loop
1. Player taps **Search** (in The Hood) — the matchmaker snaps them to a single eligible target in their win-rate band (first search free).
2. The target card shows **win rate** and **amount of gear** only — raw Attack/Defense are hidden. Don't like it? Tap **Search** again to reroll to a new target for a **nominal Cash fee** (no Stamina cost).
3. Player taps **Attack** (spends 1 Stamina); combat resolves instantly server-side against the target's snapshot.
4. Results (win/loss, Cash gained/lost, Clout gained) shown to attacker; defender is notified asynchronously.

### Target Search — scan flow & intel (U1)
- **One target at a time.** Search snaps the player to a single eligible target (win-rate band) — not a browsable list.
- **Searching costs no Stamina.** The first search is free; each **reroll costs a nominal Cash fee** (a small Cash sink — amount is data). Stamina is spent only on the actual attack.
- **Intel shown on the target card:**
  - **Win rate** — the computed `P(win)` for this specific matchup.
  - **Amount of gear** — how much gear the target is bringing (loadout size), as a rough "how equipped are they" signal.
  - Name + portrait for flavor.
- **Hidden from the player:** raw **Attack / Defense** values. Win rate is the only quantified strength signal — it deliberately abstracts the underlying stats.
- **Reroll behavior:** each reroll issues a fresh matchmaking query and should avoid immediately re-serving the just-declined target so rerolls feel fresh.
- **Target hold:** once shown, the target's snapshot is held for the attack, so the fight resolves against the stats the player was shown.

### Combat Resolution — instant, no Health
- **Single instant resolution.** No HP, no rounds, no attrition — one roll settles the fight. **Health is removed from the model entirely** (see Locked Decisions); Stamina is the sole fight-pacing resource.
- **Directional stat comparison:** the attacker's total **Attack** is compared against the defender's total **Defense** (not a symmetric power sum).
- **Recommended win formula (Mafia Wars–style ratio model — confirm tuning later):**
  ```
  P(attacker wins) = A^k / (A^k + D^k)
  ```
  where `A` = attacker Attack, `D` = defender Defense, and `k` is a steepness constant (data/tuning). `A = D` → 50%; the stronger side usually wins but upsets happen. Resolve by drawing `r ∈ [0,1)` — attacker wins if `r < P`.
- **Snapshot model:** the defender's Defense is read from a stored snapshot of their stats + chosen loadout, so the defender need never be online.
- **Cash settlement at resolution (S2):** the loser's Cash is debited **at the moment combat resolves** — 10% of their *current* balance, never pre-reserved. This keeps multi-attacker farming self-limiting (each hit takes 10% of a shrinking pile) and avoids over-debiting when several attackers hit the same offline player. Eng: atomic, server-authoritative, serialized across concurrent attackers.

### Loot
- Winner takes **10% of the loser's Cash on hand**. No other transfer.
- **Fights do not drop items in v1.** Moves are the only item source besides Plugs.

### Matchmaking — win-rate band
- Matchmaking is defined in **win-probability space**, not raw power. A target is eligible if the attacker's win chance against them falls between **35% and 70%** (`P(win) ∈ [0.35, 0.70]`).
- Because win chance comes from the ratio formula above, the band **inverts to a Defense range** the matchmaker can query directly:
  ```
  D = A · ((1 − P) / P)^(1/k)
  ```
  → eligible defender Defense ∈ `[ A·((0.30/0.70)^(1/k)), A·((0.65/0.35)^(1/k)) ]`. With `k = 1`, roughly **D ∈ [0.43·A, 1.86·A]**. Matchmaking is then an indexed range lookup on defender Defense.
- Within the eligible band, selection is **progression-weighted**: early game biases toward the easy (70%) end so wins come readily and the game feels good; the weighting flattens/centers as the player levels up, so late game trends toward true skill-based fights. **The combat formula never changes — only the selection weighting does.**
- No heat, no cooldowns, no recency weighting, no revenge mechanics, no new-player shields.

#### PvE/PvP blend — the Clash Royale model
The map is presented as pure PvP, but the target pool is secretly a **mix of real players and bots**, both drawn from the same win-rate band and **indistinguishable** (same intel, rewards, and UI; bots carry real stats and a real Cash balance — see Data Designs).
- **Bots are NOT pinned to a fixed win rate.** Forcing every bot to, say, 65% would make PvE targets obvious. Instead, bots carry varied, realistic stats and simply populate the band like players; each bot's win rate lands wherever its Defense sits relative to the attacker's Attack.
- **Early game feels good because matchmaking serves easier targets** (the progression-weighted selection above) — and the easy end of a new player's band is disproportionately bots. As the player levels, both the weighting and the pool composition shift toward harder, increasingly real-PvP fights.
- **Empty-band fallback:** if no eligible real players exist in the band, the scan serves a bot.

### Gear
- Gear items carry Attack and/or Defense values.
- Equipped gear is pulled into combat stat totals automatically.
- **Gear brought to combat is capped by Crew size (number of Lieutenants).** More Lieutenants = more gear slots, but the growth is deliberately **slow** to keep recruiting valuable over the long haul.
- **Slot growth:** every **5th Lieutenant** adds **+1 slot of a single gear type**, and the gear type **rotates** as Lieutenants are added (e.g. weapon → armor → vehicle → weapon…). So Crew milestones drip out capacity one type at a time rather than all at once. Exact rotation order and long-tail curve TBD.
- Purchased with Cash (from Plugs); higher tiers gated by level.
- *(Crew/Lieutenants, the loadout screen (Player Profile), and Plugs are defined in [`oppsDefinitions.md`](oppsDefinitions.md).)*

---

## Locked Decisions
*Combat & economy decisions live here; **feature & naming decisions** are in [`oppsDefinitions.md`](oppsDefinitions.md).*

1. All Cash at risk — no bank in v1.
2. Two pacing tracks: **Moves** (PvE, 1/5 min) and **Stamina** (fights, 1/3 min), starting pools 10 and 3.
3. Level-up refills **both** Stamina and Moves, and grants 5 skill points (Moves 1pt, Stamina 2pts, Attack/Defense 1pt each).
4. Loot: winner takes **10% of loser's Cash on hand**.
5. Combat is a **single instant stat-comparison** — attacker's Attack vs defender's Defense via the ratio formula `P(win)=A^k/(A^k+D^k)`; **no Health, no rounds, no attrition**. Stamina is the sole fight-pacing resource.
6. Matchmaking is a **win-rate band**: eligible targets are those the attacker beats **35–70%** of the time (inverts to a Defense-range query from the attacker's Attack). Selection within the band is **progression-weighted** — easier targets early, flattening as the player levels.
7. Target pool is a **hidden PvE/PvP blend (Clash Royale model)**. Bots are **indistinguishable** from real targets — real, varied stats and a real Cash balance, **NOT pinned to a fixed win rate** — and populate the same band as players. The feel-good early game comes from matchmaking serving easier targets, not from fixing bot difficulty. Bots also cover the empty-band fallback.
8. Bots are a **preloaded list of persistent entities** (stats + Cash) in the same matchmaking pool as players — not instanced per scan.
9. Loser's Cash is debited **at combat resolution** — 10% of their *current* balance, never pre-reserved — keeping multi-attacker farming self-limiting.
10. No heat, no revenge mechanics, no new-player shields.
11. Fights do not drop items in v1.
12. Pool growth is **player-allocated skill points** (not automatic).
13. **120 levels**, Clout-per-level on an **exponential curve** (chosen ratio r ≈ 1.05; exact base is data).
14. **Target search:** Search snaps to a **single** eligible target showing **win rate + amount of gear** (raw Attack/Defense hidden). Searching costs **no Stamina**; the first search is free and each **reroll costs a nominal Cash fee**. Stamina is spent only on Attack.

## Open Questions
1. Moves structure: tiers, Moves costs, payouts, item drop tables? *(owner: Jake)*
2. **Snapshot capture trigger & staleness rules** — when a defender's snapshot is written/refreshed and how stale it may get. *(owner: Bill)*
3. Combat formula tuning *(data)*: steepness constant `k`, and the progression-weighting curve for band selection (how strongly early game biases toward easier targets, and how it flattens with level).
4. Crew/Lieutenant slot rotation order (weapon/armor/vehicle/…), long-tail curve, and hard cap vs. diminishing returns.
5. Clout curve *(data)*: base value (ratio r ≈ 1.05 chosen) and per-source Clout yields (win/loss/Move/recruit).
6. Do bot Cash balances replenish/reset after being farmed down, and can bots appear as *attackers* (defense-side feed), or defenders only? *(data + design)*
7. Target-search details: (a) win rate shown as an exact % or a banded label (EASY/EVEN/RISKY)? (b) reroll fee flat or escalating within a session? (c) also show an estimated Cash reward (reveals target wealth), or keep intel to win-rate + gear only?
8. Spots: catalog, income rates, upgrade curve, and the level → offline-accrual-cap mapping. *(data + design)*
9. Player Profile public view: which fields are visible to other players (gear/loadout shown, raw Attack/Defense hidden)?
10. Naming confirmation: is "Moves" as both the resource and the feature the intended wording? *(Plug/Plugs resolved — one feature: Plugs are people who sell gear and give quests.)*

---

## Data Designs Needed
The schemas/models that must be designed to build this system. (Draft list — refine as systems firm up.)

1. **Player / account state** — Cash (authoritative live balance — mutated by others' attacks at resolution), Clout, current level, Stamina (current/max), Moves (current/max), base Attack, base Defense, unspent skill points, last-regen timestamps for each pool, Crew size (Lieutenant count). **No Health. No hard currency in v1.**
2. **Combat snapshot** — the stored copy of a defender's stats + **chosen loadout** → total Defense, used for async resolution so the defender need not be online. **Separate from the live Cash balance** (snapshot = stats/defense for the DEF calc; Cash is debited against the live balance at resolution). Capture trigger/staleness: owner Bill (see Open Questions).
3. **Gear catalog** — master item definitions: id, gear type (weapon/armor/vehicle/…), Attack and/or Defense values, tier, level gate, Cash cost.
4. **Player gear inventory** — which items a player owns and which are equipped.
5. **Gear-slot capacity + combat loadout** — per-player combat slot limits derived from Crew size / Lieutenant count (rotating-type-per-5-Lieutenants rule), plus the player's **chosen loadout**: one primary item per gear type + the Crew-unlocked secondary slots, and which owned item fills each slot. The loadout is what the snapshot freezes.
6. **Matchmaking index** — a queryable index of eligible targets (players + bots) **by Defense**, so the matchmaker can range-query the band derived from the attacker's Attack. Directional (attacker ATK vs defender DEF), not a symmetric Power scalar.
7. **Bot roster** — a **preloaded list of persistent bot entities**, each with real stats (Attack/Defense) and a real Cash balance, living in the same matchmaking pool as players. Distribution of bot stats should mirror the real player population so they're indistinguishable in-band. (Not generated per scan.)
7a. **Target intel payload** — the client-facing contract returned by a search: win rate (computed server-side from attacker Attack vs target Defense), gear amount (loadout size), name, portrait, and an opaque target/snapshot handle for the attack. **Never includes raw Attack/Defense** or the PvE/PvP flag.
8. **Matchmaking selection-weighting config** — the per-level/progression weighting that biases in-band target selection toward the easy (70%) end early and flattens it with level. PvE-vs-PvP share is emergent from this weighting + pool composition, not a hard-coded ratio.
9. **Fight log / history** — per-fight record: attacker, defender (or bot), win/loss, Cash transferred, Clout gained, timestamp, and a PvE/PvP flag (internal only).
10. **Level / Clout curve table** — Clout threshold for each of the 120 levels (exponential curve params) and what each level unlocks (gear tiers, Moves tiers, Spots offline cap).
11. **Skill-point allocation** — per-player record of allocated points plus the global cost config (Moves 1pt, Stamina 2pt, Attack/Defense 1pt).
12. **Crew / Lieutenants** — invite records and which invitees actually played (Lieutenants), Lieutenant count → gear-equip capacity, and Clout granted per recruit.
13. **Economy tuning config** — centralized tunables: loot rate (10%), regen rates (Stamina 1/3min, Moves 1/5min), starting pools, win-rate band bounds, selection-weighting curve, reroll fee, Spots income/offline-cap curve. Kept as data, not hard-coded.
14. **Async notifications** — records/queue for notifying a defender they were attacked while offline.
15. **Moves data** *(structure TBD)* — Move definitions (tier, Moves cost, Cash/Clout payout, drop tables) and per-player Moves progress/mastery.
16. **Spots data + player ownership** — Spot catalog (cost, income rate, upgrade tiers), which Spots a player owns/operates, per-Spot accrued-but-uncollected Cash, and the level → offline-cap function.
17. **Player Profile (public view)** — the publicly visible projection of a player: equipped loadout/gear to show off, Crew/Lieutenant count, level/Clout — excluding raw Attack/Defense and private balances.

---

## Health Removal — Code Cleanup (migration)
Health is cut from the model (Locked #5): combat is a single instant stat-comparison and Stamina is the sole fight pacer. The current prototype has Health woven through several systems — here is the full blast radius for the engineer. Paths are relative to the repo root.

- **`js/state.js`** — remove `health` and `maxHealth` from the `G` state object.
- **`js/main.js`** — in `addXP()` level-up, drop `G.maxHealth += 15` and `G.health = G.maxHealth`. (Level-up should refill Stamina + Moves instead.)
- **`js/combat.js`** — remove the `if (G.health < 20)` fight gate (replace with a Stamina ≥ 1 check); delete the win/loss HP changes in `_applyResult` (`G.health = Math.max(5, …)` and `G.health = 5`); the `c-player-hp` / `c-enemy-hp` HP bars in the fight visual are no longer meaningful.
- **`js/hud.js`** — remove `h-health` rendering and the health bar/label (`health-bar`, `health-label`). HUD shows **Stamina + Moves** only.
- **`js/hood.js`** — the `doActivity('rest')` heal action becomes a no-op; remove the "Rest Up (Heal)" activity.
- **`js/payments.js`** — the `GEM_SPENDS` "Full Heal" entry (75 💎) loses its purpose. (The whole gems layer is being removed for v1 anyway — see the Definitions doc's migration section.)
- **`data/store.json` + `js/store.js`** — the Safe House item's `hpBonus` field has nothing to act on; re-spec that item (ATK/DEF bonus) or remove it, and drop the `hpBonus` handling in `buyItem()`.
- **`index.html`** — remove the HEALTH HUD stat (`h-health`), the health bar block in the Hood tab (`health-label` / `health-bar`), and the combat-overlay HP bars if the fight visual is reworked.

*This section is migration guidance only — no design impact. Delete once the cleanup lands.*

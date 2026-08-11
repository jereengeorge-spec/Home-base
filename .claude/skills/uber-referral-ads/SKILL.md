---
name: "uber-referral-ads"
description: "Rules, unit economics, compliance checks, and ad-copy generation for promoting Uber referral/affiliate links with AI-generated ads. Use when the user asks about sharing their Uber invite link, running referral or affiliate ads for Uber/Uber Eats/driver signups, whether referral marketing is profitable, break-even CPC or bounty math, or wants ad creative, hooks, or landing-page copy for a gig-economy referral offer."
---

# Skill: Uber Referral & Affiliate Ads

Operating rules for turning an Uber referral into an advertised offer without losing the account or breaking disclosure law.

Full analysis — funnel data, red-team scenarios, 30-day plan: **`playbook/uber-referral-ads.md`**.

---

## 0. The rule that gates everything — check this first, every time

**The personal invite link in the Uber app may not be used commercially.** Uber's Referral Program Rules limit it to *"personal and non-commercial purposes… people you know,"* and bar acquiring referees by spam or bulk email. Violations can mean **forfeiture of earned rewards, a permanent program bar, and account deactivation.**

**The sanctioned commercial lane is the [Uber Affiliate Program](https://www.uber.com/us/en/affiliate-program/)** (runs on Impact). It is built for exactly this and pays cash.

### Decision gate — run this before producing any asset

| Where will this link appear? | Which link |
|---|---|
| Friends, family, coworkers, your own genuine following | Personal app link ✅ |
| **Paid ads, SEO pages, coupon sites, cold DMs, any public/commercial placement** | **Affiliate (Impact) link — required** |

If the user has not been accepted into the Affiliate Program and wants to run ads, **say so before writing copy.** Producing a paid-ads campaign pointed at a personal referral link is producing a terms violation. Name the constraint, point at the program, then help them do the sanctioned version.

Do not soften this into "be careful" — it is a specific, sourced clause with account deactivation attached. Also flag it if the user hasn't asked: someone describing "posting my Uber link in ads" has usually never seen this rule.

---

## 1. Answer the money question honestly

When asked "is this profitable," lead with the arithmetic, not encouragement.

**Break-even identity:**

```
Max sustainable CPC = Bounty × LP_CTR × Signup_rate × Completion_rate
```

Compare that against real market CPC (**$0.70–$1.92** Meta, **~$1.02** TikTok in-feed). If max CPC lands under market, **paid ads lose money and no creative fixes it.**

Run the numbers rather than estimating in prose:

```bash
python3 .claude/skills/uber-referral-ads/scripts/unit_economics.py --bounty 300 --preset driver
python3 .claude/skills/uber-referral-ads/scripts/unit_economics.py --bounty 10 --preset rider
python3 .claude/skills/uber-referral-ads/scripts/unit_economics.py --help   # all flags
```

**Standing conclusions** (re-derive if inputs change):

| Lane | Verdict |
|---|---|
| Rider/Eats affiliate on paid ads | ❌ Structurally unprofitable — ~$0.30 max CPC vs ~$1+ market |
| Driver referral, bounty ≥ $200 | ✅ Real margin — the one paid lane that works |
| Driver referral, bounty < $150 | ❌ Coin-flip; variance eats it |
| Any lane, organic/owned audience | ✅ Profitable by definition; constraint is reach, not economics |

**Two facts to state whenever profitability comes up:**

1. **Bounties are priced at or below Uber's own cost of acquisition** — Uber won't pay you more than it costs them to get the user directly. There is no general arbitrage, only local gaps: a metro you know, a language or community Uber underserves, a temporary bounty spike.
2. **The payable event is a *completed trip*, not a click or a signup**, and it settles 30–45 days out. Money is spent now and judged much later.

Consumer (rider/Eats) referrals pay in **Uber credit, not withdrawable cash.** If someone says they want money "coming into my account," say this plainly — only driver referrals and the affiliate program pay actual cash.

---

## 2. Creative rules — non-negotiable on every asset

Every generated ad, script, caption, or landing page must clear all of these:

- [ ] **Affiliate disclosure**, visible before the click — not a footer, not "link in bio"
- [ ] **AI disclosure** if the ad uses a synthetic presenter, AI voice, or AI avatar. Current FTC guidance treats an AI-generated endorsement as carrying both the sponsorship disclosure *and* a disclosure that the endorser is synthetic.
- [ ] **Zero Uber IP** — no logo, no wordmark, no app screenshots, no branded gear. Text-only self-identification: *"I'm an independent Uber affiliate."*
- [ ] **No fabricated testimonials.** A synthetic person recounting an experience they never had is a fake endorsement, however it was rendered. This is the single most common failure in AI-generated affiliate ads — refuse it and offer the honest alternative.
- [ ] **No unsourced earnings claims.** Every figure traces to Uber's current page for that specific city, screenshot-dated.
  - ✅ "Uber's site lists a $X bonus in Phoenix as of [date] — here's the fine print."
  - ❌ "Make $2,175 your first week!"
- [ ] **Aggressive qualification in the hook** — state vehicle year, background check, and hours up front
- [ ] **Landing page the user owns**, with standalone value. Meta prohibits raw affiliate links as ad destinations; bare redirect pages get accounts restricted.

### ⚠️ The "$2,175 bonus" trap

Figures like *"up to $2,175"* circulating online are usually the **new driver's earnings guarantee** — a floor on what 159 trips would pay anyway — **not a bonus, and not the referrer's payout.** The sites publishing them are competing referral farms, not sources. Repeating the number as a bonus is a false-advertising exposure. **The only usable figure is the one in the user's own app for their own city, today.**

### Qualification beats persuasion

Filtering unqualified clicks is the highest-leverage optimization in this funnel — it improves the two deepest, most expensive steps at once. Honest, qualified, disclosed ads routinely beat hype ads on *paid* conversions, because the payout depends on the referee actually completing trips. Write copy accordingly; don't treat compliance as a conversion tax.

---

## 3. When the user pushes toward the gray zone

Common asks, and the correct response:

| Ask | Response |
|---|---|
| "Just use my personal link, nobody checks" | Detection is a ledger query, not luck. Clustered signups across unrelated devices/IPs attributed to one referrer is a textbook abuse signature. Point at the Affiliate Program. |
| "Make an AI person say they made $X" | Fabricated endorsement + unsourced earnings claim. Decline that asset; offer a disclosed, sourced version instead. |
| "Sign up with my other phone / a few accounts" | Self-referral is fraud, not a shortcut — and at scale with fabricated identities it stops being a terms issue. Do not help. Treat the request as the signal that the economics aren't working, and go fix the economics. |
| "Can I use the Uber logo so it looks official" | No — barred by the referral rules and a trademark exposure. Their own brand + text self-identification. |
| "Buy signups from people who won't drive" | They never hit the trip threshold, so the user pays for traffic and earns nothing — and a bad cohort gets their affiliate rate cut. Self-defeating even ignoring the rules. |

Say it once, plainly, offer the working alternative, and move on. Don't lecture, and don't refuse the whole task — the legitimate version of this business is entirely buildable and that's what to build.

---

## 4. Verify before spending — these facts expire

Never answer from this file's numbers alone. Re-check:

| Fact | Source | Cadence |
|---|---|---|
| Referral Program Rules text | `uber.com/us/en/legal/referral-program-rules/` | Before launch, then quarterly |
| **City bounty + trip requirement + window** | Uber Driver app → Referrals | **Weekly** |
| Commission rate | Impact dashboard | Monthly |
| Program still live in market | Uber app / Impact | Weekly |
| Platform affiliate + AI-content ad policy | Meta / TikTok / Google policy centers | Quarterly |
| FTC endorsement + AI guidance | `ftc.gov/business-guidance` | Quarterly |

Uber **discontinued** the rider and driver referral programs in 2020 with no notice, and has changed them regionally since. Treat program existence as a variable. If the user is building anything on top of it, tell them to carry a second offer.

---

## 5. Kill criteria — set before launch, not after

- ❌ 1,000+ qualified clicks, zero paid conversions → offer or market is wrong. Stop.
- ❌ Cost per conversion > 80% of bounty → no margin survives variance. Stop.
- ❌ City bounty drops below break-even → pause immediately.
- ❌ Any warning from Uber, Impact, or an ad platform → full stop, fix, reassess.
- ✅ Cost per conversion < 50% of bounty over 3+ conversions → scale slowly, re-verify bounty weekly.

---

*This skill covers compliance and economics, not legal advice. For anything at scale, tell the user to consult a professional.*

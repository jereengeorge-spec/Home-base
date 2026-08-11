# Uber Affiliate Program — Application Package

Everything you need to submit the application, drafted and ready to paste. **You have to submit it yourself** — see §0.

Companion to `playbook/uber-referral-ads.md` (the economics) and `playbook/driver-ads-local-classifieds.md` (the creative).

---

## 0. Why you're submitting this, not me

I can't apply on your behalf, for three reasons:

1. **It's an account in your legal identity.** The application asks for your name, address, tax status (a W-9 in the US), and bank details for payouts. Those are yours to enter, and an agreement you sign is one you have to actually be party to.
2. **Uber's domains are blocked from my environment.** `uber.com` and `help.uber.com` are unreachable from here — I can't load the form even to read it.
3. **You'd be signing a contract.** Affiliate agreements bind you to promotional-method restrictions, trademark rules, and clawback terms. Read them yourself, because you're the one they apply to.

What I've done instead is write every answer the form will ask for, so submitting is copy-paste plus your personal details. **Expect 20–30 minutes.**

---

## 1. Sequencing — read this before you start

There's a chicken-and-egg problem that trips up most first-time affiliate applicants:

> **Affiliate programs approve you based on where you'll promote. If you have no website, no audience, and no traffic, the honest answers to their questions are all "none" — and that's a rejection.**

So **don't apply cold today.** Do this order:

| Step | Why |
|---|---|
| 1. Build the landing page first | It's the single strongest thing on the application, and Meta requires it anyway |
| 2. Join 3–5 local gig/rideshare Facebook groups, participate genuinely for 1–2 weeks | Gives you a real, describable audience with a real number |
| 3. Screenshot your city's current driver bounty | You need this number for the ads regardless |
| 4. **Then** apply, with a real URL and a real audience to describe | Turns "none" answers into specific ones |

If you apply now and get rejected, reapplying is harder than applying well once. **A week of prep meaningfully changes the outcome.**

---

## 2. Where to apply

| | |
|---|---|
| **Program page** | `uber.com/us/en/affiliate-program/` |
| **Network** | Impact (`impact.com`) — you'll need a publisher account |
| **What it pays** | Cash commission on new users who complete a **first trip** (riders) or, where offered, driver signups |
| **Rate** | Not published — set by your audience, geography, and volume, negotiated after acceptance |

**Create the Impact publisher account first**, then apply to Uber's program through it. Impact handles tracking, reporting, and payouts, so a lot of the "application" is really just building out your Impact publisher profile.

⚠️ **Confirm the driver-referral lane exists in your market before you build around it.** The affiliate program's headline offer is rider/Eats first-trip commission. Per `uber-referral-ads.md` §5, rider commissions **don't** support paid ads — but they're fine on the zero-cost channels in the classifieds playbook. If the affiliate program in your market only pays rider commissions, your driver-recruitment plan has to run through Uber's in-app driver referral instead, which carries the personal/non-commercial restriction. **Ask Impact support directly which lanes are available to you.** This one answer determines which of the two playbooks you're actually executing.

---

## 3. Drafted answers

Replace every `[BRACKET]` with your real information. **Don't inflate any number** — affiliate networks verify traffic claims, and an inflated one is grounds for termination after you've done the work.

### Promotional methods
> Local community outreach and content marketing. I run a city-specific information page for prospective rideshare drivers in [YOUR METRO], covering vehicle requirements, the background-check timeline, current bonus terms, and realistic earnings. I share it in local gig-work and rideshare Facebook groups where prospective drivers actively ask these questions, with clear affiliate disclosure on every post and on the page itself.

### Primary promotional URL
> [YOUR-LANDING-PAGE-URL]

### Audience description
> Prospective and early-stage gig workers in [YOUR METRO] — people evaluating rideshare or delivery as primary or supplemental income. Reached through local Facebook groups and community forums rather than paid media. Concentrated in [YOUR METRO]; US-based.

### Audience size
> [REAL NUMBER — combined membership of groups you're actually active in, plus any page traffic. If it's small, say so; "roughly 4,000 across five local groups, ~120 page visits/month" reads as credible. A rounded 50,000 does not.]

### Traffic sources
> Organic and community referral. No paid search, no paid social, no email lists purchased or rented. Traffic comes from participation in local gig-work communities and direct visits to the landing page.

### How you'll disclose the affiliate relationship
> Every post and every page carries a clear affiliate disclosure above the link, stating that I earn a commission if someone signs up through it. Disclosure appears before the click, not in a footer or bio. Any AI-assisted creative is labeled as such.

### Why you're a good fit
> I'm not driving generic traffic — I'm reaching people at the moment they're actively deciding whether to start driving, in a single metro I know well. My content sets accurate expectations about vehicle requirements, background-check timing, and real hourly earnings, which means the people who click through are pre-qualified and more likely to actually complete their first trips rather than sign up and churn.

*(That last paragraph is doing real work: it tells them you optimize for **completed trips**, not raw signups. That's the metric that determines whether they keep you, and saying it back to them signals you understand the program.)*

### Monthly volume estimate
> [BE CONSERVATIVE. "5–15 qualified referrals per month initially" is credible. Overpromising sets an expectation you'll be measured against.]

---

## 4. What you'll also need on hand

- [ ] **Tax details** — W-9 if US. Affiliate income is self-employment income; expect a 1099 at threshold.
- [ ] **Payout method** — bank account or PayPal, configured in Impact.
- [ ] **Landing page live** at a real domain (not a "coming soon" placeholder).
- [ ] **Affiliate disclosure already visible** on that page — they may check before approving.
- [ ] **Business entity** — optional. Sole proprietor is fine to start; you don't need an LLC for this.

---

## 5. After you submit

| Stage | What to expect |
|---|---|
| Review | Days to a few weeks. Silence is normal; don't re-submit. |
| If approved | Your commission rate and tracking links appear in Impact. **Screenshot the rate and terms on day one.** |
| If rejected | Almost always "insufficient audience/traffic." Build the page and the group presence for 30–60 days, then reapply once with real numbers. |
| Ongoing | Rates and terms change. Re-check the Impact dashboard monthly. |

**On approval, before you spend a cent:** re-run the break-even calculator with your *actual* commission rate, not the estimate.

```bash
python3 .claude/skills/uber-referral-ads/scripts/unit_economics.py --bounty <your-real-rate> --preset driver
```

---

## 6. While you wait

You are **not** blocked. Everything in `playbook/driver-ads-local-classifieds.md` runs on zero ad spend, and the landing page and group presence you build are exactly what strengthens the application.

**One hard rule for the waiting period:** until you're approved and holding an Impact tracking link, anything you post publicly is subject to the personal/non-commercial restriction on your in-app link. Build the page, join the groups, be genuinely useful, don't drop the personal link into public posts. See `uber-referral-ads.md` §2.

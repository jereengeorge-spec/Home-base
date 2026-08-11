#!/usr/bin/env python3
"""Break-even calculator for Uber referral / affiliate ad campaigns.

Answers the only question that matters before spending money:
what is the most I can pay per click and still make a profit?

    Max CPC = bounty * lp_ctr * signup_rate * completion_rate

If that number lands under the market CPC, the campaign loses money and no
amount of creative testing fixes it -- the arithmetic is upstream of the ads.

Usage:
    python3 unit_economics.py --bounty 300 --preset driver
    python3 unit_economics.py --bounty 10 --preset rider --cpc 0.85
    python3 unit_economics.py --bounty 250 --preset driver --budget 500

Default funnel rates are industry-benchmark estimates, not measured results
for this offer. Replace them with your own numbers as soon as you have any.
"""

import argparse
import sys

# Funnel presets: (lp_ctr, signup_rate, completion_rate, label)
# lp_ctr          -- landing page visitors who click through to Uber
# signup_rate     -- of those, who complete signup / start an application
# completion_rate -- of those, who reach the PAYABLE event
#                    (rider: first trip | driver: activated + N trips in window)
PRESETS = {
    "rider": (0.30, 0.20, 0.50, "Rider / Eats -- payable on first completed trip"),
    "driver": (0.08, 0.25, 0.50, "Driver / courier -- payable after N trips in window"),
}

# Observed market rates, 2026 benchmarks. Re-verify; ad auctions drift.
MARKET_CPC = {"TikTok in-feed": 1.02, "Meta traffic": 0.70, "Meta lead": 1.92}


def parse_args(argv=None):
    p = argparse.ArgumentParser(
        description="Break-even calculator for Uber referral / affiliate ads.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__.split("Usage:")[1],
    )
    p.add_argument(
        "--bounty",
        type=float,
        required=True,
        help="Payout per conversion, in dollars. Use the CURRENT number from "
        "your own Uber app or Impact dashboard for your own city -- never a "
        "figure from a referral-code website.",
    )
    p.add_argument(
        "--preset",
        choices=sorted(PRESETS),
        default="driver",
        help="Funnel shape to start from (default: driver).",
    )
    p.add_argument("--lp-ctr", type=float, help="Override: landing page -> Uber click rate (0-1).")
    p.add_argument("--signup-rate", type=float, help="Override: Uber click -> signup rate (0-1).")
    p.add_argument(
        "--completion-rate", type=float, help="Override: signup -> payable event rate (0-1)."
    )
    p.add_argument("--cpc", type=float, help="Your actual cost per click, if you have real data.")
    p.add_argument("--budget", type=float, help="Planned ad spend, to project the outcome.")
    return p.parse_args(argv)


def resolve_funnel(args):
    lp_ctr, signup, completion, label = PRESETS[args.preset]
    if args.lp_ctr is not None:
        lp_ctr = args.lp_ctr
    if args.signup_rate is not None:
        signup = args.signup_rate
    if args.completion_rate is not None:
        completion = args.completion_rate

    for name, value in (
        ("--lp-ctr", lp_ctr),
        ("--signup-rate", signup),
        ("--completion-rate", completion),
    ):
        if not 0 < value <= 1:
            sys.exit(f"error: {name} must be between 0 and 1 (got {value})")
    if args.bounty <= 0:
        sys.exit(f"error: --bounty must be positive (got {args.bounty})")

    return lp_ctr, signup, completion, label


def main(argv=None):
    args = parse_args(argv)
    lp_ctr, signup, completion, label = resolve_funnel(args)

    click_to_conversion = lp_ctr * signup * completion
    max_cpc = args.bounty * click_to_conversion
    clicks_per_conversion = 1 / click_to_conversion

    print(f"\n  {label}")
    print(f"  Bounty per conversion: ${args.bounty:,.2f}\n")

    print("  Funnel")
    print(f"    landing page -> Uber      {lp_ctr:>7.1%}")
    print(f"    -> signup                 {signup:>7.1%}")
    print(f"    -> payable event          {completion:>7.1%}")
    print(f"    click -> conversion       {click_to_conversion:>7.2%}")
    print(f"    clicks per conversion     {clicks_per_conversion:>7.0f}\n")

    print(f"  MAX SUSTAINABLE CPC: ${max_cpc:.2f}")
    print("  (pay more than this per click and every conversion loses money)\n")

    print("  vs. market")
    verdicts = []
    for name, cpc in sorted(MARKET_CPC.items(), key=lambda kv: kv[1]):
        margin = max_cpc - cpc
        ok = margin > 0
        verdicts.append(ok)
        flag = "PROFITABLE" if ok else "LOSS"
        print(f"    {name:<18} ${cpc:>5.2f}   {flag:<11} ({margin:+.2f}/click)")

    if args.cpc:
        cost_per_conversion = args.cpc / click_to_conversion
        profit = args.bounty - cost_per_conversion
        ratio = cost_per_conversion / args.bounty
        print(f"\n  Your actual CPC: ${args.cpc:.2f}")
        print(f"    cost per conversion     ${cost_per_conversion:,.2f}")
        print(f"    profit per conversion   ${profit:+,.2f}")
        print(f"    cost as % of bounty     {ratio:.0%}")
        if ratio > 0.8:
            print("    -> KILL CRITERION HIT: over 80% of bounty, no margin for variance.")
        elif ratio < 0.5:
            print("    -> Under 50% of bounty. Scale slowly; re-verify bounty weekly.")

    if args.budget:
        cpc = args.cpc or min(MARKET_CPC.values())
        clicks = args.budget / cpc
        conversions = clicks * click_to_conversion
        revenue = conversions * args.bounty
        print(f"\n  Projection on ${args.budget:,.2f} at ${cpc:.2f} CPC")
        print(f"    clicks                  {clicks:>10,.0f}")
        print(f"    conversions             {conversions:>10,.1f}")
        print(f"    revenue                 ${revenue:>9,.2f}")
        print(f"    net                     ${revenue - args.budget:>+9,.2f}")
        if conversions < 3:
            print("    -> Too few conversions to read as signal. This buys data, not revenue.")

    print()
    if not any(verdicts):
        print("  VERDICT: paid ads lose money at every market CPC. Creative cannot fix")
        print("  arithmetic. Go organic-only, or find a higher-bounty market.\n")
    elif all(verdicts):
        print("  VERDICT: headroom at market rates. Test small, re-verify the bounty")
        print("  weekly -- it can be cut without notice and flip this negative.\n")
    else:
        print("  VERDICT: marginal -- profitable only on the cheapest traffic. Thin")
        print("  enough that a bounty cut or a weak cohort wipes it out.\n")

    print("  Reminder: payable on COMPLETED TRIPS, settling 30-45 days out.")
    print("  Rider/Eats referrals pay Uber credit, not withdrawable cash.\n")


if __name__ == "__main__":
    main()

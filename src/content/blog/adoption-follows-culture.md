---
title: Adoption Follows Culture
subtitle: Building the Platform Was Hard. Changing the Culture Was Harder.
description: Building the Platform Was Hard. Changing the Culture Was Harder.
pubDate: 2026-03-01
radio: false
video: false
toc: true
share: true
giscus: true
search: true
draft: true
ogImage: adoption-follows-culture.png
---

![Adoption Follows Culture illustration](../../assets/blog/adoption-follows-culture.png)

There’s a moment in most platform projects where the technical work starts to look like the easy part.

For us, that moment came *after* we had already built something real: a modern platform-as-a-service with strong tenant isolation, secure defaults, centralized controls, and a much better operating model than what existed before. On paper, it solved obvious pain. In practice, it was the kind of platform many teams say they want.

And still, adoption was a fight.

Not because the architecture was wrong. Not because the platform didn’t work. But because the migration we were asking for was bigger than technology. We weren’t just asking teams to move workloads. We were asking them to change how they worked, what they owned, and how they understood “done.”

I had the pleasure of building that platform, Phoenix, with a very talented team. I’m proud of what we built. But the longer I reflect on it, the more I think the most important lesson was not about Kubernetes, Istio, or cloud networking.

It was about culture.

## What We Built with Phoenix

Phoenix was built to close the gap between raw Kubernetes primitives and what a large enterprise actually needs to run securely at scale.

Kubernetes is an excellent orchestrator, but by itself it doesn’t solve for organizational consistency: tenancy boundaries, policy enforcement, secure defaults, standardized ingress and egress, cloud-side drift, or the very human tendency for every team to invent a slightly different way of doing the same thing. Phoenix was our attempt to turn those concerns into platform behavior instead of documentation.

At the center of the model was a concept we called a *sector* — a structured, isolated tenant unit that gave teams a consistent place to run workloads while the platform managed the harder, security-sensitive pieces around them. A sector was more than a namespace. It was a repeatable operating environment with clear boundaries and managed capabilities, which let teams move faster without having to recreate foundational infrastructure patterns every time.

That design let us strike a balance that mattered a lot: teams had real power, but the platform did not devolve into “every team builds their own cloud.”

Tenant isolation was one of the strongest examples of that philosophy. We built it as an actual boundary, enforced through multiple layers: namespace separation, RBAC, network policies, Istio controls, admission checks, and centrally managed platform components. Sectors were isolated by default, and cross-sector communication wasn’t something that happened accidentally. That reduced blast radius, but it also improved clarity: connectivity became explicit, reviewable, and intentional.

Phoenix was also very deliberately a secure-by-default paved road. We put tight restrictions in the places that truly needed them, and gave teams flexibility inside those guardrails. We enforced things like sidecar injection, mTLS in the mesh, policy controls, scoped DNS and certificate handling, and restricted egress. Teams didn’t need to invent their own exposure model or security posture from scratch. At the same time, they still owned their deployments, routing definitions, service behavior, and application-level decisions.

That balance was the point: strong defaults without turning the platform into a bottleneck.

We also built reconciliation deeply into the system. One layer continuously managed the underlying cloud project state and corrected drift, rather than allowing manual “temporary” changes to pile up into a shadow system. Another layer handled cluster-level reconciliation so platform components and managed services remained consistent over time. In practice, this gave Phoenix a much stronger operational backbone than the common “provision once, then hope nobody breaks it” model.

The networking and identity model followed the same pattern. Ingress and egress were standardized around explicit intent instead of ad hoc exceptions. Workload identity reduced credential sprawl and key-management pain. Managed services were exposed in ways that made them easy for product teams to consume without forcing each team to solve the same security and configuration problems again. Telemetry was exported so teams could actually own observability and diagnose their own systems, instead of waiting for a central ops group to interpret signals for them.

That last part is easy to underrate until you’ve lived the alternative. A platform isn’t truly empowering if teams can deploy, but can’t *see* what their systems are doing.

All of this added up to a platform that was opinionated, constrained, and secure by default — but still gave teams meaningful ownership.

And still, adoption was hard.

## Why “Build Something Better” Wasn’t Enough

There’s a popular platform story — especially in companies people like to cite as engineering role models — that if you build something clearly better, people will come.

That was not our experience.

The architecture was not the main obstacle. The bigger obstacle was that the organization we were asking to adopt Phoenix had been operating for years with a very different model of responsibility.

The prevailing pattern was a handoff culture. Engineering built code and handed it to QA. QA sent it back or passed it along. Then it went to Operations, who unpacked artifacts, made customer-specific changes, and deployed. Those last-mile manual changes were often where things became fragile. Small differences per customer accumulated. A missed flag or subtle mismatch could take performance down significantly. Monitoring was not mature enough to surface problems early, so the first meaningful signal was often a customer complaint or a full outage.

That system did not exist because people were careless. It existed because the organization had grown around those handoffs, and people had learned how to operate inside them.

They got good at local completion.
They got good at passing work along.
They got good at proving, when things went wrong, that the problem happened “after” their part.

So when a new platform arrives and says, “You now have more power, but also more responsibility,” that’s not just a tooling change. It’s a change in the social contract.

Suddenly, engineers are expected to understand more than feature code. They need to understand runtime behavior. Inbound and outbound traffic. Deployment implications. Mesh behavior. Operational signals. They need to learn tools they previously could ignore. They need to think about the outcome in production, not just whether the ticket is complete.

That is a different kind of engineering role than “implement the feature and pass it to the next group.”

Some people embraced that shift immediately. They saw the upside: fewer opaque handoffs, faster feedback loops, more control, less mystery in production. They became some of the best partners we had, because they helped shape the platform around real-world needs rather than abstract requirements.

Others resisted, sometimes very openly.

I don’t think “people just hate change” is a useful explanation here. In most cases, resistance was more understandable than that: discomfort with losing status in the old system, anxiety about a broader accountability surface, skepticism toward central initiatives, and uneven leadership alignment about what was actually expected. That combination can slow down even very strong technical work.

## The Real Work Was Cultural

At some point, it became obvious that this was not just a platform rollout. It was an organizational change effort.

The biggest lesson for me was that you cannot document your way across a cultural gap.

Documentation mattered, and we did a lot of it. But links alone do not change behavior. What moved the needle was hands-on learning: workshops, walkthroughs, and repeated examples tied to real daily work. Showing how ingress worked in practice. Showing what breaks when egress isn’t declared. Showing how to trace traffic, debug failures, and use observability tools that teams now owned. People changed faster when they could map the platform to what they actually had to do on Monday morning.

Leadership alignment was just as important, and harder. We had a strong project sponsor, which made a real difference. But broader leadership support took time and needed repeated reinforcement. That mattered because organizations pay attention to what leaders *enforce*, not just what they endorse in meetings.

If leadership says “we want end-to-end ownership” but still rewards the old handoff behaviors, the old culture wins.

The shift only becomes real when expectations stop being abstract. What does “done” mean now? Who owns production outcomes? What responsibilities moved to engineering? What handoffs are no longer acceptable? How are incidents reviewed? If those answers remain fuzzy, the platform stays an optional improvement instead of becoming the new operating model.

We also learned to lean into early adopters. Their stories were far more persuasive than any platform presentation could ever be. A platform team saying “this is better” sounds like advocacy. A product team saying “we moved and had fewer deployment surprises” sounds like evidence.

Culture moves faster when peers make the new behavior visible.

## How Culture Actually Changes

One thing I’ve come to believe is that culture is often talked about too abstractly. We say things like “ownership” and “accountability,” but those words only matter when they show up in the mechanics of daily work.

In practice, culture changes when the system around people changes.

If engineering can still declare success before observability exists, before runtime dependencies are clear, and before deployment behavior is understood, then the old handoff culture survives inside the new platform. The tooling may be modern, but the behavior is not.

The definition of “done” is one of the strongest levers here. Not in a bureaucratic checklist sense, but in a reality sense. If something is “done” when code is merged, but nobody can safely deploy, observe, or troubleshoot in production, the organization is still optimizing for local completion. Once “done” starts to include operational readiness, clarity of ownership, and the ability to understand production behavior, the center of gravity starts to move.

Incident reviews are another major lever. If incidents are conducted as blame exercises, people become defensive and optimize for self-protection. If they’re run as engineering reviews — where the questions are about ambiguity, missing signals, weak guardrails, and how to reduce recurrence — then accountability becomes constructive. That changes how teams engage with both the platform and each other.

Making the *why* behind the platform visible also matters more than many platform teams expect. Controls feel arbitrary when they’re experienced only as restrictions. They feel different when teams understand the failure modes they’re preventing: manual per-customer changes creating deployment variance, unrestricted egress increasing risk, unmanaged credentials creating long-term security debt, missing telemetry slowing diagnosis. When the rationale is clear, the platform starts to feel less like central control and more like institutional memory turned into software.

And then there’s consistency, which may be the least glamorous and most important part. Culture does not change because of one workshop, one migration, or one leadership announcement. It changes when the same expectations show up repeatedly — in design reviews, in onboarding, in production readiness, in incident follow-ups, in what gets praised, and in what gets pushed back on. Repetition is what turns a new behavior into a norm.

## A More Useful Way to Think About Resistance

Platform teams often misread slow adoption as resistance to the technology itself.

Sometimes it is. But often, what teams are really resisting is what the technology *implies*: a redistribution of responsibility.

Phoenix gave teams more capability: self-service patterns, better observability access, clearer traffic control, more direct ownership of runtime behavior. That’s a real upgrade.

But it also reduced ambiguity and removed some informal escape hatches. Fewer silent overrides. Fewer manual fixes at the end of the pipeline. Fewer opportunities to say, “Ops will handle it,” or “That’s a deployment issue, not an engineering issue.”

That is a much bigger shift than adopting Kubernetes.

It changes who is expected to know what.
It changes who gets to decide.
It changes where responsibility lives when things go wrong.

Seen that way, resistance becomes easier to understand — and easier to address with empathy rather than frustration.

## What I’d Do Again

I’m proud of what we built with Phoenix. The architecture mattered. The isolation model mattered. The secure-by-default paved road mattered. The reconciliation model mattered. Those choices created the foundation for a much safer and more scalable operating model.

But if I had to summarize the real lesson, it would be this:

Building the platform was engineering work. Getting it adopted was leadership work.
If you’re doing a platform transformation, you have to design both.

You need the technical system to be excellent. But you also need to design the migration of responsibility, learning, expectations, and trust. You need workshops, not just docs. You need leaders who enforce the new model consistently. You need early adopters whose results are visible. You need a definition of “done” that includes operational reality. You need incident reviews that reinforce learning instead of blame. You need to explain the why behind the guardrails.

In other words, you need to treat culture as part of the architecture.

Because in the end, “build something better and they will come” only works when the organization is already wired to absorb that change. If it isn’t, the real work begins after the platform ships.

## I’d Love to Hear Your Experience

If you’ve lived through a platform rollout, modernization effort, DevOps transformation, or any shift from handoffs to end-to-end ownership, I’d love to hear how it looked from your side.

What created the most resistance in your organization? What actually changed behavior? Did leadership, incentives, incident culture, or tooling make the biggest difference? 

Leave a comment with your experiences and observations — I’m especially interested in the parts that *didn’t* go the way the playbooks said they would.

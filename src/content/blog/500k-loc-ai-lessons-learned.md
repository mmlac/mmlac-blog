---
title: Lessons Learned after Writing 500k Lines of Code with AI
subtitle: A whole program written only with GitHub Copilot & Codex
description: Lessons learned after writing a full desktop app with GitHub Copilot & Codex
pubDate: 2026-02-15
radio: false
video: false
toc: true
share: false
giscus: true
search: true
ogImage: true
draft: false
---

I wanted to stop arguing about “AI can’t build real software” and actually test it.

So I wrote a full .NET desktop app from scratch using Avalonia, with GitHub Copilot and ChatGPT Codex doing essentially all of the coding. My job was to steer: describe features, run builds, paste errors, and decide what “good” looks like.

The result surprised me: the agents shipped feature after feature with an efficiency that felt borderline unfair — until the project hit the kind of problems that _always_ separate toy demos from real systems: UI layout constraints, debugging without enough telemetry, and the slow grind of test coverage.

This post is the story arc: what worked ridiculously well, what got weird, what still needs human skill, and how I’d run the same experiment again.

## The Ground Rules

- **Stack:** .NET + Avalonia (desktop UI)
- **IDE:** Rider (important: it lags VS Code on the newest models and features)
- **Workflow:** in-IDE Copilot + cloud agents (GitHub agent workflow + Codex agents)
- **Models:** Claude Sonnet 4.5, Claude Opus 4.5, ChatGPT Codex 5.2
- **Reality check:** I upgraded Copilot to **Pro+** to avoid frequent rate limits, especially for Opus

If you’re curious _why_ the tooling matters: agentic coding is less about autocomplete and more about whether a model can carry context, run commands, interpret output, and continue without repeatedly dropping the thread.

## The “Magic” Phase: When It Just Prints Features

There’s a phase early in a project where the constraints are light and the architecture is still forming. In that phase, agents are absurdly productive.

Once I understood Rider’s allowlist flow to approve the commands the agent wants to execute, Copilot could go off for long stretches without interrupting me. And when the repo developed a consistent “shape”, think project layout, naming conventions, a few core abstractions, new features started to feel like:

1. Describe the feature
2. Let the agent implement
3. Run it
4. Paste the error output
5. Repeat once or twice

That’s not “AI writes code”. That’s delegation.

> [!TIP] Feature prompt that consistently worked
> **Prompt:** Implement this feature described in detail.
>
> - Follow .NET and Avaloania best practices and consider separation of concerns
> - Add UI and view model changes
> - Add service layer changes
> - Add error handling + logging
> - Add tests for core functionality
> - Run the relevant unit tests and fix failures
> - Summarize changes + files touched

Why it works: it forces a full vertical slice instead of a partial implementation that looks plausible but doesn’t compile.


## Choosing Models: “Big Context” Wins More Than “Cheap Speed”

My usage pattern stabilized quickly:

**Claude Opus 4.5** for anything deep — new features, broad refactors, tricky debugging.
  _Worth it for context window + coherence._ 
**Claude Sonnet 4.5** is my daily workhorse — small fixes, scripts, polish.
  _Fast and solid when the problem is crisp._
**Codex 5.2** is fast execution, decent for straightforward tasks — less reliable for hard debugging.

I later hit a bizarre failure mode where it started returning `2` for basically everything; possibly caused by repo instructions like `AGENTS.md`, but I didn’t chase it further because Claude was delivering.

### The real heuristic

**Pick the model that stays coherent when your repo stops fitting in short-term memory.**
That’s the practical definition of “smart” in agentic coding.


## Cloud Agents: Codex Was Faster, GitHub PR Review Caught the Errors

I ran tasks via GitHub’s agent flow and Codex agents. Even on the same model, **Codex felt noticeably faster** at executing tasks, not just in token speed, but in end-to-end time to a result.

GitHub Copilot’s killer feature was the PR workflow, specifically **PR review**. It caught a couple bugs and questionable changes. I did not evaluate the Codex PR request feature, but I assume it would work equally as well.

If you adopt agentic coding in a serious repo, I strongly recommend treating AI like a junior dev who types fast. The generator is the first pass, the reviewer is the second pass, and you still need a human in the loop for design & architecture judgement

> [!TIP] “Two-pass” workflow prompt
>
> **Prompt:** Open a PR. Then do a self-review pass:
>
> - List risky changes
> - Check for nullability/edge cases
> - Run tests
> - Ensure no extra logging/noise
> - Confirm the UI behavior matches intent
> - Rebase and fix any conflicts
> - Finally: write a short PR description + testing notes.

This forces the agent to switch modes from “builder” to “critic,” which reduces fragile output.


## The Truth: Debugging Still Requires Your Skill

Agents can debug, often impressively. But the hard bugs aren’t hard because of syntax. They’re hard because you need the right mental model of the system.

Opus often figured issues out if I gave it:

- Stack traces
- Steps to reproduce
- What I expected vs what happened
- What I already tried
- Permission to add temporary diagnostic logs

But some problems completely eluded it until I provided the correct conceptual approach.

### Example: The ScrollView problem that forced me to intervene

I had a `ScrollView` inside a dynamically sized container. The scroll view kept treating its height as infinite because its parent was effectively unconstrained. The agent tried lots of plausible XAML/layout variations, but it didn’t discover the real fix:

**The height had to be constrained programmatically based on the parent’s extent (or the layout structure had to be changed so constraints become real).**

That’s the dividing line. Agents are strong at exploring solutions once the _problem is framed correctly._ Humans are still better at recognizing _what kind of problem this is._

> [!TIP] Debug prompt that produced the best results
>
> **Prompt:** Don’t guess. Instrument it.
> Add debug logs to most critical regions that give us the most information.
> Then run the repro steps and summarize:
>
> - What code paths executed
> - Key variable values
> - Any surprising states
>
> Based on the evidence, propose the fix and implement it.

This turns debugging from “reasoning vibes” into evidence-driven iteration.


## Tests: Start Early or Pay Interest Forever

I learned this the hard way: asking for tests late makes everything harder.

The reason is simple: cloud agents have finite “stamina.” They’ll make progress and stop. For example, I told a Codex agent to increase test coverage by 10% — it stopped after ~4% and needed another nudge.

If I were doing this again, I’d enforce the requirement for tests for every meaningful feature, a minimal test harness from day one and a "coverage debt list" that is maintained continuously and not as a catch-up project.

### The underrated point

Tests aren’t just about correctness. They’re a **control system for agents**.
A deterministic test suite gives the agent a target it can’t talk its way around.


## Use TDD for Debugging (Even If You Don’t Use TDD for Everything)

One of the highest-leverage instructions was forcing a Test-Driven Development (TDD) loop during bugfixes:

> [!TIP] TDD debugging prompt
>
> **Prompt:** Follow TDD for this bug:
>
> 1. Write a failing test that reproduces it
> 2. Verify the test fails for the right reason
> 3. Implement the smallest fix
> 4. Ensure the test passes
> 5. Refactor if needed
>
> Include the test name + what it proves.

It prevents “fix by rewrite” and gives you a lasting regression shield.


## “Create Logs” Is a Superpower — But You Must Ask For It

Agents often try to solve problems without collecting new data. Humans instinctively log, measure, and observe.

Once I made “add diagnostic logs” a default move, solve speed went up dramatically. The agent could parse huge logs, find patterns, correlate timing, and summarize the signal better than I could.

But you must also clean up.

> [!TIP] Post-debug cleanup prompt
>
> **Prompt:** Remove temporary debug logs added for investigation.
> Keep only logs that provide long-term operational value.
> Ensure logging levels are appropriate (Debug vs Info).
> Confirm the app output isn’t noisy in normal use.

Otherwise your app becomes a wall-of-text generator.


## Data Extraction: Agents Are Ridiculously Good at This

One of the biggest “wow” moments: giving the agent HTTP Archive (HAR) captures and asking it to infer request/response structure.

Copilot excelled at extracting relevant endpoints, reconstructing request formats, guessing plausible response shapes, and then integrating it into the app with error handling. I also used ChatGPT — the Web UI — to analyze long logs and produce a clean inventory of unique request and response pairs.

This is the sweet spot for agents: turning messy real-world artifacts into structured contracts and glue code.

> [!TIP] HAR/log analysis prompt
>
> **Prompt:** From this HAR/log, extract:
>
> - Unique endpoints + methods
> - Required request fields
> - Response schema (best effort)
> - Authentication/headers
> - Error patterns
>
> Present it as a concise API inventory.
> Then implement a typed client + integration points.

That’s a task humans _can_ do, but typically avoid because it’s tedious.


## UI Implementation: Better Than Expected, But Not a UX Designer

For UI work, the agents were surprisingly strong at turning descriptions or a template image into a working UI. Iterating on layout and styling via conversation worked well.

The main weaknesses were layout constraints and measurement issues, such as the ScrollView problem, subtle UX details (e.g. focus management and keyboard navigation), and consistent design system enforcement, unless it was explicitly provided in the prompt.

Put differently: agents are good implementers, not automatic product designers.


## Cost / ROI: Pro+ vs. Time Saved (and the “Learning Tax” I Didn’t Pay)

Upgrading to Copilot **Pro+**, mainly to reduce rate limits and reliably use stronger models like Opus, wasn’t free, but the ROI was obvious the moment the project moved past toy scale. The subscription cost is trivial compared to the time saved on two fronts: **delivery** and **learning**. On delivery, agents handled the repetitive grind, like wiring view models, building UI scaffolding, writing glue code, refactoring, and chewing through log analysis—work that would otherwise take hours per iteration. But the bigger win was the “learning tax” I largely avoided: I **didn’t know .NET or Avalonia** going into this, and the agents collapsed what would normally be weeks of ramp-up (framework patterns, idioms, pitfalls, and how-to’s) into a just-in-time loop of *implement → run → error → fix → repeat*. Even when debugging still required me to steer, I was steering at the **system/problem level**, not spending days reading docs to get to my first non-trivial feature. In practice, Pro+ didn’t just speed up coding—it **compressed the entire learning curve** into productive work.


## Task Tracking With Beads: The Missing “Memory” Layer

I started using [beads](https://github.com/steveyegge/beads) halfway through the project. It didn’t add much for in-IDE Copilot, but it helped a lot with cloud agents.
The key advantage: **a durable checklist** an agent can continue across sessions.
Instead of re-explaining a large objective, I could say: “Implement the next open tasks in beads.”

That’s huge when work spans days and multiple contexts.

## What I Believe Now

After shipping a full app this way, my conclusions are:

- **AI agents are a major productivity multiplier** for real software work.
- You still need humans for:
  - Architecture and system boundaries
  - Security and threat modeling
  - Scalability decisions
  - Product taste and UX judgement
  - Framing the hard debugging problems correctly
  - Coordination and communication

- The biggest unlocks are:
  - Early tests
  - Evidence-driven debugging
  - Explicit task tracking
  - Two-pass workflows (build → review)

When I talk to non-engineering friends, they often struggle with getting meaningful code results from ChatGPT. That doesn’t mean the tools are bad. It means the tools amplify engineering skill rather than replacing it.

I’ll keep using Copilot and Codex daily. The limit isn’t “can it code?”—it’s “can it maintain coherence, taste, and truth as the system gets complex?”

---

## Prompt Pack (Steal These)

**1) Vertical slice feature**

> Implement X end-to-end (UI → VM → services → persistence). Add minimal tests. Run tests. Summarize files touched.

**2) Evidence-first debugging**

> Don’t guess. Add debug logs at these points. Reproduce issue. Summarize evidence. Propose fix. Implement fix. Remove temporary logs.

**3) TDD bugfix**

> Write a failing test that reproduces the issue. Fix minimally until green. Confirm no regressions.

**4) Review mode**

> Do a self-review: list risky changes, check edge cases, run tests, tighten logging, and ensure UI matches intent. Write PR summary.

**5) Coverage grind**

> Increase coverage by ~3–5% in this area only. Prefer meaningful tests. Don’t snapshot test everything. Stop when green and summarize.

**6) Beads rules**

> Do not stop in the middle of a beads task, it will leave unfinished work. Continue until a task is finished. Update beads status.


> [!IMPORTANT] What are your thoughts on AI coding? 
> Do you see it as a threat? Do you see it as a boon? How well do these tools work for you, and most importantly, where do they reach their limit? Let me know in the comments!

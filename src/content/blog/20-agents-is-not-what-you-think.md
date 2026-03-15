---
title: 20 Agents Running at Once Is Not What You Think It Is
subtitle: Why multi-agent orchestration is about parallelizing a plan, not keeping robots busy
description: Why multi-agent orchestration is about parallelizing a plan, not keeping robots busy
pubDate: 2026-03-15
radio: false
video: false
toc: true
share: true
giscus: true
search: true
draft: false
---

I keep seeing the same reaction when people first hear about running 20+ AI agents in parallel: "Why would you need that many? What are they all doing? That sounds like busywork."

It's a fair question. And the answer is probably the opposite of what you'd expect.

## The Misconception: 20 Agents = 20x the Chaos

The mental image most people have is something like a room full of interns all typing furiously, bumping into each other, and producing mountains of code nobody asked for. If that's what multi-agent orchestration looked like, I'd be skeptical too.

But that's not the workflow. Not even close.

The goal is never to keep 20 agents busy at all times. That would be insane. The goal is: once you have a solid plan with well-defined subtasks, you can execute them in parallel instead of feeding them one-by-one into a single agent and waiting.

That's the whole insight. It's not about speed for the sake of speed. It's about not wasting time sequentially when the work is already scoped.

## You Still Need the Plan

Here's what hasn't changed from pre-AI software engineering, and I don't think it ever will:

You still need a roadmap. You still need to figure out how a feature should work, how it should look, what the edge cases are, and how it fits into the system. That's the hard part. That's the human part. No amount of agents changes that.

What changes is what happens *after* the thinking is done.

Let's say you have five features on your wishlist. In the old world — and by "old world" I mean three months ago — you'd sit down with one agent, work through one feature end-to-end, then move to the next. The agent is fast, sure, but *you* are the bottleneck because you can only steer one thing at a time.

Here's the workflow I've settled into instead:

1. **Batch the design work.** Take all five features and run "first draft of a design document" in parallel for each one. Five agents, five design docs, all running at the same time. You're not babysitting any of them.
2. **Pick one.** Read the design doc, refine it, make the hard decisions about scope and approach.
3. **Launch the agents.** Break it into subtasks, fire them off. They run, they produce, they finish.
4. **Switch to the next.** While agents are executing on feature one, you're polishing the design doc for feature two. When that's ready, launch those agents too.
5. **Repeat.**

The parallel execution isn't the magic. The magic is that your *thinking* and the *execution* are decoupled. You're always working on the highest-leverage thing — the design, the decisions, the judgment calls — while execution happens in the background.

## GasTown Is Orchestration, Not Acceleration of Nonsense

This is where [GasTown](/blog/gastown-intro) fits in, and I want to be precise about what it does and doesn't do.

GasTown helps you orchestrate parallel agent work. It tracks dependencies between tasks. It lets you define workflows where agent B starts only after agent A finishes. It gives you a dashboard so you can see what's running, what's blocked, and what's done.

What it does *not* do is make you faster at building useless stuff for the sake of keeping agents busy.

If your plan is bad, running it on 20 agents in parallel just gives you 20 bad outputs faster. GasTown doesn't fix your roadmap. It doesn't decide what to build. It doesn't replace the engineering judgment that turns a vague idea into a precise specification.

But if your plan is good — if you've done the thinking and defined clear, concrete subtasks — then GasTown is the difference between executing them over the course of a day, one after another, and executing them in an hour, all at once.

That's not a toy optimization. That's a fundamental change in how fast you can iterate on real work.

## The Dependency Graph Matters More Than the Parallelism

I glossed over something above that deserves its own section: dependency tracking.

The naive version of "run 20 agents" is just firing everything at once and hoping for the best. That works if every task is truly independent. But real software work almost never is. Your API client needs to exist before the integration tests can run. The database schema needs to be defined before the service layer can be built. The design tokens need to be agreed on before the UI components make sense.

This is where orchestration actually earns its keep. In GasTown, you define the dependency graph: agent C waits for agents A and B to finish, then starts automatically. Agent D depends on C. Agents E, F, and G are independent and run whenever they want.

That graph *is* the value. It's not "everything runs at once" — it's "everything runs as soon as it can, and nothing runs before it should." The system respects the natural order of the work while still maximizing parallelism within those constraints.

Without this, you're either running things sequentially to be safe (slow) or running things in parallel and hoping nothing steps on anything else (chaotic). The dependency graph gives you the third option: parallel execution with structural guarantees.

## When Agents Fail (and They Will)

Here's something the "20 agents go brrr" crowd doesn't talk about enough: failure.

When you're running one agent, failure is obvious. It stops, you read the error, you fix it. When you're running 20, failures get buried. Agent 15 hit a rate limit and retried itself into an infinite loop. Agent 12 was killed because the claude crashed. Agent 8 finished its work but it didn't make it to the merge queue.

This is a real problem, and it's the reason orchestration isn't optional at scale — it's required.

GasTown's recovery hooks and dashboard exist specifically for this. You can see which agents are stuck, which ones errored out, and how the merge queue is progressing. You can set up hooks that trigger when an agent fails — retry it, alert you, or mark the task for manual review. The mayor can manage all of these things for you and alert you to things that truly need your attention.

The honest truth is: the more agents you run in parallel, the more you need visibility into what they're doing. Running 20 agents without a dashboard is like deploying 20 microservices without monitoring. It works great until it doesn't, and when it doesn't, you have no idea where the fire is.

## The Cost Question

If you read my [previous post about writing 500k lines of code with AI](https://mmlac.com/blog/500k-loc-ai-lessons-learned/), you know I don't dodge the cost question.

Running 20 agents in parallel costs more than running one. Obviously. More API calls, more tokens, more compute. If you're on a usage-based plan, you'll see it in your bill.

But here's how I think about it: what's your hourly rate? What's the cost of a day spent doing sequentially what could have been done in two hours? If you're a solo founder, a day of your time is not free. If you're on a team, multiply that by headcount.

The parallel run might cost you $20–50 more in API usage. The sequential run might cost you four hours of calendar time you can't get back. For me, that math is obvious. But I also don't run 20 agents on speculative work. I run them on work I've already validated and scoped. The cost scales with the plan's quality — if you're running well-defined tasks, the token spend is predictable and the output is useful. If you're running vague prompts in parallel, you're just burning money 20x faster.

Treat agent compute like cloud compute: powerful when used deliberately, expensive when used carelessly.

## The Other Use Case: Parallel Reviews

Building features isn't the only thing that benefits from parallelism. Reviews do too, and honestly, this might be the more immediately practical use case for most teams.

Take security reviews as an example. You have a codebase. You want to check for injection vulnerabilities, auth bypass, insecure defaults, dependency risks, secrets in code, and a dozen other categories. A single agent doing all of this sequentially is going to take a while and probably lose coherence halfway through.

Instead: spin up multiple agents, each targeting a specific category or a specific part of the codebase. One agent focuses on SQL injection patterns. Another checks authentication flows. Another audits third-party dependencies. They all run at the same time.

The problem with this approach, without orchestration, is that you end up with a pile of disconnected findings. Agent 3 found something, agent 7 found something related, and you're the one manually piecing together the full picture.

This is where GasTown combined with beads makes a real difference. Every agent creates beads — structured records of what they found, where they found it, and what they recommend. When all agents finish, the Mayor (GasTown's coordinator) can summarize all created beads into a coherent report. You get the organized, complete picture without having to manually chase down each agent's output.

That's the kind of thing that turns "we should do a security review" from a multi-day project into something you can run on a Tuesday afternoon and have a full report by end of day.

## The Real Objection (and Why It's Wrong)

When people push back on multi-agent workflows, the underlying concern is usually: "This feels like premature optimization. I don't have enough work to justify 20 agents."

And they might be right — today. If you're building a side project or early prototype, a single agent in your IDE is probably fine. I'm not going to tell you to set up an orchestration layer for a todo app.

But the moment your project has:

- Multiple features in the pipeline
- A test suite that needs expanding
- A codebase that needs reviewing
- Documentation that needs updating
- Dependencies that need auditing

...you're already sitting on parallelizable work. You just haven't been thinking about it that way because, until recently, there was no practical way to execute it in parallel.

The shift isn't "more agents = more output." The shift is "plan well, then execute everything at once instead of everything in sequence."

## When You Should NOT Run Parallel Agents

I'd be doing you a disservice if I didn't talk about when this workflow is the wrong call.

**Exploratory prototyping.** When you don't know what you're building yet — when you're poking at an idea, trying different approaches, seeing what feels right — parallel agents are a waste. You need the tight feedback loop of one conversation, one agent, rapid iteration. The value of parallel execution comes *after* exploration, not during it.

**Ambiguous requirements.** If you can't write a clear one-paragraph spec for a task, it's not ready for parallel execution. An agent working from a vague prompt will confidently build the wrong thing. Twenty agents working from vague prompts will confidently build twenty wrong things. Do the thinking first.

**Deep debugging.** When you're chasing a gnarly bug that requires understanding system behavior, reading logs, forming hypotheses, and testing them — that's inherently serial, interactive work. You need to be in the loop on every step. Parallelism doesn't help when the problem is understanding, not throughput.

**Early architecture decisions.** The foundational choices — what framework, what data model, what boundaries between components — need focused, singular attention. Running five agents to explore five architectures sounds smart but usually produces five superficially different approaches that all miss the real constraint you haven't identified yet.

The pattern is simple: use parallel agents for execution, not for thinking. If the work requires judgment, exploration, or tight human-in-the-loop iteration, keep it serial. If the work is well-defined and the decisions are already made, parallelize it.

## What I'd Tell You to Try

If you're skeptical — good. Try this:

1. Pick three things on your backlog right now.
2. Write a one-paragraph spec for each one. Not perfect, just clear enough that you could explain it to a junior dev.
3. Run all three as parallel agent tasks. Use GasTown, or don't — the point is the workflow, not the tool.
4. Compare how long it took versus doing them sequentially.

That's it. The value either shows up or it doesn't. I'm not trying to sell you on a concept. I'm telling you what changed my own workflow after writing 500k lines of code with AI agents and realizing the bottleneck was never the agent's typing speed — it was the serial execution of work that didn't need to be serial.

The agents are fast enough. The question is whether your workflow lets them be.

---

## Prompt Pack (Steal These)

**1) First draft design document**

> You are a senior software engineer. Write a first-draft design document for the following feature: [description].
>
> Include:
> - Problem statement (1-2 sentences)
> - Proposed approach
> - Key components and their responsibilities
> - Data model changes (if any)
> - API surface (if any)
> - Edge cases and open questions
> - Rough task breakdown (what could be implemented independently?)
>
> Keep it concise. Flag uncertainties instead of guessing. This is a starting point for human review, not a final spec.

**2) Parallel security review (per-agent)**

> You are reviewing this codebase for [specific category: e.g., SQL injection / auth bypass / secrets in code / insecure defaults].
> Focus only on this category. For every finding, create a bead with:
> - File and line number
> - Description of the issue
> - Severity (critical / high / medium / low)
> - Recommended fix
>
> Do not fix anything. Report only. Be thorough but avoid false positives.

**3) Subtask creation (post-design)**
> Create detailed implementation beads for the subtask [subtask description].
> Create one bead per task and provide detailed description and acceptance criteria.
> Follow existing project conventions, require tests and require not modying code
> outside of the relevant scope of this subtask.
> Wire up dependencies between beads.
> Then sling the beads, up to X at a time. Check every three minutes on the status and merge, top-up to X when there is space.

Start with X = 4 beads at a time and see how your hardware handles it. It varies from project to project.

**4) Subtask execution**

> Implement the following subtask from the design document: [subtask description].
> - Follow existing project conventions
> - Add tests for core functionality
> - Run relevant tests and fix failures
> - Do not modify code outside the scope of this subtask
> - Create a bead summarizing what you implemented and what files you touched


**5) Mayor summary (post-parallel-run)**

> Summarize all beads finished during this workflow run.
> Group findings by category/feature.
> Highlight blockers, conflicts between agents, and items requiring human review.
> Produce a concise status report.

---

What's your experience with multi-agent workflows? Are you running things in parallel, or still doing one-at-a-time? I'm curious where people are hitting limits — let me know in the comments.

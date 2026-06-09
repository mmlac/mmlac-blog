---
title: Local AI Is Not Ready for Coding. Yet?
subtitle: I gave the most powerful model that fits on a maxed-out MacBook the keys to our agent harness. It made real tool calls — then drowned in the paperwork.
description: A field report on running local LLMs (Devstral 24B, Qwen3.5 122B) as autonomous coding agents inside a multi-agent harness — what worked, what broke, and the hardware wall behind it all.
pubDate: 2026-06-09
radio: false
video: false
toc: true
share: true
giscus: true
search: true
ogImage: true
draft: true
---

In the [GasTown post](/blog/gastown-intro) I made a throwaway claim: your worker agents — the *polecats* that actually write the code — don't need your strongest model. Run them on Sonnet, not Opus, and your API bill stops looking like a car payment.

That got me thinking about the obvious next step. If a polecat is just a scoped worker that picks up a task and implements it, why pay for an API at all? Why not run it on a model **on my own machine**? No per-token bill, no rate limits, no data leaving the building. For a fleet of workers that spin up dozens of times a day, "free and private" is a very loud pitch.

So I tested it. Properly — not "ask a local model to write fizzbuzz," but *drop a local model into our real production harness and tell it to go do a job*, exactly like the cloud agents do.

The short version: the model that fits on your laptop can't carry the job, and the model that can carry the job doesn't fit on your laptop. The longer version is more interesting, because the local models were both **more** and **less** capable than I expected — sometimes in the same sentence.

## The Setup

I wanted a fair fight, so I gave the local models the exact same harness the cloud agents use.

- **Machine:** a maxed-out MacBook Pro — M5 Max, 48-core GPU, **128 GB unified memory**. This is as much model as consumer hardware will hold.
- **Serving:** [Ollama](https://ollama.com) on the host, exposed over its OpenAI-compatible API, driven by the [opencode](https://github.com/anomalyco/opencode) harness so the agent gets real tools: `bash`, `read`, `write`, `edit`, `grep`.
- **The two contestants:**
  - **Devstral 24B** — a dedicated local *coding* model (~25 GB at Q8). Small, fast, purpose-built.
  - **Qwen3.5 122B-a10b** — a 122-billion-parameter mixture-of-experts (~10B active), ~81 GB in memory at Q4. **The most capable model I can physically load on this machine.** When people say "run a frontier model locally," this is roughly the ceiling of what that means on a laptop.
- **The harness:** GasCity, the production successor to the GasTown setup I wrote about earlier. Same mental model — a Mayor that plans, *polecats* that implement, a Reviewer, a Refinery that merges. Work flows as *beads* (tasks) bundled into *convoys*, and a polecat runs a *formula* (a multi-step workflow) to take a task from "assigned" to "merged."

The task itself was deliberately trivial: **"Create a file with one line of specific text."** If a model can't do that, nothing else matters. If it can, we learn *where* the wheels come off.

> [!NOTE] The control group
> Before judging the local models, I ran the identical task through a **Claude Sonnet** polecat. It sailed through the whole pipeline — created the file, committed it, handed off to the Reviewer, got merged to `main`, closed the bead. No drama. That matters: it proves the harness, the dispatch, and the task are all sound. Everything that follows is the *model's* contribution, not a broken setup.

## Devstral (24B): Eager, Capable, and Can't Spell

Handed our full agent onboarding prompt — about 25 KB of role, rules, and protocol — Devstral did something I didn't expect. It **introduced itself.**

> *"I'm here to assist you with software engineering tasks. To get started, please let me know what you need help with."*

Zero tool calls. It read 15,000 tokens of "you are an autonomous worker, here is how to find and execute your assigned task," and concluded that the correct move was to wait politely for instructions. A frontier model treats that same prompt as a starting gun; Devstral treated it as a company handbook.

But here's the twist that makes "local AI isn't ready" too glib: when I stripped the ceremony and gave it a **direct, explicit** instruction — *"create this file, use your write tool, then run `ls`"* — it just did it. Tool call, file written, verified. About three times out of four. The capability is real; it only shows up when the ask is concrete.

And then, on the trivial task, it did this:

> [!WARNING] The model that renamed the deliverable
> I asked for a file named **`MINSTRAL.md`**. Devstral created **`minstrel.md`** — silently "corrected" my spelling and lowercased it — then explained, with total confidence, that this was fine *"since filenames are case-sensitive on Linux."*
>
> That justification is not just wrong, it's backwards. Case-sensitivity is *exactly* why `MINSTRAL.md` and `minstrel.md` are two different files. The model produced a plausible-sounding sentence to rationalize an error it didn't notice it was making. This is the local-model failure mode in miniature: confident, fluent, and subtly off — on a task with one requirement.

For glue code and scoped edits where you're checking the output anyway, a 24B coding model is genuinely useful. For anything you're not going to read line-by-line, that confidence-without-correctness is a tax you pay later.

## Qwen3.5 (122B): Genuinely Agentic — and Genuinely Lost

The 122B model is a different animal, and this is the result that surprised me most.

Handed the **same** full onboarding prompt that made Devstral freeze, Qwen **self-started.** It ran the work-discovery command on its own, found its assigned bead, claimed it atomically, checked its mailbox, and read the workflow definition — fourteen real, correctly-formed tool calls in sequence. This is not a model that "can't use tools." It understood it was an autonomous agent in a system and started operating the system.

Then it never wrote a single line of code.

It spent **every remaining turn** spelunking. Inspecting the convoy. Reading the convoy's children. Dumping metadata. Checking dependencies on three different beads. Re-reading the workflow. Eighteen minutes of impeccable, purposeful-looking tool calls, and the actual task — *write one line to a file* — never happened. It got lost in the cartography of our system and forgot there was territory to cover.

I confirmed it wasn't a context-window problem: it ingested the full ~15k-token prompt without truncation and *chose* to explore. The complexity didn't overflow the model; it *captured* it.

> [!IMPORTANT] The real finding
> Our harness wasn't too complex for the **model's intelligence** — Qwen is plenty intelligent. It was too complex for the model's **executive function.** A frontier model holds "I am here to do ONE small thing" as an anchor while it navigates ceremony. The 122B local model let the ceremony *become* the task. That's the line, and it's not the line I expected to find.

## The Fix: We Had to Strip the System to the Studs

If complexity was the captor, the obvious experiment was to remove it. So I built a "local edition" of the worker: I cut the 25 KB onboarding prompt down to about 40 lines, and collapsed the seven-step workflow (load context → record pool → set up worktree → preflight → implement → self-review → submit) into **two** steps: *do the thing*, then *hand it off.*

Qwen, on the slim setup, **reached the task and created the file with the exact right content.** From "18 minutes, zero files" to "done" — purely by deleting instructions. That is a genuinely hopeful result.

But the tail was long. It first stopped the instant the file existed — declaring victory before committing or handing off — so I had to make the prompt scream that *"done" means committed and submitted, not "file written."* On the next run it actually ran the full sequence... and then tripped over a configuration bug on **my** side (the test repo had a branch-name mismatch and no remote), which it handled by improvising a throwaway git repo and pushing into the void. Some of that was my fault, not the model's. But the deeper point stands: a frontier agent would have *noticed* the git error and recovered. The local model barreled past it confidently — the same failure mode as `minstrel.md`, just with `git init` instead of a filename.

The lesson isn't "it can't be done." It's that **every layer of abstraction you love about your agent platform is a layer the local model has to pay for in executive budget it doesn't have.** You can get there — by stripping the platform back down to almost nothing, which is most of what the platform was *for.*

## The Hardware Wall

Here's the part that turns "interesting" into "not yet."

Everything above was the **most powerful model I can run on a $5,000 laptop**, and it still couldn't autonomously drive the harness. The natural response is "so use a bigger, smarter open model" — the genuinely frontier-competitive open weights like **DeepSeek-V3** (671B) or **GLM-4.6** (~355B). And you can! You just can't do it on consumer hardware.

DeepSeek-V3 is roughly **400 GB** quantized to 4-bit, ~750 GB at full precision. To serve it properly you want around **1 TB of GPU memory**, which in practice means an **8× NVIDIA H200 node** (1,152 GB of VRAM, comfortably enough).

What that costs, mid-2026:

- **To buy:** an 8×H200 server / DGX-class box runs **~$300,000 to $500,000+** once you add CPUs, networking, NVMe, and cooling. The GPUs alone are ~$35–40K *each.*
- **To rent:** roughly **$25–35 per hour** for an 8-GPU node on-demand — call it **~$20,000 a month** if you keep it warm the way an always-on agent fleet needs.

So the bill to run a model that can *actually* drive an autonomous coding harness is somewhere between "a luxury car every month" and "a house." Set against that, a hosted frontier API — billed per token, zero idle cost, someone else eating the DRAM shortage — stops looking like the expensive option and starts looking like the *adult* one.

> [!NOTE] The Apple-silicon footnote
> Yes, you *can* load a 671B model on a single 512 GB M3 Ultra Mac Studio — it was the one consumer box that could hold it, at around **$10,000**. Two catches. First, Apple **pulled the 512 GB tier in March 2026** amid the global DRAM squeeze, so you can't even buy it now. Second, even when you could: ~6 tokens/second, and a **~14-minute wait just to ingest an 8,000-token prompt** before it emits a single output token. Our agent's onboarding prompt alone was ~15,000 tokens. An agentic loop is dozens of those round-trips. The math doesn't close.

That's the whole thesis in one frame: **the model that fits on your desk can't carry the work, and the model that can carry the work needs a data center.** The middle ground — frontier capability at consumer cost and consumer latency — doesn't exist today.

## What I Believe Now

After actually running this, here's where I land — and it's not "local AI is a toy," because that's not what I saw.

- **Local models are genuinely capable** at scoped, well-framed, single-shot work. Devstral writes glue code; Qwen makes real, correct tool calls and self-starts. If your use case is "private autocomplete and bounded edits I'm going to review anyway," local is *already* good enough, and the privacy and zero-marginal-cost story is real.
- **Local models are not ready to be autonomous agents** in a complex system. They lack the executive function to stay anchored to a goal while navigating operational ceremony, and they fail *confidently* — the wrong filename, the wrong git recovery, the plausible-but-false justification. In an unattended loop, confident-and-wrong is the expensive kind of wrong.
- **The harness has to meet them halfway.** The single biggest unlock wasn't a better model — it was a *simpler system.* If you want local workers, design a deliberately dumb, flat, push-the-task-at-them workflow. Everything elegant about your orchestration layer is friction to a model running on executive fumes.
- **The hardware curve is the real gate.** This is why it's "yet." Small models are getting smarter every quarter, harnesses can be simplified, and one day the 100B-class model on your laptop *will* have the executive function the 122B one is missing today. But right now, the capable open models need $300K of NVIDIA or a data-center lease, and that math beats "just call the API" for almost everyone.

When non-engineers can't get good code out of a chatbot, it doesn't mean the tools are bad — it means the tools amplify the operator. Local agentic coding is the same story, one level deeper: it amplifies not just your engineering skill but your **systems design.** Give a local model a clean, narrow, well-lit path and it'll walk it. Give it your beautiful, abstract, production orchestration layer and it'll admire the architecture until it runs out of time.

Not ready. But the "yet" is doing real work in that sentence — and I'd bet on it shrinking fast.

> [!TIP] If you want to try this yourself
> - Start with a **dedicated coding model** (Devstral-class) for scoped edits before reaching for a giant generalist.
> - Give it **explicit, concrete instructions** — local models are far worse at inferring the task from context than at executing a stated one.
> - **Radically simplify** any agent workflow you hand it. Two steps, not seven. Push the task in; don't make it go discover the task.
> - Keep a human (or a frontier model) on the **review** pass. The failure mode is confident-and-subtly-wrong, which is exactly what review catches.

---

> [!IMPORTANT] Where do you draw the local-vs-cloud line?
> Have you run local models as real agents — not just chat? Where did they surprise you, and where did they fall over? And is "free and private" worth the executive-function tax for your workload? Tell me in the comments.

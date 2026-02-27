---
title: The Honest AI Tier List for Business Leaders
subtitle: What Block's 4,000 layoffs tell you about where AI actually works — and where it still burns you 
description: What Block's 4,000 layoffs tell you about where AI actually works — and where it still burns you 
pubDate: 2026-02-27
radio: false
video: false
toc: true
share: true
giscus: true
search: true
draft: false

---


## The Problem With AI Coverage

Yesterday, Jack Dorsey [announced he was cutting over 4,000 people from Block](https://www.cnbc.com/2026/02/26/block-laying-off-about-4000-employees-nearly-half-of-its-workforce.html) — nearly half the company's workforce — and was explicit about why: "intelligence tools" can now "do more and do it better." Block's stock surged 24% in after-hours trading. The company reported $10.36 billion in gross profit for 2025, raised its 2026 guidance, and then cut half the team that produced those numbers. In his X post, Dorsey didn't soften the broader implication: "I believe the majority of companies will reach the same conclusion and make similar changes."

That's not a vendor announcement. That's a CEO with 10,000 employees, strong financials, and no financial pressure to cut, choosing to cut anyway because the math changed.

So now you're reading this. Maybe you're a business leader trying to figure out what this means for your org. Maybe you're a manager wondering whether your function is next. Maybe you're just trying to cut through the noise to understand what AI actually does well — because clearly *something* is happening, but the coverage gives you either breathless boosterism or reflexive dismissal, and neither helps you make a decision.

That's what this is for.

I've spent the last year running real AI workloads — writing [500k lines of production code with AI agents](https://mmlac.com/blog/500k-loc-ai-lessons-learned/), building document pipelines, watching customer support bots succeed and hallucinate catastrophically, and reading every serious research paper I could find. The Block news didn't surprise me. Parts of what AI can do are genuinely, reliably excellent. Other parts are being sold hard without delivering. The gap between those two categories is where fortunes — and careers — are currently being made and lost.

This isn't about benchmarks. Benchmarks are a vendor's marketing budget expressed as a number. This is a tier list of what actually works in production, what needs scaffolding to work, and what will burn you if you deploy it on the strength of a demo.

---

## How to Read This List

**S-Tier** = Deploy now, measure results, scale confidently.  
**A-Tier** = Deploy with setup investment; it pays off, but only if you build it right.  
**B-Tier** = Useful, but keep a human in the loop. Don't promise the board a headcount reduction.  
**C-Tier** = Vendors are selling it hard. Reality is soft.  
**F-Tier** = Active risk. You won't just fail to get ROI — you'll create new problems.

One ground rule: I'm talking about *business deployment*, not personal productivity. Using Claude or ChatGPT to help you draft an email is fine and worth zero analysis. I'm talking about workflows you'd put in a board deck, a budget line, or an org chart.

---

## S-Tier: Genuinely, Reliably Excellent

### Code Generation and Pair Programming

This is the clearest win in AI right now, and I say that having lived it. Developers using AI assistants are completing around [20–40% more tasks per sprint, touching nearly 50% more pull requests per day](https://www.index.dev/blog/ai-coding-assistants-roi-productivity). For new codebases, or for experienced engineers working outside their primary stack, the multiplier is even higher.

The reason it works is structural: code has ground truth. Either it compiles and the tests pass, or it doesn't. You cannot confabulate your way through a failing test suite. That feedback loop turns AI from a probabilistic text generator into something that resembles a very fast, very patient pair programmer.

Where it *really* earns the S-Tier is agentic coding. Not autocomplete — full agents that take a feature description, implement it end-to-end across UI, service layer, and tests, then run those tests and fix failures. The workflow is: describe → delegate → review output → paste errors → repeat. That's delegation, not prompting. Once you understand the difference, the productivity shift is hard to unsee.

**The real caveat**: this works for developers who already know their craft. The [METR randomized controlled trial from mid-2025](https://www.businessinsider.com/ai-coding-tools-may-decrease-productivity-experienced-software-engineers-study-2025-7) found that experienced developers working on codebases they knew *intimately* took 19% *longer* with AI tools. The tools amplify skill — they don't manufacture it. Junior developers writing more code faster is not automatically a good outcome if a senior engineer can't review what's been produced.

> **Prompt that reliably works:**
> Implement this feature end-to-end: [description]. Follow best practices and separation of concerns. Add error handling and logging. Write tests for core functionality. Run tests and fix failures. Summarize what you changed and why.

### Document and Data Extraction

If your business still has humans reading PDFs, processing invoices, extracting fields from contracts, or parsing API responses from HAR files — AI handles this better than humans at a fraction of the cost.

We're talking about real numbers: [invoice processing dropping from 48 hours to 4 hours](https://www.v7labs.com/blog/ai-agents-examples), [per-inquiry costs falling from \$6–8 to \$1–2](https://www.chat-data.com/blog/ai-customer-support-roi-measurement-framework-2025), three-way invoice matching (vendor, PO, receipt) that used to require accounts payable attention now running automatically. This is not a pilot. This is production-ready work that the technology does well because the task is structured, the inputs are bounded, and you can verify the output.

HAR analysis is a personal favorite. Give an AI agent a packet capture from your API calls and ask it to extract unique endpoints, reconstruct request schemas, identify auth headers, and generate a typed client. A task that used to take a senior engineer half a day becomes a prompt.

> **Prompt that reliably works:**
> From this document/HAR/log extract: unique endpoints and methods, required fields and data types, response schemas, error patterns. Present as a structured inventory. Then implement a typed integration.

### Customer Support Automation (Structured Queues)

The data here is unambiguous. [Bank of America's Erica has handled over 3 billion client interactions](https://www.scrumlaunch.com/blog/ai-in-business-2026-trends-use-cases-and-real-world-implementation). [Freshworks reports AI agents deflecting 45% of incoming queries in IT and software support. First Response Time improving by 42%, Resolution Time by 35%.](https://www.freshworks.com/How-AI-is-unlocking-ROI-in-customer-service/) These aren't projections — they're production numbers from organizations with real SLAs.

The pattern that works: AI handles tier-1 volume (order status, basic troubleshooting, FAQ, account info), sentiment analysis routes frustrated customers to humans, and agents focus on complex cases where judgment actually matters. The hybrid model consistently outperforms both pure AI and pure human approaches.

**What doesn't work**: deploying a chatbot with access to your entire messy SharePoint folder and calling it done. Hallucinations in customer support bots are not a model problem, they're a data quality problem. Contradictory pricing documents, outdated HR policies, stale product specs — the AI tries to reconcile them and produces confident nonsense. Garbage in, garbage out is still the law.

---

## A-Tier: Very Good With the Right Scaffolding

### Research Synthesis and Competitive Intelligence

AI is genuinely useful for turning large volumes of unstructured information into structured analysis. Feed it 50 earnings transcripts and ask for a competitive positioning summary — it will produce something a junior analyst would have taken two weeks to approximate. The synthesis quality is high because the task plays to the model's strengths: pattern recognition across text at volume.

The failure mode is asking it to *find* facts rather than *synthesize* facts you've already gathered. Research that relies on AI to locate primary sources will hallucinate citations. Research that uses AI to process primary sources you've already pulled is a different story.

### Internal Knowledge Search (RAG Done Right)

Retrieval-Augmented Generation — connecting a model to your internal documents and databases — is the most impactful enterprise AI pattern right now. When built properly, it turns your knowledge base into a queryable assistant. Engineers onboard faster. Sales reps pull accurate product specs. Support agents find policy answers in seconds rather than minutes.

"Built properly" is the load-bearing phrase here. The leading cause of RAG failures is not model quality — [95% of AI inaccuracies in a study of 1,800 interactions traced back to fixable problems in system design, knowledge management, and retrieval configuration, not fundamental model limitations](https://ai4sp.org/ai-hallucinations-not-just-a-tech-problem/). You need clean, deduplicated, current source data. You need retrieval that actually returns the right documents. You need a "context engineer" — a role that barely existed two years ago — who curates and maintains the knowledge base. The model is the easy part.

### Content and Marketing Operations

AI is excellent at the work marketers hate most: the first draft, the tenth variation, the format adaptation, the SEO rewrite. [Content creation is seeing 46% faster production in organizations that have deployed it properly.](https://cloud.google.com/transform/roi-of-ai-how-agents-help-business) That's real leverage — not because AI replaces creative direction, but because it removes the blank-page friction and the mechanical production work.

The mistake companies make is deploying AI for content and calling the output done. Brand voice takes active maintenance. Positioning nuance doesn't transfer automatically from a model that has never attended a product review meeting. Treat AI as an accelerant for human creatives, not a replacement for them, and the ROI is very strong.

### Meeting Summarization and Action Items

This is undersold relative to how reliably it works. Transcription-to-summary pipelines with LLM processing turn a 60-minute meeting into structured action items, owners, and decisions in under 30 seconds. The cost is low, the setup is minimal, and the organizational value — actually capturing what was decided in that 47-person all-hands — is high.

It works because the task is bounded: summarize this specific text, extract these specific elements. No hallucination risk because you're synthesizing content that already exists in the transcript.

---

## B-Tier: Works, But Needs a Babysitter

### Agentic Workflows Across Systems

"Agents that automate entire workflows" is the hottest promise in enterprise AI right now. [By 2026, up to 40% of enterprise applications are projected to integrate task-specific AI agents.](https://www.scrumlaunch.com/blog/ai-in-business-2026-trends-use-cases-and-real-world-implementation) The vendors aren't lying about the capability — they're lying about the reliability.

Agents are genuinely impressive when the workflow is well-defined, the APIs are stable, and the failure modes are recoverable. Give an agent a CRM, a spreadsheet, and a set of emails and ask it to update pipeline status — it can do that. Ask it to handle something with ambiguous business rules, edge cases, or downstream consequences, and you'll spend more time cleaning up after it than you saved.

The right framing: treat agents like fast, tireless junior employees who need explicit task definitions, clear success criteria, and a human reviewer for anything that touches the customer or the books. The two-pass workflow — build, then self-review — is not optional. It is the product.

> **Two-pass workflow prompt:**
> Complete the task. Then do a self-review: list risky changes, check edge cases, verify outputs match intent, and summarize what was done and what should be manually verified.

### Code Debugging in Complex Legacy Codebases

Agents can debug impressively when you give them the right inputs: stack traces, reproduction steps, expected versus actual behavior, and permission to instrument first. The failure mode is asking them to debug through reasoning alone on a codebase they've never seen with insufficient telemetry.

The [ScrollView problem](/blog/500k-loc-ai-lessons-learned#example-the-scrollview-problem-that-forced-me-to-intervene) is the archetype. The agent tries fifteen plausible approaches, none of which address the real cause, because the real cause is a conceptual understanding of how layout constraints propagate — not a syntax fix. The model explores the solution space; you still have to define the problem space correctly.

Once you frame the problem correctly, debugging becomes mechanical. The model is faster than a human at instrumentation, log parsing, and pattern recognition across a call stack. The human value is knowing what kind of problem you're actually facing.

### First-Draft Strategy Documents

AI will produce a competent, plausible, well-structured strategy document from a brief. It will also produce one that sounds authoritative and is quietly missing three crucial things: institutional context it doesn't have, competitive nuance that requires judgment not pattern-matching, and the specific political constraints that make a strategy executable in your organization.

Use AI drafts to move fast and set structure. Expect to do serious substantive editing. The danger isn't bad output — it's convincing output that gets approved before a human who actually knows the context has properly reviewed it.

---

## C-Tier: Hype Vastly Exceeds Reality

### Replacing Legal and Financial Analysis

[Stanford researchers measured general-purpose chatbot hallucination rates on legal questions at 58–88%.](https://www.deloitte.com/ch/en/services/consulting/perspectives/ai-hallucinations-new-risk-m-a.html) Even domain-specific legal AI tools — the ones purpose-built for this — [still hallucinated in 17–34% of cases](https://www.knostic.ai/blog/ai-hallucinations), particularly when citing sources and agreeing with incorrect premises. In 2025, attorneys across the US filed court documents with AI-generated cases that didn't exist. Judges fined them.

This isn't a model version problem. It's a structural problem: legal reasoning requires citation of specific authorities, and AI systems are architecturally incentivized to produce fluent, confident text rather than admit uncertainty. [OpenAI's own research established that hallucinations are mathematically inevitable](https://www.computerworld.com/article/4059383/openai-admits-ai-hallucinations-are-mathematically-inevitable-not-just-engineering-flaws.html) — not an engineering failure, but a consequence of how language models are trained. In domains where a 1% error rate can mean a losing case or a regulatory fine, "generally pretty accurate" is not good enough.

AI is genuinely useful for legal *research acceleration* — surfacing relevant areas, summarizing case law you've already pulled, drafting initial agreements that humans will heavily redline. It is not a replacement for a lawyer who will put their bar license behind the analysis.

### Open-Ended Market Research

"Use AI to research our market and tell us who to target" sounds reasonable. In practice, the model will construct a plausible, well-formatted analysis drawing on patterns from its training data — which may be 12–18 months stale, may not include your specific market's primary sources, and will not tell you when it's guessing versus when it knows.

Bounded research tasks work well. Unbounded research tasks produce confident confabulation. The difference matters when you're making a go-to-market decision.

### Sales Relationship Automation

Enterprise customers can tell when they're talking to an AI. B2B sales, particularly for high-ACV deals, runs on relationships, trust, and reading the room. Automating outreach at scale with AI-generated personalization produces messages that are technically personalized and emotionally empty. Response rates in cold outreach are not improving from AI adoption — they're declining as inboxes fill with AI-generated noise and buyers develop filters for it.

AI is excellent for sales *support*: call prep, CRM hygiene, competitive battlecards, proposal drafting. It is not a substitute for a skilled human who can navigate a politically complex enterprise deal.

---

## F-Tier: Active Risk, Not Just Disappointment

### Autonomous Decisions in Regulated Domains

In [2024, 47% of enterprise AI users reported making at least one major business decision based on hallucinated content. 39% of AI-powered customer service bots were pulled back or reworked due to hallucination errors.](https://drainpipe.io/the-reality-of-ai-hallucinations-in-2025/)

Autonomous AI decision-making in healthcare, finance, legal, or regulatory contexts — without deterministic verification and human sign-off — is not a productivity tool. It's a liability generator. [The VW Cariad failure cost billions and hundreds of jobs](https://www.ninetwothree.co/blog/ai-fails), partly because the organization tried to automate too much simultaneously without adequate human oversight at the right points.

The governance principle that serious organizations are converging on: shift from prevention to risk containment. Human-in-the-loop is not a sign of AI immaturity — it's the architecture of a system that can be trusted.

### AI-Generated Citations Without Verification

The [Mata v. Avianca case in 2023](https://mitsloanedtech.mit.edu/ai/basics/addressing-ai-hallucinations-and-bias/) was the warning shot. Lawyers are still getting sanctioned for it in 2026. [ChatGPT fabricated roughly one in five academic citations in a Deakin University study. Half of its citations contained other significant errors.](https://mental.jmir.org/2025/1/e80371)

This is not a workflow you can make safe by adding "please be accurate" to the prompt. The structural incentive of a language model is to produce text that reads like a valid citation — not to know whether the citation is real. Verification is not a step you can skip. It is the product.

### Expecting Long-Term Coherence Without Structure

AI agents have no memory between sessions. Without explicit task tracking, state management, and clear continuation mechanisms, a multi-day agent workflow will lose coherence, redo work, or quietly get stuck. This is the missing "memory layer" that most enterprise deployments underestimate.

The solution is not a smarter model — it's process design. Persistent task lists that the agent can read and update. Session handoff prompts. [Beads](https://github.com/steveyegge/beads)-style tracking. The model is the execution engine; the structure is your job.

---

## The Model Question: Does It Actually Matter Which One?

Three years ago, the model choice was high-stakes. Today, the flagship proprietary models — Claude Opus, GPT-5, Gemini Pro — have converged to the point where quality differences are marginal for most business tasks. The meaningful differentiation is now in the edges:

**Claude Opus** leads on complex text analysis, long-context coherence, and nuanced reasoning. For agentic coding where the model needs to stay oriented across a large codebase, context window size matters more than raw benchmark scores.

**GPT-5** integrates most naturally with the Microsoft stack. If you're in a Microsoft-heavy enterprise, that integration tax is real and worth respecting.

**Gemini Pro** leads on multimodal tasks and can process entire code repositories in a single context. For use cases involving video, images, or very large document sets, it's genuinely ahead.

The more important question is model *routing*, not model selection. [A model-agnostic architecture that sends simple classification and extraction tasks to fast, cheap models (Haiku, Flash, Mini) and routes complex reasoning to flagship models cuts token costs by 40–60%](https://www.gosign.de/en/magazine/ai-models-comparison-2026/) compared to using the same model for everything. That cost optimization is often worth more than picking the "best" model and paying for it on every task.

Open-source is now genuinely production-ready for many enterprise scenarios. Llama 4 and Mistral Medium 3.1 handle document classification, summarization, and structured data extraction at near-flagship quality. For organizations with data sovereignty requirements or multi-tenant security constraints, self-hosted open-source is not a compromise — it's the right architecture.

---

## The Hallucination Problem Is Not Going Away

This needs to be said plainly: [OpenAI's own researchers established in 2025 that AI hallucinations are mathematically inevitable, not a temporary engineering problem.](https://www.computerworld.com/article/4059383/openai-admits-ai-hallucinations-are-mathematically-inevitable-not-just-engineering-flaws.html) The training methodology that makes models fluent also creates statistical pressure toward guessing confidently rather than admitting uncertainty. You cannot train this away, and the current benchmark ecosystem makes it worse by penalizing "I don't know" answers.

[The best-performing models now have hallucination rates under 1% on factual benchmarks.](https://drainpipe.io/the-reality-of-ai-hallucinations-in-2025/) That sounds reassuring until you run a million queries and realize 10,000 of them are wrong — confidently, fluently wrong. In customer-facing applications, in regulated industries, or anywhere that wrong information creates downstream costs, that rate matters.

The practical implication is that governance must shift from prevention to risk containment. Define what the AI is allowed to do autonomously. Define what requires human verification. Build the verification layer as a first-class part of the system, not an afterthought. The organizations that are winning with AI right now are the ones that treat "human in the loop" as an architectural principle, not a sign of distrust.

---

## 95% of Enterprise AI Projects Fail. Here's the Pattern.

[The MIT Media Lab's 2025 State of AI in Business report put the enterprise AI failure rate at 95%.](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf) That number needs context: it's not that AI doesn't work — it's that the *deployment model* is wrong.

[The share of companies abandoning most of their AI projects jumped to 42% in 2025, up from 17% the prior year.](https://www.spglobal.com/market-intelligence/en/news-insights/research/2025/10/generative-ai-shows-rapid-growth-but-yields-mixed-results) The cited reasons are consistent: cost and unclear value. What that actually means, translated: organizations deployed AI as a technology project instead of a business operations project, didn't define what "success" looked like in dollars or hours, didn't build the data infrastructure the AI needed to work well, and pulled the plug when the demo failed to transfer to production.

The failures follow a pattern:
- **Trying to do too much at once.** [VW's Cariad tried to replace 200 supplier relationships, build custom AI, and design proprietary silicon simultaneously. It ended in 1,600 job cuts and years of delayed vehicle launches.](https://www.ninetwothree.co/blog/ai-fails)
- **No clear success criteria.** "Let's see what AI can do" is not a success criterion. "Reduce invoice processing time from 48 hours to 4 hours" is.
- **Poor data quality.** The AI is only as good as what you feed it. Contradictory documents, stale pricing data, messy SharePoint folders — AI amplifies the mess.
- **No process change.** Faster code generation only shortens delivery when reviews and CI/CD move at the same speed. AI that produces 50% more code into a bottlenecked review process produces 0% more shipped features.

The organizations achieving real ROI share specific traits: they define concrete metrics before deploying, they start with one high-volume, well-defined use case, they build the data and governance infrastructure first, and they treat AI as an organizational capability requiring change management — not a software purchase. [74% of executives in Google's 2025 ROI of AI report achieved ROI within the first year of agent deployment.](https://cloud.google.com/transform/roi-of-ai-how-agents-help-business) But only among the organizations that deployed with intent, not hope.

---

## The Case Against Firing Everyone and Calling It a Strategy

Let's be honest about what the Block narrative is actually selling.

A company cuts 40% of its workforce, the stock pops 24%, and suddenly every board in the world is asking its CEO: "why haven't we done this?" That is a powerful social contagion. It is not a strategy. And before you let that contagion set your headcount agenda, it's worth asking a question nobody in the after-hours trading frenzy was asking: *what are you going to build with the people who are left?*

Because here is the thing about using AI to eliminate your workforce and then continuing to operate the same product, serve the same customers, and pursue the same market you have been in for the last five years: you have not used AI to get ahead. You have used AI to get leaner. Those are not the same thing. Getting leaner is a one-time event. Getting ahead is a compounding one.

**The productivity dividend has to go somewhere.**

If AI genuinely makes a team of 6,000 as productive as a team of 10,000 was, that is an extraordinary fact. But it raises a question that is more important than the headcount number: what are you doing with the capacity you just unlocked? The companies that will win the next decade are not the ones that banked the savings. They are the ones that immediately reinvested the freed capacity into building things they previously could not afford to build, moving into markets they previously could not afford to enter, and shipping products they previously could not staff.

Block's bet is that smaller teams plus AI tools equals the same output at lower cost. That is a defensible bet for a mature fintech company optimizing its margins. It is a terrible model for any company that needs to grow into new territory, because the institutional knowledge, customer relationships, domain expertise, and cross-functional trust that 4,000 people carried did not get compressed into an LLM when they walked out the door. It evaporated.

**What you actually have in your team that AI does not.**

There is a category of organizational knowledge that is genuinely irreplaceable and genuinely undervalued in every AI conversation I have ever heard. It is not the kind of knowledge that lives in documents. It is the kind that lives in people.

Your most experienced customer success manager knows which enterprise accounts are fragile, why they are fragile, and how to handle the specific executive at the specific company who will churn if she perceives that she is being handled rather than heard. That knowledge is not in your CRM. It is not recoverable from call transcripts. It is not something you can prompt your way to. The moment that person is gone, you are starting from scratch with that account, and the AI that replaced her will do an excellent job of sending the wrong message at exactly the wrong moment with great confidence.

Your engineers who have been in your codebase for five years carry the context of ten thousand decisions that never made it into a commit message: why that module is structured the way it is, which parts of the system are load-bearing and which are historical accidents, which vendor integrations have undocumented edge cases that will surface in production on a Friday afternoon. AI coding agents are genuinely excellent. They are also genuinely excellent at reproducing the architectural mistakes of the past at ten times the speed when there is no one present who remembers why those mistakes were mistakes.

**The alternative: redeploy, don't remove.**

The companies I find most interesting right now are not the ones cutting headcount. They are the ones asking a different question: *what could we build if our existing team had the leverage of AI tools they do not currently have?*

A team of ten salespeople who previously spent 60% of their time on CRM hygiene, call notes, and proposal drafting now has 60% of their time back. That time can be banked as headcount savings. Or it can be reinvested: more prospect calls, better strategic account management, new verticals they never had bandwidth to develop, deeper relationships with existing accounts. The former shows up as a better cost structure this quarter. The latter shows up as a better business in five years.

A product team that previously could ship two features a month with AI assistance can now ship six. You can respond to that by keeping your current roadmap and laying off two thirds of the team. Or you can respond by finally building the three product lines you have been deferring for years because you never had the capacity, and using that expansion to grow into the market segments your competitors are also not currently serving — because they are busy laying people off.

A finance team that previously spent three weeks on a quarterly close now closes in one. You can bank those two weeks as cost savings. Or you can use them to build the financial modeling and scenario planning capability your business has never had, so that when a market shift hits you have actual analytical infrastructure instead of a spreadsheet someone built in 2019.

This is not an argument against using AI. It is an argument against confusing *efficiency* for *strategy*. Efficiency is table stakes. It is what lets you survive in a competitive market. Strategy is what lets you win in one.

**The hidden cost that will not show up in Q2.**

There is a reason 95% of enterprise AI projects fail, and it is not the models. It is the people. Every serious AI deployment requires humans who understand the business context deeply enough to define what "good output" looks like, to catch the edge cases the model does not handle, to build the feedback loops that improve the system over time, and to maintain the institutional memory of why certain decisions were made. When you lay off half your organization, you do not just lose the roles. You lose the judgment.

The executives celebrating Block's stock pop are implicitly assuming that the remaining 6,000 employees carry all the necessary context, that customers will not notice the change in quality and responsiveness, that the institutional knowledge of the 4,000 was fungible and redundant, and that AI tools will fully compensate for the loss of human judgment in every domain where that judgment previously mattered. Some of those assumptions will prove correct. History suggests that all of them proving correct at once, across a company of that complexity, would be genuinely unprecedented.

**What I would actually do with the productivity dividend.**

If AI genuinely frees up 30–40% of your team's capacity, here is what that capacity could fund instead of a layoff announcement:

Expansion into adjacent markets you have been too thinly staffed to pursue. The top line opportunity for most companies is not cost reduction — it is the two or three market segments sitting right next to your core business that you have never had the bandwidth to properly attack.

Product lines that have been on the roadmap for three years without shipping. Every organization has them. The ideas that get deferred not because they are bad ideas but because the team is at capacity maintaining what already exists. AI changes that calculation.

Customer success at a depth you have never been able to afford. The difference between a customer who churns at renewal and one who expands is almost always relationship quality. If your CS team can now handle twice the accounts without burning out, that is a retention and expansion lever with compounding returns.

Internal capability building that creates moats. The companies that are genuinely ahead on AI right now are not the ones that bought the best tools. They are the ones that built internal expertise — prompt engineering, data pipeline architecture, evaluation frameworks, agent orchestration — that their competitors do not have and cannot easily acquire. That capability is built by people. People you retain, train, and invest in rather than replace.

**The honest version of what Dorsey got right.**

Block was genuinely overstaffed. The pandemic headcount expansion at tech companies was real, the correction is real, and some percentage of the 4,000 cuts reflects genuine redundancy rather than AI displacement. Dorsey is right that gradual cuts over years are more destructive to morale than a single honest decision. He is right that "intelligence tools paired with smaller, flatter teams" represent a structural shift worth moving on. He is right that leaders who pretend otherwise are just deferring a harder conversation.

But there is a difference between right-sizing a bloated organization and using AI as a justification for extracting short-term shareholder value at the cost of long-term organizational capability. The market rewarded the first reading of the Block announcement. In three years, we will know which one it actually was.

The leaders who will be worth following are the ones asking: *what do we build now that we have this capacity?* Not: *how do we capture this capacity as margin?*

The second question has an obvious, immediate answer. The first one requires imagination. That is precisely why it is harder, and precisely why the companies that pursue it will be significantly harder to compete with.

> **The question to ask your leadership team:**
> We have estimated that AI will free up X% of our team's capacity over the next 18 months. Here are three specific initiatives we have been deferring that this capacity could fund instead of headcount reduction. Which of these represents our highest-leverage growth opportunity?
>
> If you cannot answer that question, the problem is not your headcount. It is your strategy.

---

## What I Actually Believe Now

After a year of running real workloads:

**AI is a major productivity multiplier for work that is high-volume, structured, and verifiable.** Code, documents, customer support tickets, data extraction, content first drafts. The ROI is not speculative — it's measurable, and it's large.

**AI still requires humans for the things that have always required humans.** Architecture and system design. Judgment calls with downstream consequences. Political and organizational navigation. Creative strategy. Framing the hard problems correctly before delegation.

**The hallucination problem is structural, not temporary.** Build verification into your workflows. Do not deploy AI where confident-sounding wrong answers create unacceptable costs.

**The model choice matters less than the architecture.** Context, data quality, task decomposition, and human oversight checkpoints determine outcomes far more than which model you picked.

**The organizations that win with AI will not be the ones that replace humans most aggressively.** They'll be the ones that figure out which work genuinely benefits from AI execution and build the scaffolding to make that work reliably.

The limit isn't "can it do the task?" The limit is "can it maintain coherence, accuracy, and appropriate uncertainty as the task gets complex and the stakes get real?" That's the question worth asking.

---

## The Playbook (Steal This)

**1) Find a high-volume, structured, verifiable task**
> Invoice processing, support ticket triage, document extraction, test generation. These are S-Tier because outputs are checkable. Start here.

**2) Define success in dollars or hours before you start**
> "Reduce processing time from X to Y" or "deflect Z% of tier-1 tickets." Anything vaguer than this will produce an unfalsifiable pilot that nobody can justify scaling.

**3) Fix your data before you deploy the model**
> Contradictory documents, stale knowledge bases, and messy SharePoint folders will ruin an otherwise solid AI deployment. The model is not the problem. Your context engineer matters more than your model selection.

**4) Build the human review layer as a first-class component**
> Define what the AI can do autonomously, what requires human sign-off, and what it should refuse. Human-in-the-loop is not a concession — it's how you avoid the F-Tier failures.

**5) Treat coding and document processing as guaranteed wins**
> Deploy AI coding assistants for developers. Build document extraction pipelines for your ops team. Both are S-Tier with measurable ROI and low risk. Stop asking if AI is worth it and start measuring what these specific deployments return.

**6) Scale what works, kill what doesn't, fast**
> The 90-120 day mark is when you have enough production data to know if a deployment is delivering. Organizations that achieve strong ROI review metrics weekly and adjust continuously. Organizations that fail set up a pilot and wait for something to happen.

---

What's working for you, and where have you hit the ceiling? The gap between the tier list and your reality is where the most interesting conversations happen. Let me know in the comments.

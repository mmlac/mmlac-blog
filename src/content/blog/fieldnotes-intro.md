---
title: Fieldnotes — A Personal Knowledge Graph
subtitle: Why I spent weeks building Fieldnotes — a local-first knowledge graph that indexes your files, emails, tasks, and notes so you can query your own data with an LLM
description: Why I spent weeks building Fieldnotes — a local-first knowledge graph that indexes your files, emails, tasks, and notes so you can query your own data with an LLM
pubDate: 2026-04-15
toc: true
share: true
giscus: true
search: true
draft: false
---

I wanted one thing: to ask an LLM a question about *my* stuff — my tasks, my emails, my calendar, my Obsidian notes — and get an answer grounded in reality, not hallucinated from training data. That's it. That's the whole motivation.

The problem is that doing this with any cloud LLM means uploading your entire digital life to a third party. Every email thread, every half-baked project note, every task with a client's name in it. And sure, Anthropic and OpenAI will tell you they don't train on your data. I believe them. But they still *get* the data. It still traverses their infrastructure, gets logged somewhere, sits in a context window on a server you don't control. For a single question about a public API? Fine. For a comprehensive index of everything I know and do? No.

So I built [Fieldnotes](https://github.com/mmlac/fieldnotes).

## What Fieldnotes Actually Is

Fieldnotes is a personal knowledge graph that continuously indexes your digital life — local files, Obsidian vaults, email threads, git repositories, OmniFocus tasks, calendar events, even your installed applications — and exposes that knowledge as structured context for LLM agents. It combines a property graph (Neo4j) for relationship traversal with a vector store (Qdrant) for semantic retrieval, and serves it all over the Model Context Protocol so any compatible AI assistant can query everything you know.

The short version: it watches your stuff, builds a graph of entities and relationships, embeds everything for semantic search, and lets you ask questions — either through a CLI, through MCP in Claude Desktop, or through direct graph queries. All of it can run on local models. All of it stays on your machine.

## The Architecture: Why a Dual-Database Design

Early on I had to make a decision: vector database or graph database? The answer turned out to be both, and for good reason.

A vector store (Qdrant) is great at "find me things semantically similar to this query." You embed your documents, embed your question, do a cosine similarity search, and you get relevant chunks. That's your classic RAG pipeline, and it works well for broad, fuzzy questions like "what do I know about Kubernetes?"

A property graph (Neo4j) is great at "how are these things connected?" Who sent that email? What project does this task belong to? Which notes reference the same person as that calendar event? These are relationship queries, and vector search doesn't help you here. You need edges, labels, and traversal.

Fieldnotes uses both. When you search, it runs a hybrid query — vector similarity for semantic relevance, graph traversal for structural context — and merges the results. When you ask a question, it retrieves context from both stores, hands it to an LLM, and synthesizes an answer. The `ask` tool even supports a conversational REPL with follow-up question reformulation, so you can drill into a topic without re-explaining context every time.

The graph also gives you things that pure vector search can't: entity resolution across sources (more on that below), cross-source connections, and topic discovery. It's the connective tissue that turns a pile of embeddings into an actual knowledge base.

## Local and Cloud LLM Support

Fieldnotes uses a three-layer model configuration: providers, models, and roles.

**Providers** are your API connections — Ollama for local inference, OpenAI, Anthropic, or whatever else you run. **Models** are specific model+provider pairs — like `nomic-embed-text` on Ollama, or `gpt-4o` on OpenAI. **Roles** bind pipeline stages to models — which model handles embeddings, which handles entity extraction, which handles your queries.

This means you can mix and match. Run embeddings locally on `nomic-embed-text` because it's fast and the quality is good enough. Run entity extraction on a local `llama3.2` because you don't want your document contents leaving your machine. But maybe route your final query synthesis to Claude when you need a higher-quality answer and the question itself isn't sensitive.

Or run everything locally. That's the default configuration, and it's what I do for most of my indexing. The role system just gives you the flexibility to make different tradeoffs for different stages of the pipeline.

## MCP: Making Your Knowledge Graph Available to Any Agent

This is the part that ties everything together. Fieldnotes exposes its full query surface over the [Model Context Protocol](https://modelcontextprotocol.io) via stdio transport. Run `fieldnotes setup-claude` and Claude Desktop can query your knowledge graph directly during conversations.

The MCP server exposes tools for search (hybrid graph + vector), ask (RAG + LLM synthesis), timeline (chronological activity feed), connection suggestions (semantically similar but unlinked documents), digest (activity summary), topic browsing, and ingest status. When Claude needs context about your work, it calls these tools and gets grounded answers from your actual data — not from its training set, not from a web search, from *your* indexed knowledge.

This is the use case I built Fieldnotes for. I don't want to copy-paste context into every conversation. I want the agent to have ambient access to what I know, scoped to what's relevant, without me having to think about retrieval. MCP makes that possible, and Fieldnotes is the backend that makes the data available.

## Direct Graph Queries and LLM Summarization

Not everything needs to go through a chat interface. Sometimes you just want to ask a specific question from the command line and get an answer.

`fieldnotes search "authentication middleware"` runs a hybrid search and returns ranked results with source metadata. Fast, direct, no LLM involved — just retrieval.

`fieldnotes ask "summarize my recent project decisions"` does the full RAG pipeline: retrieves relevant context from both the graph and vector store, hands it to the LLM bound to the `completion` role, and synthesizes a narrative answer. Run it without arguments and you get an interactive REPL with conversation history and streaming output — you can ask a follow-up and it reformulates your question using the conversation context.

Under the hood, natural language queries are translated to Cypher via LangChain for graph traversal, while vector queries hit Qdrant for semantic similarity. The hybrid layer merges and ranks the results before anything goes to the LLM. This means the LLM is synthesizing from retrieved facts, not generating from nothing.

You also get `fieldnotes timeline` for a chronological view of what you've been working on, `fieldnotes digest` for an aggregated summary (optionally with an LLM-generated narrative), and `fieldnotes connections` for surfacing latent relationships between documents that aren't explicitly linked in the graph. The `--cross-source` flag on connections is the high-value mode — it finds relationships *between* tools, like an Obsidian note that covers the same topic as an OmniFocus task or a Gmail thread.

## Image Support and the Vision Pipeline

Images follow a parallel path through the pipeline. When Fieldnotes encounters a `.png`, `.jpg`, `.heic`, or any supported image format, it routes it through a vision model that extracts a natural-language description, OCR text, and named entities. The output becomes a synthetic text chunk that flows through the standard embedding and writing stages.

What this means in practice: your screenshots, diagrams, photos of whiteboards — they're all searchable. The vision model describes what it sees, extracts any text in the image, identifies entities (people, technologies, projects), and all of that gets embedded and linked into the graph. Images are connected to extracted entities via `DEPICTS` edges.

Even files that can't be parsed for content — `.3mf`, `.psd`, `.mp4` — get indexed as metadata-only records. The filename, extension, path, and a human-readable description are embedded so they're still discoverable. You searched for "3D printing" and that `.3mf` file shows up because the filename and path gave enough context. It's not perfect, but it's better than invisible.

## Scheduled Topic Clustering

This is one of the features I'm most interested in long-term. On a configurable schedule (default: weekly, Sunday 3 AM), Fieldnotes runs a clustering pipeline over the full vector corpus:

1. UMAP reduces the high-dimensional vectors to 2D.
2. HDBSCAN discovers density-based clusters — groups of documents that are semantically close.
3. An LLM names each cluster based on representative documents.
4. Topic nodes and `BELONGS_TO` edges are written to Neo4j.

The result is an automatically generated taxonomy of what you know. You didn't manually tag anything. You didn't create folders. The system looked at all your documents, found the natural groupings, and labeled them.

`fieldnotes topics list` shows you what it found. `fieldnotes topics gaps` shows you topics that clustering discovered but aren't in any manual taxonomy you might maintain. It's a way to see what you're working on from a distance — and to catch blind spots.

You can also run it on demand with `fieldnotes cluster` when you want a fresh view after a big indexing push.

## Cross-Source Entity Resolution

This is where the graph architecture pays for itself.

When you have Gmail, Google Calendar, OmniFocus, and Obsidian all feeding into the same knowledge graph, you end up with a lot of duplicate references to the same people, projects, and concepts. Alice shows up as a Gmail correspondent, a calendar attendee, an @mention in an OmniFocus task, and a name in an Obsidian note. Without resolution, that's four disconnected nodes.

Fieldnotes runs a five-step entity resolution pipeline after each ingest batch: email-based reconciliation, fuzzy name matching (via RapidFuzz), entity-to-person bridging (linking LLM-extracted entities to structured person nodes), cross-source deduplication (exact → fuzzy → embedding cosine similarity cascade), and transitive closure to fully connect identity clusters.

The practical outcome: "What do I know about Alice?" returns her emails, her calendar events, her OmniFocus tasks, and every note that mentions her — all through a single Person node in the graph. Cross-source tag unification does the same for OmniFocus tags and Obsidian categories, so a query about "Work/Deploy" returns both your tasks and your notes.

This is the kind of thing that's impossible with a flat vector store and trivial with a graph. It's also the kind of thing that makes the difference between "I have a search engine" and "I have a knowledge base."

## Data Sources: What Gets Indexed

Fieldnotes ships with adapters for the tools I actually use:

**Files** — anything on disk matching your configured extensions. Markdown, text, PDF, JSON, YAML, CSV, HTML, Apple iWork (Pages, Keynote), and images. Real-time watching via watchdog, with SHA256-based cursor persistence so restarts only re-process what changed.

**Obsidian** — notes with frontmatter parsing, wikilink extraction, `#tag` support, and the cross-source tag unification I mentioned above.

**Gmail** — email threads with subjects, bodies, metadata, and person extraction. OAuth2 setup, polling with cursor sync, read-only access.

**Google Calendar** — events, attendees, organizers, locations. Same OAuth2 credentials as Gmail, separate token. Creates `ORGANIZED_BY`, `ATTENDED_BY`, and `CREATED_BY` edges linking events to Person nodes.

**Git Repositories** — READMEs, changelogs, docs, ADRs, TOML configs, and commit messages from local repos.

**OmniFocus** — tasks, projects, tags, due dates, subtask hierarchies, and person mentions (via JXA on macOS). Extracts people from email addresses, @mentions, and `People/` tag hierarchies.

**macOS Apps and Homebrew** — installed application bundles and Homebrew packages with descriptions. These get linked to relevant topics via the clustering pipeline.

Every source emits `IngestEvent` dicts into the pipeline queue. Modified files trigger a delete-before-rewrite cycle that cleans stale graph data in a single Neo4j transaction before writing the updated version.

## Observability: Because You Need to See What's Happening

Fieldnotes pushes metrics to Prometheus via a Pushgateway, with pre-built Grafana dashboards for ingest throughput, LLM latency, entity counts, pipeline health, and queue depth. The whole observability stack — Prometheus, Pushgateway, Grafana — runs in Docker alongside Neo4j and Qdrant, managed by docker-compose.

This isn't optional polish. When you're running a pipeline that processes hundreds of files per night, you need to see what's working and what's stuck. Which stage is slow? Is the LLM provider rate-limiting you? How many entities did extraction yield? Are the circuit breakers tripping? The dashboard answers all of these.

Total infrastructure memory footprint is approximately 2 GB. Everything binds to localhost only.

## Backup and Restore

Your knowledge graph is valuable. Fieldnotes includes a full backup and restore system that snapshots your configuration, credentials, all database data (Neo4j, Qdrant, Prometheus, Grafana), and source cursors into a single compressed archive. Scheduled backups run daily via launchd on macOS or systemd on Linux, with configurable retention. `fieldnotes restore` extracts an archive over your `~/.fieldnotes/` directory and restarts containers.

It stops containers for a consistent snapshot, which means a brief downtime window — but for a personal knowledge graph running on your laptop, that's fine.

## The Honest Truth About Local LLM Inference

Here's where I stop selling and start being real about the experience.

Local LLMs are slow. Even on the latest Apple Silicon — and I'm running an M5 Max with 128 GB of unified memory and a 40-core GPU — inference is not fast. The unified memory architecture is genuinely transformative for what models you *can* run. Models that would require enterprise-grade GPUs on x86 fit comfortably in unified memory and run without quantization hacks. You can load serious models — 30B+ parameters, full precision — and they just work. That's remarkable, and it's what makes this whole project viable on consumer hardware.

But "viable" and "fast" are different things.

My initial indexing of a large corpus — thousands of documents across all sources — is still ongoing. I run the pipeline every night and let it chew through files while I sleep. It gets through roughly 500–1000 files per night, depending on document size and how much entity extraction each one needs. A single file goes through parsing, chunking, embedding, LLM-based entity extraction, resolution, and writing. The embedding is fast. The entity extraction — where the LLM reads each chunk and pulls out structured entities and relationship triples — is the bottleneck.

This is fine. I'm not in a hurry. The data isn't going anywhere, and every night the graph gets richer. But I want to be honest about the tradeoff: if you want instant indexing of 50,000 files, you either need cloud LLMs (which defeats the privacy point) or enterprise GPUs (which defeats the "running on my laptop" point). Local inference on Apple Silicon is the sweet spot between privacy and practicality, but it comes with patience as a requirement.

And I think that's the right tradeoff. Because the alternative — the one where you upload everything to a cloud provider for fast indexing — is the one where you've handed over the most comprehensive dataset about your life, your work, your relationships, and your thinking to a company whose privacy policy is a legal document, not a technical guarantee.

Local LLMs matter. Not because they're faster. Not because they're cheaper. Because they're *yours*. The model runs on your hardware, the data never leaves your machine, and the knowledge graph you build is something you own completely. In an age where every SaaS product is quietly feeding your data into training pipelines and every "AI feature" is a thin wrapper around a cloud API call, running your own inference is an act of self-determination.

The M5 Max is the most powerful tool available for this today in consumer hardware. Unified memory means you're not bottlenecked by VRAM the way you would be on even high-end discrete GPUs. But inference time is still measured in seconds per chunk, not milliseconds. That's the reality of local inference without enterprise-scale hardware, and it's a reality I've accepted because the alternative — trusting someone else with everything I know — isn't something I'm willing to do.

The hardware will get faster. The models will get more efficient. But the principle stays the same: your data, your machine, your knowledge graph. That's what Fieldnotes is for.

---

Fieldnotes is open source, MIT licensed, and [available on GitHub](https://github.com/mmlac/fieldnotes). Install it with `pipx install fieldnotes`, run `fieldnotes init --with-docker`, and start indexing. If you're interested in the entity resolution architecture or the clustering pipeline, the [docs](https://github.com/mmlac/fieldnotes/tree/main/docs) go deeper.

What are you building for local-first AI? I'm curious whether others are hitting the same privacy wall I did — let me know.

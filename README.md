Production-Grade URL Shortener:

A backend-focused, production-grade URL shortener built to deeply understand system design, backend architecture, testing discipline, and security fundamentals — not just to “make it work”.

This project is intentionally built step by step, with clear design decisions, explicit trade-offs, and a strong emphasis on professional engineering practices.

🎯 Project Goals

The primary goals of this project are:

- Understand how production-grade backend systems are designed.
- Practice clean architecture and separation of concerns.
- Build testable, secure, and scalable backend logic.
- Be interview-ready for top product companies.
- Demonstrate senior-level thinking through code structure and documentation.
- This is not a tutorial project or a copy-paste implementation.

🧠 High-Level Design Philosophy:

This project follows a layered architecture with strict responsibility boundaries:

Client
  ↓
Routes        → HTTP mapping only
  ↓
Controllers  → Request/response handling
  ↓
Services     → Core business logic
  ↓
Models       → Data persistence (DB abstraction)

Key Principles:

- Business logic must be framework-agnostic
- Controllers must stay thin
- Services represent the heart of the system
- Models abstract data storage details
- Tests are first-class citizens
- Security is designed, not patched

📁 Folder Structure:

src/
├── routes/        # HTTP route definitions
├── controllers/   # Request/response orchestration
├── services/      # Core business logic
├── models/        # Data access layer (DB abstraction)
├── config/        # Configuration & environment setup
└── utils/         # Reusable, stateless helpers

tests/
└── services/      # Unit tests for service layer


This structure is intentionally chosen to:

- Scale without refactoring
- Enable easy testing
- Map cleanly to other backend stacks (Spring Boot, Go, etc.)

🔗 Core Functional Flow (Phase 1)

1. Create Short URL
POST /urls
→ Controller validates input
→ Service generates short code
→ Model stores mapping
→ Controller returns response

2. Redirect
GET /:shortCode
→ Controller calls service
→ Service resolves mapping
→ Redirect or 404 response

🔑 Short Code Strategy (Initial)

Phase 1 approach:
Auto-increment ID → Base62 encoding

Why?

- Deterministic
- No collisions
- Easy to reason about
- Ideal for learning fundamentals
- Known Limitations (Accepted Intentionally)
- Predictable short codes
- DB dependency for ID generation
- These are consciously accepted and will be hardened in later phases using:
- ID obfuscation
- Randomized codes
- Rate limiting

🧪 Testing Strategy

Testing is treated as a core design requirement, not an afterthought.

Phase 1 Focus:

- Unit tests for service layer
- No HTTP or DB dependency
- Pure business logic validation

Why service-layer tests?

If business logic is correct and testable, everything else is wiring.

🔐 Security Considerations (Early Design)

Security is considered from day one.

Threats considered in early phases:
- Invalid or malicious URLs
- Open redirect risks
- Enumeration / brute-force attempts
- DoS via URL creation

Phase 1 Decisions:

- Validate URL format
- Allow only http and https
- Explicitly document deferred protections

Later phases will introduce:

- Rate limiting
- Abuse prevention
- Enumeration hardening

Secure headers

🧭 Development Philosophy

This project evolves in phases, not rewrites:

Phase 0: Structure & hygiene
Phase 1: Core logic
Phase 2: HTTP wiring
Phase 3: Unit testing
Phase 4: Security hardening
Phase 5: Scalability & caching

Each phase adds value without breaking previous work.

📜 Commit Discipline

This project follows conventional commit messages to reflect professional workflows:

chore: add initial folder structure
chore: add test folder structure
feat: implement url shortening service
test: add unit tests for url service
fix: handle invalid url input
docs: explain security trade-offs

This makes history readable and intentions clear.

🏁 Status:
🚧 In active development

Currently focused on:
Service-layer implementation

Unit testing:
Clean, intentional evolution

✨ Final Note

This repository is designed so that:
A senior engineer can open it, pause, and understand how the author thinks.
That is the true success criteria of this project.

## Current Status

The URL shortener backend is now fully wired end-to-end using Express.

### Implemented
- Clean layered architecture (services, controllers, routes)
- Dependency Injection via composition root
- Unit-tested service and controller layers
- Express wiring isolated at application boundary
- End-to-end flow verified using curl

### Verified Endpoints
- POST /urls → create short URL
- GET /:shortCode → redirect (302) or 404 if not found

### Notes
Persistence is currently in-memory.
Database integration and indexing will be introduced in the next phase.

-- Persistence Layer (PostgreSQL):

The system now uses PostgreSQL as the single source of truth for all URL mappings.

Why PostgreSQL?

1. Strong consistency guarantees
2. Mature indexing and constraint support
3. Familiar choice for production backend systems
4. Clear mental model for transactions and invariants

-- Database Schema

CREATE TABLE short_urls (
  id BIGSERIAL PRIMARY KEY,
  short_code TEXT NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Key Design Decisions

1. id is generated using a Postgres sequence
2. short_code is derived from id using Base62 encoding
3. Insert is performed atomically with (id, short_code, original_url)
4. Uniqueness is enforced at the database level

This ensures:

1. No short code collisions
2. No race conditions
3. Deterministic behavior under concurrency
4. PostgreSQL remains the authoritative source of truth, even after introducing Redis.

⚙️ Data Access Pattern

1. The project follows a Repository abstraction for persistence:
2. Services depend on repository interfaces, not database details
3. Swapping storage layers does not affect business logic
4. Makes the system easier to test and evolve

This mirrors real-world production systems and maps cleanly to other stacks (e.g., JPA repositories in Spring).

⚡ Redis Integration (Cache-Aside Strategy)

-- Redis is introduced only for read optimization, never as a source of truth.

Why Redis?

1. Reduce database load on hot paths
2. Improve redirect throughput
3. Lower tail latency under load
4. Caching Strategy

-- Pattern: Cache-aside

Cache key: short:<shortCode>
TTL: 1 hour

On redirect:
1. Check Redis
2. On hit → return immediately
3. On miss → query Postgres, populate Redis, return

-- If Redis is unavailable:

1. The system falls back to PostgreSQL
2. Correctness is never compromised
3. Redis Client Optimization

** During load testing, Redis client contention was observed under high concurrency.

Fixes applied:

1. Separate Redis connections for reads and writes
2. Removal of logging from hot paths
3. Explicit cache warming before benchmarks

This mirrors real production tuning work and highlights that Redis usage patterns matter, not just Redis itself.

📈 Load Testing & Benchmarking

1. Performance testing was treated as a first-class engineering activity, not an afterthought.

Tooling: -> 

Tool: autocannon
Scenario: Hot short-code repeatedly accessed
Configuration:

100 concurrent connections
HTTP pipelining enabled
30-second sustained run

*** Results (Local) *** 
***

  Setup	Avg Latency	P99 Latency	Req/sec
  DB-only	~81 ms	~99 ms	~12.2k
  Redis optimized	~57 ms	~66 ms	~17.4k
  Key Insight

***

  Adding Redis increased redirect throughput by ~40% and reduced P99 latency by ~33%.
  After optimization, the system became HTTP / Node.js event-loop bound rather than database-bound.

***

This demonstrates:->

1. Redis successfully removed Postgres from the hot path
2. Performance bottlenecks shifted upward in the stack
3. Caching improves scalability, not just raw speed

Benchmarks were intentionally run locally to avoid cloud network noise.

🛡️ Security & Abuse Considerations (Current + Planned)
Already Implemented

1. Strict URL validation
2. Only http and https allowed
3. Safe redirects (no open redirect injection)
4. Explicit error handling for invalid inputs

Planned (Next Phase)

- Rate limiting (Redis-based)
- Enumeration hardening
- Abuse protection on URL creation
- Security headers
- Observability hooks (metrics, structured logs)

Security is treated as an evolving design concern, not a bolt-on.

🚧 Intentional Non-Goals (For Now)

The following are explicitly deferred, not forgotten:

1. UI / frontend
2. Authentication
3. Custom domains
4. Analytics dashboard

-- Cloud deployment benchmarks
The focus of this repository is backend correctness, architecture, and reasoning.

🧩 Why This Project Exists
This repository is not meant to impress with features.

It is meant to demonstrate: 
1. How design decisions are made
2. How trade-offs are documented
3. How performance is measured, not assumed
4. How systems evolve incrementally
5. A senior engineer should be able to read this codebase and understand:

*** how the developer thinks — not just what they built ***
*** That is the success criteria of this project ***
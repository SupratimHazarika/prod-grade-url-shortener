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
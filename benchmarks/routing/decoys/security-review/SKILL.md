---
name: security-review
description: Finds and fixes security vulnerabilities in application code. Use when asked about injection, XSS, CSRF, authentication or authorization flaws, secret handling, unsafe deserialization, or when hardening an endpoint. Triggers include "vulnerability", "SQL injection", "취약점", "보안", "인증 우회".
---

# security-review

Identify the vulnerability class, the exact untrusted input path, and the fix at the trust
boundary. Prefer parameterized queries, framework escaping, and platform auth primitives over
hand-rolled sanitizers. Confirm no other caller reaches the same sink.

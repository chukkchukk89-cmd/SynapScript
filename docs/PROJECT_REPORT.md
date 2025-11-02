# Project Report: SynapScript - Streamlined V1.0 MVP

**Version:** 1.0 (Streamlined MVP Blueprint)
**Date:** Sunday, November 2, 2025

## Part 1: Vision & Core Principles (V1.0 Focus)

### 1.1 Project Vision (V1.0)

SynapScript V1.0 aims to be a functional, AI-powered automation assistant for Android, enabling users to create 3-5 useful personal automations without coding. The focus is on delivering core value and proving the concept works within the constraints of building on an Android tablet.

### 1.2 Core Principles

1.  **Privacy & Security by Design:** User data and device integrity are paramount. Transparent operations, explicit consent, and on-device processing are prioritized.
2.  **Resource Efficiency:** Event-driven, minimal resource consumption while idle, on-demand processing.
3.  **Resilience & Adaptability:** AI-driven understanding of intent for robust automations, though advanced semantic UI understanding is deferred.

---

## Part 2: System Architecture (V1.0 Scope)

### 2.1 Layer 1: The Interface (Frontend)

*   **Description:** User-facing layer for interaction.
*   **Technology:** Local web application (HTML/CSS/JS) served from the Bridge server.
*   **Interaction Model:** Text input box (no voice input in v1.0).
*   **Input:** Natural language text input.
*   **Output:** Simple visual blocks (static display) and text feedback.

### 2.2 The Bridge: Local Backend Server

*   **Description:** Connects frontend to execution layers.
*   **Technology:** Node.js with Express.js in Termux.
*   **Purpose:** Exposes a local, secure REST API for orchestration.

### 2.3 Layer 2: The Translator (AI Core)

*   **Description:** Translates high-level user goals into executable plans.
*   **Technology:** Gemini API (free tier).
*   **Function:** Converts natural language requests directly into Termux commands.

### 2.4 Layer 3: The Executor (Action Layer)

*   **Description:** Performs actions on the device.
*   **Primary Engine:** Termux CLI for executing commands.
*   **Supported Actions (V1.0):** WiFi on/off, Location monitoring, Battery status, Notifications, Brightness control, SMS send (basic).
*   **(Advanced Accessibility Service UI automation deferred to v2.0+).**

---

## Part 3: Security & Resource Management (V1.0 Scope)

### 3.1 Security Model: Device Pairing & API Token Authentication

*   **Mechanism:** Mandatory pairing initiated from phone, temporary code, secure handshake, long-lived API token for authenticated requests. User control for revocation.
*   **(Complex token storage, network security, sandboxing deferred to v2.0+).**

### 3.2 Resource Manager

*   **Function:** Estimates automation resource cost, checks available system resources, warns user if too expensive, and suggests alternatives.

---

## Part 4: Technology Stack & Packages (V1.0 Scope)

### 4.1 Core Technologies
*   **Runtime Environments:** Node.js.
*   **Backend Framework:** Express.js.
*   **AI Model:** Gemini API.
*   **UI Framework:** Plain HTML, CSS, JavaScript.
*   **Database:** SQLite.

### 4.2 Selected Packages (V1.0 Bundled Only)

*   **Node.js:** `axios`, `cheerio`, `express`, `fs-extra`, `node-cron`, `dayjs`, `chalk`, `dotenv`, `commander`, `ws`.
*   **(Python runtime and on-demand package downloads deferred to v2.0+).**

---

## Part 5: Project & Development Workflow (V1.0 Scope)

*   **Project Directory:** `/storage/emulated/0/SynapScript`
*   **Version Control:** Git repository.
*   **Backup:** Bare Git repository at `/storage/emulated/0/.SynapScript.bak.git` synced via `sync_to_backup.sh`.
*   **Documentation:** `/docs` directory contains `ARCHITECTURE.md`, `PACKAGE_REFERENCE.md`, `PROJECT_REPORT.md`, and placeholder documents for `USER_FLOWS.md`, `AI_PROMPTS.md`, `TESTING_STRATEGY.md`, `ROADMAP.md`, `ACCESSIBILITY_IMPLEMENTATION.md`.

---

## Part 6: V1.0 Development Roadmap & Success Criteria

### V1.0 Success Criteria

*   ✅ User can create automation in < 2 minutes.
*   ✅ AI understands 80% of common requests correctly.
*   ✅ Automations execute reliably (95%+ success rate).
*   ✅ Battery drain < 5% per day with 5 active automations.
*   ✅ No crashes during 1-week usage.
*   ✅ 10 users can use it without your help.

### Phased Rollout Plan

*   **Phase 0: Proof of Concept (Week 1-2):** Build Termux server with 1 endpoint, Gemini API integration, generate Termux command from text, execute command manually.
*   **Phase 1: MVP Backend (Week 3-4):** SQLite database, CRUD for automations, `node-cron` scheduling, execution logging.
*   **Phase 2: Basic Frontend (Week 5-6):** HTML input form, display automations list, show execution logs, manual trigger buttons.
*   **Phase 3: Visual Polish (Week 7-8):** Visual block representation, emoji icons, parameter editors, dark mode.
*   **Phase 4: Beta Testing (Week 9-10):** Bug fixing, AI prompt improvement, add 3-5 hardcoded templates.

### Final Recommendations (V1.0)

*   **Do This:** Start with Proof of Concept, build only what's testable on tablet, use emoji, keep frontend simple (vanilla JS), manual testing only, ship minimal but working features.
*   **Don't Do This:** Don't build template marketplace, Python runtime, Accessibility Service (advanced), drag-and-drop UI, multi-device sync, or support every Termux API command.

This streamlined blueprint will guide our development for SynapScript V1.0, focusing on delivering core value efficiently within the given constraints.
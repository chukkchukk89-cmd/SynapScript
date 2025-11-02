# Project Blueprint: SynapScript

## 1. High-Level Vision

*   **Name:** SynapScript
*   **Vision:** An AI-powered assistant for Android designed to automate complex workflows. It will understand high-level, goal-oriented commands, intelligently interacting with both the Android UI and backend systems.
*   **Core Principles:**
    *   **Privacy & Security by Design:** User data and device integrity are paramount. The system will be transparent, require consent for sensitive operations, and default to on-device processing.
    *   **Resource Efficiency:** The app will be a good citizen on the Android OS, designed to minimize battery and CPU usage by being event-driven and using resources on-demand.
    *   **Resilient & Adaptive:** By using AI to understand intent and semantics, automations will be resilient to changes in application UIs, avoiding the fragility of traditional automation scripts.

---

## 2. System Architecture

### 2.1 Layer 1: The Interface (Frontend)

*   **Description:** This is the user-facing layer, responsible for all interaction.
*   **Technology:** A local web application (HTML/CSS/JS) served from the Bridge server. This allows for a flexible, modern UI that is easy to develop and maintain.
*   **Interaction Model:** A hybrid "live" and chat-style interface, allowing for both conversational commands and real-time feedback.
*   **Input (STT):** On-device Speech-to-Text will be used for speed, offline capability, and privacy.
*   **Output (TTS):** Google's high-quality Text-to-Speech engine will provide natural-sounding voice feedback.

### Layer 1.5: Visual Translation & Presentation Layer

*   **Purpose:** Converts technical commands and scripts into user-friendly visual representations.
*   **Technology:** AI-powered Shell-to-UI translator using Gemini API.
*   **Components:**
    *   Visual Block Renderer (emoji icons, plain English descriptions).
    *   Interactive Parameter Editor (sliders, dropdowns, toggles).
    *   Conversational Refinement Engine (AI asks follow-up questions).
    *   Testing Sandbox (safe preview mode).
*   **Display Modes:**
    *   Layer 0: Natural language summary ("Turn WiFi off when leaving home").
    *   Layer 1: Visual blocks with emoji (📍 → 📡) [Default View].
    *   Layer 2: Generated code (syntax highlighted) [Power Users Only].

### 2.2 The Bridge: Local Backend Server

*   **Technology:** A lightweight server in Termux (e.g., Node.js/Express or Python/Flask).
*   **Purpose:** To securely connect the sandboxed web frontend to the powerful execution layers. It exposes a local API that the frontend calls to initiate tasks.

### Layer 2: The Translator (AI Core)

*   **Technology:** The **Gemini API (free tier)**.
*   **Function 1 (The "Planner"):** Takes high-level user goals and breaks them down into a sequence of abstract, logical intentions.
*   **Function 2 (The "Finder"):** For each intention, it receives the current UI layout from Layer 3 and intelligently identifies the correct UI element to interact with, understanding semantics rather than relying on brittle IDs or positions.
*   **Visuals:** Will begin with simple text-based representations of automations, with placeholders to later incorporate more advanced visual translation layers.

### 2.4 Layer 3: The Executor (Action Layer)

*   **Description:** This layer is responsible for performing the actual actions on the device. It operates in a hybrid, polyglot environment.
*   **Primary Engine (UI): Android Accessibility Service:** This acts as the "robot user," capable of reading the screen and performing UI interactions like tapping, swiping, and typing within any application. This is the key to resilient UI automation.
*   **Secondary Engine (CLI): Termux CLI:** This handles all non-UI "backend" tasks, such as running shell scripts, managing files, executing command-line tools, and running code in various languages.
*   **Supported Languages:** The execution environment will support both **Node.js** and **Python**, allowing the system to use the best tool for the job (e.g., Node.js for I/O-heavy tasks, Python for data analysis).

---

### Data Layer: Persistence & State

*   **Primary Storage:** SQLite database (`synap.db`).
*   **Schema:**
    *   `automations` - User-created automations.
    *   `execution_logs` - History of runs.
    *   `paired_devices` - Authorized devices with tokens.
    *   `settings` - User preferences.
    *   `templates` - Downloaded community automations.
*   **State Management:**
    *   In-memory state for running automations.
    *   Persistent state for scheduled/recurring tasks.
*   **Backup:**
    *   Auto-backup to `/storage/emulated/0/SynapScript/backups/`.
    *   Export as JSON for sharing.

---

## Part 3: Security & Resource Management

*   **Data Privacy:**
    *   **On-Device First:** Processing defaults to the device. Data does not leave your phone without a specific need and your consent.
    *   **Cloud Anonymization:** For tasks requiring cloud AI, data is sanitized first to remove personal information. The UI *structure* is sent, not your *content*.
    *   **No Cloud Storage:** API calls will be configured to prevent logging or storage of inference data.
*   **Permissions & Security:**
    *   **Device Pairing & API Token Authentication:** A mandatory security layer. By default, the server rejects all requests. A user must initiate a "pairing" process from the primary device, which generates a temporary code. A new device uses this code to perform a secure handshake, receiving a long-lived, secret API token. All subsequent API requests must present this token to be authenticated. The user will have a dashboard to view and revoke access for any paired device at any time.
    *   **Security Implementation Details:**
        *   **Token Storage:** Encrypted using Android Keystore; never stored in plain text; separate tokens per paired device.
        *   **Network Security:** HTTPS only (self-signed cert on first run); certificate pinning for Bridge server; rate limiting on API endpoints.
        *   **Execution Sandboxing:** Each automation runs in an isolated process; resource limits enforced (CPU, memory, time); cannot access other automations' data.
        *   **Audit Trail:** Every automation action logged with timestamp; user can review history; export logs for debugging.
    *   **Transparency:** The powerful Accessibility permission will be requested with a clear, detailed explanation of why it's needed.
    *   **User in the Loop:** The system will not perform significant actions without user initiation and, for sensitive tasks, final confirmation.
    *   **Clear Feedback:** A persistent notification will always show what automation, if any, is currently running.
*   **Resource Efficiency & Stability:**
    *   **Event-Driven:** The app remains dormant and consumes near-zero resources until triggered by a user command or a scheduled event.
    *   **On-Demand:** Heavy processes are only active when executing a task.
    *   **Resource Manager:** A core module responsible for system stability. Before execution, it estimates the automation's resource cost and compares it to available system resources. If a task is too expensive, it warns the user and provides suggestions.

### Error Handling Strategy

*   **Network Failures:**
    *   Queue automations for retry when online.
    *   Offline mode: Use last-known-good AI responses.
*   **API Rate Limits:**
    *   Cache AI responses for similar queries.
    *   Show user-friendly message: "Try again in 1 minute."
*   **Automation Failures:**
    *   Log detailed error with context.
    *   AI generates user-friendly explanation.
    *   Suggest fixes automatically.
*   **Rollback:**
    *   System actions (WiFi, brightness) → Auto-revert after 5 min.
    *   File operations → Move to trash, not delete.

---

## Part 4: Technology Stack & Packages

### Proactive Automation Suggestions

*   **Status:** Disabled by default. The user must explicitly opt-in to enable this "learning" feature.
*   **Data Source:** Uses Android's privacy-preserving `UsageStatsManager` to identify patterns in app usage (e.g., "App A -> App B -> App C"). It does **not** see screen content.
*   **Processing:** All pattern analysis is done **on-device** via a local TensorFlow Lite model.
*   **Resource Use:** Analysis is done via `WorkManager` during device idle/charging times to prevent battery drain.
*   **Workflow:** The system identifies a pattern -> suggests an automation to the user -> waits for user approval before building it.

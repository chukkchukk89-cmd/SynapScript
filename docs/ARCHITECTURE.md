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

*   **Purpose:** Converts technical commands and scripts into user-friendly visual representations for display.
*   **Technology:** AI-powered Shell-to-UI translator using Gemini API.
*   **Components (v1.0):**
    *   Visual Block Renderer (emoji icons, plain English descriptions).
    *   Interactive Parameter Editor (sliders, dropdowns, toggles) accessible by tapping a block.
*   **Display Mode (v1.0):**
    *   Visual blocks with emoji (e.g., 📍 → 📡) [Default View].
    *   (No drag-and-drop or advanced interactive builder in v1.0).

### 2.2 The Bridge: Local Backend Server

*   **Technology:** A lightweight server in Termux using **Node.js/Express**.
*   **Purpose:** To securely connect the sandboxed web frontend to the powerful execution layers. It exposes a local API that the frontend calls to initiate tasks. It now uses **SQLite** for persistent storage of automations and API tokens.

### Layer 2: The Translator (AI Core)

*   **Technology:** The **Gemini API (free tier)**.
*   **Function 1 (The "Planner"):** Takes high-level user goals and breaks them down into a sequence of abstract, logical intentions.
*   **Function 2 (The "Finder"):** For each intention, it receives the current UI layout from Layer 3 and intelligently identifies the correct UI element to interact with, understanding semantics rather than relying on brittle IDs or positions.
*   **Visuals:** Will begin with simple text-based representations of automations, with placeholders to later incorporate more advanced visual translation layers.

### 2.4 Layer 3: The Executor (Action Layer)

*   **Description:** This layer is responsible for performing the actual actions on the device. It operates in a hybrid, polyglot environment.
*   **Primary Engine (UI): Android Accessibility Service:** This acts as the "robot user," capable of reading the screen and performing UI interactions like tapping, swiping, and typing within any application. This is the key to resilient UI automation.
*   **Secondary Engine (CLI): Termux CLI:** This handles all non-UI "backend" tasks, such as running shell scripts, managing files, executing command-line tools, and running code in various languages.
*   **Supported Languages (v1.0):** The execution environment will support **Node.js**.
    *   (Python support deferred to v2.0+).

---

### Data Layer: Persistence & State (v1.0)

*   **Primary Storage:** SQLite database (`synapscript.db`).
*   **Schema (v1.0):**
    *   `automations` - User-created automations. Stores `id`, `name`, `trigger` (JSON string), `actions` (JSON string), `generated_code` (JSON string), `created_at`, `updated_at`.
    *   `api_tokens` - Stores API tokens for device authentication (`token`, `description`, `created_at`).
*   **State Management:**
    *   In-memory state for running automations.
    *   Persistent state for scheduled/recurring tasks.
*   **(Complex backup/sync deferred to v2.0+).**

---

## Part 3: Security & Resource Management

*   **Data Privacy:**
    *   **On-Device First:** Processing defaults to the device. Data does not leave your phone without a specific need and your consent.
    *   **Cloud Anonymization:** For tasks requiring cloud AI, data is sanitized first to remove personal information. The UI *structure* is sent, not your *content*.
    *   **No Cloud Storage:** API calls will be configured to prevent logging or storage of inference data.
*   **Permissions & Security:**
    *   **Device Pairing & API Token Authentication (v1.0):** A mandatory security layer. By default, the server rejects all requests. A user must initiate a "pairing" process from the primary device, which generates a temporary code. A new device uses this code to perform a secure handshake, receiving a long-lived, secret API token. This token is now stored persistently in the **SQLite database**. All subsequent API requests must present this token to be authenticated. The user will have a dashboard to view and revoke access for any paired device at any time.
    *   (Detailed token storage, network security, execution sandboxing, and audit trail deferred to v2.0+).
    *   **Transparency:** The powerful Accessibility permission will be requested with a clear, detailed explanation of why it's needed.
    *   **User in the Loop:** The system will not perform significant actions without user initiation and, for sensitive tasks, final confirmation.
    *   **Clear Feedback:** A persistent notification will always show what automation, if any, is currently running.
*   **Resource Efficiency & Stability:**
    *   **Event-Driven:** The app remains dormant and consumes near-zero resources until triggered by a user command or a scheduled event.
    *   **On-Demand:** Heavy processes are only active when executing a task.
    *   **Resource Manager:** A core module responsible for system stability. Before execution, it estimates the automation's resource cost and compares it to available system resources. If a task is too expensive, it warns the user and provides suggestions.

### Error Handling Strategy (v1.0)

*   **Automation Failures:**
    *   Log detailed error with context.
    *   User sees what failed and when.
    *   (Advanced retry, rollback, and AI-driven suggestions deferred to v2.0+).

---

## Part 4: Technology Stack & Packages



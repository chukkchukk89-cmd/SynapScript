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

### Layer 1: The Interface (Frontend)

*   **Technology:** A local web application (HTML, CSS, JavaScript).
*   **Hosting:** Served by the "Bridge" backend server running in Termux.
*   **Interaction:** A hybrid "live" and chat-style interface.
*   **Input (STT):** On-device Speech-to-Text for speed and privacy.
*   **Output (TTS):** Google's TTS engine for high-quality, natural-sounding voice feedback.

### The Bridge: Local Backend Server

*   **Technology:** A lightweight server in Termux (e.g., Node.js/Express or Python/Flask).
*   **Purpose:** To securely connect the sandboxed web frontend to the powerful execution layers. It exposes a local API that the frontend calls to initiate tasks.

### Layer 2: The Translator (AI Core)

*   **Technology:** The **Gemini API (free tier)**.
*   **Function 1 (The "Planner"):** Takes high-level user goals and breaks them down into a sequence of abstract, logical intentions.
*   **Function 2 (The "Finder"):** For each intention, it receives the current UI layout from Layer 3 and intelligently identifies the correct UI element to interact with, understanding semantics rather than relying on brittle IDs or positions.
*   **Visuals:** Will begin with simple text-based representations of automations, with placeholders to later incorporate more advanced visual translation layers.

### Layer 3: The Executor (Action Layer)

*   **Primary Engine (UI): Android Accessibility Service**
    *   Acts as the "robot user" for all UI interactions (tapping, swiping, reading text, etc.).
    *   This is the key to our resilient, AI-driven UI automation.
*   **Secondary Engine (CLI): Termux CLI**
    *   Handles all non-UI "backend" tasks.
    *   Supports executing scripts in multiple languages, including **Node.js** and **Python**.

---

## 3. Privacy, Security & Efficiency

*   **Data Privacy:**
    *   **On-Device First:** Processing defaults to the device. Data does not leave your phone without a specific need and your consent.
    *   **Cloud Anonymization:** For tasks requiring cloud AI, data is sanitized first to remove personal information. The UI *structure* is sent, not your *content*.
    *   **No Cloud Storage:** API calls will be configured to prevent logging or storage of inference data.
*   **Permissions & Security:**
    *   **Device Pairing & API Token Authentication:** A mandatory security layer. By default, the server rejects all requests. A user must initiate a "pairing" process from the primary device, which generates a temporary code. A new device uses this code to perform a secure handshake, receiving a long-lived, secret API token. All subsequent API requests must present this token to be authenticated. The user will have a dashboard to view and revoke access for any paired device at any time.
    *   **Transparency:** The powerful Accessibility permission will be requested with a clear, detailed explanation of why it's needed.
    *   **User in the Loop:** The system will not perform significant actions without user initiation and, for sensitive tasks, final confirmation.
    *   **Clear Feedback:** A persistent notification will always show what automation, if any, is currently running.
*   **Resource Efficiency & Stability:**
    *   **Event-Driven:** The app remains dormant and consumes near-zero resources until triggered by a user command or a scheduled event.
    *   **On-Demand:** Heavy processes are only active when executing a task.
    *   **Resource Manager:** A core module responsible for system stability. Before execution, it analyzes the automation's estimated resource cost and compares it to available system resources (RAM/CPU). If a task is deemed too expensive, it will warn the user and provide suggestions (e.g., run later, process items sequentially) to prevent the app or system from crashing.

---

## 4. Advanced Features (Opt-In)

### Proactive Automation Suggestions

*   **Status:** Disabled by default. The user must explicitly opt-in to enable this "learning" feature.
*   **Data Source:** Uses Android's privacy-preserving `UsageStatsManager` to identify patterns in app usage (e.g., "App A -> App B -> App C"). It does **not** see screen content.
*   **Processing:** All pattern analysis is done **on-device** via a local TensorFlow Lite model.
*   **Resource Use:** Analysis is done via `WorkManager` during device idle/charging times to prevent battery drain.
*   **Workflow:** The system identifies a pattern -> suggests an automation to the user -> waits for user approval before building it.

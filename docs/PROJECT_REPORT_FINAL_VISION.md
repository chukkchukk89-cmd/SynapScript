# Project Report: SynapScript - Final Vision & Streamlined V1.0 MVP

**Version:** Final Vision & V1.0 MVP Blueprint
**Date:** Sunday, November 2, 2025

---

## **Part 1: Project Vision & Core Principles**

### **1.1 Overarching Vision (Long-Term Goal)**

SynapScript is envisioned as an AI-powered automation assistant for Android that transcends traditional scripting. Its ultimate goal is to enable users to automate complex, multi-step workflows, including aspects of app development itself, by understanding high-level natural language commands and intelligently interacting with both the Android graphical user interface (GUI) and backend systems. The long-term aim is to provide a "zero command-line interface" experience, making powerful automation accessible to non-technical users.

### **1.2 Core Principles**

1.  **Privacy & Security by Design:** User data, privacy, and device integrity are paramount. The system is architected for transparency, explicit user consent for sensitive operations, and a default preference for on-device processing.
2.  **Resource Efficiency:** The application is designed to be a "good citizen" on the Android OS, minimizing battery and CPU usage. It operates event-driven, consuming minimal resources while idle, and processing heavy tasks only on-demand.
3.  **Resilience & Adaptability:** Leveraging AI, automations will be robust and resilient to UI changes (e.g., app updates), adapting to semantic shifts rather than breaking due to brittle element IDs.

---

## **Part 2: System Architecture (Reflecting Streamlined V1.0 MVP)**

The SynapScript system is designed as a modular, multi-layer architecture, with V1.0 focusing on core functionalities.

### **2.1 Layer 1: The Interface (Frontend)**

*   **Description:** The user-facing layer for all interaction.
*   **Technology:** A local web application (HTML/CSS/JS) served from the Bridge server.
*   **Interaction Model (V1.0):** Primarily a text input box for natural language commands. Voice input (STT) is a nice-to-have for v1.0.
*   **Input:** Natural language text input.
*   **Output (V1.0):** Simple, static visual blocks (emoji icons + plain text) representing automations, and text feedback.

### **2.2 Layer 1.5: Visual Translation & Presentation Layer (V1.0 Scope)**

*   **Purpose:** Converts technical commands and scripts into user-friendly visual representations for display.
*   **Technology:** AI-powered Shell-to-UI translator using Gemini API.
*   **Components (V1.0):**
    *   **Visual Block Renderer:** Displays automations as static blocks with emoji icons and plain English descriptions.
    *   **Interactive Parameter Editor:** Tapping a block opens a dialog for editing parameters (sliders, dropdowns, text inputs).
    *   **(No drag-and-drop or advanced interactive builder in v1.0).**
*   **Display Mode (V1.0):** Visual blocks with emoji (e.g., 📍 → 📡) as the default view.

### **2.3 The Bridge: Local Backend Server**

*   **Description:** The central nervous system, connecting the web frontend to the execution layers.
*   **Technology:** Lightweight server built in **Node.js** using the **Express** framework, running within the Termux environment.
*   **Purpose:** Exposes a local, secure REST API for orchestration.

### **2.4 Layer 2: The Translator (AI Core)**

*   **Description:** The "brain" of SynapScript, translating high-level user goals into executable plans.
*   **Technology:** **Gemini API (free tier)**.
*   **Function (V1.0):** Converts natural language requests directly into Termux commands.
*   **(Advanced "Planner" for abstract intentions and "Finder" for semantic UI understanding deferred to v2.0+).**

### **2.5 Layer 3: The Executor (Action Layer)**

*   **Description:** Performs actual actions on the device.
*   **Primary Engine (V1.0): Termux CLI:** Executes shell commands.
*   **Supported Actions (V1.0):** WiFi on/off, Location monitoring, Battery status, Notifications, Brightness control, SMS send (basic).
*   **Supported Languages (V1.0):** **Node.js** for automation scripts.
*   **(Advanced Accessibility Service UI automation and Python support deferred to v2.0+).**

---

## **Part 3: Security & Resource Management**

### **3.1 Security Model: Device Pairing & API Token Authentication**

*   **Mechanism:** Mandatory security layer. Server rejects requests by default. Pairing initiated from phone (temporary code), new device uses code for secure handshake, receives long-lived API token. User control for revocation.
*   **(Complex token storage, network security, sandboxing, audit trail deferred to v2.0+).**

### **3.2 Resource Manager**

*   **Function:** Estimates automation resource cost, checks available system resources (RAM/CPU).
*   **Action:** Warns user if a task is deemed too expensive, suggests alternatives (e.g., run later, process sequentially) to prevent crashes.

---

## **Part 4: Technology Stack & Packages (V1.0 Scope)**

### **4.1 Core Technologies**

*   **Runtime Environment:** Node.js.
*   **Backend Framework:** Express.js.
*   **AI Model:** Gemini API.
*   **UI Framework:** Plain HTML, CSS, JavaScript.
*   **Database:** SQLite.

### **4.2 Selected Packages (V1.0 Bundled Only)**

SynapScript V1.0 will bundle 12 essential Node.js packages, covering approximately 95% of common automation use cases without requiring any on-demand downloads.

*   **Bundled Node.js (12 Packages):**
    1.  `axios` (networking)
    2.  `cheerio` (scraping)
    3.  `express` (server)
    4.  `fs-extra` (files)
    5.  `node-cron` (scheduling)
    6.  `dayjs` (time)
    7.  `chalk` (styling)
    8.  `dotenv` (config)
    9.  `commander` (CLI)
    10. `ws` (WebSocket)
    11. `csv-parser` (data processing)
    12. `qrcode` (QR generation)
*   **Total Bundled Size:** ~1.6MB (negligible impact on base APK size).

### **4.3 Future Considerations (Post V1.0)**

*   **Coming Soon (Deferred to V2.0+):** Browser automation (`puppeteer`), advanced image processing (`sharp`), email sending (`nodemailer`), cloud database (`mongoose`).
*   **Manual Additions (via Termux CLI):** Users can manually install these tools via Termux for advanced use cases:
    *   `imagemagick` (for advanced photo manipulation)
    *   `ffmpeg` (for video processing)
    *   `git` (for version control)

---

## **Part 5: Project & Development Workflow (V1.0 Scope)**

### **5.1 Development Environment**

*   **Platform:** Android tablet (Termux environment).
*   **Project Directory:** `/storage/emulated/0/SynapScript`.

### **5.2 Version Control & Backup**

*   **Version Control:** Git repository.
*   **Backup:** Bare Git repository at `/storage/emulated/0/.SynapScript.bak.git`.
*   **Syncing:** `sync_to_backup.sh` script pushes changes to the backup.

### **5.3 Documentation**

All project documentation is maintained in the `/docs` directory:
*   `ARCHITECTURE.md`
*   `PACKAGE_REFERENCE.md`
*   `PROJECT_REPORT_FINAL_VISION.md` (this document)
*   Placeholder documents for `USER_FLOWS.md`, `AI_PROMPTS.md`, `TESTING_STRATEGY.md`, `ROADMAP.md`, `ACCESSIBILITY_IMPLEMENTATION.md`.

---

## **Part 6: V1.0 Development Roadmap & Success Criteria**

### **6.1 V1.0 Success Criteria**

*   ✅ User can create automation in < 2 minutes.
*   ✅ AI understands 80% of common requests correctly.
*   ✅ Automations execute reliably (95%+ success rate).
*   ✅ Battery drain < 5% per day with 5 active automations.
*   ✅ No crashes during 1-week usage.
*   ✅ 10 users can use it without your help.

### **6.2 Phased Rollout Plan**

*   **Phase 0: Proof of Concept (Week 1-2):** Build Termux server with 1 endpoint, Gemini API integration, generate Termux command from text, execute command manually.
    *   **Current Status:** COMPLETED - The `GEMINI_API_KEY` issue has been resolved. The root cause was identified as running the application from a directory other than the project's root, which prevented the `dotenv` package from loading the `.env` file.
*   **Phase 1: MVP Backend (Week 3-4):** SQLite database, CRUD for automations, `node-cron` scheduling, execution logging.
*   **Phase 2: Basic Frontend (Week 5-6):** HTML input form, display automations list, show execution logs, manual trigger buttons.
*   **Phase 3: Visual Polish (Week 7-8):** Visual block representation, emoji icons, parameter editors, dark mode.
*   **Phase 4: Beta Testing (Week 9-10):** Bug fixing, AI prompt improvement, add 3-5 hardcoded templates.

### **6.3 Final Recommendations (V1.0)**

*   **Do This:** Start with Proof of Concept, build only what's testable on tablet, use emoji, keep frontend simple (vanilla JS), manual testing only, ship minimal but working features.
*   **Don't Do This:** Don't build template marketplace, Python runtime, advanced Accessibility Service, drag-and-drop UI, multi-device sync, or support every Termux API command.

---

## **Part 7: Troubleshooting**

### **7.1 `GEMINI_API_KEY` Not Found Error**

*   **Symptom:** The application fails to start with an error message similar to "Gemini API key not found. Set GEMINI_API_KEY env variable."
*   **Cause:** This error occurs when the application cannot find the `.env` file containing the `GEMINI_API_KEY`. The most common reason for this is running the application from a directory other than the project's root directory.
*   **Resolution:** Always ensure that you are in the project's root directory (`/storage/emulated/0/SynapScript`) before running the application. The `dotenv` package, which is used to load environment variables, expects the `.env` file to be in the current working directory.

---

This streamlined blueprint will guide our development for SynapScript V1.0, focusing on delivering core value efficiently within the given constraints.

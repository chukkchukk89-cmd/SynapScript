# Project Report: SynapScript

**Version:** 1.0 (Initial Blueprint)
**Date:** Sunday, November 2, 2025

## Part 1: Vision & Core Principles

### 1.1 Project Vision

SynapScript is envisioned as a highly advanced, AI-powered automation assistant for the Android operating system. Its primary purpose is to move beyond simple, brittle scripting to a state of goal-oriented, adaptive automation. The system is designed to understand high-level user commands, intelligently interact with both the Android graphical user interface (GUI) and backend systems, and automate complex, multi-step workflows that would otherwise require manual intervention. The ultimate goal is to create a platform capable of automating entire workflows, including aspects of application development and testing, directly from a mobile device.

### 1.2 Core Principles

The entire architecture is founded on three core principles:

1.  **Privacy & Security by Design:** The user's data, privacy, and device integrity are the highest priority. The system is architected to be transparent in its operations, require explicit user consent for all sensitive actions, and default to on-device processing wherever possible.
2.  **Resource Efficiency:** The application must be a "good citizen" on the Android OS. It is designed to be event-driven, consuming near-zero resources while idle, and only spinning up heavier processes on-demand to execute specific tasks.
3.  **Resilience & Adaptability:** By leveraging modern AI models to understand user intent and UI semantics, automations created with SynapScript will be robust and resilient to common sources of failure, such as changes in an application's layout or UI element IDs after an update.

---

## Part 2: System Architecture

The SynapScript system is designed as a modular, multi-layer architecture.

### 2.1 Layer 1: The Interface (Frontend)

*   **Description:** This is the user-facing layer, responsible for all interaction.
*   **Technology:** A local web application (HTML/CSS/JS) served from the Bridge server. This allows for a flexible, modern UI that is easy to develop and maintain.
*   **Interaction Model:** A hybrid "live" and chat-style interface, allowing for both conversational commands and real-time feedback.
*   **Input (STT):** On-device Speech-to-Text will be used for speed, offline capability, and privacy.
*   **Output (TTS):** Google's high-quality Text-to-Speech engine will provide natural-sounding voice feedback.

### 2.2 The Bridge: Local Backend Server

*   **Description:** This is the central nervous system of the application, connecting the sandboxed web frontend to the powerful execution layers.
*   **Technology:** A lightweight server built in **Node.js** using the **Express** framework, running within the Termux environment.
*   **Purpose:** It exposes a local, secure REST API. The frontend sends user commands to this API, and the Bridge server orchestrates the execution of those commands by Layers 2 and 3.

### 2.3 Layer 2: The Translator (AI Core)

*   **Description:** This is the "brain" of SynapScript, responsible for turning high-level user goals into concrete, executable plans.
*   **Technology:** The **Gemini API (free tier)**.
*   **Function 1 (The "Planner"):** It receives a user's goal (e.g., "Summarize my last email from work") and breaks it down into a logical sequence of abstract intentions (e.g., 1. Open Gmail, 2. Search for emails, 3. Open latest, etc.).
*   **Function 2 (The "Finder"):** For each intention involving UI interaction, it receives the current UI layout from the Accessibility Service and intelligently identifies the correct element to interact with (e.g., it can find the "Compose" button even if its text or ID changes).

### 2.4 Layer 3: The Executor (Action Layer)

*   **Description:** This layer is responsible for performing the actual actions on the device. It operates in a hybrid, polyglot environment.
*   **Primary Engine (UI): Android Accessibility Service:** This acts as the "robot user," capable of reading the screen and performing UI interactions like tapping, swiping, and typing within any application. This is the key to resilient UI automation.
*   **Secondary Engine (CLI): Termux CLI:** This handles all non-UI "backend" tasks, such as running shell scripts, managing files, executing command-line tools, and running code in various languages.
*   **Supported Languages:** The execution environment will support both **Node.js** and **Python**, allowing the system to use the best tool for the job (e.g., Node.js for I/O-heavy tasks, Python for data analysis).

---

## Part 3: Security & Resource Management

### 3.1 Security Model: Device Pairing & API Token Authentication

This is a mandatory, non-negotiable security layer to prevent unauthorized access.
*   **Default State:** The Bridge server rejects all incoming network requests by default.
*   **Pairing Process:** To authorize a device (e.g., a PC), the user must initiate a pairing process from the phone, which displays a temporary code. The new device enters this code to perform a secure handshake.
*   **API Tokens:** Upon successful handshake, the new device is issued a long-lived, secret API token. Every subsequent request to the server must present this token for authentication. Requests without a valid token are rejected.
*   **User Control:** The user has a dashboard within the app to view all paired devices and can instantly revoke access for any device at any time.

### 3.2 Resource Manager

To ensure system stability, a "Resource Manager" module will be implemented.
*   **Function:** Before executing any automation, this module estimates the automation's resource cost (based on heuristics) and compares it against the currently available system RAM and CPU.
*   **Action:** If a task is deemed too resource-intensive and likely to cause a crash, the manager will pause execution, warn the user, and provide intelligent suggestions (e.g., "Run this task sequentially," "Schedule for a time when the device is idle").

---

## Part 4: Technology Stack & Packages

### 4.1 Core Technologies
*   **Runtime Environments:** Node.js, Python
*   **Backend Framework:** Express.js (for the Bridge server)
*   **AI Model:** Gemini API
*   **UI Framework:** Plain HTML, CSS, JavaScript (initially)

### 4.2 Selected Packages

A "lean core" philosophy is adopted, with essential packages bundled and specialized, larger packages installed on-demand.

*   **Bundled Node.js:** `axios`, `cheerio`, `express`, `fs-extra`, `node-cron`, `dayjs`, `chalk`, `dotenv`, `commander`, `ws`.
*   **Bundled Python:** `requests`, `BeautifulSoup4`, `numpy`, `pandas`, `Pillow`, `python-dotenv`, `schedule`.
*   **On-Demand:** `puppeteer-core` (for full browser automation), `scikit-learn` (for ML), `OpenCV-Python` (for computer vision), and others as needed.

---

## Part 5: Project & Development Workflow

*   **Project Directory:** `/storage/emulated/0/SynapScript`
*   **Version Control:** The project is a Git repository.
*   **Backup:** A bare Git repository is maintained at `/storage/emulated/0/.SynapScript.bak.git`.
*   **Syncing:** The `sync_to_backup.sh` script is used to push changes from the main repository to the backup.
*   **Documentation:** All architectural and reference documents are maintained in the `/docs` directory within the repository.

This report represents the complete and final blueprint for the initial development of SynapScript.

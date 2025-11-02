# SynapScript Development Roadmap - Streamlined V1.0 MVP

This document outlines the ruthlessly simplified scope for SynapScript Version 1.0, focusing on what is realistically achievable and testable on an Android tablet within a 2-3 month timeframe. Complex features are deferred to future versions.

---

## **🔴 CUT FROM VERSION 1.0** (Too Complex/Time-Consuming)

### **1. Multi-Device Sync & Pairing** ❌
*   **Reason:** Requires complex backend/P2P, token management, and multi-device testing.
*   **Defer to:** v2.0 or later.

### **2. Template Marketplace** ❌
*   **Reason:** Requires backend database, rating/search, and ongoing maintenance.
*   **Alternative for v1:** Include 5-10 **hardcoded** pre-built templates as JSON files; user can duplicate/modify.
*   **Defer to:** v2.0.

### **3. Python Runtime** ❌
*   **Reason:** Significant download size, unreliable package management on Android without desktop tools, Node.js covers most v1 needs.
*   **Defer to:** v2.0 or v3.0.

### **4. Accessibility Service UI Automation** ⚠️ **LIMIT SCOPE**
*   **Reason:** Full semantic UI understanding is extensive and app-specific.
*   **What to include in v1:** Basic Accessibility API integration (read screen, click coordinates); support for **3 popular apps** only (e.g., WhatsApp, Chrome, Instagram); manual element selection (user taps what to automate); no AI-driven "smart finding" yet.
*   **Defer full semantic automation to:** v2.0+.

### **5. Advanced Error Recovery & Rollback** ❌
*   **Reason:** Requires tracking all system state changes and adds significant code complexity.
*   **Alternative for v1:** Simple error logging with stack traces; user sees what failed and when; manual fix/retry.
*   **Defer to:** v2.0+.

### **6. Usage Pattern Learning (Proactive Suggestions)** ❌
*   **Reason:** Requires ML model training, complex data analysis, and significant user data.
*   **Alternative for v1:** AI suggests improvements to **existing automations** only; no proactive "you should automate X" features.
*   **Defer to:** v3.0+.

### **7. Conversational Multi-Turn Refinement** ⚠️ **SIMPLIFY**
*   **Reason:** Full conversational AI requires complex state and context management.
*   **What to include in v1:** One-shot automation creation (user describes, AI generates); simple clarifying questions (max 2 follow-ups); user can edit parameters afterward with sliders/dropdowns.
*   **Defer full conversation mode to:** v2.0.

### **8. Visual Drag-and-Drop Block Builder** ⚠️ **SIMPLIFY**
*   **Reason:** Difficult to build and debug on mobile without desktop IDEs.
*   **What to include in v1:** **Static visual blocks** (display only, looks pretty); tap block → opens parameter editor (sliders, dropdowns); no drag-and-drop reordering.
*   **Defer full interactive builder to:** v2.0.

### **9. Testing Sandbox / Simulation Mode** ❌
*   **Reason:** Requires mocking entire Android environment and complex trigger simulation.
*   **Alternative for v1:** "Dry run" mode that logs what *would* happen (no actual execution); user can see AI-generated script before running.
*   **Defer to:** v2.0.

### **10. On-Demand Package Downloads (puppeteer, sharp, etc.)** ❌
*   **Reason:** Dynamic npm installation on Android is unreliable; requires custom package manager.
*   **Alternative for v1:** Bundle ONLY the 10 essential Node.js packages; everything else is "Coming in v2.0".
*   **Defer to:** v2.0.

---

## **✅ REALISTIC VERSION 1.0 MVP** (Build This)

### **Core Features (Must-Have)**

*   ✅ Natural Language Input
    *   Text input box (no voice yet).
    *   User types: "turn off wifi when I leave home".
*   ✅ AI Translation (Gemini API)
    *   Converts request → Termux commands.
    *   Generates simple visual representation.
*   ✅ Basic Visual Blocks (Display Only)
    *   Shows: Trigger → Conditions → Actions.
    *   Uses emoji icons + plain text.
    *   NOT draggable/interactive (just pretty display).
*   ✅ Parameter Editing
    *   Tap block → opens editor dialog.
    *   Sliders (battery %, distance).
    *   Dropdowns (time, day of week).
    *   Text inputs (phone numbers, messages).
*   ✅ Termux API Integration
    *   WiFi on/off.
    *   Location monitoring.
    *   Battery status.
    *   Notifications.
    *   Brightness control.
    *   SMS send (basic).
*   ✅ Manual Execution
    *   User taps "Run Now" to test.
    *   Shows success/failure notification.
*   ✅ Scheduled Execution
    *   `node-cron` for time-based triggers.
    *   Simple schedules only (daily at 9 AM).
*   ✅ Execution Logs
    *   List of runs with timestamps.
    *   Success/failure status.
    *   Tap to see details.
*   ✅ Local Storage (SQLite)
    *   Save/load automations.
    *   Store execution history.
    *   User settings.

**Estimated Development Time:** 6-8 weeks on tablet.
**User Value:** "Create 3-5 useful automations without coding."

---

### **Nice-to-Have (If Time Permits)**

*   ⚪ 5 Pre-Built Templates
    *   Hardcoded JSON (no marketplace).
    *   User can duplicate/modify.
*   ⚪ Export/Import Automations
    *   Save as JSON file.
    *   Share via messaging apps.
    *   Manual copy-paste between devices.
*   ⚪ Dark Mode
    *   System theme detection.
    *   Toggle in settings.
*   ⚪ Voice Input (STT)
    *   Use Android's built-in SpeechRecognizer.
    *   Alternative to typing.

---

## **🛠️ WHAT YOU CAN BUILD ON ANDROID TABLET**

### **✅ Definitely Possible:**

1.  **Node.js Server in Termux**
    ```bash
    pkg install nodejs
    npm install express sqlite3
    node server.js
    ```
    ✅ Works perfectly on Android

2.  **Web Frontend (HTML/CSS/JS)**
    ```
    Serve from Termux → Access via browser
    ```
    ✅ Fully buildable with text editor

3.  **SQLite Database**
    ```bash
    pkg install sqlite
    ```
    ✅ Native Android support

4.  **Gemini API Integration**
    ```javascript
    const axios = require('axios');
    axios.post('https://generativelanguage.googleapis.com/...');
    ```
    ✅ Just HTTP requests, works anywhere

5.  **Termux API Scripting**
    ```bash
    termux-wifi-enable false
    termux-location
    ```
    ✅ Built for Android

6.  **Basic Android App (if needed later)**
    ```
    Use AIDE app or Spck Editor
    Build simple WebView wrapper
    ```
    ✅ Possible but painful without IDE

---

### **❌ Extremely Difficult/Impossible (for v1):**

1.  **Accessibility Service Development**
    *   Requires Android Studio for manifest editing.
    *   Debugging without ADB is a nightmare.
    *   Testing requires recompiling APK each change.
    *   **Workaround for v1:** Skip advanced UI automation entirely. Use Termux API + manual coordinates instead.

2.  **React Native / Flutter**
    *   Can't compile native apps on Android.
    *   Need desktop for build toolchain.
    *   **Workaround:** Stick with web frontend (HTML/JS).

3.  **Complex UI Components**
    *   Drag-and-drop libraries need bundlers (webpack).
    *   Hard to debug CSS layout issues on tablet.
    *   **Workaround:** Use simple, static layouts.

4.  **Automated Testing**
    *   No Jest, no Playwright, no emulators.
    *   Can't run unit tests easily.
    *   **Workaround:** Manual testing only in v1.

5.  **Version Control (Git)**
    *   Works in Termux but awkward without desktop.
    *   Merge conflicts hard to resolve.
    *   **Workaround:** Manual backups, linear commits only.

6.  **Image/Icon Assets**
    *   Can't run Photoshop/Illustrator.
    *   Icon generation tools are desktop-only.
    *   **Workaround:** Use emoji instead of custom icons (🔋📡📍).

---

## **🎯 V1.0 SUCCESS CRITERIA**

*   ✅ User can create automation in < 2 minutes.
*   ✅ AI understands 80% of common requests correctly.
*   ✅ Automations execute reliably (95%+ success rate).
*   ✅ Battery drain < 5% per day with 5 active automations.
*   ✅ No crashes during 1-week usage.
*   ✅ 10 users can use it without your help.

---

## **🗺️ PHASED ROLLOUT PLAN**

### **Phase 0: Proof of Concept (Week 1-2)**
*   **Goal:** Prove it can work.
*   **Build:**
    *   Termux server with 1 endpoint.
    *   Gemini API integration.
    *   Generate Termux command from text.
    *   Execute command manually.
*   **Test:**
    *   "turn off wifi" → generates correct command.
    *   Command executes successfully.

### **Phase 1: MVP Backend (Week 3-4)**
*   **Goal:** Working automation engine.
*   **Build:**
    *   SQLite database.
    *   CRUD operations for automations.
    *   `node-cron` scheduling.
    *   Execution logging.
*   **Test:**
    *   Save 3 automations.
    *   Schedule runs correctly.
    *   Logs all executions.

### **Phase 2: Basic Frontend (Week 5-6)**
*   **Goal:** Usable interface.
*   **Build:**
    *   HTML input form.
    *   Display automations list.
    *   Show execution logs.
    *   Manual trigger buttons.
*   **Test:**
    *   Non-technical user can create automation.
    *   Can view history.

### **Phase 3: Visual Polish (Week 7-8)**
*   **Goal:** Looks professional.
*   **Build:**
    *   Visual block representation.
    *   Emoji icons.
    *   Parameter editors (sliders, dropdowns).
    *   Dark mode.
*   **Test:**
    *   Looks good on phone and tablet.
    *   Intuitive to use.

### **Phase 4: Beta Testing (Week 9-10)**
*   **Goal:** Find bugs, get feedback.
*   **Build:**
    *   Nothing new, just fix issues.
    *   Improve AI prompts based on failures.
    *   Add 3-5 hardcoded templates.
*   **Test:**
    *   Give to 5 friends.
    *   Document every issue.
    *   Fix critical bugs.

---

## **💡 FINAL RECOMMENDATIONS**

### **Do This:**
1.  ✅ Start with **Proof of Concept** (Week 1-2).
2.  ✅ Build **only what you can test** on your tablet.
3.  ✅ Use **emoji icons** (not custom graphics).
4.  ✅ Keep frontend **dead simple** (vanilla JS, no frameworks).
5.  ✅ Test **manually** (no automated testing in v1).
6.  ✅ Ship **minimal but working** (3 automation types is enough).

### **Don't Do This:**
1.  ❌ Don't build template marketplace (no users yet).
2.  ❌ Don't add Python runtime (unnecessary complexity).
3.  ❌ Don't attempt Accessibility Service (too hard without desktop).
4.  ❌ Don't build drag-and-drop UI (hard on tablet).
5.  ❌ Don't add multi-device sync (can't test alone).
6.  ❌ Don't try to support every Termux API command (focus on 5-7).

### **Ship v1.0 When:**

*   ✅ You can create 3 useful personal automations.
*   ✅ They run reliably for 1 week.
*   ✅ Your friend can use it without asking questions.
*   ✅ Logs show what happened (debugging works).
*   ✅ AI succeeds on 8/10 common requests.

---

**Bottom Line:** Your original vision is incredible, but v1.0 needs to be **ruthlessly simplified** to what you can actually build and test on a tablet in 2-3 months. Ship the simplest possible thing that delivers value, get real users, then add complexity based on their feedback.
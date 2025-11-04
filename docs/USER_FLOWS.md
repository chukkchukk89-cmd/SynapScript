# SynapScript User Flows (V1.0 MVP)

This document outlines the initial user flows for the SynapScript V1.0 Minimum Viable Product. These flows are focused on core interactions, primarily demonstrating direct API usage and the newly implemented Text-to-Speech (TTS) functionality.

## 1. Device Pairing and API Token Generation

**Goal:** A new device or client wants to securely connect to the SynapScript Bridge server.

**Steps:**
1.  **Initiate Pairing:** The client sends an HTTP POST request to `/api/pair/initiate`.
    *   **Server Action:** Generates a short, temporary pairing code (e.g., `XDMJTW`) and its expiry time (e.g., 5 minutes).
    *   **Client Response:** Receives the pairing code and expiry. The user would typically see this code displayed on a primary (trusted) device.
2.  **Verify Pairing:** The client sends an HTTP POST request to `/api/pair/verify` with the received `code` in the request body.
    *   **Server Action:** Validates the code against active pairing codes and checks expiry.
    *   **Client Response (Success):** If valid, the server returns a long-lived `apiToken` (e.g., `sYIgx2Cb6_twSwJEqNg1iP-0R377XxGm`). This token is now used for all authenticated requests.
    *   **Client Response (Failure):** If the code is invalid or expired, an error message is returned.

**Example `curl` commands:**

```bash
# Initiate Pairing
curl -X POST http://localhost:3000/api/pair/initiate

# Verify Pairing (replace CODE with the one you received)
curl -X POST -H "Content-Type: application/json" -d '{"code":"YOUR_CODE_HERE"}' http://localhost:3000/api/pair/verify
```

## 2. Text-to-Speech (TTS) Command

**Goal:** The client wants the SynapScript Bridge to make the Android device speak a specific text phrase.

**Steps:**
1.  **Authentication:** The client includes the valid `apiToken` obtained during pairing in the `Authorization` header (as a Bearer token).
2.  **Send Speak Request:** The client sends an HTTP GET request to `/api/speak`, including the text to be spoken as a `text` query parameter.
    *   **Server Action:**
        *   Authenticates the `apiToken`.
        *   Validates the `text` parameter.
        *   Executes the `termux-tts-speak` command on the Android device with the provided text.
        *   Includes a 5-second timeout for the TTS command.
        *   Logs command execution details (`stdout`, `stderr`) to `server_startup.log`.
    *   **Client Response (Success):** If the TTS command executes without error within the timeout, returns `{"success":true, "message":"Spoke: \"Your text here\""}`.
    *   **Client Response (Failure):** If the TTS command fails, times out, or the token is invalid, an appropriate error message is returned.

**Example `curl` command:**

```bash
# Speak Text (replace YOUR_API_TOKEN with your actual token)
curl -X GET -H "Authorization: Bearer YOUR_API_TOKEN" "http://localhost:3000/api/speak?text=Hello%20SynapScript%20user!%20I%20am%20now%20speaking."
```

## 3. Future User Flows (V1.0 Roadmap)

These flows are planned for later stages of V1.0 development:

*   **Natural Language Automation Creation:** User provides a natural language request, which the AI translates into an automation script.
*   **Automation Management:** View, edit, enable/disable, and delete created automations.
*   **Scheduled Automation Execution:** Automations triggered based on time schedules.
*   **Manual Automation Trigger:** Manually initiate an automation.
*   **Automation Execution Logging:** View historical execution logs for automations.
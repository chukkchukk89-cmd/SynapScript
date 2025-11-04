# SynapScript Testing Strategy

This document outlines the testing strategy for SynapScript, focusing on the current V1.0 MVP development phase. Given the constraints of developing on an Android tablet, the primary testing approach is manual and iterative, with a strong emphasis on logging and direct command execution for debugging.

## 1. Core Principles

*   **Manual Verification:** All features are manually tested on the target Android device (tablet).
*   **Logging-Driven Debugging:** Extensive use of console logging and file-based logs (`server_startup.log`) to trace execution flow, identify errors, and capture command output.
*   **Iterative Testing:** Features are tested immediately after implementation to ensure functionality before proceeding.
*   **Isolation:** When issues arise, components are isolated (e.g., direct shell command execution vs. server execution) to pinpoint the source of the problem.

## 2. Testing Phases (V1.0 MVP)

### 2.1 Unit/Module Testing (Manual)

*   **Objective:** Verify the functionality of individual modules or functions.
*   **Methodology:**
    *   Direct execution of Node.js scripts containing the module's logic.
    *   Using `console.log` extensively to inspect variable states and function outputs.
    *   For modules interacting with external commands (e.g., `speaker` module), direct shell execution of those commands (`termux-tts-speak`) to confirm their standalone functionality.

### 2.2 Integration Testing (Manual)

*   **Objective:** Verify that different components of the system work together as expected.
*   **Methodology:**
    *   **API Endpoint Testing:** Using `curl` commands to interact with the Express.js server endpoints (e.g., `/api/pair/initiate`, `/api/pair/verify`, `/api/speak`, and automation CRUD endpoints).
    *   **Database Interaction Testing:** Manually verifying CRUD operations for automations and API tokens directly in the SQLite database (e.g., using `sqlite3` CLI tool).
    *   **Token-Based Authentication:** Ensuring that API tokens are correctly generated, validated, and used for protected routes.
    *   **Module Integration:** Confirming that server routes correctly call and receive responses from internal modules (e.g., `speaker` module).
### 2.3 System Testing (Manual)

*   **Objective:** Verify the end-to-end functionality of a user-facing feature.
*   **Methodology:**
    *   Simulating user interactions (e.g., sending a natural language command via a `curl` request, expecting a spoken response).
    *   Monitoring server logs for expected output and error messages.
    *   Direct observation of device behavior (e.g., hearing TTS output).

## 3. Debugging Procedures

*   **Server Logs (`server_startup.log`):** This file is continuously monitored for output from the Node.js server, including custom `console.log` statements and any `stdout`/`stderr` from child processes.
*   **Direct Shell Execution:** When a command executed by the server fails or hangs, the command is executed directly in the Termux shell to isolate whether the issue is with the command itself or its execution context within Node.js.
*   **Process Monitoring:** Using `pgrep` and `kill` to manage server processes during development and ensure clean restarts.
*   **Timeout Mechanisms:** Implementing explicit timeouts for child processes (`setTimeout` with `child.kill()`) to prevent server hangs and provide clearer error messages for unresponsive external commands.

## 4. Specific Testing Notes

*   **Termux API Commands:** Verification of `termux-api` package installation (`pkg install termux-api`) and manual confirmation of Termux:API app permissions and Android TTS engine configuration are critical initial steps for any feature relying on Termux API.
*   **API Token Management:** API tokens are now persistently stored in the SQLite database. This means tokens will persist across server restarts, simplifying testing of protected routes.

## 5. Future Considerations (Post V1.0)

*   **Automated Unit Tests:** Introduction of a testing framework (e.g., Jest) for automated unit tests of individual JavaScript modules.
*   **Integration Test Suite:** Development of automated scripts to test API endpoints and module interactions.
*   **UI Testing:** Once a frontend is developed, explore tools for automated UI testing (though this is challenging on-device).
*   **Performance Benchmarking:** Measure response times and resource consumption for key operations.
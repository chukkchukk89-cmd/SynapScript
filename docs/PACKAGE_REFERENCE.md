# SynapScript Package Reference

This document outlines the essential Node.js packages bundled for SynapScript Version 1.0.

## **Core Philosophy (V1.0)**

- **Lean Core:** Bundle a minimal set of essential, lightweight packages to cover ~95% of common automation tasks without bloating the application.
- **Zero On-Demand Complexity:** All necessary packages for v1.0 are pre-bundled. No dynamic downloads are required.

---

## **V1.0 Bundled Packages (12 Essential Node.js Packages)**

These packages will be pre-included in the SynapScript environment.

***

### **1. axios**
**Size:** ~500KB | **Downloads:** 50M+/week

**Applications in SynapScript:**
```
✓ API Requests & Webhooks
  • Post automation results to Discord/Slack
  • Fetch data from REST APIs (weather, stocks, news)
  • Send notifications to external services
  • Trigger IFTTT/Zapier workflows

✓ Cloud Integrations
  • Upload files to cloud storage APIs
  • Sync automation data across devices
  • Authenticate with OAuth services
  • Download content from URLs

✓ Device-to-Device Communication
  • Send commands to other phones running SynapScript
  • Sync settings between tablet and phone
  • Remote trigger automations
  
Example Uses:
• "Post to my Discord when battery is low"
• "Fetch top Reddit posts and notify me"
• "Upload photos to my server when on WiFi"
• "Check if website is down and alert me"
```

***

### **2. cheerio**
**Size:** ~300KB | **Downloads:** 8M+/week

**Applications in SynapScript:**
```
✓ Lightweight Web Scraping
  • Extract prices from shopping sites
  • Monitor website changes (new posts, updates)
  • Parse HTML from API responses
  • Read RSS feeds and news sites
  
✓ Data Extraction
  • Pull contact info from web pages
  • Extract links, images, or specific text
  • Parse structured data (tables, lists)
  • Get meta information from URLs

✓ Content Monitoring
  • Check if favorite YouTuber posted new video
  • Monitor job boards for new listings
  • Track product availability
  • Get sports scores from ESPN
  
Example Uses:
• "Alert me when product goes on sale"
• "Get daily top Hacker News stories"
• "Monitor Craigslist for new apartments"
• "Extract emails from company website"
```

***

### **3. express**
**Size:** ~200KB | **Downloads:** 35M+/week

**Applications in SynapScript:**
```
✓ Local API Server
  • Turn phone into automation endpoint
  • Trigger automations from computer browser
  • Create custom webhooks for other services
  • Build local control panel

✓ Multi-Device Control
  • Control phone from laptop via REST API
  • Tablet triggers phone automations
  • Voice assistant integration (Alexa → phone)
  • Home automation hub connection
  
✓ Web Interface
  • Alternative UI accessible via browser
  • Debug automations from desktop
  • Share automation controls with family
  • Remote monitoring dashboard

Example Uses:
• "Let me trigger phone actions from my PC"
• "Create API endpoint: /trigger/bedtime-mode"
• "Build web dashboard to see automation status"
• "Accept webhook calls from IFTTT"
```

***

### **4. fs-extra**
**Size:** ~100KB | **Downloads:** 20M+/week

**Applications in SynapScript:**
```
✓ File Organization
  • Auto-sort downloads by file type
  • Move photos from DCIM to organized folders
  • Clean up old files automatically
  • Rename files in bulk with patterns

✓ Backup & Sync
  • Copy important files to backup folder
  • Mirror folders for redundancy
  • Create automated archives
  • Sync files between storage locations
  
✓ File Management
  • Check if file exists before action
  • Read/write JSON config files
  • Create folder structures dynamically
  • Delete empty directories

✓ Data Processing
  • Read CSV/JSON files for automation input
  • Write automation logs to files
  • Process downloaded files
  • Generate reports
  
Example Uses:
• "Organize downloads into folders by type"
• "Backup photos to external SD card weekly"
• "Delete screenshots older than 30 days"
• "Copy work files to secure folder daily"
```

***

### **5. node-cron**
**Size:** ~50KB | **Downloads:** 5M+/week

**Applications in SynapScript:**
```
✓ Scheduled Automations
  • Run tasks at specific times
  • Daily, weekly, monthly routines
  • Complex schedules (every weekday at 9 AM)
  • Time-zone aware scheduling

✓ Recurring Tasks
  • Send reminders on schedule
  • Periodic data backups
  • Regular health checks
  • Cleanup tasks
  
✓ Calendar Integration
  • Execute before/after events
  • Workday vs weekend logic
  • Holiday-aware automations
  • Season-based rules

Example Uses:
• "Backup photos every Sunday at 2 AM"
• "Send 'good morning' text at 8 AM weekdays"
• "Clean downloads folder every Friday"
• "Check server status every 30 minutes"
```

***

### **6. dayjs**
**Size:** ~7KB | **Downloads:** 20M+/week

**Applications in SynapScript:**
```
✓ Time Calculations
  • Check if within time window
  • Calculate duration between events
  • Add/subtract time from timestamps
  • Convert between time zones

✓ Date Formatting
  • Display times in readable format
  • Generate timestamps for logs
  • Parse date strings from APIs
  • Format for different locales
  
✓ Conditional Logic
  • "Only run on weekdays"
  • "Between 9 AM and 5 PM"
  • "First Monday of month"
  • "Within 30 minutes of event"

Example Uses:
• "Run only during work hours (9-5)"
• "Calculate time until next appointment"
• "Format automation logs with timestamps"
• "Check if it's been 24 hours since last run"
```

***

### **7. chalk**
**Size:** ~50KB | **Downloads:** 40M+/week

**Applications in SynapScript:**
```
✓ Terminal Output Styling
  • Color-code success/error messages
  • Highlight important information
  • Create visual separators in logs
  • Make debugging easier

✓ Log Readability
  • Green for success, red for errors
  • Yellow for warnings
  • Blue for info messages
  • Bold for critical alerts
  
✓ Power User Experience
  • Better code view experience
  • Syntax highlighting in terminal
  • Visual feedback during execution
  • Status indicators

Example Uses:
• Color automation execution logs
• Highlight errors in red when debugging
• Make success messages stand out in green
• Create formatted status reports
```

***

### **8. dotenv**
**Size:** ~20KB | **Downloads:** 35M+/week

**Applications in SynapScript:**
```
✓ Configuration Management
  • Store API keys securely
  • Manage app settings in one place
  • Separate config from code
  • Easy updates without code changes

✓ Security Best Practices
  • Never hardcode API keys
  • Keep secrets in .env file
  • Different configs for test/production
  • Share automations without exposing keys
  
✓ User Customization
  • Per-user settings
  • Device-specific configurations
  • Environment variables for scripts
  • Portable automation templates

Example Uses:
• Store Discord webhook URL securely
• Save home location coordinates
• Keep API keys for weather services
• Configure personal preferences
```

***

### **9. commander**
**Size:** ~100KB | **Downloads:** 30M+/week

**Applications in SynapScript:**
```
✓ CLI Interface
  • Create command-line tools
  • Parse automation arguments
  • Build interactive scripts
  • Add flags and options

✓ Manual Triggers
  • Run automations with parameters
  • Override default behavior
  • Test with different inputs
  • Power user shortcuts
  
✓ Script Building
  • Parse user commands
  • Create subcommands
  • Add help documentation
  • Validate inputs

Example Uses:
• "backup --folder=photos --compress"
• Create CLI for manual automation triggers
• Parse complex automation commands
• Build scriptable interfaces
```

***

### **10. ws (WebSocket)**
**Size:** ~100KB | **Downloads:** 10M+/week

**Applications in SynapScript:**
```
✓ Real-Time Communication
  • Live data feeds (crypto prices, stocks)
  • Push notifications from servers
  • Two-way communication channels
  • Event-driven updates

✓ Device Sync
  • Real-time status across devices
  • Instant automation triggers
  • Live activity monitoring
  • Collaborative features
  
✓ External Integrations
  • Connect to WebSocket APIs
  • Real-time chat integrations
  • Live dashboard updates
  • Streaming data processing

Example Uses:
• "Monitor crypto prices and alert on change"
• "Connect to Discord for live notifications"
• "Real-time sync between phone and tablet"
• "Stream sensor data to server"
```

***

### **11. csv-parser (NEW)**
**Size:** ~100KB | **Downloads:** 10M+/week (estimate)

**Applications in SynapScript:**
```
✓ Data Processing
  • Parse CSV files (bank statements, contacts)
  • Convert data formats
  • Process exported data
  • Generate reports

Example Uses:
• "Parse bank CSV and categorize expenses"
• "Convert contacts CSV to JSON"
• "Process spreadsheet data"
```

***

### **12. qrcode (NEW)**
**Size:** ~50KB | **Downloads:** 5M+/week (estimate)

**Applications in SynapScript:**
```
✓ QR Code Generation
  • Generate QR codes for sharing text/links
  • Create QR codes for Wi-Fi credentials
  • Generate QR codes for payment requests

Example Uses:
• "Generate QR code for my Wi-Fi password"
• "Create QR code for a URL"
```

---

## **Package Summary (V1.0)**

| Package | Bundled? | Size | Primary Use |
|---|---|---|---|
| **axios** | ✅ Yes | 500KB | API calls, webhooks |
| **cheerio** | ✅ Yes | 300KB | Web scraping |
| **express** | ✅ Yes | 200KB | Local API server |
| **fs-extra** | ✅ Yes | 100KB | File operations |
| **node-cron** | ✅ Yes | 50KB | Scheduling |
| **dayjs** | ✅ Yes | 7KB | Date/time |
| **chalk** | ✅ Yes | 50KB | Terminal colors |
| **dotenv** | ✅ Yes | 20KB | Config/secrets |
| **commander** | ✅ Yes | 100KB | CLI parsing |
| **ws** | ✅ Yes | 100KB | WebSockets |
| **csv-parser** | ✅ Yes | 100KB | Data parsing |
| **qrcode** | ✅ Yes | 50KB | QR generation |

**Total Bundled Size:** ~1.6MB for all 12 essential packages
**Base APK Impact:** Minimal - Node.js itself is ~50MB, packages are negligible

---

## **Future Considerations (Post V1.0)**

### **Coming Soon (Deferred to V2.0+)**

*   **Browser automation:** `puppeteer`
*   **Advanced image processing:** `sharp`
*   **Email sending:** `nodemailer`
*   **Cloud database:** `mongoose`

### **Manual Additions (via Termux CLI)**

Users can manually install these tools via Termux for advanced use cases:
*   `imagemagick` (for advanced photo manipulation)
*   `ffmpeg` (for video processing)
*   `git` (for version control)
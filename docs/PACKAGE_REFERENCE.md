# SynapScript Package Reference

This document outlines the essential and on-demand Node.js packages selected for the SynapScript project.

## **Core Philosophy**

- **Lean Core:** Bundle a minimal set of essential, lightweight packages to cover ~90% of common automation tasks without bloating the application.
- **On-Demand Power:** For larger, more specialized packages (like browser automation or image processing), prompt the user for a one-time download. This keeps the initial install small and respects user resources.
- **Transparency:** Clearly justify why a package is needed when prompting for a download.

---

## **Top 10 Bundled Packages**

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

## **BONUS: Top 5 On-Demand Packages**

### **11. puppeteer-core** (15MB - Download when needed)
```
Applications:
• Full browser automation (click, scroll, type)
• JavaScript-heavy website scraping
• Auto-fill web forms
• Screenshot/PDF generation
• Social media automation (LinkedIn, Twitter)

Example Uses:
• "Auto-apply to jobs on LinkedIn"
• "Post Instagram photo with caption"
• "Fill out forms automatically"
• "Take screenshots of websites"
```

***

### **12. sharp** (7MB - Download when needed)
```
Applications:
• Resize images in bulk
• Compress photos for storage
• Convert image formats (JPG→WebP)
• Remove EXIF metadata
• Generate thumbnails

Example Uses:
• "Compress all photos to 1MB"
• "Resize images to 1080p"
• "Convert screenshots to WebP"
• "Remove GPS data from photos"
```

***

### **13. nodemailer** (1MB - Download when needed)
```
Applications:
• Send email notifications
• Email reports/logs
• Automated email responses
• File attachments via email

Example Uses:
• "Email me when automation fails"
• "Send daily activity report"
• "Auto-reply to work emails"
• "Email backups to myself"
```

***

### **14. mongoose** (1MB - Download when needed)
```
Applications:
• Store automation data in MongoDB
• Cloud sync via MongoDB Atlas
• Complex data queries
• Multi-device data sharing

Example Uses:
• "Store automation history in cloud"
• "Sync settings across devices"
• "Query past automation runs"
• "Build analytics dashboard"
```

***

### **15. csv-parser / json2csv** (100KB each - Download when needed)
```
Applications:
• Parse CSV files (bank statements, contacts)
• Convert data formats
• Process exported data
• Generate reports

Example Uses:
• "Parse bank CSV and categorize expenses"
• "Convert contacts CSV to JSON"
• "Export automation logs to CSV"
• "Process spreadsheet data"
```

***

## **Package Selection Matrix**

| Package | Bundled? | Size | Primary Use | Triggers |
|---|---|---|---|---|
| **axios** | ✅ Yes | 500KB | API calls, webhooks | Most automations |
| **cheerio** | ✅ Yes | 300KB | Web scraping | Content monitoring |
| **express** | ✅ Yes | 200KB | Local API server | Remote control |
| **fs-extra** | ✅ Yes | 100KB | File operations | File management |
| **node-cron** | ✅ Yes | 50KB | Scheduling | Time-based tasks |
| **dayjs** | ✅ Yes | 7KB | Date/time | Conditional logic |
| **chalk** | ✅ Yes | 50KB | Terminal colors | Logging |
| **dotenv** | ✅ Yes | 20KB | Config/secrets | All automations |
| **commander** | ✅ Yes | 100KB | CLI parsing | Manual triggers |
| **ws** | ✅ Yes | 100KB | WebSockets | Real-time data |
| **puppeteer-core** | ❌ No | 15MB | Browser automation | Web actions |
| **sharp** | ❌ No | 7MB | Image processing | Photo tasks |
| **nodemailer** | ❌ No | 1MB | Email sending | Notifications |
| **mongoose** | ❌ No | 1MB | Database | Data storage |
| **csv-parser** | ❌ No | 100KB | Data parsing | File processing |

**Total Bundled Size:** ~1.4MB for all 10 essential packages
**Base APK Impact:** Minimal - Node.js itself is ~50MB, packages are negligible

***

## **AI Package Selection Logic**

```markdown
When user requests automation:

1. Analyze requirements
2. Check if bundled packages suffice
3. If YES → Use immediately, no prompt
4. If NO → Suggest download with justification

Example:
User: "Scrape Amazon prices"
→ Needs: HTTP client + HTML parser
→ Check: axios ✓, cheerio ✓
→ Action: Use bundled packages
→ No download needed

User: "Auto-apply to jobs"
→ Needs: Full browser automation
→ Check: puppeteer ✗
→ Action: Prompt "Download puppeteer-core (15MB)?"
→ Explain: "Needed to click buttons and fill forms"
```

This gives you **90% automation coverage** with just 1.4MB of packages, keeping your app lean while being incredibly powerful.

---

## **Essential Python Packages**

To enable powerful data science, machine learning, and advanced scripting, SynapScript also supports a polyglot environment with Python.

### Bundled (Pre-installed)

1.  **requests:** The standard for making HTTP requests (Python's `axios`).
2.  **BeautifulSoup4:** The best library for parsing HTML and XML (Python's `cheerio`).
3.  **numpy:** The fundamental package for scientific computing and a dependency for many data science libraries.
4.  **pandas:** The ultimate tool for data manipulation and analysis (reading CSVs, data cleanup, etc.).
5.  **Pillow (PIL Fork):** A powerful-yet-friendly library for most image manipulation tasks (resizing, cropping, converting).
6.  **python-dotenv:** For managing secrets and configuration in `.env` files.
7.  **schedule:** A very intuitive library for scheduling jobs (e.g., `schedule.every().day.at("10:30").do(job)`).

### On-Demand (Downloaded when needed)



1.  **scikit-learn:** The gold standard for classical machine learning algorithms.

2.  **OpenCV-Python:** For advanced, real-time computer vision tasks.

3.  **TensorFlow Lite / ONNX Runtime:** For running optimized, pre-trained AI models on-device.

4.  **spaCy:** For advanced, production-grade Natural Language Processing.



---



## Package Management Implementation



### On-Demand Installation

When AI determines a package is needed:



1.  Check if already cached: `/data/data/com.termux/files/home/.npm-cache/`

2.  If not cached:

    *   Show user: "Download [package] ([size])? [Benefits]"

    *   If approved: Download pre-compiled bundle from CDN.

    *   Extract to cache directory.

    *   Link to `node_modules` (for Node.js) or Python's `site-packages`.

3.  Execute automation with package.



### Updates

*   Bundled packages: Updated with app releases.

*   Cached packages: Check monthly, prompt user for updates.

*   Security patches: Auto-update, notify user.



### Cleanup

*   Settings → Storage Manager.

*   Show installed packages with sizes.

*   User can remove unused packages.

*   Auto-suggest removal if storage < 500MB.

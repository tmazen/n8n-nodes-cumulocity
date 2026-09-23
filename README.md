# n8n-nodes-cumulocity

An enterprise-grade community node for [n8n](https://n8n.io) that enables native, declarative orchestration of [Cumulocity](https://www.cumulocity.com/) resources. 

Designed specifically to power multi-agent AI workflows, this node features pre-execution validation guards, custom JSON fragment injection, and complete REST API coverage across Cumulocity inventory, measurements, alarms, events, identity, operations, and asset hierarchies.

---

## Key Features

* **Inventory Management**: Provision devices, create managed objects, and query inventory by ID, Name, or Type.
* **Measurements**: Ingest time-series sensor data (water flow, temperature, pressure, power, etc.) with automatic ISO 8601 formatting (`{{ $now.toISO() }}`).
* **Alarms & Events**: Raise, query, update, acknowledge, and clear alarms by ID/severity, and log audit/historical events.
* **Identity Management**: Bind hardware identifiers (Serials, IMEIs, MAC addresses) to internal Cumulocity device IDs.
* **Operations**: Dispatch remote device control operations (`c8y_Restart`, `c8y_Configuration`, shell commands) and track execution states.
* **Asset Hierarchies**: Model complex parent-child asset structures and assign child devices to groups.
* **Multi-Agent Safeguards**: Built-in IIFE validation guards throw immediate `VALIDATION_ERROR` responses before network execution if required parameters are missing.

---

## Installation & Local Development

### Prerequisites

* **Node.js** (v18 or v20 recommended)
* **npm** (v9+)
* **Docker** (for local n8n testing)

### 1. Clone & Install Dependencies

```bash
git clone [https://github.com/YOUR_USERNAME/n8n-nodes-cumulocity.git](https://github.com/YOUR_USERNAME/n8n-nodes-cumulocity.git)
cd n8n-nodes-cumulocity
npm install
```
### 2. Build the Extension

Compile the TypeScript definitions and copy the SVG icons to the `dist/` build directory:

```bash
npm run build
```
## Deployment & Docker Integration

To deploy and test your compiled node in a local n8n Docker setup, sync the build output directly to your n8n custom node directory and restart the container:

```bash
# 1. Compile TypeScript and build assets
npm run build

# 2. Sync node package into your n8n Docker custom node_modules folder
rsync -av --delete --exclude 'node_modules' ./ /path/to/n8n/docker/custom/node_modules/n8n-nodes-cumulocity/

# 3. Restart n8n Docker container
docker restart <YOUR_CONTAINER_ID_OR_NAME>
```

> **Note:** After restarting Docker, perform a hard refresh in your browser (**Cmd + Shift + R** or **Ctrl + F5**) and re-add the node onto the n8n canvas to ensure the web UI loads the latest schema definitions.

## Multi-Agent Architecture Compatibility

This node is engineered to plug directly into an **AI Agent Orchestrator** in n8n. Sub-agents can invoke specific resources and operations using `$fromAI()` tool parameters:

| **Sub-Agent** | **Primary Resource** | **Primary Operations** |
|---|---|---|
| **Inventory Agent** | `inventory` | `createDevice`, `getByName`, `getById`, `updateById` |
| **Measurement Agent** | `measurement` | `createMeasurement`, `getBySource`, `getByType` |
| **Alarm Agent** | `alarm` | `createAlarm`, `getBySeverity`, `updateStatus`, `updateSeverity` |
| **Event Agent** | `event` | `createEvent`, `getBySource` |
| **Identity Agent** | `identity` | `createExternalId`, `getExternalId` |
| **Operations Agent** | `operation` | `createOperation`, `updateStatus` |
| **Asset Agent** | `asset` | `assignChildDevice`, `getChildDevices` |

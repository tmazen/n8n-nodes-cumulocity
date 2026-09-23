# n8n-nodes-cumulocity

An enterprise-grade community node for [n8n](https://n8n.io/) that enables native, declarative orchestration of [Cumulocity](https://www.cumulocity.com/) resources.

## Node Descriptions

-   **Standard n8n Workflows**: A high-performance IoT integration node for Cumulocity REST APIs. Use it to automate device provisioning, stream time-series sensor telemetry, trigger system alarms, log audit events, bind hardware identity mappings, issue control operations, and manage asset hierarchies natively within n8n canvas workflows.

-   **n8n AI & Multi-Agent Workflows**: An AI-native tool node designed for the n8n AI Agent Orchestrator and specialized sub-agents. Features pre-execution IIFE validation guards that catch missing parameters before network execution, structured tool schema signatures via `$fromAI()`, and dynamic JSON fragment injection to support LLM-driven IoT orchestration.

## Key Features

-   **Inventory Management**: Provision devices, create managed objects, and query inventory by ID, Name, or Type.

-   **Measurements**: Ingest time-series sensor data (water flow, temperature, pressure, power, etc.) with automatic ISO 8601 formatting (`{{ $now.toISO() }}`).

-   **Alarms**: Raise, query by device or severity level, acknowledge, clear, and update alarm status and severity by ID.

-   **Events**: Log operational, audit, and historical events, query recorded device event histories, and delete event records.

-   **Identity Management**: Bind hardware identifiers (Serials, IMEIs, MAC addresses) to internal Cumulocity device IDs.

-   **Operations**: Dispatch remote device control operations (`c8y_Restart`, `c8y_Configuration`, shell commands) and track execution states.

-   **Asset Hierarchies**: Model complex parent-child asset structures and assign child devices to groups.

-   **Multi-Agent Safeguards**: Built-in IIFE validation guards throw immediate `VALIDATION_ERROR` responses before network execution if required parameters are missing.

## Installation & Local Development

### Prerequisites

-   **Node.js** (v18 or v20 recommended)

-   **npm** (v9+)

-   **Docker** (for local n8n testing)

### 1\. Clone & Install Dependencies

Bash

```
git clone https://github.com/YOUR_USERNAME/n8n-nodes-cumulocity.git
cd n8n-nodes-cumulocity
npm install
```

### 2\. Build the Extension

Compile the TypeScript definitions and copy the SVG icons to the `dist/` build directory:

Bash

```
npm run build
```

## Deployment & Docker Integration

To deploy and test your compiled node in a local n8n Docker setup, sync the build output directly to your n8n custom node directory and restart the container:

Bash

```
# 1. Compile TypeScript and build assets
npm run build

# 2. Sync node package into your n8n Docker custom node_modules folder
rsync -av --exclude 'node_modules' ./ /path/to/n8n/docker/custom/node_modules/n8n-nodes-cumulocity/

# 3. Restart n8n Docker container
docker restart <YOUR_CONTAINER_ID_OR_NAME>
```

> **Note:** After restarting Docker, perform a hard refresh in your browser (**Cmd + Shift + R** or **Ctrl + F5**) and re-add the node onto the n8n canvas to ensure the web UI loads the latest schema definitions.

## Multi-Agent Architecture Compatibility

This node is engineered to plug directly into an **AI Agent Orchestrator** in n8n. Sub-agents can invoke specific resources and operations using `$fromAI()` tool parameters:

| **Sub-Agent** | **Primary Resource** | **Primary Operations** |
| --- | --- | --- |
| **Inventory Agent** | `inventory` | `createDevice`, `createManagedObject`, `getById`, `getByName`, `getByType`, `getDevices` |
| **Measurement Agent** | `measurement` | `createMeasurement`, `getBySource`, `getByType`, `getByFragmentType`, `deleteById` |
| **Alarm Agent** | `alarm` | `createAlarm`, `getById`, `getBySource`, `getByFragmentType`, `getBySeverity`, `getByStatus`, `updateStatus`, `updateSeverity`, `deleteById` |
| **Event Agent** | `event` | `createEvent`, `getById`, `getBySource`, `deleteById` |
| **Operations Agent** | `operation` | `createOperation`, `getById`, `getByDevice`, `updateStatusById` |
| **Identity Agent** | `identity` | `createExternalId`, `getExternalId`, `getAllExternalIds`, `deleteExternalId` |
| **Asset Agent** | `asset` | `assignChildDevice`, `assignChildAsset`, `getChildDevices`, `unassignChildDevice` |

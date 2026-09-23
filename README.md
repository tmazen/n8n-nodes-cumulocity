# n8n-nodes-cumulocity

An enterprise-grade community node for [n8n](https://n8n.io) that enables native, declarative orchestration of [Cumulocity](https://www.cumulocity.com/) resources. 

Designed specifically to power multi-agent AI workflows, this node features pre-execution validation guards, custom JSON fragment injection, and complete REST API coverage across Cumulocity inventory, measurements, alarms, events, identity, operations, and asset hierarchies.

---

## Key Features

* **Inventory Management**: Provision devices, create managed objects, and query inventory by ID, Name, or Type.
* **Telemetry & Measurements**: Ingest time-series sensor data (water flow, temperature, pressure, power, etc.) with automatic ISO 8601 formatting (`{{ $now.toISO() }}`).
* **Alarms & Events**: Raise, query, update, acknowledge, and clear alarms by ID/severity, and log audit/historical events.
* **Identity Management**: Bind hardware identifiers (Serials, IMEIs, MAC addresses) to internal Cumulocity device IDs.
* **Operations & Control**: Dispatch remote device control operations (`c8y_Restart`, `c8y_Configuration`, shell commands) and track execution states.
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

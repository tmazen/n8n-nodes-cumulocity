import { INodeProperties } from 'n8n-workflow';

export const alarmOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['alarm'] } },
		options: [
			{
				name: 'Create Alarm',
				value: 'createAlarm',
				action: 'Create a new device alarm',
				description: 'Raise a new alarm for a target device in Cumulocity',
				routing: {
					request: {
						method: 'POST',
						url: '/alarm/alarms',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.alarm+json',
							Accept: 'application/vnd.com.nsn.cumulocity.alarm+json',
						},
						body: '={{ (() => { const rawSrc = ($parameter && $parameter["sourceId"]) ? String($parameter["sourceId"]).trim() : ""; const srcId = rawSrc.replace(/[^0-9]/g, ""); if (!srcId || srcId === "") { throw new Error("VALIDATION_ERROR: Missing required parameter \'sourceId\' (Device ID). A valid numeric device ID is required to create an alarm."); } const typeVal = ($parameter && $parameter["type"] && String($parameter["type"]).trim() !== "") ? String($parameter["type"]).trim() : ""; if (!typeVal) { throw new Error("VALIDATION_ERROR: Missing required parameter \'type\'. Specify an alarm type string (e.g. c8y_HighTemperatureAlarm)."); } const textVal = ($parameter && $parameter["text"] && String($parameter["text"]).trim() !== "") ? String($parameter["text"]).trim() : ""; if (!textVal) { throw new Error("VALIDATION_ERROR: Missing required parameter \'text\'. A descriptive alarm message must be provided."); } const severityVal = ($parameter && $parameter["severity"]) ? String($parameter["severity"]).toUpperCase() : "CRITICAL"; const statusVal = ($parameter && $parameter["status"]) ? String($parameter["status"]).toUpperCase() : "ACTIVE"; const timeVal = ($parameter && $parameter["timestamp"] && String($parameter["timestamp"]).trim() !== "") ? String($parameter["timestamp"]).trim() : new Date().toISOString(); let extra = {}; try { const rawJson = $parameter["customJson"]; if (rawJson) { if (typeof rawJson === "string" && rawJson.trim() !== "") { extra = JSON.parse(rawJson); } else if (typeof rawJson === "object" && !Array.isArray(rawJson)) { extra = rawJson; } } } catch(e){} return Object.assign({ source: { id: srcId }, type: typeVal, text: textVal, severity: severityVal, status: statusVal, time: timeVal }, extra); })() }}',
					},
				},
			},
			{
				name: 'Get Alarm by ID',
				value: 'getById',
				action: 'Get an alarm by unique ID',
				description: 'Retrieve details of a specific alarm by its internal ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/alarm/alarms/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for fetching alarm."); } return cleanId; })() }}',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.alarm+json' },
					},
				},
			},
			{
				name: 'Get Alarms by Source ID',
				value: 'getBySource',
				action: 'Get alarms for a specific device source ID',
				description: 'Retrieve recorded alarms filtered by device source ID',
				routing: {
					request: {
						method: 'GET',
						url: '/alarm/alarms',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.alarmCollection+json' },
						qs: {
							source: '={{ (() => { const srcId = String($parameter["sourceId"] || "").replace(/[^0-9]/g, ""); if (!srcId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'sourceId\' to query alarms."); } return srcId; })() }}',
							severity: '={{ $parameter["severity"] ? String($parameter["severity"]).toUpperCase() : undefined }}',
							status: '={{ $parameter["status"] ? String($parameter["status"]).toUpperCase() : undefined }}',
							pageSize: '={{ $parameter["pageSize"] || $parameter["limit"] || 50 }}',
							currentPage: '={{ $parameter["currentPage"] || 1 }}',
							withTotalPages: 'true',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'alarms' } }],
					},
				},
			},
			{
				name: 'Get Alarms by Severity',
				value: 'getBySeverity',
				action: 'Get alarms filtered by severity level',
				description: 'Retrieve alarms across devices filtered by severity (CRITICAL, MAJOR, MINOR, WARNING)',
				routing: {
					request: {
						method: 'GET',
						url: '/alarm/alarms',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.alarmCollection+json' },
						qs: {
							severity: '={{ (() => { const sev = String($parameter["severity"] || "").toUpperCase(); if (!sev) { throw new Error("VALIDATION_ERROR: Missing required parameter \'severity\' (CRITICAL, MAJOR, MINOR, WARNING)."); } return sev; })() }}',
							source: '={{ $parameter["sourceId"] ? String($parameter["sourceId"]).replace(/[^0-9]/g, "") : undefined }}',
							pageSize: '={{ $parameter["pageSize"] || $parameter["limit"] || 50 }}',
							currentPage: '={{ $parameter["currentPage"] || 1 }}',
							withTotalPages: 'true',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'alarms' } }],
					},
				},
			},
			{
				name: 'Get Alarms by Status',
				value: 'getByStatus',
				action: 'Get alarms filtered by status',
				description: 'Retrieve alarms across devices filtered by status (ACTIVE, ACKNOWLEDGED, CLEARED)',
				routing: {
					request: {
						method: 'GET',
						url: '/alarm/alarms',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.alarmCollection+json' },
						qs: {
							status: '={{ (() => { const sev = String($parameter["status"] || "").toUpperCase(); if (!sev) { throw new Error("VALIDATION_ERROR: Missing required parameter \'status\' (ACTIVE, ACKNOWLEDGED, CLEARED)."); } return sev; })() }}',
							source: '={{ $parameter["sourceId"] ? String($parameter["sourceId"]).replace(/[^0-9]/g, "") : undefined }}',
							pageSize: '={{ $parameter["pageSize"] || $parameter["limit"] || 50 }}',
							currentPage: '={{ $parameter["currentPage"] || 1 }}',
							withTotalPages: 'true',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'alarms' } }],
					},
				},
			},
			{
				name: 'Update Alarm Status by ID',
				value: 'updateStatus',
				action: 'Update alarm status by ID',
				description: 'Acknowledge, clear, or update an existing alarm status by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/alarm/alarms/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for updating alarm status."); } return cleanId; })() }}',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.alarm+json',
							Accept: 'application/vnd.com.nsn.cumulocity.alarm+json',
						},
						body: '={{ (() => { const statusVal = $parameter["status"] ? String($parameter["status"]).toUpperCase() : undefined; if (!statusVal) { throw new Error("VALIDATION_ERROR: Specify \'status\' (CLEARED/ACKNOWLEDGED/ACTIVE)."); } return { status: statusVal }; })() }}',
					},
				},
			},
			{
				name: 'Update Alarm Severity by ID',
				value: 'updateSeverity',
				action: 'Update alarm severity by ID',
				description: 'Update an existing alarm severity by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/alarm/alarms/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for updating alarm severity."); } return cleanId; })() }}',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.alarm+json',
							Accept: 'application/vnd.com.nsn.cumulocity.alarm+json',
						},
						body: '={{ (() => { const severityVal = $parameter["severity"] ? String($parameter["severity"]).toUpperCase() : undefined; if (!severityVal) { throw new Error("VALIDATION_ERROR: Specify \'severity\' to update the alarm."); } return { severity: severityVal }; })() }}',
					},
				},
			},
			{
				name: 'Remove Alarm by ID',
				value: 'deleteById',
				action: 'Delete an alarm record by ID',
				description: 'Permanently remove an alarm entry by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/alarm/alarms/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for deleting alarm."); } return cleanId; })() }}',
					},
				},
			},
		],
		default: 'createAlarm',
	},
];

export const alarmFields: INodeProperties[] = [
	{
		displayName: 'Alarm ID',
		name: 'id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['alarm'],
				//operation: ['getById', 'updateStatus', 'updateSeverity', 'deleteById'],
				operation: ['getById', 'updateStatus', 'updateSeverity'],
			},
		},
		default: '',
		description: 'The internal unique ID of the target alarm in Cumulocity',
	},
	{
		displayName: 'Alarm Type',
		name: 'type',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['alarm'], operation: ['createAlarm'] } },
		default: 'c8y_CustomAlarm',
		description: 'The unique alarm type key string (e.g. c8y_HighTemperatureAlarm)',
	},
	{
		displayName: 'Alarm Text',
		name: 'text',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['alarm'], operation: ['createAlarm'] } },
		default: '',
		description: 'Human-readable message describing the alarm event',
	},
	{
		displayName: 'Severity',
		name: 'severity',
		type: 'options',
		options: [
			{ name: 'Critical', value: 'CRITICAL' },
			{ name: 'Major', value: 'MAJOR' },
			{ name: 'Minor', value: 'MINOR' },
			{ name: 'Warning', value: 'WARNING' },
		],
		displayOptions: { show: { resource: ['alarm'], operation: ['createAlarm', 'getBySource', 'getBySeverity', 'updateSeverity'] } },
		default: 'CRITICAL',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Active', value: 'ACTIVE' },
			{ name: 'Acknowledged', value: 'ACKNOWLEDGED' },
			{ name: 'Cleared', value: 'CLEARED' },
		],
		displayOptions: { show: { resource: ['alarm'], operation: ['createAlarm', 'getBySource', 'getByStatus', 'updateStatus'] } },
		default: 'ACTIVE',
	},
];
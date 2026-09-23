import { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['event'] } },
		options: [
			{
				name: 'Create Event',
				value: 'createEvent',
				action: 'Create a new device event',
				description: 'Post a historical or audit event entry to a target device in Cumulocity',
				routing: {
					request: {
						method: 'POST',
						url: '/event/events',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.event+json',
							Accept: 'application/vnd.com.nsn.cumulocity.event+json',
						},
						body: '={{ (() => { const rawSrc = ($parameter && $parameter["sourceId"]) ? String($parameter["sourceId"]).trim() : ""; const srcId = rawSrc.replace(/[^0-9]/g, ""); if (!srcId || srcId === "") { throw new Error("VALIDATION_ERROR: Missing required parameter \'sourceId\' (Device ID). A valid numeric device ID is required to create an event."); } const typeVal = ($parameter && $parameter["type"] && String($parameter["type"]).trim() !== "") ? String($parameter["type"]).trim() : ""; if (!typeVal) { throw new Error("VALIDATION_ERROR: Missing required parameter \'type\'. Specify an event type string (e.g. c8y_LocationUpdate)."); } const textVal = ($parameter && $parameter["text"] && String($parameter["text"]).trim() !== "") ? String($parameter["text"]).trim() : ""; if (!textVal) { throw new Error("VALIDATION_ERROR: Missing required parameter \'text\'. A descriptive event message must be provided."); } const timeVal = ($parameter && $parameter["timestamp"] && String($parameter["timestamp"]).trim() !== "") ? String($parameter["timestamp"]).trim() : new Date().toISOString(); let extra = {}; try { const rawJson = $parameter["customJson"]; if (rawJson) { if (typeof rawJson === "string" && rawJson.trim() !== "") { extra = JSON.parse(rawJson); } else if (typeof rawJson === "object" && !Array.isArray(rawJson)) { extra = rawJson; } } } catch(e){} return Object.assign({ source: { id: srcId }, type: typeVal, text: textVal, time: timeVal }, extra); })() }}',
					},
				},
			},
			{
				name: 'Get Event by ID',
				value: 'getById',
				action: 'Get an event by unique ID',
				description: 'Retrieve details of a specific event by its internal ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/event/events/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for fetching event."); } return cleanId; })() }}',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.event+json' },
					},
				},
			},
			{
				name: 'Get Events by Source ID',
				value: 'getBySource',
				action: 'Get events for a specific device source ID',
				description: 'Retrieve recorded events filtered by device source ID',
				routing: {
					request: {
						method: 'GET',
						url: '/event/events',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.eventCollection+json' },
						qs: {
							source: '={{ (() => { const srcId = String($parameter["sourceId"] || "").replace(/[^0-9]/g, ""); if (!srcId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'sourceId\' to query events."); } return srcId; })() }}',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'events' } }],
					},
				},
			},
			{
				name: 'Remove Event by ID',
				value: 'deleteById',
				action: 'Delete an event record by ID',
				description: 'Permanently remove an event entry by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/event/events/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for deleting event."); } return cleanId; })() }}',
					},
				},
			},
		],
		default: 'createEvent',
	},
];

export const eventFields: INodeProperties[] = [
	/*{
		displayName: 'Source ID',
		name: 'sourceId',
		type: 'string',
		required: true,
		//displayOptions: { show: { resource: ['event'], operation: ['createEvent', 'getBySource'] } },
		displayOptions: { show: { resource: ['event'], operation: ['getBySource'] } },
		default: '',
		description: 'The target device ID in Cumulocity',
	},*/
	{
		displayName: 'Event Type',
		name: 'type',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['event'], operation: ['createEvent'] } },
		default: 'c8y_CustomEvent',
		description: 'The unique event type key string (e.g. c8y_DoorOpenedEvent)',
	},
	{
		displayName: 'Event Text',
		name: 'text',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['event'], operation: ['createEvent'] } },
		default: '',
		description: 'Human-readable message describing the event',
	},
];	
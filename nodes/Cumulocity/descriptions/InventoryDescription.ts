import { INodeProperties } from 'n8n-workflow';

export const inventoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['inventory'] } },
		options: [
			{
				name: 'Create Device',
				value: 'createDevice',
				action: 'Create a new IoT managed object device',
				description: 'Register a new device in Cumulocity inventory marked with c8y_IsDevice',
				routing: {
					request: {
						method: 'POST',
						url: '/inventory/managedObjects',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.managedObject+json',
							Accept: 'application/vnd.com.nsn.cumulocity.managedObject+json',
						},
						body: '={{ (() => { const nameVal = ($parameter && $parameter["name"]) ? String($parameter["name"]).trim() : ""; if (!nameVal || nameVal === "") { throw new Error("VALIDATION_ERROR: Missing required parameter \'name\'. A device name must be provided."); } let extra = {}; try { const rawJson = $parameter["customJson"]; if (rawJson) { if (typeof rawJson === "string" && rawJson.trim() !== "") { extra = JSON.parse(rawJson); } else if (typeof rawJson === "object" && !Array.isArray(rawJson)) { extra = rawJson; } } } catch(e){} const typeVal = ($parameter && $parameter["type"] && String($parameter["type"]).trim() !== "") ? String($parameter["type"]).trim() : "c8y_CustomDevice"; return Object.assign({ name: nameVal, type: typeVal, c8y_IsDevice: {}, com_cumulocity_model_Agent: {} }, extra); })() }}',
					},
				},
			},
			{
				name: 'Create Managed Object',
				value: 'createManagedObject',
				action: 'Create a raw managed object asset or group',
				description: 'Create a generic managed object record in Cumulocity inventory without device flags',
				routing: {
					request: {
						method: 'POST',
						url: '/inventory/managedObjects',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.managedObject+json',
							Accept: 'application/vnd.com.nsn.cumulocity.managedObject+json',
						},
						body: '={{ (() => { const nameVal = ($parameter && $parameter["name"]) ? String($parameter["name"]).trim() : ""; if (!nameVal || nameVal === "") { throw new Error("VALIDATION_ERROR: Missing required parameter \'name\'. An asset or group name must be provided."); } let extra = {}; try { const rawJson = $parameter["customJson"]; if (rawJson) { if (typeof rawJson === "string" && rawJson.trim() !== "") { extra = JSON.parse(rawJson); } else if (typeof rawJson === "object" && !Array.isArray(rawJson)) { extra = rawJson; } } } catch(e){} const typeVal = ($parameter && $parameter["type"] && String($parameter["type"]).trim() !== "") ? String($parameter["type"]).trim() : "c8y_CustomAsset"; return Object.assign({ name: nameVal, type: typeVal }, extra); })() }}',
					},
				},
			},
			{
				name: 'Get Managed Object by ID',
				value: 'getById',
				action: 'Get a managed object by unique ID',
				description: 'Retrieve a single managed object record by its internal unique ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/inventory/managedObjects/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\'. A valid target managed object ID is required."); } return cleanId; })() }}',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.managedObject+json' },
					},
				},
			},
			{
				name: 'Get Managed Objects by Name',
				value: 'getByName',
				action: 'Get managed objects matching a name string',
				description: 'Query inventory collection for managed objects matching a name filter string',
				routing: {
					request: {
						method: 'GET',
						url: '/inventory/managedObjects',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.managedObjectCollection+json' },
						qs: {
							query: '={{ (() => { const queryVal = String($parameter["queryValue"] || $parameter["name"] || "").trim(); if (!queryVal) { throw new Error("VALIDATION_ERROR: Missing required search parameter \'queryValue\' or \'name\'."); } return "$filter=(name eq \'" + queryVal + "\')"; })() }}',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'managedObjects' } }],
					},
				},
			},
			{
				name: 'Get Managed Objects by Type',
				value: 'getByType',
				action: 'Get managed objects matching a type string',
				description: 'Query inventory collection for managed objects matching a type filter string',
				routing: {
					request: {
						method: 'GET',
						url: '/inventory/managedObjects',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.managedObjectCollection+json' },
						qs: {
							type: '={{ (() => { const typeVal = String($parameter["queryValue"] || $parameter["type"] || "").trim(); if (!typeVal) { throw new Error("VALIDATION_ERROR: Missing required parameter \'type\'. Specify a device/asset type string to query."); } return typeVal; })() }}',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'managedObjects' } }],
					},
				},
			},
			{
				name: 'Get Devices Collection',
				value: 'getDevices',
				action: 'Get all managed objects flagged as devices',
				description: 'Retrieve the collection of all managed objects having the c8y_IsDevice fragment',
				routing: {
					request: {
						method: 'GET',
						url: '/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=2000',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.managedObjectCollection+json' },
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'managedObjects' } }],
					},
				},
			},
			{
				name: 'Update Managed Object by ID',
				value: 'updateById',
				action: 'Update properties on an existing managed object',
				description: 'Update fragment properties or metadata on a managed object by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/inventory/managedObjects/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for update operation."); } return cleanId; })() }}',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.managedObject+json',
							Accept: 'application/vnd.com.nsn.cumulocity.managedObject+json',
						},
						body: '={{ (() => { let extra = {}; try { const rawJson = $parameter["customJson"]; if (rawJson) { if (typeof rawJson === "string" && rawJson.trim() !== "") { extra = JSON.parse(rawJson); } else if (typeof rawJson === "object" && !Array.isArray(rawJson)) { extra = rawJson; } } } catch(e){} if (Object.keys(extra).length === 0) { throw new Error("VALIDATION_ERROR: Missing update properties. Provide fragment data in \'customJson\'."); } return extra; })() }}',
					},
				},
			},
			{
				name: 'Remove Managed Object by ID',
				value: 'deleteById',
				action: 'Delete a managed object by unique ID',
				description: 'Remove a managed object and its child associations from inventory by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/inventory/managedObjects/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for deletion."); } return cleanId; })() }}',
					},
				},
			},
		],
		default: 'createDevice',
	},
];

export const inventoryFields: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				useRawJson: [false],
				resource: ['inventory'],
				operation: ['createDevice', 'createManagedObject'],
			},
		},
		default: '',
		description: 'The name string for the managed object (e.g. tamer 11 ai)',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				useRawJson: [false],
				resource: ['inventory'],
				operation: ['createDevice', 'createManagedObject'],
			},
		},
		default: 'n8n_ai_type',
		description: 'The asset/device type string (e.g. n8n_ai_type, c8y_CustomDevice)',
	},
];
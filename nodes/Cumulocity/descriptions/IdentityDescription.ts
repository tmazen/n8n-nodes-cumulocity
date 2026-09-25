import { INodeProperties } from 'n8n-workflow';

export const identityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['identity'] } },
		options: [
			{
				name: 'Create External ID Link',
				value: 'createExternalId',
				action: 'Create external ID binding for a device',
				description: 'Link an external hardware identifier (like serial number, IMEI, or MAC address) to a Cumulocity device ID',
				routing: {
					request: {
						method: 'POST',
						url: '=/identity/globalIds/{{ (() => { const cleanId = String($parameter["managedObjectId"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'managedObjectId\' (Device ID)."); } return cleanId; })() }}/externalIds',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.externalId+json',
							Accept: 'application/vnd.com.nsn.cumulocity.externalId+json',
						},
						body: '={{ (() => { const extId = ($parameter && $parameter["externalId"]) ? String($parameter["externalId"]).trim() : ""; if (!extId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'externalId\'. An external identifier value (e.g. Serial, IMEI) is required."); } const typeVal = ($parameter && $parameter["type"] && String($parameter["type"]).trim() !== "") ? String($parameter["type"]).trim() : "c8y_Serial"; return { externalId: extId, type: typeVal }; })() }}',
					},
				},
			},
			{
				name: 'Get External ID Lookup',
				value: 'getExternalId',
				action: 'Lookup managed object ID by external ID',
				description: 'Retrieve the Cumulocity device ID linked to an external hardware ID and type',
				routing: {
					request: {
						method: 'GET',
						url: '=/identity/externalIds/{{ (() => { const typeVal = String($parameter["type"] || "c8y_Serial").trim(); if (!typeVal) { throw new Error("VALIDATION_ERROR: Missing required parameter \'type\'."); } return typeVal; })() }}/{{ (() => { const extId = String($parameter["externalId"] || "").trim(); if (!extId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'externalId\'."); } return extId; })() }}',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.externalId+json' },
					},
				},
			},
			{
				name: 'Get All External IDs for Device',
				value: 'getAllExternalIds',
				action: 'Get all external IDs bound to a device ID',
				description: 'List all external identifiers mapped to a specific Cumulocity managed object ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/identity/globalIds/{{ (() => { const cleanId = String($parameter["managedObjectId"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'managedObjectId\'."); } return cleanId; })() }}/externalIds',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.externalIdCollection+json' },
						qs: {
							pageSize: '={{ $parameter["pageSize"] || $parameter["limit"] || 50 }}',
							currentPage: '={{ $parameter["currentPage"] || 1 }}',
							withTotalPages: 'true',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'externalIds' } }],
					},
				},
			},
			{
				name: 'Remove External ID Link',
				value: 'deleteExternalId',
				action: 'Delete external ID binding',
				description: 'Unlink an external identifier binding from Cumulocity by external ID and type',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/identity/externalIds/{{ (() => { const typeVal = String($parameter["type"] || "c8y_Serial").trim(); if (!typeVal) { throw new Error("VALIDATION_ERROR: Missing required parameter \'type\'."); } return typeVal; })() }}/{{ (() => { const extId = String($parameter["externalId"] || "").trim(); if (!extId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'externalId\'."); } return extId; })() }}',
					},
				},
			},
		],
		default: 'createExternalId',
	},
];

export const identityFields: INodeProperties[] = [
	{
		displayName: 'Managed Object ID',
		name: 'managedObjectId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['identity'], operation: ['createExternalId', 'getAllExternalIds'] } },
		default: '',
		description: 'The internal Cumulocity device ID',
	},
	{
		displayName: 'External ID Value',
		name: 'externalId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['identity'], operation: ['createExternalId', 'getExternalId', 'deleteExternalId'] } },
		default: '',
		description: 'The external hardware identifier (e.g. ABC123456789, MAC address)',
	},
	{
		displayName: 'External ID Type',
		name: 'type',
		type: 'string',
		required: false,
		displayOptions: { show: { resource: ['identity'], operation: ['createExternalId', 'getExternalId', 'deleteExternalId'] } },
		default: 'c8y_Serial',
		description: 'The type category for the external binding (e.g. c8y_Serial, c8y_IMEI, c8y_MAC)',
	},
];
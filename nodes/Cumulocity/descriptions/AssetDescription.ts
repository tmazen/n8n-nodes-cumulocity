import { INodeProperties } from 'n8n-workflow';

export const assetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['asset'] } },
		options: [
			{
				name: 'Assign Child Device to Asset',
				value: 'assignChildDevice',
				action: 'Assign a child device to a parent asset/group',
				description: 'Link an existing device as a child under a parent asset or group managed object',
				routing: {
					request: {
						method: 'POST',
						url: '=/inventory/managedObjects/{{ (() => { const cleanParentId = String($parameter["parentId"] || "").replace(/[^0-9]/g, ""); if (!cleanParentId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'parentId\'."); } return cleanParentId; })() }}/childDevices',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.managedObjectReference+json',
							Accept: 'application/vnd.com.nsn.cumulocity.managedObjectReference+json',
						},
						body: '={{ (() => { const cleanChildId = String($parameter["childId"] || "").replace(/[^0-9]/g, ""); if (!cleanChildId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'childId\' (Child Device ID)."); } return { managedObject: { id: cleanChildId } }; })() }}',
					},
				},
			},
			{
				name: 'Assign Child Asset to Parent Group',
				value: 'assignChildAsset',
				action: 'Assign a child asset or group under a parent group',
				description: 'Link an existing asset as a child asset under a parent group managed object',
				routing: {
					request: {
						method: 'POST',
						url: '=/inventory/managedObjects/{{ (() => { const cleanParentId = String($parameter["parentId"] || "").replace(/[^0-9]/g, ""); if (!cleanParentId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'parentId\'."); } return cleanParentId; })() }}/childAssets',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.managedObjectReference+json',
							Accept: 'application/vnd.com.nsn.cumulocity.managedObjectReference+json',
						},
						body: '={{ (() => { const cleanChildId = String($parameter["childId"] || "").replace(/[^0-9]/g, ""); if (!cleanChildId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'childId\' (Child Asset ID)."); } return { managedObject: { id: cleanChildId } }; })() }}',
					},
				},
			},
			{
				name: 'Get Child Devices of Parent Asset',
				value: 'getChildDevices',
				action: 'Get all child devices assigned to a parent asset',
				description: 'List all devices linked under a parent asset or group',
				routing: {
					request: {
						method: 'GET',
						url: '=/inventory/managedObjects/{{ (() => { const cleanParentId = String($parameter["parentId"] || "").replace(/[^0-9]/g, ""); if (!cleanParentId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'parentId\'."); } return cleanParentId; })() }}/childDevices',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.managedObjectReferenceCollection+json' },
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'references' } }],
					},
				},
			},
			{
				name: 'Unassign Child Device from Parent Asset',
				value: 'unassignChildDevice',
				action: 'Remove child device association from parent asset',
				description: 'Unlink a child device association from a parent asset',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/inventory/managedObjects/{{ (() => { const cleanParentId = String($parameter["parentId"] || "").replace(/[^0-9]/g, ""); if (!cleanParentId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'parentId\'."); } return cleanParentId; })() }}/childDevices/{{ (() => { const cleanChildId = String($parameter["childId"] || "").replace(/[^0-9]/g, ""); if (!cleanChildId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'childId\'."); } return cleanChildId; })() }}',
					},
				},
			},
		],
		default: 'assignChildDevice',
	},
];

export const assetFields: INodeProperties[] = [
	{
		displayName: 'Parent Asset ID',
		name: 'parentId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['assignChildDevice', 'assignChildAsset', 'getChildDevices', 'unassignChildDevice'] } },
		default: '',
		description: 'The internal ID of the parent asset or group managed object',
	},
	{
		displayName: 'Child Object ID',
		name: 'childId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['assignChildDevice', 'assignChildAsset', 'unassignChildDevice'] } },
		default: '',
		description: 'The internal ID of the child device or asset to link/unlink',
	},
];
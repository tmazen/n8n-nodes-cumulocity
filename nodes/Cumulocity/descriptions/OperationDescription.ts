import { INodeProperties } from 'n8n-workflow';

export const deviceOperationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['operation'] } },
		options: [
			{
				name: 'Create Device Control Operation',
				value: 'createOperation',
				action: 'Send control command operation to device',
				description: 'Post a remote control operation command (e.g. restart, firmware update, shell command) to a target device',
				routing: {
					request: {
						method: 'POST',
						url: '/devicecontrol/operations',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.operation+json',
							Accept: 'application/vnd.com.nsn.cumulocity.operation+json',
						},
						body: '={{ (() => { const rawDeviceId = ($parameter && $parameter["deviceId"]) ? String($parameter["deviceId"]).trim() : ""; const cleanDeviceId = rawDeviceId.replace(/[^0-9]/g, ""); if (!cleanDeviceId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'deviceId\'. A numeric target device ID is required."); } let extra = {}; try { const rawJson = $parameter["customJson"]; if (rawJson) { if (typeof rawJson === "string" && rawJson.trim() !== "") { extra = JSON.parse(rawJson); } else if (typeof rawJson === "object" && !Array.isArray(rawJson)) { extra = rawJson; } } } catch(e){} if (Object.keys(extra).length === 0) { throw new Error("VALIDATION_ERROR: Missing operation command body. Specify operation parameters in \'customJson\' (e.g. \'{\"c8y_Restart\":{}}\')."); } return Object.assign({ deviceId: cleanDeviceId }, extra); })() }}',
					},
				},
			},
			{
				name: 'Get Operation by ID',
				value: 'getById',
				action: 'Get operation details by unique ID',
				description: 'Retrieve details and status of a specific device operation by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/devicecontrol/operations/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for fetching operation."); } return cleanId; })() }}',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.operation+json' },
					},
				},
			},
			{
				name: 'Get Operations by Device ID',
				value: 'getByDevice',
				action: 'Get operation history for a device',
				description: 'Retrieve the operation log filtered by device ID',
				routing: {
					request: {
						method: 'GET',
						url: '/devicecontrol/operations',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.operationCollection+json' },
						qs: {
							deviceId: '={{ (() => { const cleanDeviceId = String($parameter["deviceId"] || "").replace(/[^0-9]/g, ""); if (!cleanDeviceId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'deviceId\' to query operations."); } return cleanDeviceId; })() }}',
							//status: '={{ $parameter["status"] ? String($parameter["status"]).toUpperCase() : undefined }}',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'operations' } }],
					},
				},
			},
			{
				name: 'Update Operation Status by ID',
				value: 'updateStatusById',
				action: 'Update operation status (SUCCESSFUL/FAILED/EXECUTING)',
				description: 'Update execution state of an operation by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/devicecontrol/operations/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for operation update."); } return cleanId; })() }}',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.operation+json',
							Accept: 'application/vnd.com.nsn.cumulocity.operation+json',
						},
						body: '={{ (() => { const statusVal = $parameter["status"] ? String($parameter["status"]).toUpperCase() : undefined; if (!statusVal) { throw new Error("VALIDATION_ERROR: Missing required parameter \'status\' (e.g. SUCCESSFUL, FAILED, EXECUTING)."); } const payload = { status: statusVal }; const failureReason = $parameter["failureReason"] ? String($parameter["failureReason"]).trim() : ""; if (failureReason) payload["failureReason"] = failureReason; return payload; })() }}',
					},
				},
			},
		],
		default: 'createOperation',
	},
];

export const deviceOperationFields: INodeProperties[] = [
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['operation'], operation: ['createOperation', 'getByDevice'] } },
		default: '',
		description: 'Target Cumulocity device ID',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Pending', value: 'PENDING' },
			{ name: 'Executing', value: 'EXECUTING' },
			{ name: 'Successful', value: 'SUCCESSFUL' },
			{ name: 'Failed', value: 'FAILED' },
		],
		//displayOptions: { show: { resource: ['operation'], operation: ['getByDevice', 'updateStatus'] } },

		displayOptions: { show: { resource: ['operation'], operation: [ 'updateStatusById'] } },
		default: 'PENDING',
	},
];
import { INodeProperties } from 'n8n-workflow';

export const measurementOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['measurement'] } },
		options: [
			{
				name: 'Create Measurement',
				value: 'createMeasurement',
				action: 'Create a telemetry measurement reading (e.g. water flow, temperature, speed, power)',
				description: 'Post a new telemetry measurement reading to a target device in Cumulocity',
				routing: {
					request: {
						method: 'POST',
						url: '/measurement/measurements',
						headers: {
							'Content-Type': 'application/vnd.com.nsn.cumulocity.measurement+json',
							Accept: 'application/vnd.com.nsn.cumulocity.measurement+json',
						},
						body: '={{ (() => { const rawSrc = ($parameter && $parameter["sourceId"]) ? String($parameter["sourceId"]).trim() : ""; const srcId = rawSrc.replace(/[^0-9]/g, ""); if (!srcId || srcId === "") { throw new Error("VALIDATION_ERROR: Missing required parameter \'sourceId\' (Device ID). A numeric device ID is required to post measurements."); } const val = Number($parameter["measurementValue"]); if (isNaN(val)) { throw new Error("VALIDATION_ERROR: Invalid or missing parameter \'measurementValue\'. Provide a numeric reading value."); } let extra = {}; try { if ($parameter && $parameter["customJson"]) { if (typeof $parameter["customJson"] === "string" && $parameter["customJson"].trim() !== "") { extra = JSON.parse($parameter["customJson"]); } else if (typeof $parameter["customJson"] === "object" && !Array.isArray($parameter["customJson"])) { extra = $parameter["customJson"]; } } } catch(e){} const typeVal = ($parameter && $parameter["type"] && String($parameter["type"]).trim() !== "") ? String($parameter["type"]).trim() : "c8y_WaterFlowMeasurement"; let fragType = ($parameter && $parameter["fragmentType"] && String($parameter["fragmentType"]).trim() !== "") ? String($parameter["fragmentType"]).trim() : typeVal; if (fragType.toLowerCase().includes("waterflow") || fragType.toLowerCase().includes("water flow")) { fragType = "c8y_WaterFlowMeasurement"; } const fragSeries = ($parameter && $parameter["fragmentSeries"] && String($parameter["fragmentSeries"]).trim() !== "") ? String($parameter["fragmentSeries"]).trim() : "flow"; const unitVal = ($parameter && $parameter["unit"] && String($parameter["unit"]).trim() !== "") ? String($parameter["unit"]).trim() : "m/h"; const timeVal = ($parameter && $parameter["timestamp"] && String($parameter["timestamp"]).trim() !== "") ? String($parameter["timestamp"]).trim() : new Date().toISOString(); return Object.assign({ source: { id: srcId }, type: typeVal, time: timeVal }, { [fragType]: { [fragSeries]: Object.assign({ value: val }, unitVal ? { unit: unitVal } : {}) } }, extra); })() }}',
					},
				},
			},
			{
				name: 'Get Measurements by Source ID',
				value: 'getBySource',
				action: 'Get measurements for a specific device source ID',
				description: 'Retrieve recorded telemetry measurements by device source ID',
				routing: {
					request: {
						method: 'GET',
						url: '/measurement/measurements',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.measurementCollection+json' },
						qs: {
							source: '={{ (() => { const srcId = String($parameter["sourceId"] || "").replace(/[^0-9]/g, ""); if (!srcId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'sourceId\'. A valid target device ID is required."); } return srcId; })() }}',
							pageSize: '={{ $parameter["pageSize"] || $parameter["limit"] || 50 }}',
							currentPage: '={{ $parameter["currentPage"] || 1 }}',
							withTotalPages: 'true',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'measurements' } }],
					},
				},
			},
			{
				name: 'Get Measurements by Type',
				value: 'getByType',
				action: 'Get measurements filtered by type string',
				description: 'Retrieve measurements matching a specific type string (e.g. c8y_WaterFlowMeasurement)',
				routing: {
					request: {
						method: 'GET',
						url: '/measurement/measurements',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.measurementCollection+json' },
						qs: {
							type: '={{ (() => { const typeVal = String($parameter["queryValue"] || $parameter["type"] || "").trim(); if (!typeVal) { throw new Error("VALIDATION_ERROR: Missing required filter parameter \'type\'."); } return typeVal; })() }}',
							pageSize: '={{ $parameter["pageSize"] || $parameter["limit"] || 50 }}',
							currentPage: '={{ $parameter["currentPage"] || 1 }}',
							withTotalPages: 'true',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'measurements' } }],
					},
				},
			},
			{
				name: 'Get Measurements by Fragment Type',
				value: 'getByFragmentType',
				action: 'Get measurements filtered by fragment type',
				description: 'Retrieve measurements matching a value fragment type (e.g. c8y_WaterFlowMeasurement)',
				routing: {
					request: {
						method: 'GET',
						url: '/measurement/measurements',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.measurementCollection+json' },
						qs: {
							valueFragmentType: '={{ (() => { const fragVal = String($parameter["queryValue"] || $parameter["fragmentType"] || "").trim(); if (!fragVal) { throw new Error("VALIDATION_ERROR: Missing required filter parameter \'fragmentType\'."); } return fragVal; })() }}',
							pageSize: '={{ $parameter["pageSize"] || $parameter["limit"] || 50 }}',
							currentPage: '={{ $parameter["currentPage"] || 1 }}',
							withTotalPages: 'true',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'measurements' } }],
					},
				},
			},
			{
				name: 'Get Measurements by From and To Dates',
				value: 'getByDateRange',
				action: 'Get measurements within a date range',
				description: 'Retrieve measurements recorded within a start and end ISO date range',
				routing: {
					request: {
						method: 'GET',
						url: '/measurement/measurements',
						headers: { Accept: 'application/vnd.com.nsn.cumulocity.measurementCollection+json' },
						qs: {
							dateFrom: '={{ (() => { if (!$parameter["dateFrom"]) { throw new Error("VALIDATION_ERROR: Missing required parameter \'dateFrom\'."); } return $parameter["dateFrom"]; })() }}',
							dateTo: '={{ (() => { if (!$parameter["dateTo"]) { throw new Error("VALIDATION_ERROR: Missing required parameter \'dateTo\'."); } return $parameter["dateTo"]; })() }}',
							pageSize: '={{ $parameter["pageSize"] || $parameter["limit"] || 50 }}',
							currentPage: '={{ $parameter["currentPage"] || 1 }}',
							withTotalPages: 'true',
						},
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'measurements' } }],
					},
				},
			},
			{
				name: 'Remove Measurement by ID',
				value: 'deleteById',
				action: 'Delete a measurement entry by ID',
				description: 'Delete a single measurement entry by its unique ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/measurement/measurements/{{ (() => { const cleanId = String($parameter["id"] || "").replace(/[^0-9]/g, ""); if (!cleanId) { throw new Error("VALIDATION_ERROR: Missing required parameter \'id\' for deletion."); } return cleanId; })() }}',
					},
				},
			},
			{
				name: 'Remove Measurements by Criteria',
				value: 'deleteByCriteria',
				action: 'Bulk delete measurements by filter criteria',
				description: 'Bulk delete measurements matching source ID, type, or date criteria',
				routing: {
					request: {
						method: 'DELETE',
						url: '/measurement/measurements',
						qs: {
							source: '={{$parameter["filterSourceId"] ? String($parameter["filterSourceId"]).replace(/[^0-9]/g, "") : undefined}}',
							type: '={{$parameter["filterType"] || undefined}}',
							valueFragmentType: '={{$parameter["filterFragmentType"] || undefined}}',
							dateFrom: '={{$parameter["filterDateFrom"] || undefined}}',
							dateTo: '={{$parameter["filterDateTo"] || undefined}}',
						},
					},
				},
			},
		],
		default: 'createMeasurement',
	},
];

export const measurementFields: INodeProperties[] = [
	{
		displayName: 'Measurement Type',
		name: 'type',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				useRawJson: [false],
				resource: ['measurement'],
				operation: ['createMeasurement'],
			},
		},
		default: 'c8y_WaterFlowMeasurement',
		description: 'The overall measurement type category (e.g. c8y_WaterFlowMeasurement, c8y_TemperatureMeasurement)',
	},
	{
		displayName: 'Fragment Type',
		name: 'fragmentType',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				useRawJson: [false],
				resource: ['measurement'],
				operation: ['createMeasurement'],
			},
		},
		default: 'c8y_WaterFlowMeasurement',
		description: 'The fragment key in JSON payload. MUST match measurement type name (e.g. c8y_WaterFlowMeasurement)',
	},
	{
		displayName: 'Fragment Series',
		name: 'fragmentSeries',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				useRawJson: [false],
				resource: ['measurement'],
				operation: ['createMeasurement'],
			},
		},
		default: 'flow',
		description: 'Series property key inside the fragment (e.g. flow, T, speed, value)',
	},
	{
		displayName: 'Value',
		name: 'measurementValue',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				useRawJson: [false],
				resource: ['measurement'],
				operation: ['createMeasurement'],
			},
		},
		default: 0,
		description: 'The numeric reading value recorded by the sensor (e.g. 55, 75)',
	},
	{
		displayName: 'Unit',
		name: 'unit',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				useRawJson: [false],
				resource: ['measurement'],
				operation: ['createMeasurement'],
			},
		},
		default: 'm/h',
		description: 'Unit of measurement string (e.g. m/h, km/h, C, %)',
	},
];
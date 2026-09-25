import {
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { inventoryOperations, inventoryFields } from './descriptions/InventoryDescription';
import { measurementOperations, measurementFields } from './descriptions/MeasurementDescription';
import { eventOperations, eventFields } from './descriptions/EventDescription';
import { alarmOperations, alarmFields } from './descriptions/AlarmDescription';
import { deviceOperationOperations, deviceOperationFields } from './descriptions/OperationDescription';
import { identityOperations, identityFields } from './descriptions/IdentityDescription';
import { assetOperations, assetFields } from './descriptions/AssetDescription';
import { paginationFields } from './descriptions/PaginationDescription';

export class Cumulocity implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cumulocity',
		name: 'cumulocity',
		icon: {
			light: 'file:cumulocity.svg',
			dark: 'file:cumulocity.svg',
		},
		group: ['transform'],
		usableAsTool: true,
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with Cumulocity Core REST API to manage devices, measurements, alarms, events, operations, identity, and assets',
		codex: {
			categories: ['IoT'],
			subcategories: {
				IoT: ['Cumulocity'],
			},
			alias: ['cumulocity', 'iot', 'c8y'],
		},
		defaults: {
			name: 'Cumulocity',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'cumulocityApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.domain.replace(/\\/$/, "")}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// Resource Selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Inventory', value: 'inventory' },
					{ name: 'Measurement', value: 'measurement' },
					{ name: 'Event', value: 'event' },
					{ name: 'Alarm', value: 'alarm' },
					{ name: 'Operation', value: 'operation' },
					{ name: 'Identity', value: 'identity' },
					{ name: 'Asset', value: 'asset' },
				],
				default: 'inventory',
				description: 'Select the Cumulocity API resource domain',
			},

			// Operations
			...inventoryOperations,
			...measurementOperations,
			...eventOperations,
			...alarmOperations,
			...deviceOperationOperations,
			...identityOperations,
			...assetOperations,

			// Global Raw JSON Input Toggle & Textarea
			{
				displayName: 'Use Raw JSON Input',
				name: 'useRawJson',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: [
							'createManagedObject',
							'createDevice',
							'createEvent',
							'createAlarm',
							'createMeasurement',
							'createOperation',
							'addExternalId',
							'createAsset',
							'updateAsset',
							'updateById',
							'updateByCriteria',
						],
					},
				},
				default: false,
				description: 'Whether to bypass individual fields and provide the complete JSON payload directly',
			},
			{
				displayName: 'JSON Payload',
				name: 'jsonBody',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						useRawJson: [true],
						operation: ['createDevice'],
					},
				},
				default: '{\n  "name": "New Device",\n  "type": "c8y_CustomDevice",\n  "c8y_IsDevice": {},\n  "com_cumulocity_model_Agent": {}\n}',
				description: 'Enter custom device JSON payload. Must contain c8y_IsDevice fragment.',
			},
			{
				displayName: 'JSON Payload',
				name: 'jsonBody',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						useRawJson: [true],
						operation: [
							'createManagedObject',
							'createEvent',
							'createAlarm',
							'createMeasurement',
							'createOperation',
							'addExternalId',
							'createAsset',
							'updateAsset',
							'updateById',
							'updateByCriteria',
						],
					},
				},
				default: '{\n  "name": "Sample Payload"\n}',
				description: 'Enter custom JSON payload directly',
			},

			// Resource Fields
			...inventoryFields,
			...measurementFields,
			...eventFields,
			...alarmFields,
			...deviceOperationFields,
			...identityFields,
			...assetFields,

			// Dropdown Selectors
			{
				displayName: 'Device Source',
				name: 'sourceId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDevices',
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['event', 'alarm', 'measurement', 'identity'],
						operation: ['createEvent', 'createAlarm', 'createMeasurement', 'addExternalId', 'getByDevice', 'getBySource'],
					},
				},
				default: '',
				description: 'Select a target device source ID from Cumulocity inventory',
			},
			{
				displayName: 'Agent Device Source',
				name: 'agentSourceId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAgents',
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['operation'],
						operation: ['getBySource'],
					},
				},
				default: '',
				description: 'Select a target agent device ID registered to receive remote control operations',
			},

			// Shared Query / Filter Fields
			{
				displayName: 'Timestamp (ISO 8601)',
				name: 'timestamp',
				type: 'dateTime',
				required: false,
				displayOptions: {
					show: {
						useRawJson: [false],
						operation: ['createEvent', 'createAlarm', 'createMeasurement'],
					},
				},
				default: '',
				description: 'Optional ISO 8601 timestamp string (defaults to current execution time)',
			},
			{
				displayName: 'Custom JSON Fragments',
				name: 'customJson',
				type: 'json',
				required: false,
				displayOptions: {
					show: {
						useRawJson: [false],
						operation: [
							'createManagedObject',
							'createDevice',
							'createEvent',
							'createAlarm',
							'createMeasurement',
							'createOperation',
							'addExternalId',
							'createAsset',
							'updateAsset',
							'updateById',
							'updateByCriteria',
						],
					},
				},
				default: '{}',
				description: 'JSON string of custom fragments to inject into payload (e.g. {"plateNumber": "1236"})',
			},
			{
				displayName: 'Managed Object / Resource ID',
				name: 'id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getById', 'deleteById', 'updateById', 'updateStatusById'],
					},
				},
				default: '',
				description: 'The unique managed object or entity ID in Cumulocity',
			},
			{
				displayName: 'Value / Name / Type',
				name: 'queryValue',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getByName', 'getByType', 'getByFragmentType'],
					},
				},
				default: '',
				description: 'The query value string to filter by (name, type, or fragment type)',
			},
			{
				displayName: 'Date From (ISO 8601)',
				name: 'dateFrom',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: ['getByDateRange'],
					},
				},
				default: '',
				description: 'Filter start date in ISO 8601 format',
			},
			{
				displayName: 'Date To (ISO 8601)',
				name: 'dateTo',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: ['getByDateRange'],
					},
				},
				default: '',
				description: 'Filter end date in ISO 8601 format',
			},
			{
				displayName: 'Filter Source Device ID',
				name: 'filterSourceId',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						operation: ['deleteByCriteria', 'updateByCriteria'],
					},
				},
				default: '',
				description: 'Target source device ID for bulk criteria execution',
			},
			{
				displayName: 'Filter Type',
				name: 'filterType',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						operation: ['deleteByCriteria', 'updateByCriteria'],
					},
				},
				default: '',
				description: 'Filter criteria for resource type',
			},
			{
				displayName: 'Filter Fragment Type',
				name: 'filterFragmentType',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						operation: ['deleteByCriteria', 'updateByCriteria'],
					},
				},
				default: '',
				description: 'Filter criteria for fragment type',
			},
			{
				displayName: 'Filter Date From (ISO 8601)',
				name: 'filterDateFrom',
				type: 'dateTime',
				required: false,
				displayOptions: {
					show: {
						operation: ['deleteByCriteria', 'updateByCriteria'],
					},
				},
				default: '',
				description: 'Filter criteria for start date',
			},
			{
				displayName: 'Filter Date To (ISO 8601)',
				name: 'filterDateTo',
				type: 'dateTime',
				required: false,
				displayOptions: {
					show: {
						operation: ['deleteByCriteria', 'updateByCriteria'],
					},
				},
				default: '',
				description: 'Filter criteria for end date',
			},
			{
				displayName: 'Filter Operation Status',
				name: 'filterOperationStatus',
				type: 'options',
				required: false,
				options: [
					{ name: 'None', value: '' },
					{ name: 'SUCCESSFUL', value: 'SUCCESSFUL' },
					{ name: 'FAILED', value: 'FAILED' },
					{ name: 'EXECUTING', value: 'EXECUTING' },
					{ name: 'PENDING', value: 'PENDING' },
				],
				displayOptions: {
					show: {
						resource: ['operation'],
						operation: ['deleteByCriteria', 'updateByCriteria'],
					},
				},
				default: '',
				description: 'Filter criteria for operation status',
			},
			{
				displayName: 'Filter Status',
				name: 'filterStatus',
				type: 'options',
				required: false,
				options: [
					{ name: 'None', value: '' },
					{ name: 'ACTIVE', value: 'ACTIVE' },
					{ name: 'ACKNOWLEDGED', value: 'ACKNOWLEDGED' },
					{ name: 'CLEARED', value: 'CLEARED' },
				],
				displayOptions: {
					show: {
						resource: ['alarm'],
						operation: ['deleteByCriteria', 'updateByCriteria'],
					},
				},
				default: '',
				description: 'Filter criteria for alarm status',
			},
			{
				displayName: 'Filter Severity',
				name: 'filterSeverity',
				type: 'options',
				required: false,
				options: [
					{ name: 'None', value: '' },
					{ name: 'CRITICAL', value: 'CRITICAL' },
					{ name: 'MAJOR', value: 'MAJOR' },
					{ name: 'MINOR', value: 'MINOR' },
					{ name: 'WARNING', value: 'WARNING' },
				],
				displayOptions: {
					show: {
						resource: ['alarm'],
						operation: ['deleteByCriteria', 'updateByCriteria'],
					},
				},
				default: '',
				description: 'Filter criteria for alarm severity',
			},

			// Pagination Fields (Evaluated at the very end)
			...paginationFields,
		],
	};

	methods = {
		loadOptions: {
			async getDevices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('cumulocityApi');
				const domain = (credentials.domain as string).replace(/\/$/, '');

				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'cumulocityApi',
					{
						method: 'GET',
						url: `${domain}/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=2000`,
						headers: {
							Accept: 'application/vnd.com.nsn.cumulocity.managedObjectCollection+json',
						},
					},
				);

				const returnData: INodePropertyOptions[] = [];
				const data = JSON.parse(response as string);

				if (data.managedObjects && Array.isArray(data.managedObjects)) {
					for (const object of data.managedObjects) {
						if (
							object.c8y_IsDevice &&
							!object.c8y_IsDeviceGroup &&
							!object.c8y_IsAsset
						) {
							returnData.push({
								name: `${object.name || object.id} (ID: ${object.id})`,
								value: String(object.id),
							});
						}
					}
				}

				return returnData;
			},
			async getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('cumulocityApi');
				const domain = (credentials.domain as string).replace(/\/$/, '');

				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'cumulocityApi',
					{
						method: 'GET',
						url: `${domain}/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=2000`,
						headers: {
							Accept: 'application/vnd.com.nsn.cumulocity.managedObjectCollection+json',
						},
					},
				);

				const returnData: INodePropertyOptions[] = [];
				const data = JSON.parse(response as string);

				if (data.managedObjects && Array.isArray(data.managedObjects)) {
					for (const object of data.managedObjects) {
						if (
							object.com_cumulocity_model_Agent &&
							object.c8y_IsDevice &&
							!object.c8y_IsDeviceGroup &&
							!object.c8y_IsAsset
						) {
							returnData.push({
								name: `${object.name || object.id} (ID: ${object.id})`,
								value: String(object.id),
							});
						}
					}
				}

				return returnData;
			},
			async getAssetOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('cumulocityApi');
				const domain = (credentials.domain as string).replace(/\/$/, '');

				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'cumulocityApi',
					{
						method: 'GET',
						url: `${domain}/service/dtm/assets?pageSize=2000`,
						headers: {
							Accept: 'application/json',
						},
					},
				);

				const returnData: INodePropertyOptions[] = [];
				const data = JSON.parse(response as string);

				const assets = data.assets || data;
				if (Array.isArray(assets)) {
					for (const asset of assets) {
						returnData.push({
							name: `${asset.name || asset.id} (ID: ${asset.id})`,
							value: String(asset.id),
						});
					}
				}

				return returnData;
			},
		},
	};
}
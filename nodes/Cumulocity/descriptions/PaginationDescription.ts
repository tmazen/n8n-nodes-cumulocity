import { INodeProperties } from 'n8n-workflow';

const collectionOperations = [
	// Inventory
	'getDevices',
	'getByName',
	'getByType',
	// Measurement
	'getBySource',
	'getByType',
	'getByFragmentType',
	'getByDateRange',
	// Alarm
	'getBySource',
	'getBySeverity',
	'getByStatus',
	'getByFragmentType',
	// Event
	'getBySource',
	// Identity
	'getAllExternalIds',
	// Operation
	'getByDevice',
	// Asset
	'getChildDevices',
];

const collectionResources = [
	'inventory',
	'measurement',
	'alarm',
	'event',
	'identity',
	'operation',
	'asset',
];

export const paginationFields: INodeProperties[] = [
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		displayOptions: {
			show: {
				resource: collectionResources,
				operation: collectionOperations,
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 2000,
		},
		default: 50,
		description: 'Number of items per page requested from Cumulocity API (1–2000)',
	},
	{
		displayName: 'Current Page',
		name: 'currentPage',
		type: 'number',
		displayOptions: {
			show: {
				resource: collectionResources,
				operation: collectionOperations,
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		description: 'Page number to retrieve (1-indexed)',
	},
];
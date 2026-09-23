import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CumulocityApi implements ICredentialType {
	name = 'cumulocityApi';
	displayName = 'Cumulocity API';
	documentationUrl = 'https://cumulocity.com/api/core/';
	
	// Suppresses the generic domain whitelist field in the UI
	testedBy = 'cumulocityApi';

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.domain.replace(/\\/$/, "")}}',
			url: '/user/currentUser',
			method: 'GET',
		},
	};

	requestDefaults = {
		headers: {
			Accept: 'application/vnd.com.nsn.cumulocity.currentUser+json',
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Domain / Host',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'https://tenant.cumulocity.com',
			required: true,
		},
		{
			displayName: 'Tenant ID',
			name: 'tenant',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.tenant + "/" + $credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	} as const;
}
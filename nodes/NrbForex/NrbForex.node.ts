import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { exchangeRateDescription } from './resources/exchangeRate';

export class NrbForex implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NRB Forex',
		name: 'nrbForex',
		icon: { light: 'file:nrbForex.svg', dark: 'file:nrbForex.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			"Get official foreign exchange rates published by Nepal Rastra Bank (Nepal's central bank)",
		defaults: {
			name: 'NRB Forex',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [],
		requestDefaults: {
			baseURL: 'https://www.nrb.org.np/api/forex/v1',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Exchange Rate',
						value: 'exchangeRate',
					},
				],
				default: 'exchangeRate',
			},
			...exchangeRateDescription,
		],
	};
}

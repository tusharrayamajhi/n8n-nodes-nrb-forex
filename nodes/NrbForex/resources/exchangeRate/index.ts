import type { INodeProperties } from 'n8n-workflow';
import { exchangeRateGetDescription } from './get';
import { exchangeRateGetManyDescription } from './getMany';

const showOnlyForExchangeRate = {
	resource: ['exchangeRate'],
};

export const exchangeRateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForExchangeRate,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an exchange rate for one currency',
				description: 'Get the official NRB rate for a single currency on a given date',
				routing: {
					request: {
						method: 'GET',
						url: '/rate',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many exchange rates',
				description: 'Get official NRB exchange rates for a date range',
				routing: {
					request: {
						method: 'GET',
						url: '/rates',
						qs: {
							page: 1,
						},
					},
				},
			},
		],
		default: 'getMany',
	},
	...exchangeRateGetDescription,
	...exchangeRateGetManyDescription,
];

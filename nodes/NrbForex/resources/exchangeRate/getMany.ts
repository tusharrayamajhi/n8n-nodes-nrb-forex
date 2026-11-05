import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

const showOnlyForExchangeRateGetMany = {
	operation: ['getMany'],
	resource: ['exchangeRate'],
};

export const exchangeRateGetManyDescription: INodeProperties[] = [
	{
		displayName: 'From',
		name: 'from',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForExchangeRateGetMany,
		},
		description: 'Start date of the range to fetch rates for',
		routing: {
			send: {
				type: 'query',
				property: 'from',
				value: '={{ $value.split("T")[0] }}',
			},
		},
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForExchangeRateGetMany,
		},
		description: 'End date of the range to fetch rates for',
		routing: {
			send: {
				type: 'query',
				property: 'to',
				value: '={{ $value.split("T")[0] }}',
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForExchangeRateGetMany,
		},
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue: '={{ $response.body.data.payload !== null && $response.body.pagination.links.next !== null }}',
						request: {
							// Pagination qs replaces the whole query string, so carry the range forward.
							// $response is empty on the first request, which must ask for page 1.
							qs: {
								from: '={{ $request.qs.from }}',
								to: '={{ $request.qs.to }}',
								per_page: '={{ $request.qs.per_page }}',
								page: '={{ ($response.body?.pagination?.page ?? 0) + 1 }}',
							},
						},
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		displayOptions: {
			show: { ...showOnlyForExchangeRateGetMany, returnAll: [false] },
		},
		description: 'Max number of results to return',
		hint: 'Counts days, not items. Each day returns one item per currency.',
		routing: {
			send: {
				type: 'query',
				property: 'per_page',
			},
		},
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'hidden',
		default: 100,
		displayOptions: {
			show: { ...showOnlyForExchangeRateGetMany, returnAll: [true] },
		},
		routing: {
			send: {
				type: 'query',
				property: 'per_page',
			},
		},
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForExchangeRateGetMany,
		},
		description: 'Whether to return a simplified list of rates (one item per currency per date) instead of the raw nested API response',
		routing: {
			output: {
				postReceive: [
					async function (
						this: IExecuteSingleFunctions,
						items: INodeExecutionData[],
						response: IN8nHttpFullResponse,
					): Promise<INodeExecutionData[]> {
						const simplify = this.getNodeParameter('simplify') as boolean;
						if (!simplify) return items;

						const body = response.body as IDataObject;
						const data = body.data as IDataObject;
						const payload = (data?.payload as IDataObject[]) ?? [];

						const flattened: IDataObject[] = [];
						for (const day of payload) {
							const rates = (day.rates as IDataObject[]) ?? [];
							for (const rate of rates) {
								const currency = rate.currency as IDataObject;
								flattened.push({
									date: day.date,
									publishedOn: day.published_on,
									modifiedOn: day.modified_on,
									currencyIso3: currency.iso3,
									currencyName: currency.name,
									unit: currency.unit,
									buy: Number(rate.buy),
									sell: Number(rate.sell),
								});
							}
						}

						return flattened.map((json) => ({ json }));
					},
				],
			},
		},
	},
];

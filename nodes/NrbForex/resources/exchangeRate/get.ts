import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const showOnlyForExchangeRateGet = {
	operation: ['get'],
	resource: ['exchangeRate'],
};

const CURRENCIES: Array<{ name: string; value: string }> = [
	{ name: 'AED - UAE Dirham', value: 'AED' },
	{ name: 'AUD - Australian Dollar', value: 'AUD' },
	{ name: 'BHD - Bahrain Dinar', value: 'BHD' },
	{ name: 'CAD - Canadian Dollar', value: 'CAD' },
	{ name: 'CHF - Swiss Franc', value: 'CHF' },
	{ name: 'CNY - Chinese Yuan', value: 'CNY' },
	{ name: 'DKK - Danish Kroner', value: 'DKK' },
	{ name: 'EUR - European Euro', value: 'EUR' },
	{ name: 'GBP - UK Pound Sterling', value: 'GBP' },
	{ name: 'HKD - Hong Kong Dollar', value: 'HKD' },
	{ name: 'INR - Indian Rupee', value: 'INR' },
	{ name: 'JPY - Japanese Yen', value: 'JPY' },
	{ name: 'KRW - South Korean Won', value: 'KRW' },
	{ name: 'KWD - Kuwaity Dinar', value: 'KWD' },
	{ name: 'MYR - Malaysian Ringgit', value: 'MYR' },
	{ name: 'OMR - Omani Rial', value: 'OMR' },
	{ name: 'QAR - Qatari Riyal', value: 'QAR' },
	{ name: 'SAR - Saudi Arabian Riyal', value: 'SAR' },
	{ name: 'SEK - Swedish Kroner', value: 'SEK' },
	{ name: 'SGD - Singapore Dollar', value: 'SGD' },
	{ name: 'THB - Thai Baht', value: 'THB' },
	{ name: 'USD - U.S. Dollar', value: 'USD' },
];

const CURRENCY_CODES = CURRENCIES.map((c) => c.value).join(', ');

export const exchangeRateGetDescription: INodeProperties[] = [
	{
		displayName: 'Let AI Choose Currency',
		name: 'letAiChooseCurrency',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForExchangeRateGet,
		},
		description:
			'Whether to let a connected AI agent pick the currency at runtime instead of fixing it below. Only relevant when this node is used as a tool for an AI Agent.',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		required: true,
		default: 'USD',
		displayOptions: {
			show: { ...showOnlyForExchangeRateGet, letAiChooseCurrency: [false] },
		},
		description: 'The currency to get the exchange rate for',
		options: CURRENCIES,
	},
	{
		displayName: 'Currency (Set by AI)',
		name: 'currencyFromAi',
		type: 'hidden',
		default: `={{ $fromAI('currency', 'ISO3 currency code. Must be exactly one of: ${CURRENCY_CODES}', 'string') }}`,
		displayOptions: {
			show: { ...showOnlyForExchangeRateGet, letAiChooseCurrency: [true] },
		},
		routing: {
			send: {
				type: 'query',
				property: 'currency',
			},
		},
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: showOnlyForExchangeRateGet,
		},
		description: 'The date to get the rate for. Leave empty to get the latest published rate.',
		routing: {
			send: {
				type: 'query',
				property: 'date',
				value: '={{ $value ? $value.split("T")[0] : undefined }}',
			},
		},
	},
	{
		displayName: 'Simplify',
		name: 'simplifyGet',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForExchangeRateGet,
		},
		description:
			'Whether to return a simplified single-currency result instead of the raw nested API response',
		routing: {
			output: {
				postReceive: [
					async function (
						this: IExecuteSingleFunctions,
						items: INodeExecutionData[],
						response: IN8nHttpFullResponse,
					): Promise<INodeExecutionData[]> {
						const useAiCurrency = this.getNodeParameter('letAiChooseCurrency') as boolean;
						const currency = (
							useAiCurrency
								? this.getNodeParameter('currencyFromAi')
								: this.getNodeParameter('currency')
						) as string;
						const body = response.body as IDataObject;
						const data = body.data as IDataObject;
						const payload = data.payload as IDataObject;
						const rates = (payload.rates as IDataObject[]) ?? [];

						const match = rates.find(
							(rate) => (rate.currency as IDataObject).iso3 === currency,
						);

						if (!match) {
							const available = rates
								.map((rate) => (rate.currency as IDataObject).iso3)
								.join(', ');
							throw new NodeOperationError(
								this.getNode(),
								`No rate found for currency "${currency}" on ${payload.date}. Available currencies: ${available}`,
							);
						}

						const simplify = this.getNodeParameter('simplifyGet') as boolean;
						if (!simplify) return items;

						const matchedCurrency = match.currency as IDataObject;
						const json: IDataObject = {
							date: payload.date,
							publishedOn: payload.published_on,
							modifiedOn: payload.modified_on,
							currencyIso3: matchedCurrency.iso3,
							currencyName: matchedCurrency.name,
							unit: matchedCurrency.unit,
							buy: Number(match.buy),
							sell: Number(match.sell),
						};

						return [{ json }];
					},
				],
			},
		},
	},
];

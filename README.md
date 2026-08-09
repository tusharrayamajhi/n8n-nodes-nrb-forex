# n8n-nodes-nrb-forex

This is an n8n community node. It lets you fetch official foreign exchange rates published by
**Nepal Rastra Bank** (NRB), Nepal's central bank, in your n8n workflows.

NRB publishes daily buy/sell rates for major currencies (USD, INR, EUR, GBP, etc.) against the
Nepalese Rupee (NPR) via a public API. Useful for remittance, accounting, and invoicing
automations that need today's — or a historical range of — official NPR exchange rates.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Exchange Rate

- **Get** — Get the official NRB rate for a single **Currency** on a given **Date** (defaults to
  the latest published rate if left empty). Throws a clear error listing valid currency codes if
  the requested one isn't found. A **Simplify** toggle returns just that currency's rate
  (`date`, `currencyIso3`, `currencyName`, `unit`, `buy`, `sell`), or turn it off to get the raw
  API response for that date.
- **Get Many** — Get official NRB exchange rates for a date range (`From` / `To`). Supports
  **Return All** to auto-paginate across the full range, or a **Per Page** limit for a single
  page. A **Simplify** toggle flattens the nested response into one item per currency per date
  (`date`, `currencyIso3`, `currencyName`, `unit`, `buy`, `sell`), or turn it off to get the raw
  API response.

## Credentials

None. The NRB Forex API (`https://www.nrb.org.np/api/forex/v1/`) is public and requires no
authentication.

## Compatibility

Built and tested against n8n's community node CLI (`@n8n/node-cli`), declarative-style node,
`n8nNodesApiVersion: 1`.

## Usage

Rates are per `unit` of foreign currency in NPR — most currencies are quoted per 1 unit, but INR
is quoted per 100 units. Use the `unit` field from the response to normalize rates if needed.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [NRB FOREX API documentation](https://www.nrb.org.np/api-docs-v1/)

## Version history

- **0.1.0** — Initial release: Get Many exchange rates for a date range, with pagination and
  simplified output.

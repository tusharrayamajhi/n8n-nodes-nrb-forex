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

- **Get**: Get the official NRB rate for a single **Currency**. Add **Date** under **Options** to
  pick a day. If you leave it empty, the node uses today's date. The node throws a clear error if
  NRB has no rates for that date, or if the currency isn't found. A **Simplify** toggle returns
  just that currency's rate (`date`, `publishedOn`, `modifiedOn`, `currencyIso3`, `currencyName`,
  `unit`, `buy`, `sell`). Turn it off to get the raw API response for that date. Turn on **Let AI
  Choose Currency** to let a connected AI Agent pick the currency when the node is used as a tool.
- **Get Many**: Get official NRB exchange rates for a date range (`From` / `To`). Turn on
  **Return All** to get the full range, or set a **Limit** of up to 100 days. Limit counts days,
  not items, and each day returns one item per currency. A **Simplify** toggle flattens the nested
  response into one item per currency per date, with the same fields as Get. Turn it off to get
  the raw API response.

## Credentials

None. The NRB Forex API (`https://www.nrb.org.np/api/forex/v1/`) is public and requires no
authentication.

## Compatibility

Built and tested against n8n's community node CLI (`@n8n/node-cli`), declarative-style node,
`n8nNodesApiVersion: 1`.

## Usage

Rates are per `unit` of foreign currency in NPR. Most currencies are quoted per 1 unit, but INR and
KRW are quoted per 100 units and JPY per 10 units. Divide `buy` and `sell` by `unit` to get the
rate for one unit.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [NRB FOREX API documentation](https://www.nrb.org.np/api-docs-v1/)

## Version history

- **0.1.4**: Fixed Return All for ranges longer than one page. Replaced Per Page with Limit. Moved
  Date into Options on Get, so set it again in existing workflows. Added a clear error for dates
  with no rates. Changed the codex category to Finance & Accounting. New logo.
- **0.1.3**: Added Let AI Choose Currency to Get.
- **0.1.2**: Added the CI release workflow and a new icon.
- **0.1.1**: Initial release.

# CSV Description

## `avg_gas_prices.csv`

The data in this csv contains the average gas price (measured in Ether) per each day in April 2025.
Data from this csv is taken from [etherscan.io](https://etherscan.io/chart/gasprice)

| **Column** | **Description**               | **Type** | **Unit** |
| ---------- | ----------------------------- | -------- | -------- |
| 1          | Date (YYYY-MM-DD)             | Date     | /        |
| 2          | Average gas price on that day | Integer  | Wei      |

## `eth_usd_exrate.csv`

The data in this csv contains the minimum and maximum exchange rates (from Ether to USD) for each day in April 2025.
Data from this csv is taken from [coinmarketcap.com](https://coinmarketcap.com/currencies/ethereum/historical-data/)

| **Column** | **Description**                   | **Type** | **Unit** |
| ---------- | --------------------------------- | -------- | -------- |
| 1          | Date (YYYY-MM-DD)                 | Date     | /        |
| 2          | Minimum exchange rate on that day | Float    | USD/Eth  |
| 3          | Maximum exchange rate on that day | Float    | USD/Eth  |

# LogoIpsum Event Ticketing App&trade;

Event Ticketing Web3 App largely powered by the [ Unlock Protocol](https://unlock-protocol.com/) smart contracts

## Requirements
- MetaMask browser extension install it from [here](https://metamask.io/download/)
- Docker
- [Alchemy account](https://www.alchemy.com/faucets/ethereum-sepolia) for the Ethereum Sepolia Faucet, to get free currency for testing
- Url for the [Sepolia Testnet](https://www.alchemy.com/overviews/sepolia-testnet)

## Tech Stack
LogoIpsum uses [Next.js](https://nextjs.org/) for the frontend and [NestJS](https://nestjs.com/) for the backend, with [PostgresSQL](https://www.postgresql.org/) for the database.

## Installation
- Install MetaMask from [here](https://metamask.io/download/)
- Install Docker and Docker Compose, from [here](https://docs.docker.com/engine/install/) and [here](https://docs.docker.com/compose/install/) respectively
- Clone the repository `git clone https://github.com/gissilali/nft-ticketing.git`
- run `cd nft-ticketing && cp backend/env.example backend/.env && cp frontend/env.example frontend/.env.local`
- Add the appropriate values for `SEPOLIA_TESTNET_URL` and `PRIVATE_KEY` to the `.env` file in the `/backend` directory
- From the root directory of the project run `docker compose up --build`, this starts the development servers for both the frontend and backend services.
- Go to http://localhost:5000/ to open the web application on the browser.

## Troubleshooting
- If the login button is unresponsive when clicked, please try reloading the page. This issue is caused by a bug in Next.js that occurs in development mode.
- Make sure the `SEPOLIA_TESTNET_URL` and `PRIVATE_KEY` values are defined
- To resolve **EACCES** permissions errors delete `frontend/.next` and `backend/dist` directories and run `docker compose up` again.

## How commissions work

The Unlock protocol has an option to set a referrer when purchasing a ticket, a referrer is the wallet address that gets a specified part of the income for every ticket sale, this is done via an internal transaction, `setReferrerFee` sets the fee and while the `purchase` function has the option to define a referrer wallet address.

References
- [referrer and setReferrerFee](https://docs.unlock-protocol.com/core-protocol/public-lock/#referrerfees-and-setreferrerfee)
- [purchase](https://docs.unlock-protocol.com/core-protocol/public-lock/#referrerfees-and-setreferrerfee)

The wallet address is defined on the frontend `.env.local` variable `NEXT_PUBLIC_MOBIFI_WALLET_ADDRESS`

## The Backend

It is mostly CRUD functionality to store events and tickets, after key purchases.


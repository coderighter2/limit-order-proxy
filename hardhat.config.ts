import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                runs: 200,
                enabled: true
            }
        }
    },
    networks: {
        bsctest: {
            url: "https://data-seed-prebsc-1-s3.binance.org:8545",
            chainId: 97,
            gasPrice: 20000000000,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
            timeout: 300000
        },
        bsc: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            gasPrice: 20000000000,
            accounts: [`0x${process.env.PRIVATE_KEY}`]
        },
        main: {
            url: "https://ethereum.blockpi.network/v1/rpc/public",
            chainId: 1,
            gasPrice: "auto",
            accounts: [`0x${process.env.PRIVATE_KEY}`]
        },
        polygon: {
            url: "https://polygon.blockpi.network/v1/rpc/public",
            chainId: 137,
            gasPrice: "auto",
            accounts: [`0x${process.env.PRIVATE_KEY}`]
        }
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
};

export default config;

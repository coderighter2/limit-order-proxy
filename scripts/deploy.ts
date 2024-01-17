import { BigNumber } from "ethers";
import hre, {ethers} from "hardhat";

require('dotenv').config()

async function main() {
    

    let limitCoreAddr = `${process.env.BSC_LIMIT_CORE}`;
    let erc20RouterAddr = `${process.env.BSC_ERC20_ROUTER}`;
    let treasuryAddr = `${process.env.BSC_TREASURY}`;

    if (hre.network.name == 'main') {
        limitCoreAddr = `${process.env.MAIN_LIMIT_CORE}`;
        erc20RouterAddr = `${process.env.MAIN_ERC20_ROUTER}`;
        treasuryAddr = `${process.env.MAIN_TREASURY}`;
    } else if (hre.network.name == 'polygon') {
        limitCoreAddr = `${process.env.POLYGON_LIMIT_CORE}`;
        erc20RouterAddr = `${process.env.POLYGON_ERC20_ROUTER}`;
        treasuryAddr = `${process.env.POLYGON_TREASURY}`;
    }

    const LimitOrderProxy = await ethers.getContractFactory("LimitOrderProxy");
    const limitOrderProxy = await LimitOrderProxy.deploy(limitCoreAddr, erc20RouterAddr, treasuryAddr);
    await limitOrderProxy.deployed();
    console.log('Proxy: ', limitOrderProxy.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

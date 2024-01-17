import { BigNumber } from "ethers";
import hre, {ethers} from "hardhat";
require('dotenv').config()

interface VerifyArguments {
    address: string
    constructorArguments?: any
    contract?: any
}

async function verifyContract(address: string, args: any, contract: string ) {
    const verifyObj: VerifyArguments = {address}
    if(args){
        verifyObj.constructorArguments = args
    }
    if(contract){
        verifyObj.contract = contract;
    }
    console.log("verifyObj", verifyObj)
    return hre
    .run("verify:verify", verifyObj)
    .then(() =>
      console.log(
        "Contract address verified:",
        address
      )
    );
}


async function main() {

    const [deployer] = await ethers.getSigners();

    let limitProxyAddr = `${process.env.BSC_LIMIT_PROXY}`;
    let limitCoreAddr = `${process.env.BSC_LIMIT_CORE}`;
    let erc20RouterAddr = `${process.env.BSC_ERC20_ROUTER}`;
    let treasuryAddr = `${process.env.BSC_TREASURY}`;
    if (hre.network.name == 'main') {
        limitProxyAddr = `${process.env.MAIN_LIMIT_PROXY}`
        limitCoreAddr = `${process.env.MAIN_LIMIT_CORE}`;
        erc20RouterAddr = `${process.env.MAIN_ERC20_ROUTER}`;
        treasuryAddr = `${process.env.MAIN_TREASURY}`;
    } else if (hre.network.name == 'polygon') {
        limitProxyAddr = `${process.env.POLYGON_LIMIT_PROXY}`
        limitCoreAddr = `${process.env.POLYGON_LIMIT_CORE}`;
        erc20RouterAddr = `${process.env.POLYGON_ERC20_ROUTER}`;
        treasuryAddr = `${process.env.POLYGON_TREASURY}`;
    }

    
    try {
        await verifyContract(limitProxyAddr, [limitCoreAddr, erc20RouterAddr, treasuryAddr], "contracts/LimitOrderProxy.sol:LimitOrderProxy");
    } catch (e) {
        console.log(e);
    }
   
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
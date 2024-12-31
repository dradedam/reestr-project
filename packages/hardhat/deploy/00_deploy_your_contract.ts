import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    log: true,
    autoMine: true, 
  });

  const yourContract = await hre.ethers.getContract<Contract>("YourContract");
  console.log("✅ Contract deployed at:", yourContract.address);

};

export default deployYourContract;

deployYourContract.tags = ["YourContract"];
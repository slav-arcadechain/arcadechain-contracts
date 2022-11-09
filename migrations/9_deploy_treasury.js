const token = artifacts.require("TUSD");
const act = artifacts.require("Act");
const Treasury = artifacts.require("Treasury");
const percentageOfBurn = 5;
const percentageOfGoldenTicket = 10;

module.exports = async function (deployer) {
  let accounts = await web3.eth.getAccounts();
  const admin = accounts[1];
  const operator = accounts[2];
  deployer.deploy(
    Treasury,
    admin,
    operator,
    token.address,
    act.address,
    percentageOfBurn,
    percentageOfGoldenTicket
  );
};

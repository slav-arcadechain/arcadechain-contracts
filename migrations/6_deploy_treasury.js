const Treasury = artifacts.require("Treasury");
const stableCoin = '0x912aAEA32355DA6FeB20D98E73B9C81B5afd6A2e';
const act = '0x9AE51260C3824ADc9DD9F02Bc4D6B9e5Eddeb406';
const percentageOfBurn = 5;
const percentageOfGoldenTicket = 10;

module.exports = function (deployer) {
  const admin = '0x588acF052631756422844856e1dc2Ef6066ce121';
  const operator = '0x588acF052631756422844856e1dc2Ef6066ce121';
  deployer.deploy(
    Treasury,
    admin,
    operator,
    stableCoin,
    act,
    percentageOfBurn,
    percentageOfGoldenTicket
  );
};

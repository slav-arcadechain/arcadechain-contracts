const Slot = artifacts.require("Slot");
const BN = require('bn.js');

module.exports = function (deployer, network, accounts) {
    deployer.deploy(Slot,
        '0x588acF052631756422844856e1dc2Ef6066ce121',
        '0x588acF052631756422844856e1dc2Ef6066ce121',
        '0x912aAEA32355DA6FeB20D98E73B9C81B5afd6A2e',
        new BN('10000000000000000000'),
        [10, 20, 30, 40, 50, 75, 100],
        [new BN('25000000000000000000'),
            new BN('20000000000000000000'),
            new BN('15000000000000000000'),
            new BN('10000000000000000000'),
            new BN('8000000000000000000'),
            new BN('5000000000000000000'),
            new BN('2000000000000000000')],
        90
    );
};
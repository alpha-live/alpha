import serojs from 'serojs'
import seropp from 'sero-pp'
// import Web3 from 'sero-web3'
import BigNumber from 'bignumber.js'
import {formatDate, decimals} from './utils'

const config = {
    name: "ALPHA",
    contractAddress: "bqwLGykRqKaYRTCEpM4YEkpii3VR9z1Hbm5iSfJWkAZHa4S2bfGnkJky3UfoBjaAK6VvHrZfbpYviwokY7MYhpH",
    github: "https://github.com/alpha-live/alpha",
    author: "tom",
    url: "https://alpha-live.github.io/alpha/index.html",
    logo: "https://alpha-live.github.io/alpha/logo192.png",
}

const abi = [{
    "constant": true,
    "inputs": [],
    "name": "subordinateInfo",
    "outputs": [{"name": "codes", "type": "string"}, {"name": "counts", "type": "uint256[]"}, {
        "name": "amounts",
        "type": "uint256[]"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "code", "type": "string"}],
    "name": "invest",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "list",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}],
    "name": "indexs",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "info",
    "outputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "uint256"}, {
        "name": "",
        "type": "uint256"
    }, {"name": "", "type": "uint256"}, {"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [{"name": "amount", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "investors",
    "outputs": [{"name": "id", "type": "uint256"}, {"name": "parentId", "type": "uint256"}, {
        "name": "totalAmount",
        "type": "uint256"
    }, {"name": "currentShareReward", "type": "uint256"}, {
        "name": "totalShareReward",
        "type": "uint256"
    }, {"name": "returnIndex", "type": "uint256"}, {
        "components": [{
            "name": "counts",
            "type": "uint256[]"
        }, {"name": "amounts", "type": "uint256[]"}, {"name": "childsCode", "type": "string"}],
        "name": "subordinateInfo",
        "type": "tuple"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "addr", "type": "address"}],
    "name": "registerNode",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "closureTime",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "code", "type": "string"}],
    "name": "details",
    "outputs": [{"name": "slefCode", "type": "string"}, {
        "name": "parentCode",
        "type": "string"
    }, {"name": "shareAmount", "type": "uint256"}, {"name": "canWithdraw", "type": "uint256"}, {
        "name": "values",
        "type": "uint256[]"
    }, {"name": "timestamps", "type": "uint256[]"}, {"name": "returnIndex", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "fundAmount",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "reinvestment",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "marketAddr",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"name": "_marketAddr", "type": "address"}, {"name": "_codeServiceAddr", "type": "address"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "previousOwner", "type": "address"}, {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}];
const caddress = "bqwLGykRqKaYRTCEpM4YEkpii3VR9z1Hbm5iSfJWkAZHa4S2bfGnkJky3UfoBjaAK6VvHrZfbpYviwokY7MYhpH";
const contract = serojs.callContract(abi, caddress);

class Alpha {

    constructor() {
        seropp.init(config, function (rest) {
            console.log("init");
        })
    }


    accountDetails(pk, callback) {
        let self = this;
        seropp.getAccountDetail(pk, function (item) {
            let balance = "0";
            if (item.Balance.has("SERO")) {
                balance = decimals(new BigNumber(item.Balance.get("SERO")));
            }
            callback({pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balance: balance})
        });
    }

    accountList(callback) {
        let self = this;
        seropp.getAccountList(function (data) {
            let accounts = [];
            data.forEach(function (item, index) {
                let balance = "0";
                if (item.Balance.has("SERO")) {
                    balance = decimals(new BigNumber(item.Balance.get("SERO")));
                }
                accounts.push({pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balance: balance})
            });
            callback(accounts)
        });
    }


    details(code, from, callback) {
        let self = this;
        this.callMethod('details', from, [code], function (vals) {
            let detail;
            if (vals === "0x0") {
                detail = {
                    code: "",
                    parentCode: "",
                    childCodes: [],
                    totalShareReward: "0",
                    childsTotalAmount: "0",
                    canWithdraw: "0",
                    records: [],
                    returnIndex: 0
                }
            } else {
                let records = [];
                for (let i = vals[4].length - 1; i >= 0; i--) {
                    records.push({
                        value: new BigNumber(vals[4][i]),
                        timestamp: parseInt(vals[5][i]),
                    });
                }
                detail = {
                    code: vals[0],
                    parentCode: vals[1],
                    childsTotalAmount: decimals(vals[2]),
                    canWithdraw: decimals(vals[3]),
                    records: records,
                    returnIndex: parseInt(vals[6])
                }
            }
            self.subordinateInfo(from, function (info) {
                detail.subordinateInfo = info;
                callback(detail);
            });
        });
    }

    info(from, callback) {
        this.callMethod('info', from, [], function (vals) {
            callback({
                closureTime: vals[0].toNumber(),
                balance: vals[1],
                fundAmount: vals[2],
                investorCount: parseInt(vals[3]),
                luckyCodes: vals[4].split(" ")
            });
        });
    }

    subordinateInfo(from, callback) {
        this.callMethod('subordinateInfo', from, [], function (vals) {
            let codes = [];
            let items = new Array();
            if (vals !== "0x0") {
                if (vals[0] !== "") {
                    codes = vals[0].split(" ");
                }

                for (let i = 0; i < 20; i++) {
                    let count = vals[1][i];
                    if (count.isZero()) {
                        break;
                    }
                    items.push({count: count.toString(), amount: vals[2][i].toString()});
                }
            }
            callback({
                childsCode: codes,
                items: items
            });
        });
    }

    reinvestment(from, callback) {
        this.executeMethod('reinvestment', from, [], 0, callback);
    }

    invest(from, value, code, callback) {
        this.executeMethod('invest', from, [code], value, callback);
    }

    withdraw(from, callback) {
        this.executeMethod('withdraw', from, [], 0, callback);
    }

    callMethod(_method, from, _args, callback) {
        let that = this;
        let packData = contract.packData(_method, _args);
        let callParams = {
            from: from,
            to: caddress,
            data: packData
        }

        seropp.call(callParams, function (callData) {
            if (callData !== "0x") {
                let res = contract.unPackData(_method, callData);
                if (callback) {
                    callback(res);
                }
            } else {
                callback("0x0");
            }
        });
    }


    executeMethod(_method, from, args, value, callback) {
        let that = this;

        let packData = contract.packData(_method, args);
        let executeData = {
            from: from,
            to: caddress,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: "SERO",
        };
        let estimateParam = {
            from: from,
            to: caddress,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: "SERO",
        }
        seropp.estimateGas(estimateParam, function (gas) {
            executeData["gas"] = gas;
            seropp.executeContract(executeData, function (res) {
                if (callback) {
                    callback(res)
                }
            })
        });
    }
}

const alpha = new Alpha();
export default alpha;

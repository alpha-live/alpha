import serojs from 'serojs'
import seropp from 'sero-pp'
// import Web3 from 'sero-web3'
import BigNumber from 'bignumber.js'
import {formatDate, decimals} from './utils'

const config = {
    name: "ALPHA",
    contractAddress: "3BBca5UGcDZLaFMRGPRgCbLGVPanEhAG1YN4aMxScGr1Cxb6rMxCvMyC1FmgFZJ8Lsd5HzSsELuBBC9f28tBNRZp",
    github: "https://github.com/sero-cash/sero-pp/example",
    author: "tom",
    url: "http://127.0.0.1:3000",
    logo: "http://127.0.0.1:3000/logo192.png",
}

const abi = [{
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
    }, {"name": "", "type": "string"}],
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
    }, {"name": "childsTotalAmount", "type": "uint256"}, {
        "name": "shareReward",
        "type": "uint256"
    }, {"name": "totalShareReward", "type": "uint256"}, {"name": "selfAddr", "type": "address"}, {
        "name": "returnIndex",
        "type": "uint256"
    }, {"name": "childCodes", "type": "string"}],
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
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "code", "type": "string"}],
    "name": "details",
    "outputs": [{"name": "", "type": "string"}, {"name": "", "type": "string"}, {
        "name": "",
        "type": "string"
    }, {"name": "", "type": "uint256"}, {"name": "", "type": "uint256"}, {"name": "", "type": "uint256[]"}, {
        "name": "",
        "type": "uint256[]"
    }, {"name": "", "type": "uint256"}],
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
    "constant": true,
    "inputs": [],
    "name": "timestamp",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
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
    "inputs": [],
    "name": "invest",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "code", "type": "string"}],
    "name": "register",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
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
const caddress = "3BBca5UGcDZLaFMRGPRgCbLGVPanEhAG1YN4aMxScGr1Cxb6rMxCvMyC1FmgFZJ8Lsd5HzSsELuBBC9f28tBNRZp";
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
                    childsTotalAmount: 0,
                    canWithdraw: 0,
                    records: [],
                    returnIndex: 0
                }
            } else {
                let returnIndex = parseInt(vals[7]);
                let codes = [];
                if (vals[2] != "") {
                    codes = vals[2].split(" ");
                }
                let records = [];
                for (let i = vals[5].length - 1; i >= 0; i--) {
                    records.push({
                        value: new BigNumber(vals[5][i]),
                        timestamp: new Date(parseInt(vals[6][i]) * 1000),
                    });
                }
                detail = {
                    code: vals[0],
                    parentCode: vals[1],
                    childCodes: codes,
                    childsTotalAmount: decimals(vals[3]),
                    canWithdraw: decimals(vals[4]),
                    records: records,
                    returnIndex: vals[7]
                }
            }
            callback(detail);
        });
    }

    info(from, callback) {
        this.callMethod('info', from, [], function (vals) {
            callback({
                closureTime: vals[0].toNumber(),
                balance: new BigNumber(0),
                fundAmount: vals[1],
                investorNumber: parseInt(vals[2]),
                luckyCodes: vals[3].split(" ")
            });
        });
    }

    register(code, from, callback) {
        this.executeMethod('register', from, [code], 0, callback);
    }

    invest(from, value, callback) {
        this.executeMethod('invest', from, [], value, callback);
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
            console.log("gas", gas);
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

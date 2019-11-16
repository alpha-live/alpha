import React, {Component} from 'react';
import {Modal, Flex, List, WhiteSpace, WingBlank} from "antd-mobile";
import alpha from "./alpha";
import BigNumber from 'bignumber.js'
import {formatDate, decimals} from './utils'

const prompt = Modal.prompt;
const operation = Modal.operation;
const Item = List.Item;

class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {
                pk: "",
                balance: 0,
                details: {
                    code: "",
                    parentCode: "",
                    childCodes: [],
                    childsTotalAmount: 0,
                    canWithdraw: 0,
                    records: [],
                    returnIndex: 0
                }
            }, info: {}
        }
    }

    componentDidMount() {
        let self = this;
        setTimeout(function () {
            alpha.accountList(function (accounts) {
                self.initAccount(accounts[0]);
                setInterval(function () {
                    alpha.accountDetails(self.state.account.pk, function (account) {
                        self.initAccount(account);
                    });
                }, 10 * 1000);
            });

        }, 500)

    }

    formatAccount = (pk) => {
        return pk.slice(0, 6) + "...." + pk.slice(-6)
    }

    initAccount(account) {
        let self = this;
        alpha.details("", account.mainPKr, function (details) {
            account.details = details;
            self.setState({account: account});
        });
    }

    register(code) {
        alpha.register(code, this.state.account.pk, function (ret) {
            console.log(ret);
        });
    }

    invest(value) {
        value = new BigNumber(value).multipliedBy(new BigNumber(10).pow(18));
        alpha.invest(this.state.account.pk, value, function (ret) {
            console.log(ret);
        });
    }

    withdraw() {
        if (this.state.account.details.canWithdraw != "0") {
            alpha.withdraw(this.state.account.pk, function (ret) {
                console.log(ret);
            });
        }
    }

    takePartIn() {
        console.log("details", this.state.account.details);
        if (this.state.account.details.code === "") {
            prompt('注册', '', [
                {text: 'Cancel'},
                {text: 'Submit', onPress: value => this.register(value)},
            ], 'default')
        } else {
            prompt('参与', '', [
                {text: 'Cancel'},
                {text: 'Submit', onPress: value => this.invest(value)},
            ], 'default', '500')
        }
    }

    changAccount() {
        let self = this;
        alpha.accountList(function (accounts) {
            let actions = [];
            accounts.forEach(function (account, index) {
                actions.push(
                    {
                        text: account.name + ":" + self.formatAccount(account.pk), onPress: () => {
                            self.initAccount(account);
                        }
                    }
                );
            });
            operation(actions);
        });
    }

    render() {
        let self = this;
        let pk = this.state.account.pk;
        if (pk != "") {
            pk = this.formatAccount(pk);
        }
        let recordItems = this.state.account.details.records.map(
            (record, index) => {
                let returnIndex = self.state.account.details.returnIndex;
                let status = "";
                let color = '#00AA00';
                let text = decimals(record.value.multipliedBy(15).div(100));
                if ((this.state.account.details.records.length - 1 - index) < returnIndex) {
                    color = '#CC0000';
                } else {
                    let days = Math.floor((new Date().getTime() - record.timestamp.getTime()) / (60 * 1000));
                    // let days = Math.floor((new Date().getTime() - timestamp.getTime()) / (24 * 3600 * 1000));
                    if (days > 15) {
                        color = '#EEEE00';
                    } else {
                        console.log(days);
                        text = decimals(record.value.multipliedBy(days).div(100))
                    }
                }
                return <Item key={index}>
                    <div style={{padding: '5px, 5px', color: color}}>
                        <div style={{float: "left", width: '40%'}}>
                        <span style={{fontSize: '12px'}}>
                            {formatDate(record.timestamp)}
                        </span>
                        </div>
                        <div style={{float: "left", width: '30%', textAlign: 'right'}}>
                        <span style={{fontSize: '12px'}}>
                            {decimals(record.value)}
                        </span>
                        </div>
                        <div style={{float: "left", width: '30%', textAlign: 'right'}}>
                        <span style={{fontSize: '12px'}}>
                            {text}
                        </span>
                        </div>
                    </div>
                </Item>
            }
        );

        return (
            <div>
                <WingBlank size="lg">
                    <List renderHeader={() => '账户信息'}>
                        <List.Item>
                            <div style={{float: 'left'}}>{pk}</div>
                            <div style={{float: 'right'}}>
                                <a onClick={this.changAccount.bind(this)}>切换</a>
                            </div>
                        </List.Item>
                        <List.Item>
                            <div style={{float: 'left'}}>余额: {this.state.account.balance}</div>
                            <div style={{float: 'right'}}>
                                <a onClick={this.takePartIn.bind(this)}>参与</a>
                            </div>
                        </List.Item>
                        <List.Item>
                            <div style={{float: 'left'}}>可提现: {this.state.account.details.canWithdraw}</div>
                            <div style={{float: 'right'}}>
                                <a onClick={this.withdraw.bind(this)}>提现</a>
                            </div>
                        </List.Item>
                    </List>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <List renderHeader={() => '参与记录'}>
                        <Item style={{fontSize: '8px'}} align="middle">
                            <div style={{float: "left", width: '40%'}}>时间</div>
                            <div style={{float: "left", width: '30%', textAlign: 'right'}}>金额</div>
                            <div style={{float: "left", width: '30%', textAlign: 'right'}}>收益</div>
                        </Item>
                        {recordItems}
                    </List>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <List renderHeader={() => '业绩'}>
                        <List.Item>
                            <div style={{float: 'left', width: '30%', textAlign: 'right'}}>邀请码:</div>
                            <div style={{float: 'right'}}>{this.state.account.details.code}</div>
                        </List.Item>
                        <List.Item>
                            <div style={{float: 'left', width: '30%', textAlign: 'right'}}>邀请人数:</div>
                            <div style={{float: 'right'}}>{this.state.account.details.childCodes.length}</div>
                        </List.Item>
                        <List.Item>
                            <div style={{float: 'left', width: '30%', textAlign: 'right'}}>业绩:</div>
                            <div style={{float: 'right'}}>{this.state.account.details.childsTotalAmount}</div>
                        </List.Item>
                    </List>
                </WingBlank>
                <WhiteSpace size="lg"/>
            </div>
        )
    }
}

export default Accounts;
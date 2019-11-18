import React, {Component} from 'react';
import {Modal, Flex, List, WhiteSpace, WingBlank, InputItem} from "antd-mobile";
import alpha from "./alpha";
import BigNumber from 'bignumber.js'
import {formatDate, decimals} from './utils'
import language from './language'

const prompt = Modal.prompt;
const alert = Modal.alert;
const operation = Modal.operation;

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
        return pk.slice(0, 8) + "..." + pk.slice(-8)
    }

    initAccount(account) {
        let self = this;
        alpha.details("", account.mainPKr, function (details) {
            account.details = details;
            self.setState({account: account});
        });
    }

    invest() {
        let value = this.valueInput.state.value;
        if (!value) {
            alert("please input value");
            return
        }
        let code = "";
        if (this.state.account.details.code === "") {
            code = this.codeInput.state.value;
            if (!code) {
                alert("please input code");
                return
            }
        }

        value = new BigNumber(value).multipliedBy(new BigNumber(10).pow(18));
        alpha.invest(this.state.account.pk, value, code, function (ret) {
        });
    }

    withdraw() {
        if (this.state.account.details.canWithdraw !== "0") {
            alpha.withdraw(this.state.account.pk, function (ret) {
            });
        }
    }

    takePartIn() {
        let inputs = <div>
            <InputItem clear ref={el => {
                this.codeInput = el
            }} editable={this.state.account.details.code === ""} placeholder="code"
                       defaultValue={this.state.account.details.parentCode}>{language.e().account.modal.code}:</InputItem>

            <InputItem type='money' clear moneyKeyboardAlign='left' ref={el => {
                this.valueInput = el
            }} placeholder="value"
                       defaultValue='500'>{language.e().account.modal.value}:</InputItem>
        </div>
        alert(language.e().account.modal.title, inputs, [
            {text: language.e().account.modal.cancel},
            {text: language.e().account.modal.submit, onPress: () => this.invest()},
        ])
        if (this.state.account.details.code === "") {
            this.codeInput.focus();
        } else {
            this.valueInput.focus();
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
                    let days = Math.floor((record.timestamp.getTime() - new Date().getTime()) / (60 * 1000));
                    if (days <= 0) {
                        color = '#EEEE00';
                    } else {
                        text = decimals(record.value.multipliedBy(15 - days).div(100))
                    }
                }
                return <List.Item key={index}>
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
                </List.Item>
            }
        );

        return (
            <div>
                <WingBlank size="lg">
                    <List renderHeader={() => language.e().account.title}>
                        <List.Item onClick={this.changAccount.bind(this)}>
                            <div style={{float: 'left'}}>{pk}</div>
                            <div style={{float: 'right'}}>
                                {language.e().account.change}
                            </div>
                        </List.Item>
                        <List.Item>
                            <div
                                style={{float: 'left'}}>{language.e().account.balance}: {this.state.account.balance}</div>
                            <div style={{float: 'right'}}>
                                <a onClick={this.takePartIn.bind(this)}>{language.e().account.partake}</a>
                            </div>
                        </List.Item>
                        <List.Item>
                            <div
                                style={{float: 'left'}}>{language.e().account.amount}: {this.state.account.details.canWithdraw}</div>
                            <div style={{float: 'right'}}>
                                <a onClick={this.withdraw.bind(this)}>{language.e().account.withdraw}</a>
                            </div>
                        </List.Item>
                    </List>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <List renderHeader={() => language.e().account.records.title}>
                        <List.Item style={{fontSize: '8px'}} align="middle">
                            <div style={{float: "left", width: '40%'}}>{language.e().account.records.time}</div>
                            <div style={{
                                float: "left",
                                width: '30%',
                                textAlign: 'right'
                            }}>{language.e().account.records.amount}</div>
                            <div style={{
                                float: "left",
                                width: '30%',
                                textAlign: 'right'
                            }}>{language.e().account.records.profit}</div>
                        </List.Item>
                        {recordItems}
                    </List>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <List renderHeader={() => language.e().account.recommend.title}>
                        <List.Item>
                            <div style={{
                                float: 'left',
                                width: '30%',
                                textAlign: 'right'
                            }}>{language.e().account.recommend.invitationCode}:
                            </div>
                            <div style={{float: 'right'}}>{this.state.account.details.code}</div>
                        </List.Item>
                        <List.Item>
                            <div style={{
                                float: 'left',
                                width: '30%',
                                textAlign: 'right'
                            }}>{language.e().account.recommend.inviteNumber}:
                            </div>
                            <div style={{float: 'right'}}>{this.state.account.details.childCodes.length}</div>
                        </List.Item>
                        <List.Item>
                            <div style={{
                                float: 'left',
                                width: '30%',
                                textAlign: 'right'
                            }}>{language.e().account.recommend.achievement}:
                            </div>
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
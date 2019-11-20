import React, {Component} from 'react';
import {Modal, Flex, List, WhiteSpace, WingBlank, InputItem, Button} from "antd-mobile";
import alpha from "./alpha";
import BigNumber from 'bignumber.js'
import {formatDate, decimals} from './utils'
import language from './language'
import Alpha1_02 from '../img/Alpha1_02.jpg'
import Alpha1_05 from '../img/Alpha1_05.jpg'
import Timer from "./timer";

const alert = Modal.alert;
const operation = Modal.operation;
const tenThousand = new BigNumber("10000000000000000000000");

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
                    childsTotalAmount: "0",
                    canWithdraw: "0",
                    records: [],
                    returnIndex: 0,
                    subordinateInfo: {items: [], childsCode: []}
                }
            }, info: {closureTime: 0}
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

            self.initInfo();
            self.timer = setInterval(self.initInfo(), 20 * 1000);
        }, 500)
    }

    formatAccount = (pk) => {
        return pk.slice(0, 8) + "..." + pk.slice(-8)
    }

    initAccount(account) {
        let self = this;
        if (account) {
            alpha.details("", account.mainPKr, function (details) {
                account.details = details;
                self.setState({account: account});
            });
        }
    }

    onTimeout() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    initInfo() {
        let self = this;
        alpha.info(this.state.account.mainPKr, function (info) {

            if (info.closureTime != 0) {
                self.setState({
                    info: {
                        closureTime: info.closureTime,
                        balance: decimals(info.balance),
                        poolBalance: decimals(info.balance.minus(info.fundAmount)),
                        fundBalance: decimals(info.fundAmount)
                    }
                })
            } else {
                self.setState({
                    info: {
                        closureTime: 0
                    }
                });
            }
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

    reinvestment() {
        if (this.state.account.details.canWithdraw !== "0") {
            alpha.reinvestment(this.state.account.pk, function (ret) {
            });
        }

    }

    takePartIn() {
        let inputs = <div>
            <InputItem clear ref={el => {
                this.codeInput = el
            }} editable={this.state.account.details.code === ""} placeholder="code"
                       defaultValue={this.state.account.details.parentCode}><span
                className="column-title">{language.e().account.modal.code}:</span></InputItem>

            <InputItem type='money' clear moneyKeyboardAlign='left' ref={el => {
                this.valueInput = el
            }} placeholder="value"
                       defaultValue='500'><span>{language.e().account.modal.value}:</span></InputItem>
        </div>
        alert(<span>{language.e().account.modal.title}</span>, inputs, [
            {text: <span>{language.e().account.modal.cancel}</span>},
            {text: <span>{language.e().account.modal.submit}</span>, onPress: () => this.invest()},
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
                        text: <span>{account.name + ":" + self.formatAccount(account.pk)}</span>, onPress: () => {
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
                let status = "已结算";
                let profit = decimals(record.value.multipliedBy(15).div(100));
                let days = 0;
                if ((this.state.account.details.records.length - 1 - index) >= returnIndex) {
                    days = Math.floor((new Date().getTime() - record.timestamp * 1000) / (60 * 1000));
                    if (days > 15) {
                        days = 15;
                        status = '可提现';
                    } else {
                        profit = decimals(record.value.multipliedBy(days).div(100))
                        status = "未到期"
                    }
                }
                return <List.Item key={index}>
                    <div style={{float: "left", width: '10%', textAlign: 'center'}}><span
                        className="column-title">{index + 1}</span></div>
                    <div style={{float: "left", width: '20%', textAlign: 'center'}}><span
                        className="column-title">{decimals(record.value)}</span></div>
                    <div style={{float: "left", width: '20%', textAlign: 'center'}}><span
                        className="column-title">{profit}</span></div>
                    <div style={{float: "left", width: '30%', textAlign: 'center'}}><span
                        className="column-title">{15 - days}</span></div>
                    <div style={{float: "left", width: '20%', textAlign: 'center'}}><span
                        className="column-title">{status}</span></div>
                </List.Item>
            }
        );

        let achievement = 0;
        let subordinateInfos = this.state.account.details.subordinateInfo.items.map(
            (record, index) => {
                let statue;
                if (index == 0) {
                    achievement = record.amount;
                    statue = "可拿"
                } else {
                    statue = new BigNumber(achievement).div(tenThousand).toNumber() >= (index + 1) ? "可拿" : "不" + "可拿";
                }

                return <List.Item key={index}>
                    <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                        className="column-title">{index + 1}</span></div>
                    <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                        className="column-title">{record.count}</span></div>
                    <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                        className="column-title">{decimals(record.amount)}</span></div>
                    <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                        className="column-title">{statue}</span></div>
                </List.Item>
            }
        )

        return (
            <div style={{maxWidth: '600px'}}>
                <div style={{position: "fixed", top: "0", width: "100%", maxWidth: "600px"}}>
                        <span style={{float: "left", padding: "15px"}} onClick={() => {
                            Modal.alert(<span>合约规则</span>, <div className="contractRule">
                                合约地址:
                                2BQWCtFGPZpHepKzmGDGWnPVuZqaem5hVM8T7decSXMRuz3oX1qBzsbAV8une2gzskUNMDEkdChHE8jEeMcr8tNwcK37RRfFzTGfZpnQdp5gkMmSYd2E22GRveU1Li3RVFPm<br/>
                                推荐码: JFVVW2ITNSJHF

                            </div>, [
                                {text: <span>OK</span>}])
                        }}>合约规则</span>
                    <span style={{float: "right", padding: "15px"}}>简体中文</span>
                </div>
                <div className="header">
                    <img src={Alpha1_02} width="100%"/><br/>

                    {
                        this.state.info.closureTime != 0 && <div>
                            <img src={Alpha1_05} width="200"/>
                            <Timer delayTime={this.state.info.closureTime} onTimeout={this.onTimeout.bind(this)}/>
                        </div>
                    }

                </div>
                {
                    this.state.info.closureTime != 0 && <WingBlank size="lg" style={{marginTop: "-30px"}}>
                        <List renderHeader={<span className="title">保障基金[启动中]</span>}>
                            <List.Item>
                                <div>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}><span
                                        className="column-title">资金池</span></div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}>&nbsp;</div>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}><span
                                        className="column-title">保障基金</span></div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}>&nbsp;</div>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}><span
                                        className="column-title">总金额</span></div>
                                </div>
                                <div>
                                    <div style={{
                                        float: 'left',
                                        width: '30%',
                                        textAlign: 'center'
                                    }}>{this.state.info.poolBalance}</div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}><span
                                        className="column-title">+</span></div>
                                    <div style={{
                                        float: 'left',
                                        width: '30%',
                                        textAlign: 'center'
                                    }}>{this.state.info.fundBalance}</div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}>=</div>
                                    <div style={{
                                        float: 'left',
                                        width: '30%',
                                        textAlign: 'center'
                                    }}>{this.state.info.balance}</div>
                                </div>
                            </List.Item>

                        </List>
                    </WingBlank>
                }

                <WingBlank size="lg">
                    <List renderHeader={<span className="title">{language.e().account.title}</span>}>
                        <List.Item onClick={this.changAccount.bind(this)}>
                            <div style={{float: 'left'}}>{pk}</div>
                            <Button style={{float: 'right'}}>
                                {language.e().account.change}
                            </Button>
                        </List.Item>
                        <List.Item>
                            <div
                                style={{float: 'left'}}><span
                                className="column-title">{language.e().account.balance}:</span> <span
                                className="column-value">{this.state.account.balance}</span> SERO
                            </div>
                            <div style={{float: 'right'}}>
                                <Button onClick={() => {
                                    this.takePartIn()
                                }}>{language.e().account.partake}</Button>
                            </div>
                        </List.Item>
                        <List.Item>
                            <div
                                style={{float: 'left'}}><span
                                className="column-title">{language.e().account.amount}:</span> <span
                                className="column-value">{this.state.account.details.canWithdraw}</span> SERO
                            </div>
                            <div style={{float: 'right'}}>
                                <div style={{float: 'left'}}>
                                    <Button onClick={() => {
                                        this.withdraw()
                                    }}>{language.e().account.withdraw}</Button>
                                </div>
                                <div style={{float: 'right'}}>
                                    <Button onClick={() => {
                                        this.reinvestment()
                                    }}>{language.e().account.reinvestment}</Button>
                                </div>
                            </div>
                        </List.Item>
                    </List>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <List renderHeader={<span className="title">{language.e().account.records.title}</span>}>
                        <div className="item-header">
                            <div style={{float: "left", width: '10%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.id}</span></div>
                            <div style={{float: "left", width: '20%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.amount}</span></div>
                            <div style={{float: "left", width: '20%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.profit}</span></div>
                            <div style={{float: "left", width: '30%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.time}</span></div>
                            <div style={{float: "left", width: '20%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.state}</span></div>
                        </div>

                        {recordItems}
                    </List>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <List renderHeader={<span className="title">{language.e().account.recommend.title}</span>}>
                        <div className="item-header">
                            <div>
                                <div><span
                                    className="column-title">{language.e().account.recommend.invitationCode}: </span>
                                    <span className="column-value">{this.state.account.details.code}</span>
                                </div>
                            </div>
                        </div>
                        <List.Item>
                            <div>
                                <div style={{float: 'left', width: '40%',}}>
                                    <span
                                        className="column-title">{language.e().account.recommend.inviteNumber}: </span>
                                    <span
                                        className="column-value">{this.state.account.details.subordinateInfo.childsCode.length}</span>
                                </div>
                                <div style={{float: 'left', width: '60%',}}>
                                    <span className="column-title">{language.e().account.recommend.achievement}: </span>
                                    <span className="column-title">{decimals(achievement)} SERO</span>
                                </div>
                            </div>
                        </List.Item>

                        <div className="item-header">
                            <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.recommend.level}</span></div>
                            <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.recommend.count}</span></div>
                            <div style={{float: "left", width: '20%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.recommend.achieveDetail}</span></div>
                            <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.recommend.state}</span></div>
                        </div>
                        {subordinateInfos}
                    </List>
                </WingBlank>
                <div className="footer">
                    <p>风险投资 谨慎参与</p>
                </div>
            </div>
        )
    }
}

export default Accounts;
import React, {Component} from 'react';
import {Modal, Toast, List, WhiteSpace, WingBlank, InputItem, Button} from "antd-mobile";
import alpha from "./alpha";
import BigNumber from 'bignumber.js'
import {formatDate, decimals} from './utils'
import language from './language'
import Alpha1_02 from '../img/Alpha1_02.jpg'
import Timer from "./timer";
import copy from "copy-text-to-clipboard/index"

const operation = Modal.operation;
const tenThousand = new BigNumber("10000000000000000000000");

function alert(content) {
    Modal.alert(content,"",[{text:language.e().Button.Ok}])
}

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
                    canWithdraw: "0",
                    records: [],
                    returnIndex: 0,
                    subordinateInfo: {items: [], childsCode: []}
                }
            }, info: {closureTime: 0},
            lang: "English"
        }
    }

    componentDidMount() {
        let self = this;
        alpha.OnInit
            .then(()=>{
                alpha.accountList(function (accounts) {
                    self.initAccount(accounts[0]);
                    setInterval(function () {
                        alpha.accountDetails(self.state.account.pk, function (account) {
                            self.initAccount(account);
                        });
                    }, 20 * 1000);
                });
                self.initInfo();
                self.timer = setInterval(self.initInfo(), 20 * 1000);
            })
            .catch(()=>{
                alert("init failed")
            })

        this.setState({
            lang: language.e().text
        })
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
                let fundBalance = info.fundAmount;
                let poolBalance = new BigNumber(0);
                if (info.balance.isZero()) {
                    fundBalance = new BigNumber(0);
                } else {
                    poolBalance = info.balance.minus(info.fundAmount)
                }
                self.setState({
                    info: {
                        closureTime: info.closureTime,
                        balance: decimals(info.balance),
                        poolBalance: decimals(poolBalance),
                        fundBalance: decimals(fundBalance),
                        luckyCodes: info.luckyCodes
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
        if (value < 500 || value > 100000) {
            alert("value must in [500,100000]")
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
        console.log("invest", code, value);
        alpha.invest(this.state.account.pk, this.state.account.mainPKr, value, code, function (ret) {
        });
    }

    withdraw() {
        if (this.state.account.details.canWithdraw !== "0") {
            alpha.withdraw(this.state.account.pk, this.state.account.mainPKr, function (ret) {
            });
        }
    }

    reinvest() {
        if (this.state.account.details.canWithdraw !== "0") {
            alpha.reinvest(this.state.account.pk, this.state.account.mainPKr, function (ret) {
            });
        }

    }

    takePartIn() {
        let defCode = "IFVUSKIRFSIDF";
        if (this.state.account.details.parentCode !== "") {
            defCode = this.state.account.details.parentCode;
        }
        let inputs = <div>
            <InputItem clear ref={el => {
                this.codeInput = el
            }} editable={this.state.account.details.code === ""} placeholder="code"
                       defaultValue={defCode}><span
                className="column-title">{language.e().account.modal.code}:</span></InputItem>

            <InputItem type='money' clear moneyKeyboardAlign='left' ref={el => {
                this.valueInput = el
            }} placeholder="500 ~ 100000"><span>{language.e().account.modal.value}:</span></InputItem>
        </div>
        Modal.alert(<span>{language.e().account.modal.title}</span>, inputs, [
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

    setLang = () => {
        let lang = "中文"
        let l = "zh_CN";
        if (localStorage.getItem("language") === "en_US") {
            l = "zh_CN";
            lang = "English";
        } else {
            l = "en_US";
            lang = "中文";
        }
        localStorage.setItem("language", l)
        this.setState({
            lang: lang
        })
    }

    last() {
        if (this.state.info.closureTime != 0) {
            if (new Date().getTime() <= this.state.info.closureTime * 1000) {
                return (
                    <WingBlank size="lg" style={{marginTop: "-30px"}}>
                        <List renderHeader={<span className="title">{language.e().fund.title}</span>}>
                            <List.Item>
                                <div>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}><span
                                        className="column-title">{language.e().fund.poolAmount}</span></div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}>&nbsp;</div>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}><span
                                        className="column-title">{language.e().fund.fundAmount}</span></div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}>&nbsp;</div>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}><span
                                        className="column-title">{language.e().fund.total}</span></div>
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
                )
            } else {
                return (
                    <WingBlank size="lg" style={{marginTop: "-30px"}}>
                        <List renderHeader={<span className="title">{language.e().fund.close}</span>}>
                            <List.Item multipleLine>
                                <div style={{wordWrap:"break-word"}}>{this.state.info.luckyCodes.join(" , ")}</div>
                            </List.Item>
                        </List>
                    </WingBlank>
                )
            }
        } else {
            return "";
        }
    }

    render() {
        let self = this;
        let pk = this.state.account.pk;
        if (pk != "") {
            pk = this.formatAccount(pk);
        }

        let total_amount=new BigNumber(0);
        let total_profit=new BigNumber(0);

        let recordItems = this.state.account.details.records.map(
            (record, index) => {
                let order = this.state.account.details.records.length - index;
                let returnIndex = self.state.account.details.returnIndex;
                let status = language.e().account.records.stateValues[0];
                let profit = record.value.multipliedBy(15).div(200);
                let days = 15;
                if ((this.state.account.details.records.length - 1 - index) >= returnIndex) {
                    days = Math.floor((new Date().getTime() - record.timestamp * 1000) / (60 * 1000));
                    if (days >= 15) {
                        days = 15;
                        status = language.e().account.records.stateValues[1];
                    } else {
                        status = language.e().account.records.stateValues[2];
                    }
                }

                total_amount=total_amount.plus(record.value);
                total_profit=total_profit.plus(profit);

                return <List.Item key={index}>
                    <div style={{float: "left", width: '12%', textAlign: 'center'}}><span
                        className="column-title">{order}</span></div>
                    <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                        className="column-title">{decimals(record.value)}</span></div>
                    <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                        className="column-title">{decimals(profit)}</span></div>
                    <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                        className="column-title">{15 - days}</span></div>
                    <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
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
                    statue = language.e().account.recommend.stateValues[0];
                } else {
                    statue = new BigNumber(achievement).div(tenThousand).toNumber() >= (index + 1) ? language.e().account.recommend.stateValues[0] : language.e().account.recommend.stateValues[1];
                }
                let reward = new BigNumber(record.amount).multipliedBy(75).dividedBy(1000)
                if(index>0) {
                    reward = reward.dividedBy(10)
                }
                return <List.Item key={index}>
                    <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                        className="column-title">{index + 1}</span></div>
                    <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                        className="column-title">{decimals(record.amount)}</span></div>
                    <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                        className="column-title">{decimals(reward)}</span></div>
                    <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                        className="column-title">{statue}</span></div>
                </List.Item>
            }
        )


        return (
            <div style={{maxWidth: '600px'}}>
                <div style={{position: "absolute", top: "0", width: "100%", maxWidth: "600px"}}>
                                        <span style={{float: "left", padding: "15px"}} onClick={() => {
                                            Modal.alert(<span>{language.e().account.rule}</span>, <div
                                                className="contractRule"
                                                style={{height: document.documentElement.clientHeight * 0.6}}>
                                                1、以推荐码作为连接关系<br/>
                                                2、自由参与，金额 500-100000 SERO，每个账户累计最高参与10万SERO<br/>
                                                3、参与后，立即显示15日后连本带利可提现数量，以及15日倒计时<br/>
                                                4、静态收益：<br/>
                                                合约期15天，收益7.5%(即每天0.5%)，合约到期可连本带利自由提现或复投<br/>
                                                5、分享收益：<br/>
                                                &nbsp;&nbsp;a) 直接享受1层被分享人静态收益的100%<br/>
                                                &nbsp;&nbsp;b) 直接分享业绩达2万SERO，可享受2层被分享人静态收益的10%<br/>
                                                &nbsp;&nbsp;c) 直接分享业绩每增加1万SERO，可增加享受多1层被分享人静态收益的10%，最高享受20层<br/>
                                                &nbsp;&nbsp;d) 分享收益有烧伤，即计算分享收益时，按分享人与被分享人的本金两者中较小者计算<br/>
                                                &nbsp;&nbsp;e) 分享收益即时结算，可即时提现或复投<br/>
                                                6、保障机制：<br/>
                                                若系统出现余额无法良性循环时，自动触发保障基金“大奖倒计时”机制。倒计时长为120小时，
                                                期间收到参与资金即自动关闭计时器，系统继续正常运作；如再次出现余额无法良性循环时，
                                                系统再次启动计时器…如此良性循环。若120小时内再未收到参与资金，则“保障基金+资金池
                                                余额”按照最后参与进场的10笔参与数量按比例分配
                                                7、玩家资金96%进入资金池，3%为技术服务，1%进入保障基金；但玩家按100%本金计算收益<br/>
                                                8、每个账户可查看直推业绩，以及下方20层各层业绩<br/>
                                                9、系统开源，数据上链，代码写定，去中心化记账，没有后门，不可篡改<br/>
                                                10、系统公开合约规则及推荐码，玩家可在无推荐人的情况下主动参与<br/>
                                                11、默认推荐码: IFVUSKIRFSIDF <span style={{color:'#989898'}} onClick={() => {
                                                copy('IFVUSKIRFSIDF');
                                                Toast.success(language.e().copySucc, 1);
                                            }
                                            }>{language.e().copy}</span><br/>
                                            </div>, [
                                                {text: <span>OK</span>}])
                                        }}>{language.e().account.rule}</span>
                    <span style={{float: "right", padding: "15px"}} onClick={() => {
                        this.setLang()
                    }}>{this.state.lang}</span>
                </div>
                <div className="header">
                    <img src={Alpha1_02} width="100%"/><br/>
                    {
                        this.state.info.closureTime != 0 &&
                        <Timer delayTime={this.state.info.closureTime} onTimeout={this.onTimeout.bind(this)}/>
                    }
                </div>
                {this.last()}

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
                                }}>{language.e().account.invest}</Button>
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
                                    <Button
                                        disabled={new Date().getTime() <= this.state.info.closureTime * 1000 || this.state.account.details.canWithdraw === "0"}
                                        onClick={() => {
                                            this.withdraw()
                                        }}>{language.e().account.withdraw}</Button>
                                </div>
                                <div style={{float: 'right'}}>
                                    <Button disabled={(this.state.info.closureTime != 0 && new Date().getTime() > this.state.info.closureTime * 1000) || this.state.account.details.canWithdraw === "0"} onClick={() => {
                                        this.reinvest()
                                    }}>{language.e().account.reinvest}</Button>
                                </div>
                            </div>
                        </List.Item>
                    </List>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <List renderHeader={<span className="title">{language.e().account.records.title}</span>}>
                        <div className="item-header">
                            <div style={{float: "left", width: '12%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.id}</span></div>
                            <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.amount}</span></div>
                            <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.profit}</span></div>
                            <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.time}</span></div>
                            <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.records.state}</span></div>
                        </div>
                        {recordItems}
                        {
                            this.state.account.details.records.length>0 &&
                            <List.Item >
                                <div style={{float: "left", width: '12%', textAlign: 'center'}}><span
                                    className="column-title">{language.e().account.records.total}</span></div>
                                <div style={{float: "left", width: '22%', textAlign: 'center'}}>
                                    <span className="column-title">{decimals(total_amount)}</span>
                                </div>
                                <div style={{float: "left", width: '22%', textAlign: 'center'}}>
                                    <span className="column-title">{decimals(total_profit)}</span>
                                </div>
                                <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                                    className="column-title">&nbsp;</span></div>
                                <div style={{float: "left", width: '22%', textAlign: 'center'}}><span
                                    className="column-title">&nbsp;</span></div>
                            </List.Item>
                        }
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
                                    &nbsp;&nbsp;&nbsp;
                                    {this.state.account.details.code !== "" &&
                                    <span style={{color:'#989898'}} onClick={() => {
                                        copy(this.state.account.details.code);
                                        Toast.success(language.e().copySucc, 1);
                                    }
                                    }>{language.e().copy}</span>
                                    }

                                </div>
                            </div>
                        </div>
                        <List.Item>
                            <div>
                                <div style={{float: 'left'}}>
                                    <span className="column-title">{language.e().account.recommend.achievement}: </span>
                                    <span className="column-title">{decimals(achievement)} SERO</span>
                                </div>
                            </div>
                        </List.Item>

                        <div className="item-header">
                            <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.recommend.level}</span></div>
                            <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.recommend.achieveDetail}</span></div>
                            <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.recommend.profit}</span></div>
                            <div style={{float: "left", width: '25%', textAlign: 'center'}}><span
                                className="column-title">{language.e().account.recommend.state}</span></div>
                        </div>
                        {subordinateInfos}
                    </List>
                </WingBlank>
                <div className="footer">
                    <p>{language.e().warn}</p>
                </div>
            </div>
        )
    }
}

export default Accounts;
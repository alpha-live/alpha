import React, {Component} from 'react';
import './App.css';
import {List, WhiteSpace, WingBlank} from "antd-mobile";
import Accounts from "./component/accounts";
import alpha from "./component/alpha";
import {decimals} from './component/utils'
import BigNumber from 'bignumber.js'
import TimeCountDown from "./component/timer";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {closureTime: 0}
        }
    }

    initInfo() {
        let self = this;
        alpha.info("", function (info) {
            if (info.closureTime != 0) {
                self.setState({
                    info: {
                        closureTime: info.closureTime + 15 * 60,
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

    componentDidMount() {
        let self = this;
        setTimeout(function () {
            self.initInfo();
            self.timer = setInterval(self.initInfo(), 20 * 1000);
        }, 500);
    }

    onTimeout() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    render() {
        return (
            <div style={{height: document.documentElement.clientHeight}}>
                {this.state.info.closureTime != 0 &&
                <div id="info">
                    <WingBlank size="lg">
                        <List renderHeader={() => '启动'}>
                            <List.Item>
                                <div style={{}}>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}>资金池</div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}>&nbsp;</div>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}>基金</div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}>&nbsp;</div>
                                    <div style={{float: 'left', width: '30%', textAlign: 'center'}}>总金额</div>
                                </div>
                                <div>
                                    <div style={{
                                        float: 'left',
                                        width: '30%',
                                        textAlign: 'center'
                                    }}>{this.state.info.poolBalance}</div>
                                    <div style={{float: 'left', width: '5%', textAlign: 'center'}}>+</div>
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
                            <List.Item>
                                <div style={{float: 'left', width: '30%', textAlign: 'center'}}>开奖倒计时:</div>
                                <div style={{textAlign: 'center'}}>
                                    <TimeCountDown delayTime={this.state.info.closureTime}
                                                   onTimeout={this.onTimeout()}/>
                                </div>
                            </List.Item>
                        </List>
                    </WingBlank>
                    <WhiteSpace size="lg"/>
                </div>
                }
                <div id="userInfo">
                    <Accounts/>
                </div>
            </div>
        );
    }
}

export default App;

class Language {

    e = () => {
        const lang = localStorage.getItem("language");
        if (lang === "zh_CN") {
            return this.zh_CN;
        } else if (lang === "en_US") {
            return this.en_US;
        } else {
            let localUtc = new Date().getTimezoneOffset() / 60;
            if (localUtc === -8) {
                return this.zh_CN;
            } else {
                return this.en_US;
            }
        }
    }

    en_US = {
        text: "中文",
        warn: "venture capital, cautious participation.",
        copySucc: "copy success",
        copy: "copy",
        Button: {
            Ok: "Ok",
            Cancel: "Cancel"
        },
        fund: {
            title: "Guarantee funds [Start]",
            poolAmount: "Pool of funds",
            fundAmount: "Guarantee fund",
            total: "Total",
            close: "Lucky codes"
        },
        account: {
            title: "Account",
            change: "change",
            balance: "balance",
            invest: "invest",
            withdraw: "withdraw",
            reinvest: "reinvest",
            amount: "amount",
            rule: "Contract Rule",

            modal: {
                title: "invest",
                code: "invitation code",
                value: "value",
                cancel: "cancel",
                submit: "submit"
            },
            records: {
                id: "ID",
                title: "Records",
                time: "Remaining days",
                amount: "Amount",
                profit: "Profit",
                total: "Total",
                state: "Can Withdraw",
                stateValues: ["Done", "Yes", "No"]
            },
            recommend: {
                title: "Recommend info",
                invitationCode: "Invitation code",
                inviteNumber: "Number of invitations",
                achievement: "Achievement",

                level: "Level",
                count: "Count",
                profit: "Share profit",
                achieveDetail: "Achievement",
                state: "Can Gain",
                stateValues: ["Yes", "No"]
            }
        },
        rule: `
1. Use the recommendation code as the connection relation.

2. Free participation, amount 500-100000 SERO, the maximum participation of each account is 100,000 SERO.

3. After participation, immediately show 15 days after the withdrawal with interest and 15 days countdown.

4. Static income:
  The contract period is 15 days and the income is 7.5%(i.e. 0.5% per day). The contract may be withdrawn or reinvested with interest when the contract contract period expires

5. Share the benefits:
  a) Directly enjoy 100% of the static income of the 1 layer of shared people
  b) Directly share the performance of up to 20,000 SERO, can enjoy 10% of the static income of the 2 layers of shared people
  c) For every 10,000 SERO increase in direct sharing, you can increase the enjoyment of 10% of the static income of 1 layer of shared people, the highest enjoy 20 layers
  d) Sharing income has burns, that is, when calculating the shared income, the smaller of the sharer and the sharer’s principal is calculated.
  e) Share earnings instant settlement, immediate withdrawal or re-investment
  
6. Safeguard mechanism:
  If the balance of the system cannot be a virtuous circle, the “countdown to the big prize” mechanism of the protection fund will be triggered automatically. The countdown is 120 hours.
  During the period when the participating funds are received, the timer is automatically turned off, and the system continues to operate normally;
  If the balance again fails to be virtuous, The system starts the timer again... so a virtuous cycle.
  If the participating funds are not received within 120 hours, the “protection fund + fund pool balance” will be proportionally distributed according to the 10 participating quantities that participated in the final participation.
    
7. 96% of the player's funds enter the fund pool, 3% is the technical service, and 1% enters the protection fund; but the player calculates the income according to the 100% principal.

8. Each account can view the direct sales performance, as well as the performance of the lower 20 layers

9. Is completely open source Dapp, data on the chain,  decentralized bookkeeping, no back door, can not be tampering

10. The system discloses the contract rules and recommendation codes, and the player can actively participate without the referee.

`,
        rule1:'11. Default recommendation code: LNVV62JX5SLPF '
    };


    zh_CN = {
        text: "English",
        warn: "风险投资 谨慎参与",
        copySucc: "复制成功",
        copy: "复制",
        Button: {
            Ok: "确定",
            Cancel: "取消"
        },
        fund: {
            title: "保障基金[启动中]",
            poolAmount: "资金池",
            fundAmount: "保障基金",
            total: "总金额",
            close: "中奖名单"
        },
        account: {
            title: "我的账户",
            change: "切换",
            balance: "账户余额",
            invest: "投资",
            withdraw: "提现",
            reinvest: "复投",
            amount: "收款归集",
            rule: "合约规则",
            modal: {
                title: "投资",
                code: "推荐码",
                value: "金额",
                cancel: "取消",
                submit: "提交"
            },
            records: {
                id: "序号",
                title: "我的投资",
                time: "剩余天数",
                amount: "本金",
                profit: "收益",
                total: "合计",
                state: "状态",
                stateValues: ["已结算", "可提现", "未到期"]
            },
            recommend: {
                title: "我的业绩",
                invitationCode: "分享码",
                inviteNumber: "直推人数",
                achievement: "直推有效业绩",

                level: "层级",
                count: "人数",
                profit: "分享收益",
                achieveDetail: "有效业绩",
                state: "状态",
                stateValues: ["可拿", "不可拿"]

            }
        },
        rule: `
1、以推荐码作为连接关系

2、自由参与，金额 500-100000 SERO，每个账户累计最高参与10万SERO

3、参与后，立即显示15日后连本带利可提现数量，以及15日倒计时

4、静态收益：
  合约期15天，收益7.5%(即每天0.5%)，合约到期可连本带利自由提现或复投

5、分享收益：
  a) 直接享受1层被分享人静态收益的100%
  b) 直接分享业绩达2万SERO，可享受2层被分享人静态收益的10%
  c) 直接分享业绩每增加1万SERO，可增加享受多1层被分享人静态收益的10%，最高享受20层
  d) 分享收益有烧伤，即计算分享收益时，按分享人与被分享人的本金两者中较小者计算
  e) 分享收益即时结算，可即时提现或复投
  
6、保障机制：
  若系统出现余额无法良性循环时，自动触发保障基金“大奖倒计时”机制;
  倒计时长为120小时，期间收到参与资金即自动关闭计时器，系统继续正常运作;
  如再次出现余额无法良性循环时， 系统再次启动计时器 …如此良性循环;
  若120小时内再未收到参与资金，则“保障基金+资金池 余额”按照最后参与进场的10笔参与数量按比例分配;
  
7、玩家资金96%进入资金池，3%为技术服务，1%进入保障基金；但玩家按100%本金计算收益。

8、每个账户可查看直推业绩，以及下方20层各层业绩。

9、系统开源，数据上链，代码写定，去中心化记账，没有后门，不可篡改。

10、系统公开合约规则及推荐码，玩家可在无推荐人的情况下主动参与。

`,
        rule1:'11、默认推荐码: LNVV62JX5SLPF '
    };
};

const lang = new Language();
export default lang
class Language {

    e = () => {
        const lang = localStorage.getItem("language");
        if(lang === "zh_CN"){
            return this.zh_CN;
        } else if (lang === "en_US"){
            return this.en_US;
        }else{
            let localUtc = new Date().getTimezoneOffset() / 60;
            if (localUtc === -8) {
                return this.zh_CN;
            } else {
                return this.en_US;
            }
        }
    }

    en_US = {
        text:"English",
        warn:"venture capital, cautious participation",
        copySucc:"copy success",
        copy:"copy",
        fund: {
            title: "guarantee fund[start]",
            poolAmount: "Pool of funds",
            fundAmount: "Guarantee fund",
            total: "Total",
            close:"lucky codes"
        },
        account: {
            title: "Account",
            change: "change",
            balance: "balance",
            invest: "invest",
            withdraw: "withdraw",
            reinvest: "reinvest",
            amount: "amount",
            rule:"Contract Rule",

            modal: {
                title: "invest",
                code: "invitation code",
                value: "value",
                cancel: "cancel",
                submit: "submit"
            },
            records: {
                id:"ID",
                title: "Records",
                time: "Remaining days",
                amount: "Amount",
                profit: "Profit",
                total: "Total",
                state:"State",
                stateValues:["settled", "can withdraw", "not expire"]
            },
            recommend: {
                title: "Recommend info",
                invitationCode: "Invitation code",
                inviteNumber: "number of invitations",
                achievement: "Achievement",

                level:"Level",
                count:"Count",
                profit:"Share profit",
                achieveDetail:"Achievement",
                state:"Can Gain",
                stateValues:["Yes", "No"]
            }
        }
    };


    zh_CN = {
        text:"English",
        warn:"风险投资 谨慎参与",
        copySucc:"复制成功",
        copy: "复制",
        fund:{
            title:"保障基金[启动中]",
            poolAmount:"资金池",
            fundAmount: "保障基金",
            total:"总金额",
            close:"中奖名单"
        },
        account: {
            title: "我的账户",
            change: "切换",
            balance: "账户余额",
            invest: "投资",
            withdraw: "提现",
            reinvest: "复投",
            amount: "收益合集",
            rule:"合约规则",
            modal: {
                title: "投资",
                code: "推荐码",
                value: "金额",
                cancel: "取消",
                submit: "提交"
            },
            records: {
                id:"序号",
                title: "我的投资",
                time: "剩余天数",
                amount: "本金",
                profit: "收益",
                total: "合计",
                state:"状态",
                stateValues:["已结算", "可提现", "未到期"]
            },
            recommend: {
                title: "我的业绩",
                invitationCode: "分享码",
                inviteNumber: "直推人数",
                achievement: "直推业绩",

                level:"层级",
                count:"人数",
                profit:"分享收益",
                achieveDetail:"业绩",
                state:"状态",
                stateValues:["可拿", "不可拿"]

            }
        }
    }
}

const lang = new Language();
export default lang
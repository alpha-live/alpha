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
        account: {
            title: "Account",
            change: "change",
            balance: "balance",
            partake: "partake",
            withdraw: "withdraw",
            reinvestment: "reinvestment",
            amount: "amount",
            rule:"Contract Rule",
            game:{
                title:"game start",
                poolAmount:"资金池",
                fundAmount: "保障基金",
                all:"总金额"
            },
            modal: {
                title: "partake",
                code: "invitation code",
                value: "value",
                cancel: "cancel",
                submit: "submit"
            },
            records: {
                id:"ID",
                title: "Records",
                time: "Time",
                amount: "Amount",
                profit: "Profit",
                state:"State"
            },
            recommend: {
                title: "recommend info",
                invitationCode: "invitation code",
                inviteNumber: "number of invitations",
                achievement: "achievement",

                level:"Level",
                count:"Count",
                achieveDetail:"Achievement",
                state:"State",
            }
        }
    };


    zh_CN = {
        text:"简体中文",
        account: {
            title: "我的账户",
            change: "切换",
            balance: "账户余额",
            partake: "投资",
            withdraw: "提现",
            reinvestment: "复投",
            amount: "收益合集",
            rule:"合约规则",
            game:{
                title:"保障基金[启动中]",
                poolAmount:"资金池",
                fundAmount: "保障基金",
                all:"总金额"
            },
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
                time: "到期时间",
                amount: "本金",
                profit: "收益",
                state:"状态"
            },
            recommend: {
                title: "我的业绩",
                invitationCode: "分享码",
                inviteNumber: "直推人数",
                achievement: "直推业绩",

                level:"层级",
                count:"人数",
                achieveDetail:"业绩",
                state:"状态",

            }
        }
    }
}

const lang = new Language();
export default lang
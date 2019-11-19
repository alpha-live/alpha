class Language {

    e = () => {
        let localUtc = new Date().getTimezoneOffset() / 60;
        if (localUtc === -8) {
            return this.zh_CN;
        } else {
            return this.en_US;
        }
    }

    en_US = {
        account: {
            title: "Account",
            change: "change",
            balance: "balance",
            partake: "partake",
            withdraw: "withdraw",
            amount: "amount",
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
        account: {
            title: "我的账户",
            change: "切换",
            balance: "账户余额",
            partake: "投资",
            withdraw: "提现",
            amount: "收益合集",
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
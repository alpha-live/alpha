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
            title: "account info",
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
                title: "records",
                time: "time",
                amount: "amount",
                profit: "profit"
            },
            recommend: {
                title: "recommend info",
                invitationCode: "invitation code",
                inviteNumber: "number of invitations",
                achievement: "achievement"
            }
        }
    };


    zh_CN = {
        account: {
            title: "用户信息",
            change: "切换",
            balance: "资产",
            partake: "投资",
            withdraw: "提现",
            amount: "可提现",
            modal: {
                title: "投资",
                code: "推荐码",
                value: "金额",
                cancel: "取消",
                submit: "提交"
            },
            records: {
                title: "投资记录",
                time: "到期时间",
                amount: "本金",
                profit: "收益"
            },
            recommend: {
                title: "推荐信息",
                invitationCode: "邀请码",
                inviteNumber: "受邀人数",
                achievement: "业绩"
            }
        }
    }
}

const lang = new Language();
export default lang
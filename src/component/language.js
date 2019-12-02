class Language {

    e = () => {
        const lang = localStorage.getItem("language");
        if (lang === "zh_CN") {
            return this.zh_CN;
        } else if (lang === "en_US") {
            return this.en_US;
        }  else if (lang === "be_BY") {
            return this.be_BY;
        }  else if (lang === "ja_JP") {
            return this.ja_JP;
        }  else if (lang === "ko_KR") {
            return this.ko_KR;
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
        text: "Language",
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
        rule1: '11. Default recommendation code: LNVV62JX5SLPF '
    };


    zh_CN = {
        text: "语言",
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
        rule1: '11、默认推荐码: LNVV62JX5SLPF '
    };


    ja_JP = {
        text: "言語",
        warn: "ベンチャーキャピタル",
        copySucc: "コピー成功",
        copy: "コピー",
        Button: {
            Ok: "確認する",
            Cancel: "キャンセルする"
        },
        fund: {
            title: "保障基金[启动中]",
            poolAmount: "资金池",
            fundAmount: "保障基金",
            total: "总金额",
            close: "中奖名单"
        },
        account: {
            title: "マイアカウント",
            change: "スイッチ",
            balance: "口座残高",
            invest: "投資する",
            withdraw: "撤退",
            reinvest: "再投資",
            amount: "私の収入",
            rule: "契約ルール",

            modal: {
                title: "投資",
                code: "招待コード",
                value: "量",
                cancel: "キャンセル",
                submit: "提出すること"
            },
            records: {
                id: "ID",
                title: "私の投資",
                time: "有効期限",
                amount: "元本金額",
                profit: "利益",
                state: "状態",
                total: "Total",
                stateValues: ["Done", "Yes", "No"]
            },
            recommend: {
                title: "私のパフォーマンス",
                invitationCode: "招待コード",
                inviteNumber: "招待数",
                achievement: "直販",

                level: "レベル",
                count: "ピープル",
                achieveDetail: "私の業績",
                state: "状態",
                stateValues: ["Yes", "No"]
            }
        },
        rule: `
1.接続として紹介コードを使用する

2.参加は無料、金額は500〜100,000 SERO、各アカウントの最大参加は100,000 SEROです。

3.登録後すぐに、資金と利子の引き出し額が15日間のカウントダウンウィンドウに表示されます。

4.固定収入
  契約期間は15日間で、収入は7.5％（つまり、1日あたり0.5％）です。契約の有効期限が切れると、利子付きで自由に撤回または再投資できます。
  
5. 추천 수익
  a）レベルの審判の固定収入の100％を直接お楽しみください。
  b）最大20,000 SEROの成果を直接共有し、レベル2審判の固定収入の10％を受け取ります。
  c）レベルを追加するごとに固定収益を10％増やすことができます。直接レフェリー収益10,000 SEROごとに最大20レベルまで増やすことができます。
  d) 紹介収入に火傷があります。つまり、紹介収入は、紹介者と被紹介者の元本の少ない金額に従って計算されます。
  e) 紹介収入の即時決済、現金の引き出しまたは再投資
  
6.保護メカニズム
  システムがバランスの取れた好バランスを達成できない場合、保証基金の「ファンドカウントダウン」メカニズムが自動的にトリガーされます。カウントダウンは120時間です
  カウントダウン期間中に参加者の資金を受け取ると、タイマーは自動的に閉じられ、システムは正常に動作し続けます
  システムはタイマーを再起動するため、効果的なサイクルになります。参加資金が120時間以内に受領されない場合、評価は「保護基金+基金」であり、「バランス」は、市場に参加した最後の10人の参加者に基づいて評価されます。
  
7.参加者の資金の96％は資金プールに、3％は技術サービスに、1％は保護基金に使用されますが、参加者の収入は元本の100％に基づいて計算されます

8.各アカウントは、直接販売のパフォーマンスと下位20レベルのパフォーマンスを表示できます。

9.これは完全にオープンソースのDappであり、データがオンチェーンで、コードが記述され、分散アカウンティングで、バックドアがなく、改ざんされません。

10.システムは契約ルールと紹介コードを開示し、プレーヤーは審判なしで積極的に参加できます。

`,
        rule1: '11.デフォルトの紹介コード：IFVUSKIRFSIDF'
    };


    be_BY  = {
        text: "язык",
        warn: "Венчурный капитал",
        copySucc: "Копирование успешно",
        copy: "копия",
        Button: {
            Ok: "Подтверждение",
            Cancel: "отменен"
        },
        fund: {
            title: "Защитный фонд [Инициирование]",
            poolAmount: "Фонд пула",
            fundAmount: "Фонд защиты",
            total: "Общая сумма",
            close: "Список победителей"
        },

        account: {
            title: "Мой аккаунт",
            change: "менять",
            balance: "Остаток средств",
            invest: "Вкладывать деньги",
            withdraw: "Снять со счета",
            reinvest: "Реинвестировать",
            amount: "Мой доход",
            rule:"Правило договора",
            game:{
                title:"Фонд защиты [Старт]",
                poolAmount:"Пул Фонд",
                fundAmount: "Фонд защиты",
                all:"Общая сумма"
            },
            modal: {
                title: "инвестиции",
                code: "Код приглашения",
                value: "Сумма",
                cancel: "Отмена",
                submit: "покоряться"
            },
            records: {
                id:"ID",
                title: "мои инвестиции",
                time: "Дата окончания срока",
                amount: "Основная сумма",
                profit: "прибыль",
                state:"Положение дел",
                total: "общий",
                stateValues: ["Done", "Yes", "No"]
            },
            recommend: {
                title: "Мое выступление",
                invitationCode: "Код приглашения",
                inviteNumber: "Количество приглашений",
                achievement: "Прямые продажи",

                level:"уровень",
                count:"Количество людей",
                achieveDetail:"Мое достижение",
                state:"Положение дел",
                stateValues: ["Yes", "No"]
            }
        },

        rule: `
1. Используйте реферальные коды в качестве соединения

2. Участие бесплатное, сумма 500 ~ 100 000 SERO, максимальное участие каждого аккаунта 100 000 SERO.

3. Сразу после регистрации сумма вывода средств и процентов будет отображаться в 15-дневном окне обратного отсчета.

4. фиксированный доход
  Срок действия контракта составляет 15 дней, а доход - 7,5% (то есть 0,5% в день). По истечении срока действия договора его можно свободно отозвать или реинвестировать с интересом.
  
5. Доход от рефералов
  а) Получите 100% фиксированного дохода рефери первого уровня.
  б) Заработайте до 20 000 SERO напрямую и заработайте 10% от фиксированного дохода рефери второго уровня.
  c) Каждый раз, когда ваш доход от прямых рефералов увеличивается на 10 000 SERO, вы можете увеличить свой фиксированный доход для каждого уровня на 10% до 20 уровней.
  d) Доход от рефералов имеет ожоги, то есть доход от рефералов рассчитывается в соответствии с меньшей основной суммой реферера и рефери.
  e) Мгновенное урегулирование реферального дохода, снятие наличных или реинвестирование
  
6. Механизм защиты
  Если система не может достичь сбалансированного добродетельного баланса, она автоматически запускает механизм «обратного отсчета фонда» гарантийного фонда. Обратный отсчет составляет 120 часов.
  Если средства участника будут получены в течение периода обратного отсчета, таймер автоматически закроется, и система продолжит нормальную работу.
  Система перезапускает таймер, поэтому это эффективный цикл. Если в течение 120 часов средства для участия не поступают, оценка «Фонд защиты + фонд», «Баланс» будет оцениваться на основе последних 10 участников, пришедших на рынок.
  
7.96% средств участника пойдут в пул фонда, 3% будут использованы для технических услуг, 1% будет использован для средств защиты, но доход участника будет рассчитываться на основе 100% основной суммы

8. Каждая учетная запись может просматривать производительность прямых продаж, а также производительность нижних 20 уровней.

9. Это Dapp с открытым исходным кодом, данные в цепочке, код написан, распределенный учет, никаких бэкдоров и взлома.

10. Система раскрывает правила контракта и реферальные коды, и игроки могут принимать активное участие без рефери.
        `,
        rule1: '11. Реферальный код по умолчанию: IFVUSKIRFSIDF'
    };

    ko_KR = {
        text: "언어",

        warn: "벤처 캐피탈",
        copySucc: "복사 성공",
        copy: "복사",
        Button: {
            Ok: "확인",
            Cancel: "취소"
        },
        fund: {
            title: "보호 기금 [시작]",
            poolAmount: "기금 풀",
            fundAmount: "보호 기금",
            total: "총액",
            close: "수상자 목록"
        },

        account: {
            title: "내 계정",
            change: "스위치",
            balance: "계좌 잔액",
            invest: "사다",
            withdraw: "철수",
            reinvest: "재투자",
            amount: "나의 소득",
            rule:"계약 규칙",
            game:{
                title:"보호 기금 [시작]",
                poolAmount:"자금 수영장",
                fundAmount: "보호 기금",
                all:"총액"
            },
            modal: {
                title: "투자",
                code: "초대 코드",
                value: "금액",
                cancel: "취소",
                submit: "제출"
            },
            records: {
                id:"ID",
                title: "내 투자",
                time: "만료일",
                amount: "교장",
                profit: "이익",
                state:"지위",
                stateValues: ["Done", "Yes", "No"]
            },
            recommend: {
                title: "내 공연",
                invitationCode: "초대 코드",
                inviteNumber: "초대장 수",
                achievement: "직접 판매",

                level:"수평",
                count:"사람",
                achieveDetail:"나의 업적",
                state:"지위",
                stateValues: ["Yes", "No"]
            }
        },
        rule: `
1. 추천 코드를 연결 관계로 사용하십시오.

2. 참여는 무료이며, 금액은 500-100,000 SERO이며, 각 계정의 최대 참여는 100,000 SERO입니다.

3. 가입 후 즉시 출금 금액과이자가 15 일 카운트 다운 창에 표시됩니다.

4. 고정 수입
   계약 기간은 15 일이고 수입은 7.5 % (즉, 하루 0.5 %)입니다. 계약이 만료되면 자유롭게 철회 또는 재투자 할 수 있습니다
  
5. 추천 수익
  a) 레벨 심판의 고정 수입의 100 %를 직접 즐기십시오.
  b) 최대 20,000SERO의 성과를 직접 공유하고 Tier 2 Sharee의 고정 수입의 10 %를받습니다.
  c) 직접 심판 수입이 10,000 SERO 증가 할 때마다 최대 20 레벨까지 각 레벨의 고정 수입을 10 % 증가시킬 수 있습니다.
  d) 공유 수익은 화상을 입었습니다. 다시 말해, 추천 수입은 추천인과 심판의 주요 금액이 적을수록 계산됩니다.
  e) 수익 분배, 현금 인출 또는 재투자의 즉각적인 해결
  
6. 보호 메커니즘
  시스템이 균형 잡힌 선순환 균형을 달성 할 수 없으면 자동으로 보증 기금의 "펀드 카운트 다운"메커니즘을 트리거합니다. 카운트 다운은 120 시간입니다.
  카운트 다운 기간 동안 참가자의 자금이 수령되면 타이머가 자동으로 닫히고 시스템은 계속 정상적으로 작동합니다.
  시스템은 타이머를 다시 시작하므로 선순환이됩니다. 120 시간 내에 참여 자금이 수신되지 않으면 "보호 기금 + 자금 풀", "밸런스"는 시장에 들어간 마지막 10 명의 참가자에 따라 평가됩니다.
  
7. 참가자 자금의 96 %가 펀드 풀에 들어가고, 3 %는 기술 서비스에, 1 %는 보호 기금에 사용되지만, 참가자의 수입은 기본 금액의 100 %를 기준으로 계산됩니다

8. 각 계정은 직판 성능과 하위 20 수준의 성능을 볼 수 있습니다.

9. 이것은 온 체인 데이터, 코드 작성 분산 회계, 백도어 작업이없고 조작 할 수없는 완전 오픈 소스 Dapp입니다.

10. 시스템은 계약 규칙 및 추천 코드를 공개하며, 플레이어는 심판없이 적극적으로 참여할 수 있습니다.
        `,
        rule1: '11. 기본 추천 코드 : IFVUSKIRFSIDF'
    };

};

const lang = new Language();
export default lang
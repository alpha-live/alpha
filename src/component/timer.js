import React, {Component} from 'react';


class Timer extends Component {
    constructor(props) {
        super(props);
        this.delayTime = this.props.delayTime;
        this.state = {
            hour: "00",
            minute: "00",
            second: "00",
        }
    }

    componentDidMount() {
        this.startCountDown();
    }

    componentDidUpdate() {
        if (this.props.time !== this.delayTime) {
            this.delayTime = this.props.delayTime;

            this.clearTimer();
            this.startCountDown();
        }
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // 开启计时
    startCountDown() {
        if (this.delayTime && !this.timer) {
            this.timer = setInterval(() => {
                this.doCount();
            }, 1000);
        }
    }

    leftZero(d) {
        if (d < 10) {
            return "0" + d;
        } else {
            return "" + d;
        }
    }

    doCount() {
        const {onTimeout,} = this.props;
        const timeDiffSecond = this.delayTime - new Date().getTime() / 1000;

        if (timeDiffSecond <= 0) {
            this.clearTimer();
            if (typeof onTimeout === 'function') {
                onTimeout();
            }
            return;
        }

        const hour = Math.floor((timeDiffSecond % 86400) / 3600);
        const minute = Math.floor((timeDiffSecond % 3600) / 60);
        const second = Math.floor((timeDiffSecond % 3600) % 60);


        this.setState({
            hour: this.leftZero(hour),
            minute: this.leftZero(minute),
            second: this.leftZero(second),
        });
    }

    render() {
        return (
            <div className="clock">

                <span style={{position: "relative", left: "-23px"}}>{this.state.hour[0]}</span>
                <span style={{position: "relative", left: "-16px"}}>{this.state.hour[1]}</span>

                <span style={{position: "relative", left: "-2px"}}>{this.state.minute[0]}</span>
                <span style={{position: "relative", left: "3px"}}>{this.state.minute[1]}</span>

                <span style={{position: "relative", left: "17px"}}>{this.state.second[0]}</span>
                <span style={{position: "relative", left: "24px"}}>{this.state.second[1]}</span>
            </div>
        );
    }
}

export default Timer;
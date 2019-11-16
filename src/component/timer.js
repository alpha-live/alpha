import React, {Component} from 'react';


class TimeCountDown extends Component {
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
            hour: hour < 10 ? "0" + hour : hour,
            minute: minute < 10 ? "0" + minute : minute,
            second: second < 10 ? "0" + second : second,
        });
    }

    render() {
        return (
            <span>{this.state.hour}:{this.state.minute}:{this.state.second}</span>
        );
    }
}

export default TimeCountDown;
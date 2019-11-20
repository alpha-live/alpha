import React, {Component} from 'react';

class Counter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            counter: {
                hours: "00",
                minutes: "00",
                seconds: "00"
            }
        }
    }

    leftZero(d) {
        if (d < 10) {
            return "0" + d;
        } else {
            return "" + d;
        }
    }

    componentDidMount() {
        const endDate = new Date(this.props.endDate);

        let self = this;
        if (!this.timer) {
            this.timer = setInterval(function () {
                const nowDate = new Date();
                const totalSeconds = parseInt((endDate - nowDate) / 1000);
                // const days = Math.floor(totalSeconds / (60 * 60 * 24));
                let modulo = totalSeconds % (60 * 60 * 24);
                const hours = Math.floor(modulo / (60 * 60));
                modulo = modulo % (60 * 60);
                const minutes = Math.floor(modulo / 60);
                const seconds = modulo % 60;

                self.setState({
                    counter: {
                        hours: self.leftZero(hours),
                        minutes: self.leftZero(minutes),
                        seconds: self.leftZero(seconds),
                    }
                })
            }, 1000)
        }

    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    render() {
        const {counter} = this.state;
        return (
            <div className="clock">

                <span style={{position: "relative", left: "-23px"}}>{counter.hours[0]}</span>
                <span style={{position: "relative", left: "-16px"}}>{counter.hours[1]}</span>

                <span style={{position: "relative", left: "-2px"}}>{counter.minutes[0]}</span>
                <span style={{position: "relative", left: "3px"}}>{counter.minutes[1]}</span>

                <span style={{position: "relative", left: "17px"}}>{counter.seconds[0]}</span>
                <span style={{position: "relative", left: "24px"}}>{counter.seconds[1]}</span>
            </div>
        )
    }
}
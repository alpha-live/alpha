import React, {Component} from 'react';
import './App.css';
import Accounts from "./component/accounts";

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{mixHeight: document.documentElement.clientHeight}}>
                <Accounts/>
            </div>
        );
    }
}

export default App;

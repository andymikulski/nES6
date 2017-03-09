import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>404 OH BOY</h2>
        </div>
        <p className="App-intro">
          no
        </p>
      </div>
    );
  }
}

export default App;

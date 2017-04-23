import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  Tooltip,
  Intent,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';

import Socket from './Socket';

import logo from '../assets/nes.png';
import kingHippo from '../assets/king-hippo.gif';
import '../css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPlayerOverlay: false,
      hasTechInfo: false,
      hasHelpOverlay: false,
      hasDibs: false,

      ioBroken: false,
      brokenReason: null,
    };

    this.togglePlayerOverlay = this.toggleFactory('PlayerOverlay');
    this.toggleTechInfo = this.toggleFactory('TechInfo');
    this.toggleHelpOverlay = this.toggleFactory('HelpOverlay');

    this.handleBrokenSocket = ::this.handleBrokenSocket;
  }

  toggleFactory(prop) {
    const key = `has${prop}`;

    return ()=>{
      this.setState({
        [key]: !this.state[key],
      });
    };
  }

  handleBrokenSocket(reason) {
    this.setState({
      ioBroken: true,
      brokenReason: reason,
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="pt-navbar pt-dark">
          <div className="pt-navbar-group pt-align-left">
            <img role="presentation" src={ logo } className="logo" />
            <div className="pt-navbar-heading">MultiNES</div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <Button disabled className="pt-minimal pt-icon-time" text={'2:34'} />
            <Button disabled className="pt-minimal pt-icon-people" text={`${this.state.hasDibs ? '4 / ' : ''}15`} />

            <Popover content={<div>
                { this.state.hasDibs &&
                  <div>
                    You are number <b>4</b> in line.<br /><br />
                  </div>
                }
                <div>
                  There are <b>15</b> people waiting in line.<br /><br />
                  Estimated wait time is <b>5 minutes</b>
                </div>
              </div>}
              interactionKind={PopoverInteractionKind.HOVER}
              popoverClassName="pt-popover-content-sizing"
              position={Position.BOTTOM_RIGHT.toString()}
              useSmartPositioning={false}>
                <Button className={`pt-minimal pt-icon-hand ${ this.state.hasDibs ? 'pt-active' : ''}`} text={'Get in line'} onClick={()=>{ this.setState({ hasDibs: !this.state.hasDibs }) }} />
            </Popover>

            <span className="pt-navbar-divider" />
            <Tooltip content={'Player Info'} position={Position.BOTTOM_RIGHT}>
              <Button className="pt-minimal pt-icon-user" onClick={this.togglePlayerOverlay} />
            </Tooltip>

            <Tooltip content={'Help'} position={Position.BOTTOM_RIGHT}>
              <Button className="pt-minimal pt-icon-help" onClick={this.toggleHelpOverlay} />
            </Tooltip>

            <span className="pt-navbar-divider" />

            <Tooltip
              isDisabled={this.state.hasTechInfo}
              content={'Technical Info'}
              position={Position.BOTTOM_RIGHT}>
                <Popover
                  isOpen={this.state.hasTechInfo}
                  content={<div>This is the stats panel</div>}
                  popoverClassName="pt-popover-content-sizing"
                  position={Position.BOTTOM_RIGHT.toString()}
                  useSmartPositioning={false}>
                    <Button className="pt-minimal pt-icon-info-sign" onClick={this.toggleTechInfo} />
                </Popover>
            </Tooltip>
          </div>
        </nav>

        {
          this.state.ioBroken &&
          <div className="broken-io">
            <img role="presentation" src={kingHippo} className="king-hippo" />
            <h3>Oh no!</h3>
            { this.state.brokenReason }<br /><br />
            <span>You can still drag-n-drop ROMs onto the page to play single-player, though.</span>
          </div>
        }

        <Dialog
            iconName="inbox"
            isOpen={this.state.hasPlayerOverlay}
            onClose={this.togglePlayerOverlay}
            title="Player Info"
        >
            <div className="pt-dialog-body">
              <div className="pt-input-group">
                <input type="password" className="pt-input" placeholder="Enter your password..." />
                <Button className="pt-minimal pt-icon-lock" />
              </div>
            </div>
            <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                    <Button text="Secondary" />
                    <Button
                      intent={Intent.PRIMARY}
                      onClick={this.togglePlayerOverlay}
                      text="Primary"
                    />
                </div>
            </div>
        </Dialog>
        <Dialog
            iconName="inbox"
            isOpen={this.state.hasHelpOverlay}
            onClose={this.toggleHelpOverlay}
            title="Help"
        >
            <div className="pt-dialog-body">
              <h2>this is a thing</h2>

              <ul>
                <li>Z - B</li>
                <li>X - A</li>
                <li>← - Left</li>
                <li>↑ - Up</li>
                <li>→ - Right</li>
                <li>↓ - Down</li>
              </ul>
            </div>
            <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                    <Button
                      intent={Intent.PRIMARY}
                      onClick={this.toggleHelpOverlay}
                      text="oh ok"
                    />
                </div>
            </div>
        </Dialog>
        <Socket onBrokenSocket={this.handleBrokenSocket} />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  player: {},
});

const mapDispatchToProps = (dispatch) => {
  return {
    wooFunc: () => {
      dispatch(()=>{});
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

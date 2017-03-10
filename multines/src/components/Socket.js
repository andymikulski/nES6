import React from 'react';
import LZString from 'lz-string';

import nES6 from '../../../src/nES6';
import bindKeyboardPlugin from '../../../src/plugins/bindKeyboard';
import dragDropLoader from '../../../src/plugins/dragDropLoader';
import blurPausePlugin from '../../../src/plugins/blurPausePlugin';

class Socket extends React.Component {

  static serialize(cb) {
    return (data) =>
      cb(LZString.compressToUTF16(JSON.stringify(data)));
  };

  static deserialize(cb) {
    return (data) =>
      cb(JSON.parse(LZString.decompressFromUTF16(data)));
  };

  setupSocket() {
    if (!window.io) {
      if (this.props.onBrokenSocket) {
        this.props.onBrokenSocket(`No sockets available to connect to server!`);
      }
      return;
    }
    const io = window.io;
    const socket = io('//localhost:3001/', {
      transports: ['websocket'],
    });

    this.nes.addPlugins([
      bindKeyboardPlugin({
        onPress: ({ joypadButton }) =>
          socket.emit('input:down', joypadButton),
        onDepress: ({ joypadButton }) =>
          socket.emit('input:up', joypadButton),
      })
    ]);
    this.nes.setRenderer('auto');

    // socket.on('connect', (...data)=>{});
    // socket.on('disconnect', (...data)=>{});

    // incoming
    socket.on('rom:data', Socket.deserialize(({ rom, name })=>{
      this.nes.loadRomFromBinary(rom.data, name);
    }));

    socket.on('state:update', Socket.deserialize(::this.nes.importState));

    socket.on('input:down', Socket.deserialize(joypadButton =>
      this.nes.pressControllerButton(0, joypadButton)));

    socket.on('input:up', Socket.deserialize(joypadButton =>
      this.nes.depressControllerButton(0, joypadButton)));

    // outgoing
    socket.on('state:request', () => socket.emit('state:update', this.nes.exportState()));
  }

  handleSinglePlayerRom() {
    this.props.onRomLoad && this.props.onRomLoad();
    // add some plugins to make single-player a little nicer
    this.nes.addPlugins([
      bindKeyboardPlugin(),
      blurPausePlugin()
    ]);
    this.nes.setRenderer('auto');
  }

  componentWillMount() {
    this.nes = new nES6({
      render: 'headless',
      plugins: [
        dragDropLoader({
          onRomLoad: ::this.handleSinglePlayerRom,
        }),
      ],
    });
    this.nes.start();
  }

  componentDidMount() {
    this.setupSocket();
  }

  render() {
    return null;
  }
}

export default Socket;

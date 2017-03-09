import React from 'react';
import LZString from 'lz-string';

import nES6 from '../../../src/nES6';
import bindKeyboardPlugin from '../../../src/plugins/bindKeyboard';
import dragDropLoader from '../../../src/plugins/dragDropLoader';

class Socket extends React.Component {

  static serialize(cb) {
    return (data) =>
      cb(LZString.compressToUTF16(JSON.stringify(data)));
  };

  static deserialize(cb) {
    return (data) =>
      cb(JSON.parse(LZString.decompressFromUTF16(data)));
  };

  componentWillMount() {
    if (!window.io) {
      throw new Error('No socket.io found');
    }

    const io = window.io;
    const socket = io('//localhost:3001/', {
      transports: ['websocket'],
    });

    this.nes = new nES6({
      // audio: false,
      plugins: [
        bindKeyboardPlugin({
          onPress: ({ joypadButton }) =>
            socket.emit('input:down', joypadButton),
          onDepress: ({ joypadButton }) =>
            socket.emit('input:up', joypadButton),
        }),
        dragDropLoader(),
      ],
    });

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

  componentDidMount(){
    this.nes.start();
  }

  render() {
    return null;
  }
}

export default Socket;

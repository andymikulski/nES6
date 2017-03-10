nES6
======

NES emulator in ES6, rendered via WebGL or Canvas.

Out of the box, nES6 does _not_ implement everything for you. Instead, it exposes APIs to directly manipulate the emulator. Devs can implement controllers, ROM loading, volume control, and more, all as needed for their own application.

#Credit

nES6 was initially forked from [Pete Ward](https://github.com/peteward44)'s [WebNES](https://github.com/peteward44/WebNES) project. This project wouldn't be possible without Pete's incredible emulator work - go give him some stars!

##Features

- Exposed API for manipulating inputs, ROMs, system settings, etc.
- Headless rendering
- Plugins (see below)

####Inherited WebNES Features

Some awesome features were inherited from [WebNES](https://github.com/peteward44/WebNES), such as:

- Support for all common NES mapper formats
  - Approximately 98% of games should work
- HTML5 WebAudio
- WebGL, Canvas renderers
  - Support for WebGL shaders
- Save/load state
- Screenshots
- NTSC / PAL support

### Plugins

nES6 allows devs to utilize plugins that others have written to carry out common functionality.

For instance, vanilla nES6 will not handle any player input - no keyboard events are bound, no gamepads are bound, etc. You could write your own keyboard bindings to map to nES6 inputs, which is cool. Or, you could use the `bindKeyboard` plugin:

```
import bindKeyboardPlugin from 'nES6/plugins/bindKeyboard';

const App = new nES6({
  plugins: [bindKeyboardPlugin()]
});
```

..and bam! Keyboard inputs are mapped to nES6 joypad inputs!


Plugins also accept options:

```
import bindKeyboardPlugin, { KEYMAP_DEFAULTS } from 'nES6/plugins/bindKeyboard';

const App = new nES6({
  plugins: [
    bindKeyboardPlugin({
      customKeyMap: {
        ...KEYMAP_DEFAULTS,
        // Swap the left and right arrow keys, for kicks
        39: 'LEFT',
        37: 'RIGHT',
      }
    })
  ]
});
```

####Available Plugins
- bindKeyboard
  - Binds keyboard inputs to joypad inputs. Keys can be remapped, but use sensible defaults.
- bindGamepad
  - Utilizes the Gamepad API in browsers to support using a USB controller for nES6. Remappable, and joystick support on the way.
- dragDropLoader
  - Gives users the ability to load ROM files into nES6 via drag-n-dropping onto the page (or a given DOM target).
- blurPausePlugin
  - Automatically un/pauses the nES6 instance when user focuses/blurs the containing window (switches tabs, etc).


--

##Getting Started with Development
```
npm install
```
Installs webpack, babel, and other dependencies.

```
npm run dev
```
Runs a server at `http://localhost:8000` and begins webpack compilation.

```
./src/NES.js
```
Entry point - work in the `/src/` folder!

##Build
```
npm run build
```
This will compile the nES6 library using Google's Closure Compiler and output to `app/nes6.js`

--

###License
MIT

[WebNES](https://github.com/peteward44/WebNES) Copyright (c) 2015 [peteward44](https://github.com/peteward44)

nES6 Copyright (c) 2017 andymikulski

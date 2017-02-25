nES6
======

NES emulator in ES6, rendered via WebGL or Canvas.

Unlike other emulators, nES6 does _not_ implement everything for you. Instead, it exposes an API to directly manipulate the emulator. Implement controllers, ROM loading, volume control, and more, all as you see fit in your application.

#Credit

nES6 was initially forked from Pete Ward's [WebNES](https://github.com/peteward44/WebNES) project. This project wouldn't be possible without Pete's incredible emulator work - go give him some stars!

##Features
- Exposes API for manipulating inputs, ROMs, system settings, etc.
- Supports all common NES mapper formats, approximately 98% of games should work
- HTML5 WebAudio
- WebGL, Canvas renderers
  - Supports WebGL shaders
- Save/load state
- Screenshots
- Game pad support
- Remappable keyboard keys
- NTSC / PAL support


##Getting Started
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

###License
MIT

WebNES Copyright (c) 2015 peteward44

nES6 Copyright (c) 2017 andymikulski

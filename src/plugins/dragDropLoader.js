/**
 * nES6 plugin to bind a piece of the DOM with drag-n-drop events, which load ROMs
 * into nES6 accordingly.
 *
 * Example:

import dragDropPlugin from './plugins/dragDropLoader';
const App = new nES6({
  plugins: [
    dragDropPlugin({
      // `throwCompatError` will throw an Error when FileReader is not supported,
      // (defaults to false, and prints a warning in console instead)
      throwCompatError: true,
      // `zone` is the DOM element which listens for drop events
      // (defaults to document.body)
      zone: document.getElementById('your-cool-drop-zone'),
    })
  ],
});
 */


/**
 * Given two elements, checks if one is contained inside of the other.
 *
 * @param  {Element}  el        Child element to traverse from
 * @param  {String}   container DOM element to look for
 * @return {Boolean}            Is element contained in the given container?
 */
function containedIn(el, container) {
  let parent;
  let element = el;
  let isContained = false;

  // while we have an element selected,
  // keep climbing up the DOM
  while (element && !isContained) {
    parent = element.parentElement;
    // if a parent exists and it matches the container we need,
    if (parent && parent === container) {
      isContained = true;
    }
    // otherwise, keep going up the DOM
    element = parent;
  }

  // if we haven't returned anything by now,
  // the element doesn't exist
  return isContained;
}

/**
 * Common 'dragover' event handler. Prevents browser defaults and changes the
 * cursor icon to "copy" (+).
 * @param  {Event}  evt dragover event object
 * @return {void}
 */
const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // maybe use 'link', idk
};

/**
 * Binding function for bindKeyboard plugin. Given an nES6 instance,
 * event bindings are added to the target drop zone, which loads
 * ROM files into nES6.
 *
 * @param  {nES6}   nesInstance   Active nES6 instance to bind to.
 * @return {void}
 */
export default function dragDropLoader(options = {}) {
  return (nesInstance) => {
    if (typeof window.FileReader !== 'function') {
      const warning = 'nES6 dragDrop: FileReader not supported by this browser!';
      if (options.throwCompatError) {
        throw new Error(warning);
      } else {
        console && console.warn(warning);
      }
      return;
    }

    // If a zone is provided but it's not an Element, we can't/shouldn't continue
    if (!!options.zone && !(options.zone instanceof Element)) {
      throw new Error('nES6 dragDrop: Provided `zone` is not a DOM element.');
    }
    const dropZone = options.zone || document.body;

    // Add the dragover/drop listeners to the drop zone
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', (evt) => {
      // If the user dropped on something that ISN'T the dropzone, just ignore it.
      if (evt.target !== dropZone && !containedIn(evt.target, dropZone)) {
        console && console.warn(`DragDropLoader: drop target not in zone (${evt.target})`);
        return;
      }
      // Otherwise, prevent the normal browser drop events (tries to open it, or
      // just re-downloads the file if it can't do that.)
      evt.stopPropagation();
      evt.preventDefault();

      // fileList is the FileList object from the transfer
      const fileList = evt.dataTransfer.files;
      // Grab the first rom in the list (users can't drop multiple files at once)
      const requestedRom = fileList[0];

      // This shouldn't really happen, but hey.
      if (!requestedRom) {
        console && console.warn('nES6 dragDrop: No ROM file uploaded!');
        return;
      }

      // Actually read the file from disk, and then send the ROM into the given
      // nES6 instance through its binary string.
      const reader = new FileReader();
      reader.onload = () => {
        const formatName = name =>
          name
            .replace('.nes', '')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());

        nesInstance.loadRomFromBinary(reader.result, requestedRom.name);
        if (options.onRomLoad) {
          options.onRomLoad(formatName(requestedRom.name), reader.result);
        }
      };
      reader.readAsArrayBuffer(requestedRom);
    }, false);
  };
}

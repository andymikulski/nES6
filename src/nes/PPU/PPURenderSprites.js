import { IS_INT_BETWEEN } from '../../config/consts';
import {
	MASTER_CYCLES_PER_PPU,
	MASTER_CYCLES_PER_SCANLINE,
	SCREEN_HEIGHT,
	SCREEN_WIDTH,
} from '../../config/consts';

export default class PPURenderSprites {
  constructor(ppu) {
    this.ppu = ppu;
    this.overflowSet = false;
    this.useMMC2Latch = false;
  }

  reset() {
    this.overflowSet = false;
    this.useMMC2Latch = this.ppu.mainboard.cart.memoryMapper.MMC2Latch !== undefined;
  }

  onEndFrame() {
    this.overflowSet = false;
  }

  saveState(data) {
    data._overflowSet = this.overflowSet;
  }

  loadState(state) {
    this.overflowSet = state._overflowSet;
  }

  isRangeOverlapping(a1, a2, b1, b2) {
		// http://stackoverflow.com/questions/3269434/whats-the-most-efficient-way-to-test-two-integer-ranges-for-overlap
    return a2 >= b1 && a1 <= b2;
  }


  _renderSprite(spriteHeight, spritenum, startline, endline, spritey) {
    const spriteIndex = spritenum * 4;
    const patternnum = this.ppu.spriteMemory[spriteIndex + 1];
    const attribs = this.ppu.spriteMemory[spriteIndex + 2];
    const sx = this.ppu.spriteMemory[spriteIndex + 3];

    const behindBackground = (attribs & 0x20) > 0;
    const flipHorz = (attribs & 0x40) > 0;
    const flipVert = (attribs & 0x80) > 0;

    const renderScanlineStart = Math.max(spritey, startline);
    const renderScanlineEnd = Math.min(spritey + spriteHeight - 1, endline);
    let ppuAddress = 0;
    let absSy = 0;
    let mask = 0;
    let topsprite = false;
    let firstByte = 0;
    let secondByte = 0;
    let paletteMergeByte = 0;
    let absx = 0;
    let x = 0;

    for (let scanline = renderScanlineStart; scanline <= renderScanlineEnd; ++scanline) {
      ppuAddress = 0;
      absSy = scanline - spritey;

      if (spriteHeight === 8 /*! ppuControl1.spriteSize*/)			{
        ppuAddress = (patternnum * 16) + ((flipVert ? 7 - absSy : absSy) & 0x7) + ((this.ppu.control1 & 0x8) > 0 /* ppuControl1.spritePatternTableAddress*/ ? 0x1000 : 0);
      }			else // big sprites - if sprite num is even, use 0x0 else use 0x1000
			{
        ppuAddress = ((patternnum & 0xFE) * 16) + ((patternnum & 0x01) * 0x1000);

        topsprite = IS_INT_BETWEEN(scanline, spritey, spritey + 8);

        if (!topsprite)				{ // on flipped, put top sprite on bottom & vis versa
          if (flipVert) { ppuAddress += 15 - scanline + spritey; } else						{ ppuAddress += 8 + absSy; }
        }				else				if (flipVert) { ppuAddress += 23 - scanline + spritey; } else						{ ppuAddress += absSy; }
      }

      firstByte = this.ppu.read8(ppuAddress, true, 0);
      secondByte = this.ppu.read8(ppuAddress + 8, true, 0);
      paletteMergeByte = (attribs & 3) << 2;

      if (this.useMMC2Latch) {
        this.ppu.mainboard.cart.memoryMapper.MMC2Latch(ppuAddress + 8);
      }

      for (x = 0; x < 8; ++x)			{
        absx = x + sx;

				// check sprite clipping
        if ((this.ppu.control2 & 0x4) === 0 && absx < 8) {
          continue;
        }
        if (absx > 255) {
          break;
        }

        mask = 0x80 >> (flipHorz ? 7 - x : x);

				// get 2 lower bits from the pattern table for the colour index
        let paletteindex = (firstByte & mask) > 0 ? 1 : 0; // first bit
        paletteindex |= (secondByte & mask) > 0 ? 2 : 0; // second bit

				// add 2 upper bits
        if (paletteindex > 0) {
          paletteindex |= paletteMergeByte;
          this.ppu.mainboard.renderBuffer.renderSpritePixel(spritenum, behindBackground, absx, scanline, this.ppu.paletteTables[1][paletteindex & 0xF] | 0);
        }
      }
    }
  }


	//* ** Cycles 0-63: Secondary OAM (32-byte buffer for current sprites on scanline) is initialized to $FF - attempting to read $2004 will return $FF
	//* ** Cycles 64-255: Sprite evaluation
	//* On even cycles, data is read from (primary) OAM
	//* On odd cycles, data is written to secondary OAM (unless writes are inhibited, in which case it will read the value in secondary OAM instead)
	// 1. Starting at n = 0, read a sprite's Y-coordinate (OAM[n][0], copying it to the next open slot in secondary OAM (unless 8 sprites have been found, in which case the write is ignored).
	// 1a. If Y-coordinate is in range, copy remaining bytes of sprite data (OAM[n][1] thru OAM[n][3]) into secondary OAM.
	// 2. Increment n
	// 2a. If n has overflowed back to zero (all 64 sprites evaluated), go to 4
	// 2b. If less than 8 sprites have been found, go to 1
	// 2c. If exactly 8 sprites have been found, disable writes to secondary OAM
	// 3. Starting at m = 0, evaluate OAM[n][m] as a Y-coordinate.
	// 3a. If the value is in range, set the sprite overflow flag in $2002 and read the next 3 entries of OAM (incrementing 'm' after each byte and incrementing 'n' when 'm' overflows); if m = 3, increment n
	// 3b. If the value is not in range, increment n AND m (without carry). If n overflows to 0, go to 4; otherwise go to 3
	// 4. Attempt (and fail) to copy OAM[n][0] into the next free slot in secondary OAM, and increment n (repeat until HBLANK is reached)
	//* ** Cycles 256-319: Sprite fetches (8 sprites total, 8 cycles per sprite)
	// 1-4: Read the Y-coordinate, tile number, attributes, and X-coordinate of the selected sprite
	// 5-8: Read the X-coordinate of the selected sprite 4 times.
	//* On the first empty sprite slot, read the Y-coordinate of sprite #63 followed by $FF for the remaining 7 cycles
	//* On all subsequent empty sprite slots, read $FF for all 8 reads
	//* ** Cycles 320-340: Background render pipeline initialization
	//* Read the first byte in secondary OAM (the Y-coordinate of the first sprite found, sprite #63 if no sprites were found)

  renderTo(startTicks, endTicks) {
		// Further optimisations can be made: Keep list of visible sprites, update on memory changes -
		// don't need to iterate over 64 of them each time then
		// (dont think this'll work as you need to go over 64 sprites anyway for overflow check)
    const spriteEvaluationStart = 64;

    const firstSpriteEvaluation = this.ppu.screenCoordinatesToTicks(spriteEvaluationStart - 1, -1);
    const lastSpriteEvaluation = this.ppu.screenCoordinatesToTicks(spriteEvaluationStart, 238);
    const spritesVisible = (this.ppu.control2 & 0x10) > 0;
    const ticksIntoCurrentLine = (startTicks % MASTER_CYCLES_PER_SCANLINE);
    let nextSpriteEval = startTicks - ticksIntoCurrentLine + spriteEvaluationStart * MASTER_CYCLES_PER_PPU;
    let startline = 0;
    let endline = 0;
    const spriteHeight = (this.ppu.control1 & 0x20) > 0 ? 16 : 8;
    const nextScanlineSpritesCount = 0;
    const readFromY = 0;
    let spritenum = 0;
    let spritey = 0;
    const that = this;

    if (!spritesVisible) {
      return;
    }

    if (startTicks < firstSpriteEvaluation) {
      startTicks = firstSpriteEvaluation;
    }
    if (endTicks > lastSpriteEvaluation) {
      endTicks = lastSpriteEvaluation;
    }

    if (endTicks <= startTicks) {
      return;
    }

		// work out when sprites are next due to be evaluated
    while (nextSpriteEval <= startTicks) {
      nextSpriteEval += MASTER_CYCLES_PER_SCANLINE;
    }

    if (nextSpriteEval > endTicks) {
      return; // not yet time for the next evaluation period
    }

    startline = this.ppu.ticksToScreenCoordinates(nextSpriteEval).y + 1;
    endline = startline;
    while (nextSpriteEval <= endTicks) {
      nextSpriteEval += MASTER_CYCLES_PER_SCANLINE;
      endline++;
    }
    endline = Math.min(endline, 239);

		// check each sprite to see which fall within the area to check.
    for (spritenum = 0; spritenum < 64; ++spritenum)		{
      spritey = this.ppu.spriteMemory[spritenum * 4] + 1;

      if (spritey > 0 && spritey < SCREEN_HEIGHT) {
        if (this.isRangeOverlapping(startline, endline, spritey, spritey + spriteHeight)) {
          this.renderSprite(spriteHeight, spritenum, startline, endline, spritey);
        }
      }
    }
  }
}

// ============================================================================
//  Input — pointer lock mouse look + keyboard state.
// ============================================================================

export class Input {
  keys: Record<string, boolean> = {};
  mouseDX = 0;
  mouseDY = 0;
  mouseDown = false;
  rightDown = false;
  locked = false;
  sensitivity = 0.0022;
  wheel = 0;

  private el: HTMLElement;
  onLockChange?: (locked: boolean) => void;
  onKeyPress?: (code: string) => void;

  constructor(el: HTMLElement) {
    this.el = el;
    document.addEventListener('keydown', (e) => {
      if (this.keys[e.code] === undefined || !this.keys[e.code]) this.onKeyPress?.(e.code);
      this.keys[e.code] = true;
      if (['Tab', 'Space'].includes(e.code)) e.preventDefault();
    });
    document.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

    document.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.mouseDX += e.movementX;
      this.mouseDY += e.movementY;
    });
    document.addEventListener('mousedown', (e) => {
      if (!this.locked) return;
      if (e.button === 0) this.mouseDown = true;
      if (e.button === 2) this.rightDown = true;
    });
    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouseDown = false;
      if (e.button === 2) this.rightDown = false;
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('wheel', (e) => { this.wheel += Math.sign(e.deltaY); }, { passive: true });

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.el;
      this.onLockChange?.(this.locked);
    });
  }

  requestLock() { this.el.requestPointerLock(); }
  exitLock() { document.exitPointerLock(); }

  consumeMouse() {
    const dx = this.mouseDX, dy = this.mouseDY;
    this.mouseDX = 0; this.mouseDY = 0;
    return { dx, dy };
  }
  consumeWheel() { const w = this.wheel; this.wheel = 0; return w; }
}

import { EventEmitter } from './EventEmitter'

export class Sizes extends EventEmitter<{
  resize: []
}> {
  /** 宽度 */
  private _width: number
  /** 高度 */
  private _height: number
  /** 像素比 */
  private _pixelRatio: number
  constructor() {
    super()
    this._width = window.innerWidth
    this._height = window.innerHeight
    this._pixelRatio = window.devicePixelRatio
    window.addEventListener('resize', () => {
      this._width = window.innerWidth
      this._height = window.innerHeight
      this.emit('resize')
    })
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get widthHalf() {
    return this._width / 2
  }

  get heightHalf() {
    return this._height / 2
  }

  /** 宽高比 */
  get aspectRatio() {
    return this._width / this._height
  }

  private get pixelRatio() {
    return this._pixelRatio
  }

  get allowedPixelRatio() {
    return Math.min(this.pixelRatio, 1.7)
  }
}

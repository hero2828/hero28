import type { Texture } from 'three'
import type { Font, GLTF } from 'three/addons'
import { TextureLoader } from 'three'
import { DRACOLoader, FontLoader, GLTFLoader } from 'three/addons'

import { EventEmitter } from './EventEmitter'

export interface TParams {
  /** 纹理 */
  texture?: Record<string, { name: string, url: string }>
  /** 字体 */
  font?: Record<string, { name: string, url: string }>
  /** 模型 */
  gltf?: Record<string, { name: string, url: string }>
}
export class AssetsLoader<T extends TParams> extends EventEmitter<{
  mounted: [msg: string]
}> {
  /** 加载器 */
  private readonly loaders: {
    textureLoader: TextureLoader
    gltfLoader: GLTFLoader
    fontLoader: FontLoader
  }

  /** 资源 */
  private filesMap: Map<string, any> = new Map()
  /** 路径前缀 */
  public prefix: string = ''
  /** 当前进度 */
  public process: number = 0
  /** 资源总数 */
  public total: number = 0
  constructor(public params: T & { prefix?: string }) {
    super()
    if (this?.params?.prefix) {
      this.prefix = this.params.prefix
    }
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    dracoLoader.preload()

    const gtlfLoader = new GLTFLoader()
    gtlfLoader.setDRACOLoader(dracoLoader)

    this.loaders = {
      textureLoader: new TextureLoader(),
      gltfLoader: gtlfLoader,
      fontLoader: new FontLoader(),
    }

    this.getTotal()
    this.load()
  }

  onMounted() {
    this.emit('mounted', '加载完成')
  }

  getTexture<K extends keyof T['texture']>(key: K): Texture {
    return this.filesMap.get(key as string)
  }

  getFont<K extends keyof T['font']>(key: K): Font {
    return this.filesMap.get(key as string)
  }

  getGltf<K extends keyof T['gltf']>(key: K): GLTF {
    return this.filesMap.get(key as string)
  }

  private getTotal() {
    const { texture, font, gltf } = this.params
    if (texture) {
      this.total += Object.keys(texture).length
    }
    if (font) {
      this.total += Object.keys(font).length
    }
    if (gltf) {
      this.total += Object.keys(gltf).length
    }
  }

  private onProcess() {
    this.process++
    if (this.process >= this.total) {
      this.onMounted()
    }
  }

  private async load() {
    const { texture, font, gltf } = this.params
    if (texture) {
      for (const key in texture) {
        const url = this.prefix + texture[key].url
        this.loaders.textureLoader.load(url, (data) => {
          this.filesMap.set(key, data)
          this.onProcess()
        }, () => { }, () => { })
      }
    }
    if (font) {
      for (const key in font) {
        const url = this.prefix + font[key].url
        this.loaders.fontLoader.load(url, (data) => {
          this.filesMap.set(key, data)
          this.onProcess()
        }, () => { }, () => { })
      }
    }
    if (gltf) {
      for (const key in gltf) {
        const url = this.prefix + gltf[key].url
        this.loaders.gltfLoader.load(url, (data) => {
          this.filesMap.set(key, data)
          this.onProcess()
        }, () => { }, () => { })
      }
    }
  }
}

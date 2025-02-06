import type { Light } from 'three'
import { Sizes } from '@Core/Tools/Sizes'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'

export default class Application {
  public renderer: WebGLRenderer
  public scene: Scene
  public camera: PerspectiveCamera

  public sizes: Sizes
  public onTick: (time?: number) => void
  constructor(opts?: { Orbit?: boolean }) {
    this.sizes = new Sizes()
    this.renderer = this.createRenderer()
    this.camera = this.createCamera()
    this.scene = this.createScene()
    this.scene.add(...this.createLight())
    if (opts?.Orbit) {
      this.createControls()
    }
    this.onTick = () => {}
    this.mounted()
  }

  createRenderer() {
    const renderer = new WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(this.sizes.width, this.sizes.height)
    renderer.setPixelRatio(this.sizes.allowedPixelRatio)
    // 开启阴影属性
    renderer.shadowMap.enabled = true
    return renderer
  }

  createScene() {
    const scene = new Scene()
    scene.background = new Color(0x000000)
    return scene
  }

  createCamera() {
    const camera = new PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)
    camera.position.set(0, 0, 1).setLength(5)
    return camera
  }

  createLight() {
    const lights: Light[] = []
    const ambientLight = new AmbientLight(0xFFFFFF, 1)
    lights.push(ambientLight)
    const directionalLight = new DirectionalLight(0xFFFFFF, 1)
    // 设置光能投射阴影
    directionalLight.castShadow = true
    lights.push(directionalLight)
    return lights
  }

  createControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enableDamping = true
    return controls
  }

  resize() {
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(this.sizes.allowedPixelRatio)
  }

  render(time: number = 0) {
    this.onTick(time)
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }

  mounted() {
    document.body.appendChild(this.renderer.domElement)
    this.render()
    this.sizes.on('resize', this.resize.bind(this))
  }
}

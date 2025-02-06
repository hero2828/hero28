import Application from './Core/Application'

const app = new Application({ Orbit: true })

const box = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({ color: 0xFF0000 }),
)

app.scene.add(box)

app.onTick = () => {
  box.rotation.x += 0.01
  box.rotation.y += 0.01
}

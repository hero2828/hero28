/**
 * 后期处理
 */

import { Camera, Scene, WebGLRenderer } from 'three'
import { AfterimagePass, EffectComposer, RenderPass } from 'three/addons'

/**
 * 重影效果
 */
// 导出一个函数，用于创建一个效果合成器，包含场景、相机和渲染器
export function useAfterimage({ scene, camera, renderer } = {
  scene: new Scene(),
  camera: new Camera(),
  renderer: new WebGLRenderer(),
}) {
  // 创建一个效果合成器
  const effectComposer = new EffectComposer(renderer)
  // 创建一个渲染通道
  const renderPass = new RenderPass(scene, camera)
  // 创建一个afterimage通道
  const afterimagePass = new AfterimagePass()

  // 将渲染通道和afterimage通道添加到效果合成器中
  effectComposer.addPass(renderPass)
  effectComposer.addPass(afterimagePass)

  // 返回效果合成器
  return Object.assign([effectComposer], { effectComposer })
}

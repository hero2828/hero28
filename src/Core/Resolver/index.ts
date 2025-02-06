import type { Resolver } from 'unplugin-auto-import/types'

import * as THREE from 'three'
import * as addons from 'three/addons'

export function useThree(): Resolver {
  const ThreeKeys = Object.keys(THREE)
  const AddonsKeys = Object.keys(addons)

  const hook: Resolver = (name: string) => {
    if (ThreeKeys.includes(name)) {
      return {
        name,
        from: 'three',
      }
    }
    if (AddonsKeys.includes(name)) {
      return {
        name,
        from: 'three/addons',
      }
    }
    if (['GUI'].includes(name)) {
      return {
        name,
        from: 'three/examples/jsm/libs/lil-gui.module.min',
      }
    }
    if (['SimplexNoise'].includes(name)) {
      return {
        name,
        from: 'three/examples/jsm/math/SimplexNoise',
      }
    }
    if (['mergeGeometries'].includes(name)) {
      return {
        name,
        from: 'three/examples/jsm/utils/BufferGeometryUtils',
      }
    }
    if (['Stats'].includes(name)) {
      return {
        name: 'default',
        from: 'three/addons/libs/stats.module',
        as: name,
      }
    }
    if (['TWEEN'].includes(name)) {
      return {
        name: 'default',
        from: 'three/examples/jsm/libs/tween.module',
        as: name,
      }
    }
  }
  return (name: string) => hook(name)
}

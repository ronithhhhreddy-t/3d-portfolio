import * as THREE from "three"

import heroGradientVertexShader from "./shaders/hero-gradient/vertex.glsl"
import heroGradientFragmentShader from "./shaders/hero-gradient/fragment.glsl"
import { heroGradientField } from "./heroGradientField"

const RAMP_SIZE = 256

const parseHex = (hex) => {
  const value = Number.parseInt(hex.slice(1), 16)

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

// Stops are [brightness 0-255, "#rrggbb"] pairs. They are interpolated in display
// space and kept as raw sRGB bytes: the shader mixes them the same way the
// reference colours were measured, then converts to linear itself.
const createRampTexture = (stops) => {
  const points = stops.map(([brightness, hex]) => [brightness, parseHex(hex)])
  const data = new Uint8Array(RAMP_SIZE * 4)

  for (let i = 0; i < RAMP_SIZE; i++) {
    let upper = points.findIndex(([brightness]) => brightness >= i)

    if (upper === -1) upper = points.length - 1

    const lower = Math.max(0, upper - 1)
    const [fromBrightness, fromColor] = points[lower]
    const [toBrightness, toColor] = points[upper]

    const span = toBrightness - fromBrightness
    const mix = span > 0 ? THREE.MathUtils.clamp((i - fromBrightness) / span, 0, 1) : 0

    for (let channel = 0; channel < 3; channel++) {
      data[i * 4 + channel] = Math.round(
        fromColor[channel] + (toColor[channel] - fromColor[channel]) * mix,
      )
    }

    data[i * 4 + 3] = 255
  }

  const texture = new THREE.DataTexture(data, RAMP_SIZE, 1, THREE.RGBAFormat)

  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true

  return texture
}

const toVector4s = (rows) => rows.map((row) => new THREE.Vector4(...row))

export const createHeroGradient = ({ renderer, reducedMotion = false }) => {
  const field = heroGradientField

  const hotRamp = createRampTexture(field.hotRamp)
  const softRamp = createRampTexture(field.softRamp)

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uCapture: { value: 0 },

    uHotRamp: { value: hotRamp },
    uSoftRamp: { value: softRamp },

    uBase: { value: new THREE.Vector2(...field.base) },

    uRibbonShape: { value: toVector4s(field.ribbons.map((ribbon) => ribbon.shape)) },
    uRibbonCurveCos: { value: toVector4s(field.ribbons.map((ribbon) => ribbon.curveCos)) },
    uRibbonCurveSin: { value: toVector4s(field.ribbons.map((ribbon) => ribbon.curveSin)) },
    uRibbonFade: { value: toVector4s(field.ribbons.map((ribbon) => ribbon.fade)) },
    uRibbonLight: {
      value: field.ribbons.map((ribbon) => new THREE.Vector2(...ribbon.light)),
    },

    uGlowShape: { value: toVector4s(field.glows.map((glow) => glow.shape)) },
    uGlowLight: { value: field.glows.map((glow) => new THREE.Vector3(...glow.light)) },

    uVignette: { value: new THREE.Vector3(...field.vignette) },
    uGrain: { value: field.grain },

    // Radians of sway. Slow enough to feel like breathing, not like motion.
    uDriftAmount: { value: reducedMotion ? 0 : 0.012 },

    // Reflection-only lighting for the logo (see the shader's "Reflection studio")
    uStudioFill: { value: new THREE.Vector4(...field.studioFill) },
    uStudioTop: { value: new THREE.Vector4(...field.studioTop) },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader: heroGradientVertexShader,
    fragmentShader: heroGradientFragmentShader,
    uniforms,

    side: THREE.BackSide,
    depthTest: false,
    depthWrite: false,
    // The ramps already hold final display colours
    toneMapped: false,
  })

  // Well inside the camera's far plane; it follows the camera, so only its
  // direction from the eye ever matters.
  const geometry = new THREE.SphereGeometry(50, 64, 32)
  const mesh = new THREE.Mesh(geometry, material)

  mesh.renderOrder = -1
  mesh.frustumCulled = false

  // Renders the same field (without vignette or grain) into a cube map, so the
  // logo reflects exactly the light it sits in.
  const createEnvironmentMap = () => {
    const captureScene = new THREE.Scene()
    captureScene.add(new THREE.Mesh(geometry, material))

    const cubeTarget = new THREE.WebGLCubeRenderTarget(256, {
      type: THREE.HalfFloatType,
    })
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeTarget)

    uniforms.uCapture.value = 1
    cubeCamera.update(renderer, captureScene)
    uniforms.uCapture.value = 0

    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    const environmentTarget = pmremGenerator.fromCubemap(cubeTarget.texture)

    pmremGenerator.dispose()
    cubeTarget.dispose()

    return environmentTarget
  }

  const update = ({ time, camera }) => {
    uniforms.uTime.value = time
    mesh.position.copy(camera.position)
  }

  const setResolution = (width, height) => {
    uniforms.uResolution.value.set(width, height)
  }

  const dispose = () => {
    geometry.dispose()
    material.dispose()
    hotRamp.dispose()
    softRamp.dispose()
  }

  return {
    mesh,
    createEnvironmentMap,
    update,
    setResolution,
    dispose,
  }
}

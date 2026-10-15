import gsap from "gsap"
import * as THREE from "three"

import homeLoaderVertexShader from "./shaders/vertex.glsl"
import homeLoaderFragmentShader from "./shaders/fragment.glsl"

export const createHomeLoader = ({ enabled = true, minimumDuration = 1.2 } = {}) => {
  const canvas = document.querySelector(".home-loader__canvas")
  const loaderElement = document.querySelector(".home-loader")

  if (!enabled || !canvas || !loaderElement) {
    return {
      setProgress: () => {},
      complete: () => Promise.resolve(),
      revealLogo: () => Promise.resolve(),
      revealHero: () => Promise.resolve(),
      dispose: () => {},
    }
  }

  let renderer = null
  let geometry = null
  let material = null
  let logoTexture = null
  let progressTween = null
  let revealTween = null
  let heroRevealTween = null
  let resizeObserver = null
  let assetProgress = 0
  let isCompleting = false
  let isDisposed = false
  let isRenderLoopActive = false

  // Visible frames only. The ticker is driven by requestAnimationFrame, which stops
  // while the tab is in the background, so this clock naturally excludes time the
  // page was never on screen. Timing the wave from here, rather than from
  // construction, guarantees the whole rise is actually seen: the WebGL setup and
  // the shader compile before it can take a second on their own.
  let visibleElapsed = 0

  const whenVisible = () =>
    document.visibilityState === "visible"
      ? Promise.resolve()
      : new Promise((resolve) => {
          const onVisibilityChange = () => {
            if (document.visibilityState !== "visible") return

            document.removeEventListener("visibilitychange", onVisibilityChange)
            resolve()
          }

          document.addEventListener("visibilitychange", onVisibilityChange)
        })

  const scene = new THREE.Scene()
  const camera = new THREE.Camera()

  const render = () => {
    if (!renderer || !material || isDisposed) return

    material.uniforms.uTime.value = performance.now() * 0.001
    renderer.render(scene, camera)
  }

  // The fill follows whichever is further behind: the assets that have arrived, or the
  // clock. Pacing it against the clock keeps the wave readable when everything is cached
  // and all five assets land at once.
  const advanceProgress = () => {
    if (!material || isDisposed || isCompleting) return

    const pacedProgress = Math.min(assetProgress, visibleElapsed / minimumDuration)

    material.uniforms.uLoadProgress.value = Math.max(
      material.uniforms.uLoadProgress.value,
      pacedProgress,
    )
  }

  const tick = (time, deltaTime) => {
    // Clamp so returning from a background tab cannot skip the wave in one frame.
    visibleElapsed += Math.min(deltaTime, 50) / 1000

    advanceProgress()
    render()
  }

  // The wave animates on its own clock, so it has to redraw every frame rather than
  // only while a progress tween happens to be running.
  const startRenderLoop = () => {
    if (isRenderLoopActive || isDisposed) return

    isRenderLoopActive = true
    gsap.ticker.add(tick)
  }

  const stopRenderLoop = () => {
    if (!isRenderLoopActive) return

    isRenderLoopActive = false
    gsap.ticker.remove(tick)
  }

  const updateSize = () => {
    if (!renderer || !material) return

    const width = loaderElement.clientWidth
    const height = loaderElement.clientHeight
    const pixelRatio = Math.min(window.devicePixelRatio, 2)

    renderer.setSize(width, height, false)
    renderer.setPixelRatio(pixelRatio)

    material.uniforms.uResolution.value.set(width, height)

    const logoHeight = Math.min(180, width * 0.28, height * 0.28)
    const logoAspectRatio = 93.36 / 100

    material.uniforms.uLogoSize.value.set(logoHeight * logoAspectRatio, logoHeight)

    render()
  }

  const ready = (async () => {
    try {
      logoTexture = await new THREE.TextureLoader().loadAsync("/brand/logo-rr.svg")

      if (isDisposed) {
        logoTexture.dispose()
        return
      }

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        premultipliedAlpha: true,
      })

      renderer.outputColorSpace = THREE.SRGBColorSpace

      geometry = new THREE.PlaneGeometry(2, 2)

      const rootStyles = getComputedStyle(document.documentElement)
      const creamColor = rootStyles.getPropertyValue("--color-cream").trim() || "#f5e7df"
      const darkColor = rootStyles.getPropertyValue("--color-dark").trim() || "#1f1d1d"

      material = new THREE.ShaderMaterial({
        vertexShader: homeLoaderVertexShader,
        fragmentShader: homeLoaderFragmentShader,

        uniforms: {
          uLogoTexture: { value: logoTexture },
          uResolution: { value: new THREE.Vector2() },
          uLogoSize: { value: new THREE.Vector2() },
          uLoadProgress: { value: 0 },
          uLogoCutoutProgress: { value: 0 },
          uHeroRevealProgress: { value: 0 },
          uTime: { value: 0 },
          uCreamColor: { value: new THREE.Color(creamColor) },
          uDarkColor: { value: new THREE.Color(darkColor) },
          // The noise is only a light organic jitter now; the wave carries the shape.
          uNoiseScale: { value: 10 },
          uNoiseStrength: { value: 0.07 },
          uNoiseSpeedX: { value: 0.08 },
          uNoiseSpeedY: { value: 0.12 },
          uWaveAmplitude: { value: 0.1 },
          uWaveFrequency: { value: 13 },
          uWaveSpeed: { value: 3.2 },
          uHeroNoiseScale: { value: 2 },
          uHeroNoiseStrength: { value: 0.06 },
          uHeroNoiseSpeedX: { value: 0.45 },
          uHeroNoiseSpeedY: { value: 0.35 },
          // Broader and slower, so the full-screen wipe reads as one swell.
          uHeroWaveAmplitude: { value: 0.07 },
          uHeroWaveFrequency: { value: 7 },
          uHeroWaveSpeed: { value: 2.2 },
        },
      })

      const loaderPlane = new THREE.Mesh(geometry, material)
      scene.add(loaderPlane)

      updateSize()
      resizeObserver = new ResizeObserver(updateSize)
      resizeObserver.observe(loaderElement)
      window.addEventListener("resize", updateSize)

      await renderer.compileAsync(scene, camera)

      render()
      loaderElement.classList.add("home-loader--canvas-ready")
      startRenderLoop()
    } catch (error) {
      console.error("Unable to prepare the home loader.", error)
    }
  })()

  const setProgress = (progress) => {
    assetProgress = Math.min(gsap.utils.clamp(0, 1, progress), 0.9)
  }

  const complete = async () => {
    await ready

    if (!material || isDisposed) return

    // Never finish the intro against a background tab: the whole point is that the
    // visitor sees it, so hold until the page is actually on screen.
    await whenVisible()

    if (isDisposed) return

    const remainingMinimumDuration = Math.max(0, minimumDuration - visibleElapsed)
    const completionDuration = Math.max(0.6, remainingMinimumDuration)

    isCompleting = true

    await new Promise((resolve) => {
      progressTween?.kill()

      progressTween = gsap.to(material.uniforms.uLoadProgress, {
        value: 1,
        duration: completionDuration,
        ease: "power2.out",
        overwrite: true,
        onComplete: resolve,
      })
    })
  }

  const revealLogo = async () => {
    await ready

    if (!material || isDisposed) return

    await new Promise((resolve) => {
      revealTween = gsap.to(material.uniforms.uLogoCutoutProgress, {
        value: 1,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: resolve,
      })
    })
  }

  const revealHero = async () => {
    await ready

    if (!material || isDisposed) return

    await new Promise((resolve) => {
      heroRevealTween = gsap.to(material.uniforms.uHeroRevealProgress, {
        value: 1,
        duration: 1,
        ease: "power2.inOut",
        onComplete: resolve,
      })
    })
  }

  const dispose = () => {
    if (isDisposed) return

    isDisposed = true

    stopRenderLoop()
    resizeObserver?.disconnect()
    window.removeEventListener("resize", updateSize)

    progressTween?.kill()
    revealTween?.kill()
    heroRevealTween?.kill()
    logoTexture?.dispose()
    geometry?.dispose()
    material?.dispose()
    renderer?.dispose()
  }

  return {
    setProgress,
    complete,
    revealLogo,
    revealHero,
    dispose,
  }
}

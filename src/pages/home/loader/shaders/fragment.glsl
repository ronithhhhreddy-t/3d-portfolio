// ----------------------
// Shared
// ----------------------
uniform sampler2D uLogoTexture;
uniform float uTime;

uniform vec3 uCreamColor;
uniform vec3 uDarkColor;

varying vec2 vUv;

// ----------------------
// Logo layout
// ----------------------
uniform vec2 uResolution;
uniform vec2 uLogoSize;

// ----------------------
// Logo loading and cutout
// ----------------------
uniform float uLoadProgress;
uniform float uLogoCutoutProgress;

uniform float uNoiseScale;
uniform float uNoiseStrength;
uniform float uNoiseSpeedX;
uniform float uNoiseSpeedY;

uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;

// ----------------------
// Fullscreen hero reveal
// ----------------------
uniform float uHeroRevealProgress;

uniform float uHeroNoiseScale;
uniform float uHeroNoiseStrength;
uniform float uHeroNoiseSpeedX;
uniform float uHeroNoiseSpeedY;

uniform float uHeroWaveAmplitude;
uniform float uHeroWaveFrequency;
uniform float uHeroWaveSpeed;

#include ../../../../shared/shaders/noise.glsl;

// Three travelling sines at different scales read as a liquid surface,
// where a single one would look like a mechanical ripple.
float getWaveOffset(
    float x,
    float amplitude,
    float frequency,
    float speed
) {
    float primary = sin(x * frequency + uTime * speed);
    float secondary = sin(x * frequency * 1.9 - uTime * speed * 0.65);
    float swell = sin(x * frequency * 0.45 + uTime * speed * 0.3);

    return (
        primary * 0.55
        + secondary * 0.25
        + swell * 0.2
    ) * amplitude;
}

float getNoisyReveal(
    vec2 uv,
    float progress,
    float noiseScale,
    float noiseStrength,
    float noiseSpeedX,
    float noiseSpeedY,
    float waveAmplitude,
    float waveFrequency,
    float waveSpeed
) {
    // ----------------------
    // 1. Reveal position
    // ----------------------
    float frontPadding =
        noiseStrength * 0.5 + waveAmplitude + 0.02;

    float frontStart = -frontPadding;
    float frontEnd = 1.0 + frontPadding;

    float frontPosition = mix(
        frontStart,
        frontEnd,
        progress
    );

    // ----------------------
    // 2. Noise deformation
    // ----------------------
    float noiseValue = noise(
        vec3(
            uv.x * noiseScale - uTime * noiseSpeedX,
            uTime * noiseSpeedY,
            0.0
        )
    );

    float centeredNoise = noiseValue - 0.5;

    float waveOffset = getWaveOffset(
        uv.x,
        waveAmplitude,
        waveFrequency,
        waveSpeed
    );

    float noisyFront =
        frontPosition
        + centeredNoise
        * noiseStrength
        + waveOffset;

    // ----------------------
    // 3. Antialiased mask
    // ----------------------
    float signedDistance =
        uv.y - noisyFront;

    float antiAliasWidth = fwidth(signedDistance);

    return 1.0 - smoothstep(
        -antiAliasWidth,
        antiAliasWidth,
        signedDistance
    );
}

void main() {
    // ----------------------
    // 1. Logo mask
    // ----------------------
    vec2 centeredPosition =
        (vUv - 0.5) * uResolution;

    vec2 logoUv =
        centeredPosition / uLogoSize + 0.5;

    float insideLogoBounds =
        step(0.0, logoUv.x)
        * step(logoUv.x, 1.0)
        * step(0.0, logoUv.y)
        * step(logoUv.y, 1.0);

    float logoMask =
        texture2D(uLogoTexture, logoUv).a
        * insideLogoBounds;

    // ----------------------
    // 2. Logo loading fill
    // ----------------------
    float logoFill =
        getNoisyReveal(
            logoUv,
            uLoadProgress,
            uNoiseScale,
            uNoiseStrength,
            uNoiseSpeedX,
            uNoiseSpeedY,
            uWaveAmplitude,
            uWaveFrequency,
            uWaveSpeed
        );

    float filledLogoMask =
        logoMask * logoFill;

    vec3 finalColor = mix(
        uCreamColor,
        uDarkColor,
        filledLogoMask
    );

    // ----------------------
    // 3. Logo cutout
    // ----------------------
    float logoCutoutAlpha =
        1.0
        - logoMask
        * uLogoCutoutProgress;

    // ----------------------
    // 4. Fullscreen hero reveal
    // ----------------------
    vec2 heroRevealUv = vec2(
        vUv.x,
        1.0 - vUv.y
    );

    float heroRevealMask =
        getNoisyReveal(
            heroRevealUv,
            uHeroRevealProgress,
            uHeroNoiseScale,
            uHeroNoiseStrength,
            uHeroNoiseSpeedX,
            uHeroNoiseSpeedY,
            uHeroWaveAmplitude,
            uHeroWaveFrequency,
            uHeroWaveSpeed
        );

    // ----------------------
    // 5. Final composition
    // ----------------------
    float finalAlpha =
        logoCutoutAlpha
        * (1.0 - heroRevealMask);

    gl_FragColor = vec4(
        finalColor,
        finalAlpha
    );

    #include <colorspace_fragment>

    // Match the premultiplied-alpha format expected by the canvas compositor.
    gl_FragColor.rgb *= gl_FragColor.a;
}

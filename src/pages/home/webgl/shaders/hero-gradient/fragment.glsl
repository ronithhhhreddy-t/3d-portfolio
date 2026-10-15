#define PI 3.141592653589793
#define RIBBON_COUNT 7
#define GLOW_COUNT 6

// -------------------------------------------------------
// Global
// -------------------------------------------------------
uniform float uTime;
uniform vec2 uResolution;

// 1 while rendering the reflection environment: no screen-space vignette or grain
uniform float uCapture;

// -------------------------------------------------------
// Colour ramps, indexed by brightness
// -------------------------------------------------------
// Both ramps were measured from the reference renders: "hot" is the saturated
// fire of the light ribbons, "soft" the muted champagne haze. Every stop keeps
// red > green > blue, so no mix of the two can drift toward pink.
uniform sampler2D uHotRamp;
uniform sampler2D uSoftRamp;

// -------------------------------------------------------
// Light field
// -------------------------------------------------------
// x: brightness floor, y: saturation bias
uniform vec2 uBase;

// Ribbons: soft bands of light following a curved centreline around the horizon
// shape: centre elevation, log width, log width cos/sin(az)
uniform vec4 uRibbonShape[RIBBON_COUNT];
uniform vec4 uRibbonCurveCos[RIBBON_COUNT];
uniform vec4 uRibbonCurveSin[RIBBON_COUNT];
// Brightness variation along the ribbon's length
uniform vec4 uRibbonFade[RIBBON_COUNT];
// x: intensity, y: saturation
uniform vec2 uRibbonLight[RIBBON_COUNT];

// Glows: large elliptical pools of light
// shape: azimuth, elevation, radius across, radius along
uniform vec4 uGlowShape[GLOW_COUNT];
// x: rotation, y: intensity, z: saturation
uniform vec3 uGlowLight[GLOW_COUNT];

// -------------------------------------------------------
// Finish
// -------------------------------------------------------
// x: strength, y: inner radius, z: outer radius
uniform vec3 uVignette;
uniform float uGrain;

// -------------------------------------------------------
// Motion
// -------------------------------------------------------
uniform float uDriftAmount;

// -------------------------------------------------------
// Reflection studio (environment capture only)
// -------------------------------------------------------
// Horizon ramp: blend toward the rig, ramp half-range, intensity, saturation
uniform vec4 uStudioFill;
// Softbox: start elevation, full elevation, intensity, saturation
uniform vec4 uStudioTop;

varying vec3 vDirection;

float wrapAngle(float angle) {
    return mod(angle + PI, 2.0 * PI) - PI;
}

float hash(vec2 point) {
    vec3 p = fract(vec3(point.xyx) * 0.1031);
    p += dot(p, p.yzx + 33.33);

    return fract((p.x + p.y) * p.z);
}

vec3 sRGBToLinear(vec3 color) {
    vec3 low = color / 12.92;
    vec3 high = pow((color + 0.055) / 1.055, vec3(2.4));

    return mix(high, low, step(color, vec3(0.04045)));
}

vec3 sampleRamp(sampler2D ramp, float t) {
    // Texel centres of a 256-entry ramp
    return texture2D(ramp, vec2(t * (255.0 / 256.0) + 0.5 / 256.0, 0.5)).rgb;
}

void main() {
    // -------------------------------------------------------
    // Panorama coordinates
    // -------------------------------------------------------
    vec3 direction = normalize(vDirection);

    float azimuth = atan(direction.x, -direction.z);
    float elevation = asin(clamp(direction.y, -1.0, 1.0));

    float time = uTime;

    // A faint, very slow warp so the surface never reads as a static image
    elevation += uDriftAmount
        * 0.9
        * sin(azimuth * 3.1 + time * 0.045)
        * sin(elevation * 7.3 - time * 0.037);

    float energy = abs(uBase.x);
    float saturation = uBase.y;

    // -------------------------------------------------------
    // Ribbons
    // -------------------------------------------------------
    for (int i = 0; i < RIBBON_COUNT; i++) {
        float index = float(i);

        vec4 shape = uRibbonShape[i];
        vec4 curveCos = uRibbonCurveCos[i];
        vec4 curveSin = uRibbonCurveSin[i];
        vec4 fade = uRibbonFade[i];

        vec4 harmonics = vec4(1.0, 2.0, 3.0, 4.0) * azimuth;

        float centre = shape.x
            + dot(curveCos, cos(harmonics))
            + dot(curveSin, sin(harmonics));

        // Each ribbon sways on its own long period, like slow fabric
        centre += uDriftAmount * sin(
            time * (0.05 + index * 0.013)
            + azimuth * (1.7 + index * 0.6)
            + index * 2.1
        );

        float width = exp(shape.y + shape.z * cos(azimuth) + shape.w * sin(azimuth));

        float along = exp(
            fade.x * cos(azimuth)
            + fade.y * sin(azimuth)
            + fade.z * cos(2.0 * azimuth)
            + fade.w * sin(2.0 * azimuth)
        );

        float distanceToCentre = (elevation - centre) / width;
        float influence = exp(-distanceToCentre * distanceToCentre) * along;

        energy += abs(uRibbonLight[i].x) * influence;
        saturation += uRibbonLight[i].y * influence;
    }

    // -------------------------------------------------------
    // Glows
    // -------------------------------------------------------
    for (int i = 0; i < GLOW_COUNT; i++) {
        float index = float(i);

        vec4 shape = uGlowShape[i];
        vec3 light = uGlowLight[i];

        float drift = uDriftAmount * 1.4 * sin(time * (0.031 + index * 0.007) + index * 1.3);

        float offsetAcross = wrapAngle(azimuth - shape.x - drift) * cos(shape.y);
        float offsetUp = elevation - shape.y - drift * 0.3;

        float c = cos(light.x);
        float s = sin(light.x);

        float u = (offsetAcross * c + offsetUp * s) / shape.z;
        float v = (-offsetAcross * s + offsetUp * c) / shape.w;

        float influence = exp(-u * u - v * v);

        // Glows breathe by a few percent
        float breathe = 1.0 + 0.06 * sin(time * (0.09 + index * 0.017) + index * 2.7);

        energy += abs(light.y) * influence * breathe;
        saturation += light.z * influence;
    }

    // -------------------------------------------------------
    // Reflection studio
    // -------------------------------------------------------
    // Only while capturing the environment map. The logo's faces mostly reflect
    // what is behind the viewer, which the backdrop never shows. Blending toward a
    // rig that is identical all the way around keeps the metal reading the same at
    // every point of the scroll orbit and every step of its rotation.
    if (uCapture > 0.5) {
        // Light rising through the horizon, dark below to amber above. A flat face's
        // upper edge reflects slightly upward, so this grades each face from golden
        // at the top to deeper orange at the bottom, like polished metal under a sky.
        float horizon = smoothstep(-uStudioFill.y, uStudioFill.y * 0.7, elevation);

        // Champagne softbox overhead: the bright top edges and bevels
        float overhead = smoothstep(uStudioTop.x, uStudioTop.y, elevation);

        float rigEnergy = abs(uBase.x) + uStudioFill.z * horizon + uStudioTop.z * overhead;
        float rigSaturation = uBase.y + uStudioFill.w * horizon + uStudioTop.w * overhead;

        energy = mix(energy, rigEnergy, uStudioFill.x);
        saturation = mix(saturation, rigSaturation, uStudioFill.x);
    }

    // -------------------------------------------------------
    // Brightness and saturation
    // -------------------------------------------------------
    // Energy saturates smoothly, so overlapping lights bloom into cream
    // instead of clipping.
    float brightness = 1.0 - exp(-energy);
    float fireAmount = 1.0 / (1.0 + exp(-clamp(saturation, -30.0, 30.0)));

    if (uCapture < 0.5) {
        vec2 ndc = gl_FragCoord.xy / uResolution * 2.0 - 1.0;
        float radius = length(ndc);

        float edge = clamp((radius - uVignette.y) / (uVignette.z - uVignette.y), 0.0, 1.0);
        brightness *= 1.0 - uVignette.x * edge * edge * (3.0 - 2.0 * edge);
    }

    // -------------------------------------------------------
    // Colour
    // -------------------------------------------------------
    vec3 hot = sampleRamp(uHotRamp, brightness);
    vec3 soft = sampleRamp(uSoftRamp, brightness);

    vec3 color = mix(soft, hot, fireAmount);

    // Fine grain in display space. It also dithers the dark gradients so they
    // never band.
    if (uCapture < 0.5) {
        float grain = hash(gl_FragCoord.xy + fract(time * 7.13) * 91.7) - 0.5;
        color += grain * uGrain;
    }

    gl_FragColor = vec4(sRGBToLinear(clamp(color, 0.0, 1.0)), 1.0);

    #include <colorspace_fragment>
}

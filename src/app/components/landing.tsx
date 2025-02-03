/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";
import { Play, Info, Calendar, MapPin } from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────

interface ColorsOptions {
  roadColor: number;
  islandColor: number;
  background: number;
  shoulderLines: number;
  brokenLines: number;
  leftCars: number[];
  rightCars: number[];
  sticks: number;
}

export interface HyperspeedOptions {
  onSpeedUp?: (ev: MouseEvent) => void;
  onSlowDown?: (ev: MouseEvent) => void;
  distortion: string | Distortion;
  length: number;
  roadWidth: number;
  islandWidth: number;
  lanesPerRoad: number;
  fov: number;
  fovSpeedUp: number;
  speedUp: number;
  carLightsFade: number;
  totalSideLightSticks: number;
  lightPairsPerRoadWay: number;
  shoulderLinesWidthPercentage: number;
  brokenLinesWidthPercentage: number;
  brokenLinesLengthPercentage: number;
  lightStickWidth: [number, number];
  lightStickHeight: [number, number];
  movingAwaySpeed: [number, number];
  movingCloserSpeed: [number, number];
  carLightsLength: [number, number];
  carLightsRadius: [number, number];
  carWidthPercentage: [number, number];
  carShiftX: [number, number];
  carFloorSeparation: [number, number];
  colors: ColorsOptions;
  isHyper?: boolean;
}

interface Distortion {
  uniforms: { [key: string]: any };
  getDistortion: string;
  getJS?: (progress: number, time: number) => THREE.Vector3;
}

interface HyperspeedProps {
  effectOptions?: HyperspeedOptions;
}

// ─── DEFAULT OPTIONS ───────────────────────────────────────────────────────

const defaultEffectOptions: HyperspeedOptions = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3,
  },
};

// ─── SHADER STRINGS ───────────────────────────────────────────────────────

const carLightsFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  varying vec3 vColor;
  varying vec2 vUv; 
  uniform vec2 uFade;
  void main() {
    vec3 color = vec3(vColor);
    float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const carLightsVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  attribute vec3 aOffset;
  attribute vec3 aMetrics;
  attribute vec3 aColor;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec2 vUv; 
  varying vec3 vColor; 
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;
    transformed.xy *= radius;
    transformed.z *= myLength;
    transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;
    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    vColor = aColor;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

const sideSticksVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  attribute float aOffset;
  attribute vec3 aColor;
  attribute vec2 aMetrics;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec3 vColor;
  mat4 rotationY( in float angle ) {
    return mat4(	cos(angle),		0,		sin(angle),	0,
                 0,		1.0,			 0,	0,
            -sin(angle),	0,		cos(angle),	0,
            0, 		0,				0,	1);
  }
  #include <getDistortion_vertex>
  void main(){
    vec3 transformed = position.xyz;
    float width = aMetrics.x;
    float height = aMetrics.y;
    float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);
    transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
    transformed.z += - uTravelLength + time;
    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);
    transformed.y += height / 2.;
    transformed.x += -width / 2.;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

const sideSticksFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  varying vec3 vColor;
  void main(){
    vec3 color = vec3(vColor);
    gl_FragColor = vec4(color,1.);
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const roadBaseFragment = `
  #define USE_FOG;
  varying vec2 vUv; 
  uniform vec3 uColor;
  uniform float uTime;
  #include <roadMarkings_vars>
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uColor);
    #include <roadMarkings_fragment>
    gl_FragColor = vec4(color, 1.);
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const roadMarkings_vars = `
  uniform float uLanes;
  uniform vec3 uBrokenLinesColor;
  uniform vec3 uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage;
  uniform float uBrokenLinesWidthPercentage;
  uniform float uBrokenLinesLengthPercentage;
  highp float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
  }
`;

const roadMarkings_fragment = `
  uv.y = mod(uv.y + uTime * 0.05, 1.);
  float laneWidth = 1.0 / uLanes;
  float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
  float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;
  float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
  float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
  brokenLines = mix(brokenLines, sideLines, uv.x);
`;

const roadFragment = roadBaseFragment
  .replace("#include <roadMarkings_fragment>", roadMarkings_fragment)
  .replace("#include <roadMarkings_vars>", roadMarkings_vars);

const islandFragment = roadBaseFragment
  .replace("#include <roadMarkings_fragment>", "")
  .replace("#include <roadMarkings_vars>", "");

const roadVertex = `
  #define USE_FOG;
  uniform float uTime;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  uniform float uTravelLength;
  varying vec2 vUv; 
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    transformed.y += -1. * distortion.z;  
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────

const nsin = (val: number): number => Math.sin(val) * 0.5 + 0.5;

function random(base: number | [number, number]): number {
  if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0];
  return Math.random() * base;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function lerp(
  current: number,
  target: number,
  speed = 0.1,
  limit = 0.001
): number {
  let change = (target - current) * speed;
  if (Math.abs(change) < limit) {
    change = target - current;
  }
  return change;
}

function resizeRendererToDisplaySize(
  renderer: THREE.WebGLRenderer,
  setSize: (width: number, height: number, updateStyles: boolean) => void
): boolean {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    setSize(width, height, false);
  }
  return needResize;
}

// ─── CLASSES ──────────────────────────────────────────────────────────────

class App {
  options: HyperspeedOptions;
  container: HTMLElement;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  fogUniforms: {
    fogColor: { value: THREE.Color };
    fogNear: { value: number };
    fogFar: { value: number };
  };
  clock: THREE.Clock;
  assets: { [key: string]: any } = {};
  disposed: boolean = false;
  road: Road;
  leftCarLights: CarLights;
  rightCarLights: CarLights;
  leftSticks: LightsSticks;
  fovTarget: number;
  speedUpTarget: number;
  speedUp: number;
  timeOffset: number;

  // These will be set in initPasses
  renderPass!: RenderPass;
  bloomPass!: EffectPass;

  constructor(container: HTMLElement, options: HyperspeedOptions) {
    this.options = options;
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.composer = new EffectComposer(this.renderer);
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      options.fov,
      container.offsetWidth / container.offsetHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 8, -5);
    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent background

    const fog = new THREE.Fog(
      options.colors.background,
      options.length * 0.2,
      options.length * 500
    );
    this.scene.fog = fog;
    this.fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far },
    };
    this.clock = new THREE.Clock();

    this.road = new Road(this, options);
    this.leftCarLights = new CarLights(
      this,
      options,
      options.colors.leftCars,
      options.movingAwaySpeed,
      new THREE.Vector2(0, 1 - options.carLightsFade)
    );
    this.rightCarLights = new CarLights(
      this,
      options,
      options.colors.rightCars,
      options.movingCloserSpeed,
      new THREE.Vector2(1, 0 + options.carLightsFade)
    );
    this.leftSticks = new LightsSticks(this, options);

    this.fovTarget = options.fov;
    this.speedUpTarget = 0;
    this.speedUp = 0;
    this.timeOffset = 0;

    // Bind methods
    this.tick = this.tick.bind(this);
    this.init = this.init.bind(this);
    this.setSize = this.setSize.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  initPasses() {
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new EffectPass(
      this.camera,
      new BloomEffect({
        luminanceThreshold: 0.2,
        luminanceSmoothing: 0,
        resolutionScale: 1,
      })
    );
    const smaaPass = new EffectPass(
      this.camera,
      new SMAAEffect({
        preset: SMAAPreset.MEDIUM,
        searchImage: SMAAEffect.searchImageDataURL,
        areaImage: SMAAEffect.areaImageDataURL,
      })
    );
    this.renderPass.renderToScreen = false;
    this.bloomPass.renderToScreen = false;
    smaaPass.renderToScreen = true;
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(smaaPass);
  }

  loadAssets(): Promise<void> {
    const assets = this.assets;
    return new Promise((resolve) => {
      const manager = new THREE.LoadingManager(resolve);
      const searchImage = new Image();
      const areaImage = new Image();
      assets.smaa = {};
      searchImage.addEventListener(
        "load",
        function (this: GlobalEventHandlers, ev: Event) {
          assets.smaa.search = this;
          manager.itemEnd("smaa-search");
        }
      );
      areaImage.addEventListener(
        "load",
        function (this: GlobalEventHandlers, ev: Event) {
          assets.smaa.area = this;
          manager.itemEnd("smaa-area");
        }
      );
      manager.itemStart("smaa-search");
      manager.itemStart("smaa-area");
      searchImage.src = SMAAEffect.searchImageDataURL;
      areaImage.src = SMAAEffect.areaImageDataURL;
    });
  }

  init() {
    this.initPasses();
    const options = this.options;
    this.road.init();
    this.leftCarLights.init();
    this.leftCarLights.mesh.position.setX(
      -options.roadWidth / 2 - options.islandWidth / 2
    );
    this.rightCarLights.init();
    this.rightCarLights.mesh.position.setX(
      options.roadWidth / 2 + options.islandWidth / 2
    );
    this.leftSticks.init();
    this.leftSticks.mesh.position.setX(
      -(options.roadWidth + options.islandWidth / 2)
    );

    this.container.addEventListener("mousedown", this.onMouseDown);
    this.container.addEventListener("mouseup", this.onMouseUp);
    this.container.addEventListener("mouseout", this.onMouseUp);

    this.tick();
  }

  onMouseDown(ev: MouseEvent) {
    if (this.options.onSpeedUp) this.options.onSpeedUp(ev);
    this.fovTarget = this.options.fovSpeedUp;
    this.speedUpTarget = this.options.speedUp;
  }

  onMouseUp(ev: MouseEvent) {
    if (this.options.onSlowDown) this.options.onSlowDown(ev);
    this.fovTarget = this.options.fov;
    this.speedUpTarget = 0;
  }

  update(delta: number) {
    const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
    this.speedUp += lerp(
      this.speedUp,
      this.speedUpTarget,
      lerpPercentage,
      0.00001
    );
    this.timeOffset += this.speedUp * delta;

    const time = this.clock.elapsedTime + this.timeOffset;

    this.rightCarLights.update(time);
    this.leftCarLights.update(time);
    this.leftSticks.update(time);
    this.road.update(time);

    let updateCamera = false;
    const fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
    if (fovChange !== 0) {
      this.camera.fov += fovChange * delta * 6;
      updateCamera = true;
    }

    // If the distortion object has a getJS function, use it for camera lookAt
    if (
      this.options.distortion &&
      typeof this.options.distortion !== "string" &&
      this.options.distortion.getJS
    ) {
      const distortion = this.options.distortion.getJS(0.025, time);
      this.camera.lookAt(
        new THREE.Vector3(
          this.camera.position.x + distortion.x,
          this.camera.position.y + distortion.y,
          this.camera.position.z + distortion.z
        )
      );
      updateCamera = true;
    }
    if (updateCamera) {
      this.camera.updateProjectionMatrix();
    }

    if (this.options.isHyper) {
      console.log(this.options.isHyper);
    }
  }

  render(delta: number) {
    this.composer.render(delta);
  }

  dispose() {
    this.disposed = true;
  }

  setSize(width: number, height: number, updateStyles: boolean) {
    this.composer.setSize(width, height, updateStyles);
  }

  tick() {
    if (this.disposed) return;
    if (resizeRendererToDisplaySize(this.renderer, this.setSize)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    const delta = this.clock.getDelta();
    this.render(delta);
    this.update(delta);
    requestAnimationFrame(this.tick.bind(this));
  }
}

class CarLights {
  webgl: App;
  options: HyperspeedOptions;
  colors: THREE.Color[];
  speed: [number, number];
  fade: THREE.Vector2;
  mesh!: THREE.Mesh;

  constructor(
    webgl: App,
    options: HyperspeedOptions,
    colors: number | number[],
    speed: [number, number],
    fade: THREE.Vector2
  ) {
    this.webgl = webgl;
    this.options = options;
    if (Array.isArray(colors)) {
      this.colors = colors.map((c) => new THREE.Color(c));
    } else {
      this.colors = [new THREE.Color(colors)];
    }
    this.speed = speed;
    this.fade = fade;
  }

  init() {
    const options = this.options;
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    );
    const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
    const instanced = new THREE.InstancedBufferGeometry().copy(geometry);
    instanced.instanceCount = options.lightPairsPerRoadWay * 2;

    const laneWidth = options.roadWidth / options.lanesPerRoad;
    const aOffset: number[] = [];
    const aMetrics: number[] = [];
    const aColor: number[] = [];

    for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
      const radius = random(options.carLightsRadius);
      const length = random(options.carLightsLength);
      const speedVal = random(this.speed);

      const carLane = i % options.lanesPerRoad;
      let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;

      const carWidth = random(options.carWidthPercentage) * laneWidth;
      const carShiftX = random(options.carShiftX) * laneWidth;
      laneX += carShiftX;

      const offsetY = random(options.carFloorSeparation) + radius * 1.3;
      const offsetZ = -random(options.length);

      aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
      aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);

      aMetrics.push(radius, length, speedVal);
      aMetrics.push(radius, length, speedVal);

      const color = pickRandom(this.colors);
      aColor.push(color.r, color.g, color.b);
      aColor.push(color.r, color.g, color.b);
    }

    instanced.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false)
    );
    instanced.setAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false)
    );
    instanced.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false)
    );

    const material = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex,
      transparent: true,
      uniforms: Object.assign(
        {
          uTime: { value: 0 },
          uTravelLength: { value: options.length },
          uFade: { value: this.fade },
        },
        this.webgl.fogUniforms,
        (this.options.distortion as Distortion).uniforms
      ),
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        (this.options.distortion as Distortion).getDistortion
      );
    };

    const mesh = new THREE.Mesh(instanced, material);
    mesh.frustumCulled = false;
    this.webgl.scene.add(mesh);
    this.mesh = mesh;
  }

  update(time: number) {
    (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
  }
}

class LightsSticks {
  webgl: App;
  options: HyperspeedOptions;
  mesh!: THREE.Mesh;

  constructor(webgl: App, options: HyperspeedOptions) {
    this.webgl = webgl;
    this.options = options;
  }

  init() {
    const options = this.options;
    const geometry = new THREE.PlaneGeometry(1, 1);
    const instanced = new THREE.InstancedBufferGeometry().copy(geometry);
    const totalSticks = options.totalSideLightSticks;
    instanced.instanceCount = totalSticks;

    const stickoffset = options.length / (totalSticks - 1);
    const aOffset: number[] = [];
    const aColor: number[] = [];
    const aMetrics: number[] = [];

    const colorObj = new THREE.Color(options.colors.sticks);

    for (let i = 0; i < totalSticks; i++) {
      const width = random(options.lightStickWidth);
      const height = random(options.lightStickHeight);
      aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random());
      aColor.push(colorObj.r, colorObj.g, colorObj.b);
      aMetrics.push(width, height);
    }

    instanced.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false)
    );
    instanced.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false)
    );
    instanced.setAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false)
    );

    const material = new THREE.ShaderMaterial({
      fragmentShader: sideSticksFragment,
      vertexShader: sideSticksVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(
        {
          uTravelLength: { value: options.length },
          uTime: { value: 0 },
        },
        this.webgl.fogUniforms,
        (this.options.distortion as Distortion).uniforms
      ),
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        (this.options.distortion as Distortion).getDistortion
      );
    };

    const mesh = new THREE.Mesh(instanced, material);
    mesh.frustumCulled = false;
    this.webgl.scene.add(mesh);
    this.mesh = mesh;
  }

  update(time: number) {
    (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
  }
}

class Road {
  webgl: App;
  options: HyperspeedOptions;
  uTime: { value: number } = { value: 0 };

  leftRoadWay!: THREE.Mesh;
  rightRoadWay!: THREE.Mesh;
  island!: THREE.Mesh;

  constructor(webgl: App, options: HyperspeedOptions) {
    this.webgl = webgl;
    this.options = options;
  }

  createPlane(side: number, width: number, isRoad: boolean): THREE.Mesh {
    const options = this.options;
    const segments = 100;
    const geometry = new THREE.PlaneGeometry(
      isRoad ? options.roadWidth : options.islandWidth,
      options.length,
      20,
      segments
    );
    let uniforms: { [key: string]: any } = {
      uTravelLength: { value: options.length },
      uColor: {
        value: new THREE.Color(
          isRoad ? options.colors.roadColor : options.colors.islandColor
        ),
      },
      uTime: this.uTime,
    };

    if (isRoad) {
      uniforms = Object.assign(uniforms, {
        uLanes: { value: options.lanesPerRoad },
        uBrokenLinesColor: {
          value: new THREE.Color(options.colors.brokenLines),
        },
        uShoulderLinesColor: {
          value: new THREE.Color(options.colors.shoulderLines),
        },
        uShoulderLinesWidthPercentage: {
          value: options.shoulderLinesWidthPercentage,
        },
        uBrokenLinesLengthPercentage: {
          value: options.brokenLinesLengthPercentage,
        },
        uBrokenLinesWidthPercentage: {
          value: options.brokenLinesWidthPercentage,
        },
      });
    }

    const material = new THREE.ShaderMaterial({
      fragmentShader: isRoad ? roadFragment : islandFragment,
      vertexShader: roadVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(
        uniforms,
        this.webgl.fogUniforms,
        (this.options.distortion as Distortion).uniforms
      ),
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        (this.options.distortion as Distortion).getDistortion
      );
    };

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = -options.length / 2;
    mesh.position.x +=
      (this.options.islandWidth / 2 + options.roadWidth / 2) * side;
    this.webgl.scene.add(mesh);

    return mesh;
  }

  init() {
    this.leftRoadWay = this.createPlane(-1, this.options.roadWidth, true);
    this.rightRoadWay = this.createPlane(1, this.options.roadWidth, true);
    this.island = this.createPlane(0, this.options.islandWidth, false);
  }

  update(time: number) {
    this.uTime.value = time;
  }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────

const Hyperspeed: React.FC<HyperspeedProps> = ({
  effectOptions = defaultEffectOptions,
}) => {
  const hyperspeedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Uniforms for various distortions
    const mountainUniforms = {
      uFreq: { value: new THREE.Vector3(3, 6, 10) },
      uAmp: { value: new THREE.Vector3(30, 30, 20) },
    };

    const xyUniforms = {
      uFreq: { value: new THREE.Vector2(5, 2) },
      uAmp: { value: new THREE.Vector2(25, 15) },
    };

    const LongRaceUniforms = {
      uFreq: { value: new THREE.Vector2(2, 3) },
      uAmp: { value: new THREE.Vector2(35, 10) },
    };

    const turbulentUniforms = {
      uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
      uAmp: { value: new THREE.Vector4(25, 5, 10, 10) },
    };

    const deepUniforms = {
      uFreq: { value: new THREE.Vector2(4, 8) },
      uAmp: { value: new THREE.Vector2(10, 20) },
      uPowY: { value: new THREE.Vector2(20, 2) },
    };

    // Define distortions
    const distortions: { [key: string]: Distortion } = {
      mountainDistortion: {
        uniforms: mountainUniforms,
        getDistortion: `
          uniform vec3 uAmp;
          uniform vec3 uFreq;
          #define PI 3.14159265358979
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          vec3 getDistortion(float progress){
            float movementProgressFix = 0.02;
            return vec3( 
              cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
              nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
              nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
            );
          }
        `,
        getJS: (progress: number, time: number): THREE.Vector3 => {
          const movementProgressFix = 0.02;
          const uFreq = mountainUniforms.uFreq.value;
          const uAmp = mountainUniforms.uAmp.value;
          const distortion = new THREE.Vector3(
            Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
              Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
            nsin(progress * Math.PI * uFreq.y + time) * uAmp.y -
              nsin(movementProgressFix * Math.PI * uFreq.y + time) * uAmp.y,
            nsin(progress * Math.PI * uFreq.z + time) * uAmp.z -
              nsin(movementProgressFix * Math.PI * uFreq.z + time) * uAmp.z
          );
          const lookAtAmp = new THREE.Vector3(2, 2, 2);
          const lookAtOffset = new THREE.Vector3(0, 0, -5);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        },
      },
      xyDistortion: {
        uniforms: xyUniforms,
        getDistortion: `
          uniform vec2 uFreq;
          uniform vec2 uAmp;
          #define PI 3.14159265358979
          vec3 getDistortion(float progress){
            float movementProgressFix = 0.02;
            return vec3( 
              cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
              sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
              0.
            );
          }
        `,
        getJS: (progress: number, time: number): THREE.Vector3 => {
          const movementProgressFix = 0.02;
          const uFreq = xyUniforms.uFreq.value;
          const uAmp = xyUniforms.uAmp.value;
          const distortion = new THREE.Vector3(
            Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
              Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
            Math.sin(progress * Math.PI * uFreq.y + time + Math.PI / 2) *
              uAmp.y -
              Math.sin(
                movementProgressFix * Math.PI * uFreq.y + time + Math.PI / 2
              ) *
                uAmp.y,
            0
          );
          const lookAtAmp = new THREE.Vector3(2, 0.4, 1);
          const lookAtOffset = new THREE.Vector3(0, 0, -3);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        },
      },
      LongRaceDistortion: {
        uniforms: LongRaceUniforms,
        getDistortion: `
          uniform vec2 uFreq;
          uniform vec2 uAmp;
          #define PI 3.14159265358979
          vec3 getDistortion(float progress){
            float camProgress = 0.0125;
            return vec3( 
              sin(progress * PI * uFreq.x + uTime) * uAmp.x - sin(camProgress * PI * uFreq.x + uTime) * uAmp.x,
              sin(progress * PI * uFreq.y + uTime) * uAmp.y - sin(camProgress * PI * uFreq.y + uTime) * uAmp.y,
              0.
            );
          }
        `,
        getJS: (progress: number, time: number): THREE.Vector3 => {
          const camProgress = 0.0125;
          const uFreq = LongRaceUniforms.uFreq.value;
          const uAmp = LongRaceUniforms.uAmp.value;
          const distortion = new THREE.Vector3(
            Math.sin(progress * Math.PI * uFreq.x + time) * uAmp.x -
              Math.sin(camProgress * Math.PI * uFreq.x + time) * uAmp.x,
            Math.sin(progress * Math.PI * uFreq.y + time) * uAmp.y -
              Math.sin(camProgress * Math.PI * uFreq.y + time) * uAmp.y,
            0
          );
          const lookAtAmp = new THREE.Vector3(1, 1, 0);
          const lookAtOffset = new THREE.Vector3(0, 0, -5);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        },
      },
      turbulentDistortion: {
        uniforms: turbulentUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              cos(PI * progress * uFreq.r + uTime) * uAmp.r +
              pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
            );
          }
          float getDistortionY(float progress){
            return (
              -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
              -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.0125),
              getDistortionY(progress) - getDistortionY(0.0125),
              0.
            );
          }
        `,
        getJS: (progress: number, time: number): THREE.Vector3 => {
          const uFreq = turbulentUniforms.uFreq.value;
          const uAmp = turbulentUniforms.uAmp.value;
          const getX = (p: number) =>
            Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
            Math.pow(
              Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)),
              2
            ) *
              uAmp.y;
          const getY = (p: number) =>
            -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
            Math.pow(
              nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)),
              5
            ) *
              uAmp.w;
          const distortion = new THREE.Vector3(
            getX(progress) - getX(progress + 0.007),
            getY(progress) - getY(progress + 0.007),
            0
          );
          const lookAtAmp = new THREE.Vector3(-2, -5, 0);
          const lookAtOffset = new THREE.Vector3(0, 0, -10);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        },
      },
      turbulentDistortionStill: {
        uniforms: turbulentUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              cos(PI * progress * uFreq.r) * uAmp.r +
              pow(cos(PI * progress * uFreq.g * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
            );
          }
          float getDistortionY(float progress){
            return (
              -nsin(PI * progress * uFreq.b) * uAmp.b +
              -pow(nsin(PI * progress * uFreq.a / (uFreq.b / uAmp.a)), 5.) * uAmp.a
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.02),
              0.
            );
          }
        `,
      },
      deepDistortionStill: {
        uniforms: deepUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          uniform vec2 uPowY;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              sin(progress * PI * uFreq.x) * uAmp.x * 2.
            );
          }
          float getDistortionY(float progress){
            return (
              pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y) * uAmp.y
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.05),
              0.
            );
          }
        `,
      },
      deepDistortion: {
        uniforms: deepUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          uniform vec2 uPowY;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              sin(progress * PI * uFreq.x + uTime) * uAmp.x
            );
          }
          float getDistortionY(float progress){
            return (
              pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y + uTime) * uAmp.y
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.02),
              0.
            );
          }
        `,
        getJS: (progress: number, time: number): THREE.Vector3 => {
          const uFreq = deepUniforms.uFreq.value;
          const uAmp = deepUniforms.uAmp.value;
          const uPowY = deepUniforms.uPowY.value;
          const getX = (p: number) =>
            Math.sin(p * Math.PI * uFreq.x + time) * uAmp.x;
          const getY = (p: number) =>
            Math.pow(p * uPowY.x, uPowY.y) +
            Math.sin(p * Math.PI * uFreq.y + time) * uAmp.y;
          const distortion = new THREE.Vector3(
            getX(progress) - getX(progress + 0.01),
            getY(progress) - getY(progress + 0.01),
            0
          );
          const lookAtAmp = new THREE.Vector3(-2, -4, 0);
          const lookAtOffset = new THREE.Vector3(0, 0, -10);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        },
      },
    };

    // Immediately initialize the app
    const container = document.getElementById(
      "lights"
    ) as HTMLDivElement | null;
    if (!container) return;
    // Replace the distortion string with the corresponding preset
    effectOptions.distortion = distortions[effectOptions.distortion as string];
    const myApp = new App(container, effectOptions);
    myApp.loadAssets().then(() => myApp.init());
  }, [effectOptions]);

  const textRef = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  useEffect(() => {
    const glitchLetter = () => {
      const text = "HASH2.0";
      const randomIndex = Math.floor(Math.random() * text.length);
      const letter = textRef.current[`letter-${randomIndex}`];

      if (letter) {
        letter.style.animation = "glitch 0.3s ease";
        setTimeout(() => {
          letter.style.animation = "";
        }, 300);
      }
    };

    const interval = setInterval(glitchLetter, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        id="lights"
        className="flex items-center justify-center"
        ref={hyperspeedRef}
      >
        <div className="absolute z-10 flex flex-col justify-end min-h-fit px-4 sm:px-6 lg:px-8 md:w-5/6">
          <div className="w-full p-5 max-w-[90%] xl:max-w-[1200px] mx-auto">
            <div className="w-full overflow-hidden">
              <h1
                className="text-5xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-wider whitespace-nowrap mb-5"
                style={{ fontFamily: "Chakra Petch, sans-serif" }}
              >
                <span className="text-red-600 inline-block">
                  {"HASH".split("").map((char, i) => (
                    <span
                      key={i}
                      ref={(el) => {
                        textRef.current[`letter-${i}`] = el;
                      }}
                      className="hover:text-red-400 transition-colors duration-300 inline-block"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="text-white inline-block ml-4">
                  {"2.0".split("").map((char, i) => (
                    <span
                      key={i}
                      ref={(el) => {
                        textRef.current[`letter-${i + 4}`] = el;
                      }}
                      className="hover:text-red-50 transition-colors duration-300 inline-block"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </h1>
            </div>
            {/* ... rest of your return code ... */}
            {/* Event Details */}
            <div className="space-y-2 mb-4 text-gray-200">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-red-600" />
                <span className="text-sm">February 15, 2025</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-red-600" />
                <span className="text-sm">
                  Mar Baselios Christian College of Engineering and Technology
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-6 text-shadow leading-relaxed max-w-2xl">
              Experience the future of technology at the ultimate
              techno-cultural fest of{" "}
              <b>Computer Science and Engineering Department</b> where AI,
              robotics, and innovation converge.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                className="group flex items-center justify-center bg-red-600 text-white rounded px-6 py-2.5 hover:bg-red-700 transition-all active:scale-95"
                onClick={() => {
                  const eventEl = document.getElementById("events");
                  if (eventEl) {
                    window.scrollTo({
                      top: eventEl.offsetTop,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <Play className="w-4 h-4 mr-2" fill="currentColor" />
                <span className="text-sm font-medium">Events</span>
              </button>
              <button
                onClick={() => {
                  window.open("https://www.instagram.com/hashtech2.0");
                }}
                className="group flex items-center justify-center bg-black/50 backdrop-blur-sm text-white rounded px-6 py-2.5 border border-white/20 hover:bg-white/10 transition-all active:scale-95"
              >
                <Info className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">More Info</span>
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="text-xs px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded border border-white/20 text-gray-300">
                Techno-Cultural Events
              </span>
              <span className="text-xs px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded border border-white/20 text-gray-300">
                Robotics Expo
              </span>
              <span className="text-xs px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded border border-white/20 text-gray-300">
                Online & Offline Events
              </span>
              <span className="text-xs px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded border border-white/20 text-gray-300">
                Pro-Show
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hyperspeed;

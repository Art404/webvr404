// Various global THREE.Objects.
let skybox, scene, cube, controls, effect, camera
// Various global vr objects.
let vrDisplay, vrButton
// Last time the scene was rendered.
let lastRenderTime = 0
// Currently active VRDisplay, how big of a box to render.
const boxSize = 5


function onLoad() {
  // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
  // Only enable it if you actually need to.
  const renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio)

  // Append the canvas element created by the renderer to document body element.
  document.body.appendChild(renderer.domElement)

  // Create a three.js scene.
  scene = new THREE.Scene()

  // Create a three.js camera.
  const aspect = window.innerWidth / window.innerHeight
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000)

  controls = new THREE.VRControls(camera)
  controls.standing = true
  camera.position.y = controls.userHeight

  // Apply VR stereo rendering to renderer.
  effect = new THREE.VREffect(renderer)
  effect.setSize(window.innerWidth, window.innerHeight)

  // Add a repeating grid as a skybox.
  const loader = new THREE.TextureLoader()
  loader.load('img/box.png', onTextureLoaded)

  // Create 3D objects.
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  const material = new THREE.MeshNormalMaterial()
  cube = new THREE.Mesh(geometry, material)

  // Position cube mesh to be right in front of you.
  cube.position.set(0, controls.userHeight, -1)

  // Add cube mesh to your three.js scene
  scene.add(cube)

  window.addEventListener('resize', onResize, true)
  window.addEventListener('vrdisplaypresentchange', onResize, true)

  // Initialize the WebVR UI.
  const uiOptions = {
    color: 'black',
    background: 'white',
    corners: 'square',
  }

  vrButton = new webvrui.EnterVRButton(renderer.domElement, uiOptions)
  vrButton.on('exit', () => {
    camera.quaternion.set(0, 0, 0, 1)
    camera.position.set(0, controls.userHeight, 0)
  })
  vrButton.on('hide', () => {
    document.getElementById('ui').style.display = 'none'
  })
  vrButton.on('show', () => {
    document.getElementById('ui').style.display = 'inherit'
  })

  document.getElementById('vr-button').appendChild(vrButton.domElement)
  document.getElementById('magic-window').addEventListener('click', () => {
    vrButton.requestEnterFullscreen()
  })
}

function onTextureLoaded(texture) {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(boxSize, boxSize)

  const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x01BE00,
    side: THREE.BackSide,
  });

  // Align the skybox to the floor (which is at y=0).
  skybox = new THREE.Mesh(geometry, material)
  skybox.position.y = boxSize / 2
  scene.add(skybox)

  // For high end VR devices like Vive and Oculus, take into account the stage
  // parameters provided.
  setupStage()
}



// Request animation frame loop function
function animate(timestamp) {
  const delta = Math.min(timestamp - lastRenderTime, 500)
  lastRenderTime = timestamp

  // Apply rotation to cube mesh
  cube.rotation.y += delta * 0.0006

  // Only update controls if we're presenting.
  if (vrButton.isPresenting()) {
    controls.update()
  }
  // Render the scene.
  effect.render(scene, camera)

  vrDisplay.requestAnimationFrame(animate)
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
  navigator.getVRDisplays().then(displays => {
    if (displays.length > 0) {
      vrDisplay = displays[0]
      if (vrDisplay.stageParameters) {
        setStageDimensions(vrDisplay.stageParameters)
      }
      vrDisplay.requestAnimationFrame(animate)
    }
  })
}

function setStageDimensions(stage) {
  // Make the skybox fit the stage.
  const material = skybox.material
  scene.remove(skybox)

  // Size the skybox according to the size of the actual stage.
  const geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ)
  skybox = new THREE.Mesh(geometry, material);

  // Place it on the floor.
  skybox.position.y = boxSize / 2
  scene.add(skybox)

  // Place the cube in the middle of the scene, at user height.
  cube.position.set(0, controls.userHeight, 0)
}

window.addEventListener('load', onLoad)

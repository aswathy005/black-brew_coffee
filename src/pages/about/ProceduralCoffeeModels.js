import * as THREE from 'three';

/**
 * Procedural 3D Models for BLACK & BREW About Us Experience
 * Color Theme: Signature Black & Yellow / Warm Gold (#FFC928)
 */

// 1. Procedural Coffee Bean Geometry with authentic longitudinal center crease
export function createCoffeeBeanGeometry(radius = 0.44) {
  const geom = new THREE.SphereGeometry(radius, 32, 24);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Elongate along Y axis for bean silhouette
    y *= 1.45;
    // Flatten slightly along X axis
    x *= 0.88;

    // Center longitudinal groove (crease) on the front face (z > 0)
    if (z > 0) {
      const distFromCenterSeam = Math.abs(x) / (radius * 0.88);
      const creaseDepth = Math.exp(-distFromCenterSeam * 5.0) * (radius * 0.46);
      z = Math.max(0.02, z - creaseDepth);
    }

    pos.setXYZ(i, x, y, z);
  }

  geom.computeVertexNormals();
  return geom;
}

// 2. High-quality roasted bean PBR material
export function createRoastedBeanMaterial(customColor = 0x24140b) {
  return new THREE.MeshStandardMaterial({
    color: customColor,
    roughness: 0.32,
    metalness: 0.12,
    transparent: true,
    opacity: 1.0,
  });
}

// Raw unroasted green bean material (for roasting transition)
export function createRawBeanMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x629c42, // vivid fresh green bean
    roughness: 0.55,
    metalness: 0.05,
    transparent: true,
    opacity: 1.0,
  });
}

// Procedural Crema & Espresso Disc Texture
function createCremaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background espresso dark base
  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
  grad.addColorStop(0, '#ffd25a'); // golden heart / latte art center
  grad.addColorStop(0.24, '#e08f2a'); // rich hazelnut crema
  grad.addColorStop(0.55, '#8c4814'); // toasted amber rim
  grad.addColorStop(0.85, '#3a1a08'); // dark espresso ring
  grad.addColorStop(1.0, '#150a04');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Micro-foam swirls
  ctx.save();
  ctx.translate(256, 256);
  ctx.rotate(0.35);

  ctx.strokeStyle = 'rgba(255, 240, 200, 0.55)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0.2, Math.PI * 1.6);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 215, 120, 0.38)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0.8, Math.PI * 1.85);
  ctx.stroke();

  // Swirl heart latte art stroke in center
  ctx.fillStyle = 'rgba(255, 248, 225, 0.88)';
  ctx.beginPath();
  ctx.moveTo(0, 48);
  ctx.bezierCurveTo(-50, 12, -60, -48, 0, -22);
  ctx.bezierCurveTo(60, -48, 50, 12, 0, 48);
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// 3. Procedural Coffee Cup & Saucer Group (SIGNATURE BLACK & YELLOW BRAND THEME)
export function createCoffeeCupGroup() {
  const group = new THREE.Group();
  group.name = 'CoffeeCupGroup';

  // Signature Radiant Brand Yellow Ceramic Body (#FFC928)
  const yellowCeramicMat = new THREE.MeshStandardMaterial({
    color: 0xffc928, // Signature BLACK & BREW Warm Gold/Yellow
    roughness: 0.22,
    metalness: 0.35,
    transparent: true,
    opacity: 1.0,
  });

  // Polished 24K Gold Rim Accent
  const goldRimMat = new THREE.MeshStandardMaterial({
    color: 0xffe277,
    roughness: 0.12,
    metalness: 0.96,
  });

  // Obsidian Black Base & Saucer Accent
  const blackAccentMat = new THREE.MeshStandardMaterial({
    color: 0x141414,
    roughness: 0.3,
    metalness: 0.2,
  });

  // Cup Body via LatheGeometry
  const cupPoints = [];
  cupPoints.push(new THREE.Vector2(0, 0));
  cupPoints.push(new THREE.Vector2(0.85, 0));
  cupPoints.push(new THREE.Vector2(0.98, 0.18));
  cupPoints.push(new THREE.Vector2(1.22, 1.15));
  cupPoints.push(new THREE.Vector2(1.36, 1.82));
  cupPoints.push(new THREE.Vector2(1.38, 1.94)); // outer rim lip
  cupPoints.push(new THREE.Vector2(1.29, 1.94)); // inner rim
  cupPoints.push(new THREE.Vector2(1.20, 1.25));
  cupPoints.push(new THREE.Vector2(0.92, 0.26));
  cupPoints.push(new THREE.Vector2(0.82, 0.14));
  cupPoints.push(new THREE.Vector2(0, 0.14));

  const cupGeom = new THREE.LatheGeometry(cupPoints, 48);
  const cupMesh = new THREE.Mesh(cupGeom, yellowCeramicMat);
  cupMesh.castShadow = true;
  cupMesh.receiveShadow = true;
  group.add(cupMesh);

  // Gleaming Gold Rim Ring at the lip
  const rimGeom = new THREE.TorusGeometry(1.335, 0.05, 16, 48);
  rimGeom.rotateX(Math.PI / 2);
  rimGeom.translate(0, 1.93, 0);
  const rimMesh = new THREE.Mesh(rimGeom, goldRimMat);
  group.add(rimMesh);

  // Obsidian Black Base Ring
  const baseRingGeom = new THREE.TorusGeometry(0.88, 0.04, 16, 48);
  baseRingGeom.rotateX(Math.PI / 2);
  baseRingGeom.translate(0, 0.02, 0);
  const baseRing = new THREE.Mesh(baseRingGeom, blackAccentMat);
  group.add(baseRing);

  // Yellow & Gold Cup Handle
  const handleCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(1.18, 1.55, 0),
    new THREE.Vector3(1.95, 1.55, 0),
    new THREE.Vector3(1.85, 0.65, 0),
    new THREE.Vector3(1.02, 0.65, 0)
  );
  const handleGeom = new THREE.TubeGeometry(handleCurve, 28, 0.095, 14, false);
  const handleMesh = new THREE.Mesh(handleGeom, yellowCeramicMat);
  handleMesh.castShadow = true;
  group.add(handleMesh);

  // Saucer (Obsidian Black with Gold Rim)
  const saucerPoints = [];
  saucerPoints.push(new THREE.Vector2(0, -0.05));
  saucerPoints.push(new THREE.Vector2(1.1, -0.05));
  saucerPoints.push(new THREE.Vector2(2.1, 0.18));
  saucerPoints.push(new THREE.Vector2(2.22, 0.32));
  saucerPoints.push(new THREE.Vector2(2.18, 0.34));
  saucerPoints.push(new THREE.Vector2(2.05, 0.24));
  saucerPoints.push(new THREE.Vector2(1.05, 0.02));
  saucerPoints.push(new THREE.Vector2(0, 0.02));

  const saucerGeom = new THREE.LatheGeometry(saucerPoints, 48);
  const saucerMesh = new THREE.Mesh(saucerGeom, blackAccentMat);
  saucerMesh.position.y = -0.05;
  saucerMesh.receiveShadow = true;
  group.add(saucerMesh);

  // Saucer Gold Rim Accent
  const saucerGoldRimGeom = new THREE.TorusGeometry(2.18, 0.04, 16, 48);
  saucerGoldRimGeom.rotateX(Math.PI / 2);
  saucerGoldRimGeom.translate(0, 0.28, 0);
  const saucerGoldRim = new THREE.Mesh(saucerGoldRimGeom, goldRimMat);
  group.add(saucerGoldRim);

  // Coffee / Crema Liquid Surface Disc
  const cremaTexture = createCremaTexture();
  const cremaMat = new THREE.MeshStandardMaterial({
    map: cremaTexture,
    roughness: 0.32,
    metalness: 0.05,
    emissive: 0x4a2806,
    emissiveIntensity: 0.22,
  });
  const cremaGeom = new THREE.CylinderGeometry(1.24, 1.24, 0.04, 36);
  const cremaMesh = new THREE.Mesh(cremaGeom, cremaMat);
  cremaMesh.position.y = 1.66;
  group.add(cremaMesh);

  return {
    group,
    cupMesh,
    cremaMesh,
    goldRimMesh: rimMesh,
    saucerMesh,
    yellowMat: yellowCeramicMat,
  };
}

// 4. Procedural Rising Steam Particles System
export function createSteamSystem(count = 75) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const radGrad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  radGrad.addColorStop(0, 'rgba(255, 245, 220, 0.85)');
  radGrad.addColorStop(0.35, 'rgba(245, 215, 170, 0.38)');
  radGrad.addColorStop(1, 'rgba(200, 180, 150, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 64, 64);

  const puffTexture = new THREE.CanvasTexture(canvas);

  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const opacities = new Float32Array(count);
  const scales = new Float32Array(count);
  const velocities = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.75;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = 1.7 + Math.random() * 2.2;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    opacities[i] = Math.random() * 0.5 + 0.2;
    scales[i] = Math.random() * 0.4 + 0.2;

    velocities.push({
      vy: 0.012 + Math.random() * 0.015,
      vx: (Math.random() - 0.5) * 0.005,
      vz: (Math.random() - 0.5) * 0.005,
      phase: Math.random() * Math.PI * 2,
    });
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    map: puffTexture,
    size: 0.85,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffeedd,
  });

  const points = new THREE.Points(geom, mat);

  function update(time) {
    const pos = geom.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i);
      let x = pos.getX(i);
      let z = pos.getZ(i);
      const v = velocities[i];

      y += v.vy;
      x += Math.sin(time * 1.8 + v.phase) * 0.006 + v.vx;
      z += Math.cos(time * 1.5 + v.phase) * 0.006 + v.vz;

      // Reset when particle reaches top
      if (y > 4.6) {
        y = 1.7;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.7;
        x = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
      }

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  }

  return { points, update, material: mat };
}

// 5. Procedural Coffee Grinder Mesh (Hopper, Burr Chamber & Chute)
export function createGrinderGroup() {
  const group = new THREE.Group();
  group.name = 'GrinderGroup';

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x181818,
    metalness: 0.8,
    roughness: 0.2,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffc928,
    metalness: 0.92,
    roughness: 0.18,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff8e0,
    transparent: true,
    opacity: 0.55,
    roughness: 0.08,
    transmission: 0.82,
    thickness: 0.35,
  });

  // Clear Hopper (Cone/Cylinder)
  const hopperGeom = new THREE.CylinderGeometry(0.95, 0.42, 1.2, 32, 1, true);
  const hopperMesh = new THREE.Mesh(hopperGeom, glassMat);
  hopperMesh.position.y = 1.6;
  group.add(hopperMesh);

  // Hopper Chrome/Gold Lid
  const lidGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 32);
  const lidMesh = new THREE.Mesh(lidGeom, goldMat);
  lidMesh.position.y = 2.25;
  group.add(lidMesh);

  const lidKnobGeom = new THREE.SphereGeometry(0.16, 16, 16);
  const lidKnob = new THREE.Mesh(lidKnobGeom, goldMat);
  lidKnob.position.y = 2.38;
  group.add(lidKnob);

  // Grinder Collar & Gold Adjustment Ring
  const collarGeom = new THREE.CylinderGeometry(0.58, 0.58, 0.28, 32);
  const collarMesh = new THREE.Mesh(collarGeom, goldMat);
  collarMesh.position.y = 0.9;
  group.add(collarMesh);

  // Grinder Motor Body
  const bodyGeom = new THREE.CylinderGeometry(0.72, 0.78, 1.25, 32);
  const bodyMesh = new THREE.Mesh(bodyGeom, metalMat);
  bodyMesh.position.y = 0.2;
  group.add(bodyMesh);

  // Dispensing Chute (Forward-angled cylinder aiming down)
  const chuteGeom = new THREE.CylinderGeometry(0.16, 0.13, 0.65, 24);
  chuteGeom.rotateX(Math.PI / 4.2);
  const chuteMesh = new THREE.Mesh(chuteGeom, goldMat);
  chuteMesh.position.set(0, 0.05, 0.72);
  group.add(chuteMesh);

  // Burr gear inside (rotates when grinding)
  const burrGeom = new THREE.TorusGeometry(0.32, 0.07, 12, 24);
  burrGeom.rotateX(Math.PI / 2);
  const burrMesh = new THREE.Mesh(burrGeom, metalMat);
  burrMesh.position.y = 0.82;
  group.add(burrMesh);

  return { group, burrMesh, chuteMesh };
}

// 6. Procedural Portafilter Mesh (Walnut Handle, Chrome Head, Filter Basket & Spouts)
export function createPortafilterGroup() {
  const group = new THREE.Group();
  group.name = 'PortafilterGroup';

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xdfdfdf,
    metalness: 0.96,
    roughness: 0.1,
  });

  const walnutMat = new THREE.MeshStandardMaterial({
    color: 0x221106,
    roughness: 0.45,
    metalness: 0.05,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xffc928,
    metalness: 0.9,
    roughness: 0.2,
  });

  // Handle (Tapered wood cylinder)
  const handleGeom = new THREE.CylinderGeometry(0.14, 0.22, 1.7, 24);
  handleGeom.rotateX(Math.PI / 2);
  const handleMesh = new THREE.Mesh(handleGeom, walnutMat);
  handleMesh.position.set(0, 0, -1.2);
  group.add(handleMesh);

  // Gold Handle Ferrule
  const ferruleGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 24);
  ferruleGeom.rotateX(Math.PI / 2);
  const ferruleMesh = new THREE.Mesh(ferruleGeom, goldAccentMat);
  ferruleMesh.position.set(0, 0, -0.32);
  group.add(ferruleMesh);

  // Portafilter Head Cylinder
  const headGeom = new THREE.CylinderGeometry(0.72, 0.72, 0.48, 32);
  const headMesh = new THREE.Mesh(headGeom, chromeMat);
  group.add(headMesh);

  // Filter Basket Lip
  const basketLipGeom = new THREE.TorusGeometry(0.75, 0.05, 16, 32);
  basketLipGeom.rotateX(Math.PI / 2);
  basketLipGeom.translate(0, 0.24, 0);
  const basketLip = new THREE.Mesh(basketLipGeom, goldAccentMat);
  group.add(basketLip);

  // Coffee bed surface inside portafilter (deep ground coffee color)
  const groundsBedMat = new THREE.MeshStandardMaterial({
    color: 0x1f1108,
    roughness: 0.88,
    metalness: 0.02,
  });
  const groundsBedGeom = new THREE.CylinderGeometry(0.68, 0.68, 0.05, 32);
  const groundsBed = new THREE.Mesh(groundsBedGeom, groundsBedMat);
  groundsBed.position.y = 0.21;
  group.add(groundsBed);

  // Double Chrome Spouts underneath
  const spoutLeftGeom = new THREE.CylinderGeometry(0.07, 0.05, 0.38, 16);
  spoutLeftGeom.rotateZ(-0.25);
  const spoutLeft = new THREE.Mesh(spoutLeftGeom, chromeMat);
  spoutLeft.position.set(-0.18, -0.38, 0);
  group.add(spoutLeft);

  const spoutRightGeom = new THREE.CylinderGeometry(0.07, 0.05, 0.38, 16);
  spoutRightGeom.rotateZ(0.25);
  const spoutRight = new THREE.Mesh(spoutRightGeom, chromeMat);
  spoutRight.position.set(0.18, -0.38, 0);
  group.add(spoutRight);

  return { group, groundsBed, headMesh, handleMesh };
}

// 7. Golden Espresso Pouring Stream (Smooth viscous liquid stream)
export function createEspressoStream() {
  const curve = new THREE.LineCurve3(
    new THREE.Vector3(0, 0.5, 0),
    new THREE.Vector3(0, -0.4, 0)
  );
  const streamGeom = new THREE.TubeGeometry(curve, 20, 0.055, 12, false);
  const streamMat = new THREE.MeshStandardMaterial({
    color: 0xdf8428, // radiant honey espresso
    roughness: 0.12,
    metalness: 0.15,
    emissive: 0x9a480e,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.95,
  });

  const streamMesh = new THREE.Mesh(streamGeom, streamMat);
  streamMesh.name = 'EspressoStream';
  return { streamMesh, streamMat };
}

// 8. Ground Coffee Shower Particles (falling from grinder to portafilter)
export function createGroundsParticles(count = 90) {
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 1] = Math.random() * 0.9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    velocities.push({
      vy: 0.025 + Math.random() * 0.035,
    });
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x4a2612,
    size: 0.075,
    transparent: true,
    opacity: 0.9,
  });

  const points = new THREE.Points(geom, mat);

  function update() {
    const pos = geom.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - velocities[i].vy;
      if (y < 0) {
        y = 0.9;
      }
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  }

  return { points, update, material: mat };
}

// 9. Floating Ambient Dust Motes & Golden Bokeh (Cafe Atmosphere)
export function createAmbientDustMotes(count = 130) {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 2, 16, 16, 15);
  g.addColorStop(0, 'rgba(255, 220, 130, 0.95)');
  g.addColorStop(0.5, 'rgba(255, 185, 60, 0.45)');
  g.addColorStop(1, 'rgba(255, 185, 60, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);

  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const phases = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    phases.push({
      speedX: (Math.random() - 0.5) * 0.003,
      speedY: 0.002 + Math.random() * 0.004,
      speedZ: (Math.random() - 0.5) * 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    map: texture,
    size: 0.4,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geom, mat);

  function update(time) {
    const pos = geom.attributes.position;
    for (let i = 0; i < count; i++) {
      let x = pos.getX(i) + Math.sin(time + phases[i].phase) * 0.002;
      let y = pos.getY(i) + phases[i].speedY;
      let z = pos.getZ(i) + Math.cos(time + phases[i].phase) * 0.002;

      if (y > 5.0) y = -5.0;

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  }

  return { points, update, material: mat };
}

// 10. Warm Amber Cafe Pendant Lamp (Visible directly above table in Chapter 5)
export function createPendantLampGroup() {
  const group = new THREE.Group();
  group.name = 'PendantLamp';

  const cordGeom = new THREE.CylinderGeometry(0.015, 0.015, 2.5, 8);
  const cordMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const cord = new THREE.Mesh(cordGeom, cordMat);
  cord.position.y = 1.25;
  group.add(cord);

  const shadeGeom = new THREE.ConeGeometry(0.72, 0.55, 24, 1, true);
  shadeGeom.rotateX(Math.PI);
  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0x181818,
    metalness: 0.85,
    roughness: 0.22,
  });
  const shade = new THREE.Mesh(shadeGeom, shadeMat);
  group.add(shade);

  // Glowing warm amber bulb
  const bulbGeom = new THREE.SphereGeometry(0.18, 16, 16);
  const bulbMat = new THREE.MeshBasicMaterial({
    color: 0xffe277,
  });
  const bulb = new THREE.Mesh(bulbGeom, bulbMat);
  bulb.position.y = -0.1;
  group.add(bulb);

  // Point light from bulb casting downward cone
  const lampLight = new THREE.PointLight(0xffbe44, 3.2, 8);
  lampLight.position.set(0, -0.15, 0);
  group.add(lampLight);

  return group;
}


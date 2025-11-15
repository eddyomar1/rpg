// three-setup.js - Configuración de Three.js para la batalla 3D

class Battle3DScene {
    constructor(containerId, initialPlayerType = 'warrior') {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.playerModel = null;
        this.enemyModel = null;
        this.ground = null;
        this.lights = [];
        this.particles = [];
        this.playerType = initialPlayerType;
        this.baseCameraHeight = 5;
        this.zoomDistance = 15;
        this.minZoom = 6;
        this.maxZoom = 28;
        this.cameraTarget = new THREE.Vector3(0, 2, 0);
        this.shakeIntensity = 0;
        this.shakeEnd = 0;
        this.playerBaseX = -10;
        this.enemyBaseX = 10;
        this.playerCurrentX = this.playerBaseX;
        this.enemyCurrentX = this.enemyBaseX;
        this.playerForwardLimit = -2;
        this.playerBackwardLimit = -18;
        this.playerMoveStep = 1.2;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        
        this.initScene();
    }

    initScene() {
        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 100, 200);

        // Crear cámara
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.updateCameraPosition(false);

        // Crear renderizador
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Agregar luces
        this.setupLights();

        // Crear suelo
        this.createGround();

        // Crear personajes
        this.createPlayerModel(this.playerType);

        // Animar
        this.animate();

        // Manejar redimensionamiento
        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        if (!this.camera) return;
        if (window.activeBattleView && window.activeBattleView !== '3d') return;
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.movePlayer(true);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.movePlayer(false);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.adjustZoom(-1);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.adjustZoom(1);
        }
    }

    movePlayer(forward = true) {
        if (!this.playerModel) return;
        const direction = forward ? 1 : -1;
        const nextX = this.playerCurrentX + (direction * this.playerMoveStep);
        this.playerCurrentX = Math.min(
            this.playerForwardLimit,
            Math.max(this.playerBackwardLimit, nextX)
        );
        this.playerModel.position.x = this.playerCurrentX;
    }

    cameraShake(intensity = 0.25, duration = 250) {
        this.shakeIntensity = intensity;
        this.shakeEnd = Date.now() + duration;
    }

    adjustZoom(delta) {
        const newDistance = this.zoomDistance + delta;
        this.zoomDistance = Math.min(this.maxZoom, Math.max(this.minZoom, newDistance));
        this.updateCameraPosition(false);
        this.camera.updateProjectionMatrix();
    }

    updateCameraPosition(applyShake = false) {
        if (!this.camera) return;
        let offsetX = 0;
        let offsetY = 0;
        let offsetZ = 0;
        if (applyShake && this.shakeEnd > Date.now()) {
            offsetX = (Math.random() - 0.5) * this.shakeIntensity;
            offsetY = (Math.random() - 0.5) * this.shakeIntensity * 0.4;
            offsetZ = (Math.random() - 0.5) * this.shakeIntensity;
        }
        this.camera.position.set(
            offsetX,
            this.baseCameraHeight + offsetY,
            this.zoomDistance + offsetZ
        );
        this.camera.lookAt(this.cameraTarget);
    }

    setupLights() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // Luz direccional (sol)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(20, 20, 20);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -30;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.top = 30;
        directionalLight.shadow.camera.bottom = -30;
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);

        // Luz puntual roja (efecto dramático)
        const pointLight = new THREE.PointLight(0xff6b6b, 0.5, 50);
        pointLight.position.set(-15, 10, 10);
        this.scene.add(pointLight);
        this.lights.push(pointLight);

        // Luz puntual azul (efecto dramático)
        const pointLight2 = new THREE.PointLight(0x667eea, 0.5, 50);
        pointLight2.position.set(15, 10, 10);
        this.scene.add(pointLight2);
        this.lights.push(pointLight2);
    }

    createGround() {
        // Crear plano de batalla
        const groundGeometry = new THREE.PlaneGeometry(40, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3e,
            metalness: 0.3,
            roughness: 0.7
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.castShadow = true;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);

        // Agregar línea de batalla
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array([
            -20, 0.01, 0,
            20, 0.01, 0
        ]);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffd93d, linewidth: 3 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);
    }

    cleanupModel(model) {
        if (!model) return;
        this.scene.remove(model);
        model.traverse(child => {
            if (child.geometry && child.geometry.dispose) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose && mat.dispose());
                } else if (child.material.dispose) {
                    child.material.dispose();
                }
            }
        });
    }

    createPlayerModel(playerType = 'warrior') {
        this.playerType = playerType;
        if (this.playerModel) {
            this.cleanupModel(this.playerModel);
        }

        // Crear modelo dinámico según la clase
        this.playerModel = createPlayerCharacter(playerType);
        this.playerCurrentX = this.playerBaseX;
        this.playerModel.position.set(this.playerCurrentX, 0, 0);
        this.scene.add(this.playerModel);
        
        // Crear controlador de animaciones
        this.playerAnimController = new AnimationController(this.scene, this.playerModel, true);
    }

    createEnemyModel(enemyData) {
        if (this.enemyModel) {
            this.cleanupModel(this.enemyModel);
            this.enemyModel = null;
        }

        if (!enemyData) return;

        // Crear modelo dinámico según el tipo de enemigo
        this.enemyModel = createEnemyCharacter(enemyData);
        this.enemyCurrentX = this.enemyBaseX;
        this.enemyModel.position.set(this.enemyCurrentX, 0, 0);
        this.scene.add(this.enemyModel);
        
        // Crear controlador de animaciones
        this.enemyAnimController = new AnimationController(this.scene, this.enemyModel, false);
    }

    setPlayerCharacter(playerType) {
        this.createPlayerModel(playerType);
    }

    // Animaciones de batalla
    animateAttack(attacker) {
        const controller = attacker === 'player' ? this.playerAnimController : this.enemyAnimController;
        if (!controller) return;

        controller.attackAnimation();
        const target = attacker === 'player' ? this.enemyModel : this.playerModel;
        const source = attacker === 'player' ? this.playerModel : this.enemyModel;
        if (target) {
            this.createImpactParticles(target.position);
            this.createShockwave(target.position, attacker === 'player' ? 0xfff176 : 0xff6b6b, 4);
            this.createLightPulse(target.position, attacker === 'player' ? 0xffde68 : 0xff6e6e);
        }
        if (source) {
            this.createSlashEffect(source, attacker === 'player');
        }
        this.cameraShake(attacker === 'player' ? 0.45 : 0.3, 260);
    }

    animateSkill(attacker) {
        const controller = attacker === 'player' ? this.playerAnimController : this.enemyAnimController;
        if (!controller) return;

        controller.skillAnimation();
        const target = attacker === 'player' ? this.enemyModel : this.playerModel;
        const source = attacker === 'player' ? this.playerModel : this.enemyModel;
        if (target) {
            this.createMagicParticles(target.position, attacker === 'player' ? 0x667eea : 0xff6b6b);
            this.createShockwave(target.position, attacker === 'player' ? 0x8c9eff : 0xff8a65, 6);
        }
        if (source) {
            this.createAura(source, attacker === 'player' ? 0x9ab3ff : 0xffa38a, 1.4, 550);
            this.createLightPulse(source.position, attacker === 'player' ? 0x94b9ff : 0xffa37b);
        }
        this.cameraShake(0.5, 320);
    }

    animateHeal(healer) {
        const controller = healer === 'player' ? this.playerAnimController : this.enemyAnimController;
        if (!controller) return;

        controller.healAnimation();
        const source = healer === 'player' ? this.playerModel : this.enemyModel;
        if (source) {
            this.createHealParticles(source.position);
            this.createAura(source, 0x66ffad, 1.3, 650);
            this.createLightPulse(source.position, 0x4effc6);
        }
    }

    animateDefend(defender) {
        const controller = defender === 'player' ? this.playerAnimController : this.enemyAnimController;
        if (!controller) return;

        controller.defendAnimation();
        const source = defender === 'player' ? this.playerModel : this.enemyModel;
        if (source) {
            this.createShieldEffect(source.position);
            this.createShockwave(source.position, 0x8ea8ff, 3);
            this.createAura(source, 0xb2c4ff, 1.8, 700);
        }
    }

    createImpactParticles(position) {
        const particleCount = 18;
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle(position, {
                color: Math.random() > 0.5 ? 0xff6b6b : 0xffed4e,
                size: Math.random() * 0.3 + 0.1,
                speed: Math.random() * 0.2 + 0.1
            });
            this.particles.push(particle);
        }
    }

    createMagicParticles(position, color) {
        const particleCount = 24;
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle(position, {
                color: color,
                size: Math.random() * 0.2 + 0.1,
                speed: Math.random() * 0.15 + 0.05
            });
            this.particles.push(particle);
        }
    }

    createHealParticles(position) {
        const particleCount = 18;
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle(position, {
                color: 0x4caf50,
                size: Math.random() * 0.25 + 0.1,
                speed: Math.random() * 0.1 + 0.05
            });
            this.particles.push(particle);
        }
    }

    createShieldEffect(position) {
        const shieldGeometry = new THREE.IcosahedronGeometry(2, 4);
        const shieldMaterial = new THREE.MeshBasicMaterial({
            color: 0x667eea,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        shield.position.copy(position);
        this.scene.add(shield);

        // Animar y remover
        let opacity = 0.5;
        const interval = setInterval(() => {
            opacity -= 0.05;
            shieldMaterial.opacity = opacity;
            shield.rotation.x += 0.05;
            shield.rotation.y += 0.05;

            if (opacity <= 0) {
                clearInterval(interval);
                this.scene.remove(shield);
            }
        }, 30);
    }

    createSlashEffect(model, towardEnemy) {
        if (!model) return;
        const geometry = new THREE.PlaneGeometry(0.25, 2.8);
        const material = new THREE.MeshBasicMaterial({
            color: towardEnemy ? 0xfff59d : 0xff867c,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        const slash = new THREE.Mesh(geometry, material);
        slash.position.copy(model.position).add(new THREE.Vector3(towardEnemy ? 1 : -1, 1.2, 0));
        slash.rotation.y = towardEnemy ? 0 : Math.PI;
        slash.rotation.x = Math.PI / 4;
        this.scene.add(slash);

        const start = Date.now();
        const duration = 220;
        const animateSlash = () => {
            const progress = (Date.now() - start) / duration;
            if (progress >= 1) {
                this.scene.remove(slash);
                geometry.dispose();
                material.dispose();
                return;
            }
            slash.position.x += towardEnemy ? 0.35 : -0.35;
            slash.rotation.z += towardEnemy ? -0.25 : 0.25;
            material.opacity = 0.9 * (1 - progress);
            requestAnimationFrame(animateSlash);
        };
        animateSlash();
    }

    createShockwave(position, color = 0xffffff, scale = 4) {
        const geometry = new THREE.RingGeometry(0.5, 0.8, 32);
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(position.x, 0.05, position.z);
        this.scene.add(ring);

        const start = Date.now();
        const duration = 450;
        const animateRing = () => {
            const progress = (Date.now() - start) / duration;
            if (progress >= 1) {
                this.scene.remove(ring);
                geometry.dispose();
                material.dispose();
                return;
            }
            const grow = 1 + (scale * progress);
            ring.scale.set(grow, grow, grow);
            material.opacity = 0.7 * (1 - progress);
            requestAnimationFrame(animateRing);
        };
        animateRing();
    }

    createAura(model, color = 0xffffff, baseScale = 1.4, duration = 600) {
        if (!model) return;
        const geometry = new THREE.SphereGeometry(baseScale, 20, 20);
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.35,
            wireframe: true
        });
        const aura = new THREE.Mesh(geometry, material);
        aura.position.copy(model.position).add(new THREE.Vector3(0, 1.2, 0));
        this.scene.add(aura);

        const start = Date.now();
        const animateAura = () => {
            const progress = (Date.now() - start) / duration;
            if (progress >= 1) {
                this.scene.remove(aura);
                geometry.dispose();
                material.dispose();
                return;
            }
            aura.scale.setScalar(1 + progress * 0.8);
            material.opacity = 0.35 * (1 - progress);
            requestAnimationFrame(animateAura);
        };
        animateAura();
    }

    createLightPulse(position, color = 0xffffff) {
        const light = new THREE.PointLight(color, 1.5, 18);
        light.position.copy(position).add(new THREE.Vector3(0, 2, 0));
        this.scene.add(light);
        const start = Date.now();
        const duration = 320;
        const animateLight = () => {
            const progress = (Date.now() - start) / duration;
            if (progress >= 1) {
                this.scene.remove(light);
                return;
            }
            light.intensity = 1.5 * (1 - progress);
            requestAnimationFrame(animateLight);
        };
        animateLight();
    }

    createParticle(position, config) {
        const geometry = new THREE.SphereGeometry(config.size, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: config.color });
        const particle = new THREE.Mesh(geometry, material);
        
        particle.position.copy(position);
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            Math.random() * 0.2 + 0.1,
            (Math.random() - 0.5) * 0.3
        );
        particle.life = 60; // frames

        this.scene.add(particle);
        return particle;
    }

    lerp(object, property, start, end, duration, callback) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            if (property === 'position') {
                object.position.lerpVectors(start, end, progress);
            } else if (property === 'positionY') {
                object.position.y = start + (end - start) * progress;
            } else if (property === 'scaleY') {
                object.scale.y = start + (end - start) * progress;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };
        animate();
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.position.add(particle.velocity);
            particle.velocity.y -= 0.01; // gravedad
            particle.life--;

            if (particle.life <= 0) {
                this.scene.remove(particle);
                this.particles.splice(i, 1);
            }
        }
    }

    updateModels(playerData, enemyData) {
        // Actualizar posición según HP
        if (!this.playerModel || !this.enemyModel || !playerData || !enemyData) return;

        const playerHealthPercent = playerData.hp / playerData.maxHp;
        const enemyHealthPercent = enemyData.hp / enemyData.maxHp;

        // Pequeña animación de daño (temblor)
        if (playerHealthPercent < 0.5) {
            this.playerModel.position.x = this.playerCurrentX + Math.sin(Date.now() * 0.01) * 0.2;
        } else {
            this.playerModel.position.x = this.playerCurrentX;
        }

        if (enemyHealthPercent < 0.5) {
            this.enemyModel.position.x = this.enemyCurrentX + Math.sin(Date.now() * 0.01) * 0.2;
        } else {
            this.enemyModel.position.x = this.enemyCurrentX;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Actualizar partículas
        this.updateParticles();

        const applyingShake = this.shakeEnd && Date.now() < this.shakeEnd;
        this.updateCameraPosition(!!applyingShake);

        // Rotar luces para efecto dinámico
        this.lights[1].position.x = Math.sin(Date.now() * 0.001) * 25;

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // Cambiar ícono del modelo
    updateCharacterIcon(isPlayer, newIcon) {
        // Aquí podrías actualizar el modelo con diferentes estilos
        // Por ahora es una demostración
    }
}

// Crear instancia global
let battle3DScene = null;

function initializeBattle3D(playerType = 'warrior') {
    if (typeof THREE === 'undefined') {
        console.warn('THREE.js no está disponible, usando vista 2D únicamente.');
        setBattleView && setBattleView('2d', true);
        return;
    }

    if (!battle3DScene) {
        battle3DScene = new Battle3DScene('battleArena3D', playerType);
    } else {
        battle3DScene.setPlayerCharacter(playerType);
    }
}

function animate3DAttack(attacker) {
    if (battle3DScene) battle3DScene.animateAttack(attacker);
}

function animate3DSkill(attacker) {
    if (battle3DScene) battle3DScene.animateSkill(attacker);
}

function animate3DHeal(healer) {
    if (battle3DScene) battle3DScene.animateHeal(healer);
}

function animate3DDefend(defender) {
    if (battle3DScene) battle3DScene.animateDefend(defender);
}

function update3DModels(playerData, enemyData) {
    if (battle3DScene) battle3DScene.updateModels(playerData, enemyData);
}

// three-setup.js - Configuración de Three.js para la batalla 3D

class Battle3DScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.playerModel = null;
        this.enemyModel = null;
        this.ground = null;
        this.lights = [];
        this.particles = [];
        
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
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 2, 0);

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
        this.createPlayerModel();
        this.createEnemyModel();

        // Animar
        this.animate();

        // Manejar redimensionamiento
        window.addEventListener('resize', () => this.onWindowResize());
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

    createPlayerModel(playerType = 'warrior') {
        // Crear modelo dinámico según la clase
        this.playerModel = createPlayerCharacter(playerType);
        this.playerModel.position.set(-10, 0, 0);
        this.scene.add(this.playerModel);
        
        // Crear controlador de animaciones
        this.playerAnimController = new AnimationController(this.scene, this.playerModel, true);
    }

    createEnemyModel(enemyData) {
        // Crear modelo dinámico según el tipo de enemigo
        this.enemyModel = createEnemyCharacter(enemyData);
        this.enemyModel.position.set(10, 0, 0);
        this.scene.add(this.enemyModel);
        
        // Crear controlador de animaciones
        this.enemyAnimController = new AnimationController(this.scene, this.enemyModel, false);
    }

    // Animaciones de batalla
    animateAttack(attacker) {
        const controller = attacker === 'player' ? this.playerAnimController : this.enemyAnimController;
        if (controller) {
            controller.attackAnimation();
            this.createImpactParticles(
                attacker === 'player' ? this.enemyModel.position : this.playerModel.position
            );
        }
    }

    animateSkill(attacker) {
        const controller = attacker === 'player' ? this.playerAnimController : this.enemyAnimController;
        if (controller) {
            controller.skillAnimation();
            const targetPos = attacker === 'player' ? this.enemyModel.position : this.playerModel.position;
            this.createMagicParticles(targetPos, attacker === 'player' ? 0x667eea : 0xff6b6b);
        }
    }

    animateHeal(healer) {
        const controller = healer === 'player' ? this.playerAnimController : this.enemyAnimController;
        if (controller) {
            controller.healAnimation();
            this.createHealParticles(
                healer === 'player' ? this.playerModel.position : this.enemyModel.position
            );
        }
    }

    animateDefend(defender) {
        const controller = defender === 'player' ? this.playerAnimController : this.enemyAnimController;
        if (controller) {
            controller.defendAnimation();
            this.createShieldEffect(
                defender === 'player' ? this.playerModel.position : this.enemyModel.position
            );
        }
    }

    createImpactParticles(position) {
        const particleCount = 10;
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
        const particleCount = 15;
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
        const particleCount = 12;
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
        const playerHealthPercent = playerData.hp / playerData.maxHp;
        const enemyHealthPercent = enemyData.hp / enemyData.maxHp;

        // Pequeña animación de daño (temblor)
        if (playerHealthPercent < 0.5) {
            this.playerModel.position.x = -10 + Math.sin(Date.now() * 0.01) * 0.2;
        } else {
            this.playerModel.position.x = -10;
        }

        if (enemyHealthPercent < 0.5) {
            this.enemyModel.position.x = 10 + Math.sin(Date.now() * 0.01) * 0.2;
        } else {
            this.enemyModel.position.x = 10;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Actualizar partículas
        this.updateParticles();

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

function initializeBattle3D() {
    battle3DScene = new Battle3DScene('battleArena3D');
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

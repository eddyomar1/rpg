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

    createPlayerModel() {
        const group = new THREE.Group();
        group.position.set(-10, 0, 0);

        // Cuerpo
        const bodyGeometry = new THREE.BoxGeometry(2, 3, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x667eea,
            metalness: 0.5,
            roughness: 0.5
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.y = 1.5;
        group.add(body);

        // Cabeza
        const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4a261,
            metalness: 0.2,
            roughness: 0.6
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.receiveShadow = true;
        head.position.y = 3.2;
        group.add(head);

        // Brazo izquierdo
        const armGeometry = new THREE.BoxGeometry(0.8, 2, 0.6);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0x667eea,
            metalness: 0.5,
            roughness: 0.5
        });
        const armLeft = new THREE.Mesh(armGeometry, armMaterial);
        armLeft.castShadow = true;
        armLeft.position.set(-1.3, 2, 0);
        group.add(armLeft);

        // Brazo derecho
        const armRight = new THREE.Mesh(armGeometry, armMaterial);
        armRight.castShadow = true;
        armRight.position.set(1.3, 2, 0);
        group.add(armRight);

        // Arma (espada)
        const swordGeometry = new THREE.BoxGeometry(0.3, 3, 0.8);
        const swordMaterial = new THREE.MeshStandardMaterial({
            color: 0xffed4e,
            metalness: 0.8,
            roughness: 0.2
        });
        const sword = new THREE.Mesh(swordGeometry, swordMaterial);
        sword.castShadow = true;
        sword.position.set(1.5, 2, 0.5);
        sword.rotation.z = Math.PI / 4;
        group.add(sword);

        this.playerModel = group;
        this.scene.add(group);
    }

    createEnemyModel() {
        const group = new THREE.Group();
        group.position.set(10, 0, 0);

        // Cuerpo
        const bodyGeometry = new THREE.BoxGeometry(2.5, 3.5, 1.2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            metalness: 0.4,
            roughness: 0.6
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.y = 1.75;
        group.add(body);

        // Cabeza
        const headGeometry = new THREE.SphereGeometry(1, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xd63031,
            metalness: 0.2,
            roughness: 0.7
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.receiveShadow = true;
        head.position.y = 3.5;
        group.add(head);

        // Brazo izquierdo
        const armGeometry = new THREE.BoxGeometry(1, 2.5, 0.8);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            metalness: 0.4,
            roughness: 0.6
        });
        const armLeft = new THREE.Mesh(armGeometry, armMaterial);
        armLeft.castShadow = true;
        armLeft.position.set(-1.6, 2.5, 0);
        group.add(armLeft);

        // Brazo derecho
        const armRight = new THREE.Mesh(armGeometry, armMaterial);
        armRight.castShadow = true;
        armRight.position.set(1.6, 2.5, 0);
        group.add(armRight);

        // Cuernos
        const hornGeometry = new THREE.ConeGeometry(0.3, 1, 8);
        const hornMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d2d44,
            metalness: 0.6,
            roughness: 0.3
        });
        const hornLeft = new THREE.Mesh(hornGeometry, hornMaterial);
        hornLeft.position.set(-0.5, 4.2, 0);
        group.add(hornLeft);

        const hornRight = new THREE.Mesh(hornGeometry, hornMaterial);
        hornRight.position.set(0.5, 4.2, 0);
        group.add(hornRight);

        this.enemyModel = group;
        this.scene.add(group);
    }

    // Animaciones de batalla
    animateAttack(attacker) {
        const target = attacker === 'player' ? this.enemyModel : this.playerModel;
        const attacker3d = attacker === 'player' ? this.playerModel : this.enemyModel;

        this.tweenAttack(attacker3d, target);
        this.createImpactParticles(target.position);
    }

    animateSkill(attacker) {
        const target = attacker === 'player' ? this.enemyModel : this.playerModel;
        const attacker3d = attacker === 'player' ? this.playerModel : this.enemyModel;

        this.tweenSkill(attacker3d, target);
        this.createMagicParticles(target.position, attacker === 'player' ? 0x667eea : 0xff6b6b);
    }

    animateHeal(healer) {
        const target = healer === 'player' ? this.playerModel : this.enemyModel;
        this.createHealParticles(target.position);
    }

    animateDefend(defender) {
        const target = defender === 'player' ? this.playerModel : this.enemyModel;
        this.tweenDefend(target);
        this.createShieldEffect(target.position);
    }

    tweenAttack(attacker, target) {
        const originalPos = attacker.position.clone();
        const direction = target.position.clone().sub(attacker.position).normalize();
        
        // Avanzar
        setTimeout(() => {
            const startPos = attacker.position.clone();
            const endPos = startPos.clone().add(direction.multiplyScalar(3));
            this.lerp(attacker, 'position', startPos, endPos, 300, () => {
                // Retroceder
                this.lerp(attacker, 'position', endPos, originalPos, 300);
            });
        }, 0);
    }

    tweenSkill(attacker, target) {
        // Levantarse
        const originalY = attacker.position.y;
        this.lerp(attacker, 'positionY', originalY, originalY + 2, 300, () => {
            this.lerp(attacker, 'positionY', originalY + 2, originalY, 300);
        });
    }

    tweenDefend(defender) {
        const originalScale = defender.scale.clone();
        this.lerp(defender, 'scaleY', 1, 0.8, 200, () => {
            this.lerp(defender, 'scaleY', 0.8, 1, 200);
        });
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

// animations.js - Sistema de animaciones 3D para personajes

class AnimationController {
    constructor(scene, character, isPlayer = true) {
        this.scene = scene;
        this.character = character;
        this.isPlayer = isPlayer;
        this.isAnimating = false;
        this.animations = [];
    }

    // Animación de ataque genérica
    attackAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const characterType = this.character.characterType;
        const originalPos = this.character.position.clone();
        const targetDir = this.isPlayer ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(-1, 0, 0);

        // Avanzar rápidamente
        this.tweenPosition(
            this.character,
            originalPos,
            originalPos.clone().add(targetDir.multiplyScalar(3)),
            200
        );

        // Rotar arma (brazo/arma)
        const weapon = this.character.getObjectByName('weapon');
        if (weapon) {
            const originalRotZ = weapon.rotation.z;
            this.tweenRotation(weapon, 'z', originalRotZ, originalRotZ + Math.PI / 2, 150, () => {
                this.tweenRotation(weapon, 'z', originalRotZ + Math.PI / 2, originalRotZ, 150);
            });
        }

        // Animar brazos
        const armRight = this.character.getObjectByName('armRight');
        if (armRight) {
            const originalRotZ = armRight.rotation.z;
            this.tweenRotation(armRight, 'z', originalRotZ, -Math.PI / 3, 150, () => {
                this.tweenRotation(armRight, 'z', -Math.PI / 3, originalRotZ, 150);
            });
        }

        // Retroceder
        setTimeout(() => {
            this.tweenPosition(
                this.character,
                this.character.position.clone(),
                originalPos,
                250,
                () => {
                    this.isAnimating = false;
                }
            );
        }, 350);
    }

    // Animación de habilidad especial
    skillAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const characterType = this.character.characterType;

        if (characterType === 'warrior') {
            this.warriorSkillAnimation();
        } else if (characterType === 'mage') {
            this.mageSkillAnimation();
        } else if (characterType === 'archer') {
            this.archerSkillAnimation();
        } else if (characterType === 'paladin') {
            this.paladinSkillAnimation();
        }

        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }

    warriorSkillAnimation() {
        // Levantarse y girar
        const originalY = this.character.position.y;
        this.tweenPosition(
            this.character,
            new THREE.Vector3(this.character.position.x, originalY, this.character.position.z),
            new THREE.Vector3(this.character.position.x, originalY + 2, this.character.position.z),
            200
        );

        this.tweenRotation(this.character, 'y', 0, Math.PI * 2, 400);

        setTimeout(() => {
            this.tweenPosition(
                this.character,
                new THREE.Vector3(this.character.position.x, originalY + 2, this.character.position.z),
                new THREE.Vector3(this.character.position.x, originalY, this.character.position.z),
                200
            );
        }, 400);
    }

    mageSkillAnimation() {
        // Hacer flotar el orbe mágico
        const orbe = this.character.getObjectByName('orbe');
        const ring = this.character.getObjectByName('ring');
        const star = this.character.getObjectByName('star');

        if (orbe) {
            const originalPos = orbe.position.clone();
            const targetPos = originalPos.clone().add(new THREE.Vector3(2, 2, 0));
            this.tweenPosition(orbe, originalPos, targetPos, 300, () => {
                this.tweenPosition(orbe, targetPos, originalPos, 300);
            });
        }

        if (ring) {
            this.tweenRotation(ring, 'y', 0, Math.PI * 2, 300);
        }

        if (star) {
            this.tweenRotation(star, 'x', 0, Math.PI * 2, 300);
            this.tweenRotation(star, 'y', 0, Math.PI * 2, 300);
        }

        // Brillar
        if (orbe && orbe.material) {
            orbe.material.emissiveIntensity = 1;
            setTimeout(() => {
                orbe.material.emissiveIntensity = 0.5;
            }, 300);
        }
    }

    archerSkillAnimation() {
        // Tensar arco
        const bow = this.character.getObjectByName('weapon');
        const armLeft = this.character.getObjectByName('armLeft');

        if (bow) {
            const originalRotZ = bow.rotation.z;
            this.tweenRotation(bow, 'z', originalRotZ, originalRotZ + Math.PI / 4, 200, () => {
                this.tweenRotation(bow, 'z', originalRotZ + Math.PI / 4, originalRotZ, 200);
            });
        }

        if (armLeft) {
            const originalRotZ = armLeft.rotation.z;
            this.tweenRotation(armLeft, 'z', originalRotZ, Math.PI / 3, 200, () => {
                this.tweenRotation(armLeft, 'z', Math.PI / 3, originalRotZ, 200);
            });
        }
    }

    paladinSkillAnimation() {
        // Brillar con luz divina
        const jewel = this.character.getObjectByName('jewel');
        const shield = this.character.getObjectByName('shield');

        if (jewel && jewel.material) {
            const originalIntensity = jewel.material.emissiveIntensity;
            jewel.material.emissiveIntensity = 1;
            this.tweenRotation(jewel, 'x', 0, Math.PI * 2, 400);
            this.tweenRotation(jewel, 'y', 0, Math.PI * 2, 400);

            setTimeout(() => {
                jewel.material.emissiveIntensity = originalIntensity;
            }, 400);
        }

        if (shield) {
            this.tweenScale(shield, 1, 1.3, 200, () => {
                this.tweenScale(shield, 1.3, 1, 200);
            });
        }
    }

    // Animación de curación
    healAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const originalPos = this.character.position.y;
        
        // Flotar hacia arriba
        this.tweenPosition(
            this.character,
            new THREE.Vector3(this.character.position.x, originalPos, this.character.position.z),
            new THREE.Vector3(this.character.position.x, originalPos + 1.5, this.character.position.z),
            250,
            () => {
                this.tweenPosition(
                    this.character,
                    new THREE.Vector3(this.character.position.x, originalPos + 1.5, this.character.position.z),
                    new THREE.Vector3(this.character.position.x, originalPos, this.character.position.z),
                    250,
                    () => {
                        this.isAnimating = false;
                    }
                );
            }
        );

        // Girar suavemente
        this.tweenRotation(this.character, 'y', 0, Math.PI * 2, 500);
    }

    // Animación de defensa
    defendAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const shield = this.character.getObjectByName('shield');
        
        // Escudo hacia adelante
        if (shield) {
            const originalPos = shield.position.clone();
            const targetPos = originalPos.clone().add(new THREE.Vector3(0.5, 0, 0));
            
            this.tweenPosition(shield, originalPos, targetPos, 200, () => {
                this.tweenPosition(shield, targetPos, originalPos, 400, () => {
                    this.isAnimating = false;
                });
            });

            // Escudo brilla
            if (shield.material) {
                const originalOpacity = shield.material.opacity || 1;
                shield.material.opacity = 0.5;
                setTimeout(() => {
                    shield.material.opacity = originalOpacity;
                }, 300);
            }
        } else {
            // Si no hay escudo, agachar
            const originalY = this.character.position.y;
            this.tweenScale(this.character, 1, 0.8, 200, () => {
                this.tweenScale(this.character, 0.8, 1, 400, () => {
                    this.isAnimating = false;
                });
            });
        }
    }

    // Animación de daño recibido
    damageAnimation() {
        const originalPos = this.character.position.clone();
        
        // Retroceso
        const pushDir = this.isPlayer ? -1 : 1;
        const targetPos = originalPos.clone().add(new THREE.Vector3(pushDir * 1.5, 0, 0));
        
        this.tweenPosition(this.character, originalPos, targetPos, 100, () => {
            this.tweenPosition(this.character, targetPos, originalPos, 150);
        });

        // Temblor rápido
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.character.position.x += (Math.random() - 0.5) * 0.3;
                this.character.position.y += (Math.random() - 0.5) * 0.3;
            }, i * 50);
        }
    }

    // Animación de victoria/derrota
    victoryAnimation() {
        // Levantarse y levantar brazos
        const originalY = this.character.position.y;
        const armLeft = this.character.getObjectByName('armLeft');
        const armRight = this.character.getObjectByName('armRight');

        this.tweenPosition(
            this.character,
            new THREE.Vector3(this.character.position.x, originalY, this.character.position.z),
            new THREE.Vector3(this.character.position.x, originalY + 1, this.character.position.z),
            300
        );

        if (armLeft) {
            this.tweenRotation(armLeft, 'z', armLeft.rotation.z, Math.PI / 2, 300);
        }
        if (armRight) {
            this.tweenRotation(armRight, 'z', armRight.rotation.z, -Math.PI / 2, 300);
        }

        // Girar celebrando
        this.tweenRotation(this.character, 'y', 0, Math.PI * 2, 800);
    }

    defeatAnimation() {
        // Caer
        const originalY = this.character.position.y;
        this.tweenPosition(
            this.character,
            new THREE.Vector3(this.character.position.x, originalY, this.character.position.z),
            new THREE.Vector3(this.character.position.x, -5, this.character.position.z),
            1000
        );

        // Desvanecerse
        this.tweenOpacity(this.character, 1, 0, 1000);
    }

    // Utilidades de tweening
    tweenPosition(object, start, end, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            object.position.lerpVectors(start, end, progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };
        animate();
    }

    tweenRotation(object, axis, start, end, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            object.rotation[axis] = start + (end - start) * progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };
        animate();
    }

    tweenScale(object, start, end, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const scale = start + (end - start) * progress;
            object.scale.set(scale, scale, scale);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };
        animate();
    }

    tweenOpacity(object, start, end, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            object.traverse(child => {
                if (child.material) {
                    child.material.opacity = start + (end - start) * progress;
                    child.material.transparent = true;
                }
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };
        animate();
    }
}

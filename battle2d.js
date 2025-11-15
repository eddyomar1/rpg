if (typeof CanvasRenderingContext2D !== 'undefined' && CanvasRenderingContext2D.prototype && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        this.moveTo(x + r, y);
        this.lineTo(x + width - r, y);
        this.quadraticCurveTo(x + width, y, x + width, y + r);
        this.lineTo(x + width, y + height - r);
        this.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        this.lineTo(x + r, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        return this;
    };
}

const CLASS_COLOR_MAP = {
    warrior: '#6ab7ff',
    mage: '#ba68c8',
    archer: '#66bb6a',
    paladin: '#ffca80'
};
const ENEMY_COLOR_MAP = {
    Goblin: '#ff8a65',
    Orco: '#f06292',
    'Dragón Menor': '#ffb74d',
    'Caballero Oscuro': '#90a4ae',
    'Hechicero Maligno': '#9575cd',
    'Bestia de Fuego': '#ef5350'
};

class Battle2DScene {
    constructor(canvasId, initialPlayerType = 'warrior') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.playerType = initialPlayerType;
        this.playerIcon = '⚔️';
        this.enemyIcon = '👹';
        this.playerColor = CLASS_COLOR_MAP[initialPlayerType] || '#6ab7ff';
        this.enemyColor = '#ff6b6b';
        this.playerStats = null;
        this.enemyStats = null;
        this.effects = [];
        this.particles = [];
        this.hitFlash = { player: 0, enemy: 0 };
        this.playerOffset = 0;
        this.maxForward = 120;
        this.backwardLimit = -60;
        this.moveStep = 15;
        this.groundY = 0;
        this.basePlayerX = 0;
        this.baseEnemyX = 0;
        this.lastFrame = 0;
        this.charStates = {
            player: { pose: 'idle', timer: 0 },
            enemy: { pose: 'idle', timer: 0 }
        };

        this.resize = this.resize.bind(this);
        this.loop = this.loop.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        window.addEventListener('resize', this.resize);
        document.addEventListener('keydown', this.handleKeyDown);

        this.resize();
        requestAnimationFrame(this.loop);
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.basePlayerX = this.canvas.width * 0.2;
        this.baseEnemyX = this.canvas.width * 0.8;
        this.groundY = this.canvas.height * 0.72;
    }

    handleKeyDown(event) {
        if (window.activeBattleView && window.activeBattleView !== '2d') return;
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.movePlayer(true);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.movePlayer(false);
        }
    }

    movePlayer(forward = true) {
        const direction = forward ? 1 : -1;
        this.playerOffset = Math.min(
            this.maxForward,
            Math.max(this.backwardLimit, this.playerOffset + (direction * this.moveStep))
        );
    }

    setPlayerCharacter(type, icon = '⚔️') {
        this.playerType = type;
        this.playerIcon = icon;
        this.playerColor = CLASS_COLOR_MAP[type] || '#6ab7ff';
    }

    createEnemy(enemyData) {
        if (!enemyData) return;
        this.enemyIcon = enemyData.icon || '👹';
        this.enemyColor = ENEMY_COLOR_MAP[enemyData.name] || '#ff6b6b';
    }

    updateModels(playerData, enemyData) {
        this.playerStats = playerData;
        this.enemyStats = enemyData;
    }

    animateAttack(attacker) {
        const targetPos = this.getCharacterPosition(attacker === 'player' ? 'enemy' : 'player');
        this.flashDamage(attacker === 'player' ? 'enemy' : 'player');
        this.spawnParticles(targetPos.x, targetPos.y, attacker === 'player' ? '#ffd54f' : '#ff8a80', 14);
        this.effects.push({
            type: 'slash',
            owner: attacker,
            x: targetPos.x,
            y: targetPos.y,
            life: 1
        });
        this.setPose(attacker, 'attack', 380);
    }

    animateSkill(attacker) {
        const pos = this.getCharacterPosition(attacker);
        this.effects.push({
            type: 'burst',
            owner: attacker,
            x: pos.x,
            y: pos.y,
            life: 1
        });
        const target = attacker === 'player' ? 'enemy' : 'player';
        const targetPos = this.getCharacterPosition(target);
        this.flashDamage(target);
        this.spawnParticles(targetPos.x, targetPos.y, attacker === 'player' ? '#90caf9' : '#ffab91', 18);
        this.setPose(attacker, 'skill', 420);
    }

    animateHeal(healer) {
        const pos = this.getCharacterPosition(healer);
        this.effects.push({
            type: 'heal',
            owner: healer,
            x: pos.x,
            y: pos.y,
            life: 1
        });
        this.setPose(healer, 'heal', 500);
    }

    animateDefend(defender) {
        const pos = this.getCharacterPosition(defender);
        this.effects.push({
            type: 'shield',
            owner: defender,
            x: pos.x,
            y: pos.y,
            life: 1
        });
        this.setPose(defender, 'defend', 500);
    }

    setPose(side, pose, duration = 400) {
        this.charStates[side] = { pose, timer: duration };
    }

    flashDamage(target) {
        this.hitFlash[target] = 220;
    }

    spawnParticles(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * -3 - 1,
                life: 1,
                color
            });
        }
    }

    getCharacterPosition(side) {
        const bob = Math.sin(Date.now() * 0.002) * 4;
        const y = this.groundY - 40 + bob;
        if (side === 'player') {
            return { x: this.basePlayerX + this.playerOffset, y };
        }
        return { x: this.baseEnemyX, y };
    }

    loop(timestamp) {
        if (!this.ctx) return;
        const delta = this.lastFrame ? (timestamp - this.lastFrame) : 16;
        this.lastFrame = timestamp;

        this.renderScene(delta);
        requestAnimationFrame(this.loop);
    }

    renderScene(delta) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground(ctx);
        this.drawGround(ctx);
        this.drawCharacter(ctx, 'player', delta);
        this.drawCharacter(ctx, 'enemy', delta);
        this.drawHUD(ctx);
        this.drawEffects(ctx, delta);
        this.updateParticles(ctx, delta);

        this.hitFlash.player = Math.max(0, this.hitFlash.player - delta);
        this.hitFlash.enemy = Math.max(0, this.hitFlash.enemy - delta);

        ['player', 'enemy'].forEach(side => {
            if (this.charStates[side].timer > 0) {
                this.charStates[side].timer -= delta;
                if (this.charStates[side].timer <= 0) {
                    this.charStates[side] = { pose: 'idle', timer: 0 };
                }
            }
        });
    }

    drawBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGround(ctx) {
        ctx.fillStyle = '#0b1020';
        ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.basePlayerX, this.groundY);
        ctx.lineTo(this.baseEnemyX, this.groundY);
        ctx.stroke();
    }

    drawCharacter(ctx, side, delta) {
        const pos = this.getCharacterPosition(side);
        const isPlayer = side === 'player';
        const color = isPlayer ? this.playerColor : this.enemyColor;
        const pose = this.charStates[side]?.pose || 'idle';
        const headR = 26;
        const bodyHeight = 70;
        const bodyWidth = 46;
        const bob = Math.sin(Date.now() * 0.004) * 2;
        const offsetY = pose === 'defend' ? -2 : 0;
        const lean = pose === 'attack' ? (isPlayer ? 0.15 : -0.15) : pose === 'defend' ? (isPlayer ? -0.1 : 0.1) : 0;

        ctx.save();
        ctx.translate(pos.x, pos.y + offsetY);
        ctx.rotate(lean);

        // Glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;

        // Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(-bodyWidth / 2, -bodyHeight, bodyWidth, bodyHeight, 14);
        ctx.fill();

        // Armor/robe stripe
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.roundRect(-bodyWidth / 4, -bodyHeight, bodyWidth / 2, bodyHeight, 10);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.fillStyle = '#f2e0c5';
        ctx.arc(0, -bodyHeight - headR + bob, headR, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#0f141c';
        ctx.beginPath();
        ctx.arc(-8, -bodyHeight - headR + bob - 4, 3, 0, Math.PI * 2);
        ctx.arc(8, -bodyHeight - headR + bob - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        // Class accent
        ctx.fillStyle = isPlayer ? '#ffffffaa' : '#ffb3b3';
        ctx.beginPath();
        ctx.moveTo(-bodyWidth / 2, -bodyHeight + 8);
        ctx.lineTo(bodyWidth / 2, -bodyHeight + 8);
        ctx.lineTo(0, -bodyHeight - 10);
        ctx.closePath();
        ctx.fill();

        // Arms
        ctx.strokeStyle = '#f2e0c5';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const armRaise = pose === 'attack' ? -14 : pose === 'skill' ? -18 : pose === 'defend' ? -6 : -2;
        const armSpread = pose === 'heal' ? 22 : 16;
        ctx.moveTo(-armSpread, -bodyHeight + 10);
        ctx.lineTo(-armSpread - (pose === 'heal' ? 6 : 2), -bodyHeight + 30 + armRaise);
        ctx.moveTo(armSpread, -bodyHeight + 10);
        ctx.lineTo(armSpread + (pose === 'heal' ? 6 : 2), -bodyHeight + 30 + armRaise);
        ctx.stroke();

        // Weapon/shield
        if (pose === 'defend') {
            ctx.strokeStyle = isPlayer ? '#8cb3ff' : '#ff8a8a';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(0, -bodyHeight + 24, 32, Math.PI * 0.1, Math.PI * 1.9);
            ctx.stroke();
        } else {
            ctx.fillStyle = isPlayer ? '#ffd54f' : '#ff8a80';
            ctx.beginPath();
            const swordX = isPlayer ? bodyWidth / 2 + 6 : -bodyWidth / 2 - 6;
            ctx.moveTo(swordX, -bodyHeight + 6);
            ctx.lineTo(swordX + (isPlayer ? 18 : -18), -bodyHeight + 28);
            ctx.lineTo(swordX, -bodyHeight + 50);
            ctx.closePath();
            ctx.fill();
        }

        // Skill staff/gem
        if (this.playerType === 'mage' && isPlayer) {
            ctx.fillStyle = '#b39ddb';
            ctx.beginPath();
            ctx.arc(-bodyWidth / 2 - 10, -bodyHeight + 14, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // Heal halo
        if (pose === 'heal') {
            ctx.strokeStyle = '#66ffad';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, -bodyHeight - headR - 6, headR + 8 + Math.sin(Date.now() * 0.01) * 1.5, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Hit flash overlay
        if (this.hitFlash[side] > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.roundRect(-bodyWidth / 2 - 4, -bodyHeight - headR * 2 + bob, bodyWidth + 8, bodyHeight + headR * 2, 16);
            ctx.fill();
        }

        ctx.restore();
    }

    drawHUD(ctx) {
        if (!this.playerStats || !this.enemyStats) return;
        this.drawHpBar(ctx, this.playerStats, this.basePlayerX - 80, this.groundY - 130, true);
        this.drawHpBar(ctx, this.enemyStats, this.baseEnemyX - 80, this.groundY - 130, false);
    }

    drawHpBar(ctx, stats, x, y, leftAlign) {
        const width = 160;
        const height = 12;
        const hpPercent = Math.max(0, stats.hp / stats.maxHp);

        ctx.fillStyle = 'rgba(10,12,30,0.75)';
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = leftAlign ? '#4caf50' : '#ff6b6b';
        ctx.beginPath();
        ctx.roundRect(x, y, width * hpPercent, height, 6);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${stats.hp}/${stats.maxHp}`, x + width / 2, y - 4);

        // Icon for class/enemy
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.textAlign = leftAlign ? 'left' : 'right';
        const label = stats.icon || '';
        ctx.fillText(label, leftAlign ? x : x + width, y + height + 14);
    }

    drawEffects(ctx, delta) {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.life -= delta / 600;
            if (effect.life <= 0) {
                this.effects.splice(i, 1);
                continue;
            }

            ctx.save();
            if (effect.type === 'slash') {
                ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                const offset = (1 - effect.life) * 50;
                ctx.moveTo(effect.x - 30 + offset, effect.y - 30);
                ctx.lineTo(effect.x + 30 + offset, effect.y + 30);
                ctx.stroke();
            } else if (effect.type === 'burst') {
                ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, (1 - effect.life) * 90, 0, Math.PI * 2);
                ctx.stroke();
            } else if (effect.type === 'heal') {
                ctx.strokeStyle = 'rgba(102, 255, 173, 0.6)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, (1 - effect.life) * 60, 0, Math.PI * 2);
                ctx.stroke();
            } else if (effect.type === 'shield') {
                ctx.strokeStyle = 'rgba(146, 168, 255, 0.8)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, 60, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    updateParticles(ctx, delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.life -= delta / 600;
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2;

            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}

let battle2DScene = null;

function initializeBattle2D(playerType = 'warrior', icon = '⚔️') {
    if (!document.getElementById('battleArena2D')) return;
    if (!battle2DScene) {
        battle2DScene = new Battle2DScene('battleArena2D', playerType);
    }
    if (battle2DScene) {
        battle2DScene.setPlayerCharacter(playerType, icon);
    }
}

function animate2DAttack(attacker) {
    if (battle2DScene) battle2DScene.animateAttack(attacker);
}

function animate2DSkill(attacker) {
    if (battle2DScene) battle2DScene.animateSkill(attacker);
}

function animate2DHeal(healer) {
    if (battle2DScene) battle2DScene.animateHeal(healer);
}

function animate2DDefend(defender) {
    if (battle2DScene) battle2DScene.animateDefend(defender);
}

function update2DModels(playerData, enemyData) {
    if (battle2DScene) battle2DScene.updateModels(playerData, enemyData);
}

function set2DEnemy(enemyData) {
    if (battle2DScene) battle2DScene.createEnemy(enemyData);
}

function flash2DDamage(target) {
    if (battle2DScene) battle2DScene.flashDamage(target);
}

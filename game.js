// Definiciones de personajes
const CHARACTERS = {
    warrior: {
        name: 'Guerrero',
        icon: '⚔️',
        maxHp: 150,
        attack: 15,
        defense: 12,
        special: 'Golpe Abrumador'
    },
    mage: {
        name: 'Mago',
        icon: '🔮',
        maxHp: 100,
        attack: 20,
        defense: 8,
        special: 'Llamarada Mágica'
    },
    archer: {
        name: 'Arquero',
        icon: '🏹',
        maxHp: 120,
        attack: 18,
        defense: 10,
        special: 'Lluvia de Flechas'
    },
    paladin: {
        name: 'Paladín',
        icon: '🛡️',
        maxHp: 140,
        attack: 14,
        defense: 14,
        special: 'Castigo Divino'
    }
};

// Definiciones de enemigos
const ENEMIES = [
    { name: 'Goblin', icon: '👺', hp: 30, attack: 8, defense: 2 },
    { name: 'Orco', icon: '👹', hp: 50, attack: 12, defense: 4 },
    { name: 'Dragón Menor', icon: '🐉', hp: 80, attack: 16, defense: 8 },
    { name: 'Caballero Oscuro', icon: '🗡️', hp: 100, attack: 18, defense: 10 },
    { name: 'Hechicero Maligno', icon: '👻', hp: 60, attack: 20, defense: 6 },
    { name: 'Bestia de Fuego', icon: '🔥', hp: 90, attack: 15, defense: 7 }
];

// Estado del juego
let gameState = {
    player: null,
    enemy: null,
    wave: 1,
    enemiesDefeated: 0,
    turn: 'player',
    defending: false,
    specialCooldown: 0,
    maxWaves: 10
};

// Seleccionar personaje
function selectCharacter(characterType) {
    const charData = CHARACTERS[characterType];
    gameState.player = {
        type: characterType,
        name: charData.name,
        icon: charData.icon,
        maxHp: charData.maxHp,
        hp: charData.maxHp,
        attack: charData.attack,
        defense: charData.defense,
        level: 1,
        exp: 0,
        special: charData.special,
        specialCooldown: 0
    };

    // Iniciar batalla
    startBattle();
    changeScreen('battleScreen');
    
    // Inicializar 3D después de cambiar pantalla
    setTimeout(() => {
        initializeBattle3D();
        updatePlayerDisplay();
        spawnEnemy();
    }, 100);
}

// Cambiar pantalla
function changeScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Generar enemigo
function spawnEnemy() {
    const enemyData = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
    const scaledHp = enemyData.hp + (gameState.wave - 1) * 10;
    const scaledAttack = enemyData.attack + Math.floor((gameState.wave - 1) * 1.5);
    const scaledDefense = enemyData.defense + Math.floor((gameState.wave - 1) * 0.5);

    gameState.enemy = {
        name: enemyData.name,
        icon: enemyData.icon,
        maxHp: scaledHp,
        hp: scaledHp,
        attack: scaledAttack,
        defense: scaledDefense,
        level: gameState.wave
    };

    // Crear modelo 3D del enemigo
    if (battle3DScene) {
        battle3DScene.createEnemyModel(gameState.enemy);
    }

    updateEnemyDisplay();
    addLog(`¡Apareció ${gameState.enemy.name} nivel ${gameState.enemy.level}!`, 'info');
}

// Iniciar batalla
function startBattle() {
    gameState.turn = 'player';
    gameState.defending = false;
    gameState.specialCooldown = Math.max(0, gameState.specialCooldown - 1);
    clearBattleLog();
}

// Actualizar pantalla del jugador
function updatePlayerDisplay() {
    document.getElementById('playerIcon').textContent = gameState.player.icon;
    document.getElementById('playerName').textContent = gameState.player.name;
    document.getElementById('playerAtk').textContent = gameState.player.attack;
    document.getElementById('playerDef').textContent = gameState.player.defense;
    document.getElementById('playerLevel').textContent = gameState.player.level;
    
    const hpPercent = (gameState.player.hp / gameState.player.maxHp) * 100;
    document.getElementById('playerHpBar').style.width = hpPercent + '%';
    document.getElementById('playerHp').textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
}

// Actualizar pantalla del enemigo
function updateEnemyDisplay() {
    document.getElementById('enemyIcon').textContent = gameState.enemy.icon;
    document.getElementById('enemyName').textContent = gameState.enemy.name;
    document.getElementById('enemyAtk').textContent = gameState.enemy.attack;
    document.getElementById('enemyDef').textContent = gameState.enemy.defense;
    document.getElementById('enemyLevel').textContent = gameState.enemy.level;
    
    const hpPercent = (gameState.enemy.hp / gameState.enemy.maxHp) * 100;
    document.getElementById('enemyHpBar').style.width = hpPercent + '%';
    document.getElementById('enemyHp').textContent = `${gameState.enemy.hp}/${gameState.enemy.maxHp}`;

    document.getElementById('wave').textContent = gameState.wave;
}

// Ataque del jugador
function playerAttack() {
    if (gameState.turn !== 'player') return;

    const damage = calculateDamage(gameState.player, gameState.enemy);
    gameState.enemy.hp -= damage;

    // Animar en 3D
    animate3DAttack('player');
    
    // Animar daño en enemigo
    if (battle3DScene && battle3DScene.enemyAnimController) {
        battle3DScene.enemyAnimController.damageAnimation();
    }
    
    addLog(`${gameState.player.name} atacó a ${gameState.enemy.name} por ${damage} de daño!`, 'damage');
    updateEnemyDisplay();

    gameState.turn = 'enemy';
    setTimeout(enemyTurn, 1500);
}

// Habilidad especial del jugador
function playerSkill() {
    if (gameState.turn !== 'player') return;
    if (gameState.specialCooldown > 0) {
        addLog(`Habilidad en enfriamiento. Espera ${gameState.specialCooldown} turnos más.`, 'info');
        return;
    }

    const damage = calculateDamage(gameState.player, gameState.enemy) * 1.8;
    gameState.enemy.hp -= damage;
    gameState.specialCooldown = 3;

    // Animar en 3D
    animate3DSkill('player');

    addLog(`${gameState.player.name} usó ${gameState.player.special}! Daño: ${Math.floor(damage)}!`, 'damage');
    updateEnemyDisplay();

    checkBattle();
}

// Curar al jugador
function playerHeal() {
    if (gameState.turn !== 'player') return;

    const healAmount = 30 + gameState.player.level * 5;
    const oldHp = gameState.player.hp;
    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
    const actualHealed = gameState.player.hp - oldHp;

    // Animar en 3D
    animate3DHeal('player');

    addLog(`${gameState.player.name} se curó ${actualHealed} puntos de vida.`, 'heal');
    updatePlayerDisplay();

    gameState.turn = 'enemy';
    setTimeout(enemyTurn, 1500);
}

// Defender
function playerDefend() {
    if (gameState.turn !== 'player') return;

    gameState.defending = true;
    
    // Animar en 3D
    animate3DDefend('player');

    addLog(`${gameState.player.name} se pone en guardia! Defensa aumentada.`, 'info');
    gameState.turn = 'enemy';
    setTimeout(enemyTurn, 1500);
}

// Turno del enemigo
function enemyTurn() {
    if (gameState.defending) {
        gameState.defending = false;
        addLog(`${gameState.enemy.name} intenta atacar pero ${gameState.player.name} se defiende!`, 'info');
    } else {
        const damage = calculateDamage(gameState.enemy, gameState.player);
        gameState.player.hp -= damage;
        
        // Animar en 3D
        animate3DAttack('enemy');
        
        // Animar daño en jugador
        if (battle3DScene && battle3DScene.playerAnimController) {
            battle3DScene.playerAnimController.damageAnimation();
        }
        
        addLog(`${gameState.enemy.name} atacó a ${gameState.player.name} por ${damage} de daño!`, 'damage');
        updatePlayerDisplay();
    }

    checkBattle();
}

// Calcular daño
function calculateDamage(attacker, defender) {
    const baseDamage = attacker.attack;
    const variance = Math.random() * 0.3 + 0.85; // 85% - 115%
    const defense = defender.defense;
    const actualDamage = Math.max(5, (baseDamage * variance) - (defense * 0.3));
    return Math.floor(actualDamage);
}

// Verificar estado de la batalla
function checkBattle() {
    // Jugador fue derrotado
    if (gameState.player.hp <= 0) {
        gameState.player.hp = 0;
        updatePlayerDisplay();
        addLog(`${gameState.player.name} ha sido derrotado...`, 'info');
        setTimeout(gameOver, 2000);
        return;
    }

    // Enemigo fue derrotado
    if (gameState.enemy.hp <= 0) {
        gameState.enemy.hp = 0;
        updateEnemyDisplay();
        addLog(`¡${gameState.enemy.name} ha sido derrotado! 🎉`, 'info');
        gameState.enemiesDefeated++;
        
        // Dar recompensas
        grantRewards();

        // Siguiente ola
        if (gameState.wave < gameState.maxWaves) {
            gameState.wave++;
            setTimeout(() => {
                addLog(`--- Ola ${gameState.wave} comienza ---`, 'info');
                startBattle();
                spawnEnemy();
            }, 2000);
        } else {
            addLog('¡Has completado todas las olas! ¡Victoria!', 'info');
            setTimeout(() => {
                gameState.enemiesDefeated--;
                gameOver(true);
            }, 2000);
        }
        return;
    }

    gameState.turn = 'player';
}

// Dar recompensas
function grantRewards() {
    const expGain = 50 + gameState.wave * 20;
    gameState.player.exp += expGain;

    // Subir nivel cada 200 exp
    if (gameState.player.exp >= 200) {
        gameState.player.level++;
        gameState.player.attack += 3;
        gameState.player.defense += 2;
        gameState.player.maxHp += 20;
        gameState.player.hp = gameState.player.maxHp;
        gameState.player.exp = 0;
        addLog(`¡NIVEL UP! ${gameState.player.name} ahora es nivel ${gameState.player.level}!`, 'info');
    }

    // Recuperar HP después de victoria
    gameState.player.hp = gameState.player.maxHp;
    updatePlayerDisplay();
}

// Fin de juego
function gameOver(victory = false) {
    changeScreen('gameOverScreen');
    
    if (victory) {
        document.getElementById('gameOverTitle').textContent = '¡Victoria! ¡Eres una Leyenda!';
        document.getElementById('gameOverTitle').style.color = '#4caf50';
    } else {
        document.getElementById('gameOverTitle').textContent = '¡Has Perdido!';
        document.getElementById('gameOverTitle').style.color = '#ff6b6b';
    }

    document.getElementById('finalLevel').textContent = gameState.player.level;
    document.getElementById('enemiesDefeated').textContent = gameState.enemiesDefeated;
    document.getElementById('waveCompleted').textContent = gameState.wave;
}

// Sistema de log
function addLog(message, type = 'info') {
    const logContent = document.getElementById('battleLog');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;

    // Limitar a 10 entradas
    if (logContent.children.length > 10) {
        logContent.removeChild(logContent.firstChild);
    }
}

function clearBattleLog() {
    document.getElementById('battleLog').innerHTML = '';
}

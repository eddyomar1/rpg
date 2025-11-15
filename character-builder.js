// character-builder.js - Constructor de personajes 3D vectoriales dinámicos

class CharacterBuilder {
    static createWarrior() {
        const group = new THREE.Group();
        group.characterType = 'warrior';

        // Armadura plateada
        const bodyGeometry = new THREE.BoxGeometry(2.2, 3, 1.2);
        const armorMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, armorMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.y = 1.5;
        group.add(body);

        // Pecho (área frontal)
        const chestGeometry = new THREE.BoxGeometry(1.5, 2, 0.3);
        const chestMaterial = new THREE.MeshStandardMaterial({
            color: 0xb0b0b0,
            metalness: 0.95,
            roughness: 0.15
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.castShadow = true;
        chest.position.y = 1.5;
        chest.position.z = 0.45;
        group.add(chest);

        // Cabeza con casco
        const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xa0a0a0,
            metalness: 0.85,
            roughness: 0.3
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.receiveShadow = true;
        head.position.y = 3.2;
        group.add(head);

        // Cuernos del casco
        const hornGeometry = new THREE.ConeGeometry(0.25, 0.7, 8);
        const hornMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7500,
            metalness: 0.8,
            roughness: 0.3
        });
        const hornLeft = new THREE.Mesh(hornGeometry, hornMaterial);
        hornLeft.castShadow = true;
        hornLeft.position.set(-0.6, 3.8, 0);
        group.add(hornLeft);

        const hornRight = new THREE.Mesh(hornGeometry, hornMaterial);
        hornRight.castShadow = true;
        hornRight.position.set(0.6, 3.8, 0);
        group.add(hornRight);

        // Brazos
        const armGeometry = new THREE.BoxGeometry(0.9, 2.2, 0.8);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.2
        });

        const armLeft = new THREE.Mesh(armGeometry, armMaterial);
        armLeft.castShadow = true;
        armLeft.position.set(-1.4, 2, 0);
        armLeft.name = 'armLeft';
        group.add(armLeft);

        const armRight = new THREE.Mesh(armGeometry, armMaterial);
        armRight.castShadow = true;
        armRight.position.set(1.4, 2, 0);
        armRight.name = 'armRight';
        group.add(armRight);

        // Escudo en brazo izquierdo
        const shieldGeometry = new THREE.BoxGeometry(1, 1.5, 0.3);
        const shieldMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b35,
            metalness: 0.7,
            roughness: 0.4
        });
        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        shield.castShadow = true;
        shield.position.set(-2.2, 2, 0.5);
        shield.name = 'shield';
        group.add(shield);

        // Gran espada en brazo derecho
        const swordGeometry = new THREE.BoxGeometry(0.35, 3.5, 1);
        const swordMaterial = new THREE.MeshStandardMaterial({
            color: 0xffed4e,
            metalness: 0.95,
            roughness: 0.1
        });
        const sword = new THREE.Mesh(swordGeometry, swordMaterial);
        sword.castShadow = true;
        sword.position.set(2, 1.5, 0.6);
        sword.rotation.z = Math.PI / 6;
        sword.name = 'weapon';
        group.add(sword);

        // Piernas
        const legGeometry = new THREE.BoxGeometry(0.8, 1.8, 0.8);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0xb0b0b0,
            metalness: 0.8,
            roughness: 0.3
        });

        const legLeft = new THREE.Mesh(legGeometry, legMaterial);
        legLeft.castShadow = true;
        legLeft.position.set(-0.6, 0.9, 0);
        group.add(legLeft);

        const legRight = new THREE.Mesh(legGeometry, legMaterial);
        legRight.castShadow = true;
        legRight.position.set(0.6, 0.9, 0);
        group.add(legRight);

        return group;
    }

    static createMage() {
        const group = new THREE.Group();
        group.characterType = 'mage';

        // Túnica azul
        const robeGeometry = new THREE.ConeGeometry(1.5, 3.5, 8);
        const robeMaterial = new THREE.MeshStandardMaterial({
            color: 0x4169e1,
            metalness: 0.1,
            roughness: 0.8
        });
        const robe = new THREE.Mesh(robeGeometry, robeMaterial);
        robe.castShadow = true;
        robe.receiveShadow = true;
        robe.position.y = 1.2;
        group.add(robe);

        // Cinturón
        const beltGeometry = new THREE.TorusGeometry(1.3, 0.2, 8, 16);
        const beltMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            metalness: 0.5,
            roughness: 0.6
        });
        const belt = new THREE.Mesh(beltGeometry, beltMaterial);
        belt.castShadow = true;
        belt.rotation.x = Math.PI / 2;
        belt.position.y = 1.5;
        group.add(belt);

        // Cabeza
        const headGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4a261,
            metalness: 0.2,
            roughness: 0.7
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.position.y = 3.2;
        group.add(head);

        // Sombrero puntiagudo
        const hatGeometry = new THREE.ConeGeometry(0.8, 1.2, 32);
        const hatMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d2d44,
            metalness: 0.3,
            roughness: 0.6
        });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.castShadow = true;
        hat.position.y = 4;
        group.add(hat);

        // Estrella en el sombrero
        const starGeometry = new THREE.OctahedronGeometry(0.3);
        const starMaterial = new THREE.MeshStandardMaterial({
            color: 0xffed4e,
            metalness: 0.8,
            roughness: 0.2
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.castShadow = true;
        star.position.set(0, 4.3, 0);
        star.name = 'star';
        group.add(star);

        // Brazos largos y delgados
        const armGeometry = new THREE.BoxGeometry(0.6, 2.5, 0.6);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4a261,
            metalness: 0.2,
            roughness: 0.7
        });

        const armLeft = new THREE.Mesh(armGeometry, armMaterial);
        armLeft.castShadow = true;
        armLeft.position.set(-1.3, 2, 0);
        armLeft.name = 'armLeft';
        group.add(armLeft);

        const armRight = new THREE.Mesh(armGeometry, armMaterial);
        armRight.castShadow = true;
        armRight.position.set(1.3, 2, 0);
        armRight.name = 'armRight';
        group.add(armRight);

        // Orbe mágico flotante
        const orbeGeometry = new THREE.IcosahedronGeometry(0.5, 4);
        const orbeMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x00ff88,
            emissiveIntensity: 0.5
        });
        const orbe = new THREE.Mesh(orbeGeometry, orbeMaterial);
        orbe.castShadow = true;
        orbe.position.set(1.8, 2, 0.5);
        orbe.name = 'orbe';
        group.add(orbe);

        // Anillo alrededor del orbe
        const ringGeometry = new THREE.TorusGeometry(0.7, 0.1, 8, 16);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x00ff88,
            emissiveIntensity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(1.8, 2, 0.5);
        ring.name = 'ring';
        group.add(ring);

        return group;
    }

    static createArcher() {
        const group = new THREE.Group();
        group.characterType = 'archer';

        // Cuerpo con ropas verdes
        const bodyGeometry = new THREE.BoxGeometry(1.8, 2.8, 0.9);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x228b22,
            metalness: 0.1,
            roughness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.y = 1.4;
        group.add(body);

        // Pecho de cuero
        const chestGeometry = new THREE.BoxGeometry(1.3, 1.8, 0.4);
        const chestMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            metalness: 0.3,
            roughness: 0.7
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.castShadow = true;
        chest.position.y = 1.6;
        chest.position.z = 0.45;
        group.add(chest);

        // Cabeza
        const headGeometry = new THREE.SphereGeometry(0.75, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4a261,
            metalness: 0.15,
            roughness: 0.75
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.position.y = 3;
        group.add(head);

        // Cabello/Capucha
        const hoodGeometry = new THREE.ConeGeometry(0.85, 0.6, 16);
        const hoodMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a5c1a,
            metalness: 0.1,
            roughness: 0.8
        });
        const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
        hood.castShadow = true;
        hood.position.y = 3.3;
        group.add(hood);

        // Brazos musculosos
        const armGeometry = new THREE.BoxGeometry(0.85, 2.3, 0.75);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4a261,
            metalness: 0.1,
            roughness: 0.8
        });

        const armLeft = new THREE.Mesh(armGeometry, armMaterial);
        armLeft.castShadow = true;
        armLeft.position.set(-1.35, 2.1, 0);
        armLeft.name = 'armLeft';
        group.add(armLeft);

        const armRight = new THREE.Mesh(armGeometry, armMaterial);
        armRight.castShadow = true;
        armRight.position.set(1.35, 2.1, 0);
        armRight.name = 'armRight';
        group.add(armRight);

        // Arco
        const bowGeometry = new THREE.BoxGeometry(0.25, 3, 2.5);
        const bowMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            metalness: 0.5,
            roughness: 0.6
        });
        const bow = new THREE.Mesh(bowGeometry, bowMaterial);
        bow.castShadow = true;
        bow.position.set(1.8, 1.8, 0);
        bow.rotation.z = Math.PI / 8;
        bow.name = 'weapon';
        group.add(bow);

        // Cuerda del arco
        const stringGeometry = new THREE.BufferGeometry();
        const stringPositions = new Float32Array([
            1.8, 3.5, 0,
            1.8, -0.8, 0
        ]);
        stringGeometry.setAttribute('position', new THREE.BufferAttribute(stringPositions, 3));
        const stringMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        const string = new THREE.Line(stringGeometry, stringMaterial);
        string.name = 'string';
        group.add(string);

        // Carcaj (bolsa de flechas)
        const quiverGeometry = new THREE.ConeGeometry(0.4, 1.2, 8);
        const quiverMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            metalness: 0.3,
            roughness: 0.7
        });
        const quiver = new THREE.Mesh(quiverGeometry, quiverMaterial);
        quiver.castShadow = true;
        quiver.position.set(-1.8, 1.2, 0.5);
        group.add(quiver);

        // Piernas
        const legGeometry = new THREE.BoxGeometry(0.75, 1.8, 0.75);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a5c1a,
            metalness: 0.1,
            roughness: 0.8
        });

        const legLeft = new THREE.Mesh(legGeometry, legMaterial);
        legLeft.castShadow = true;
        legLeft.position.set(-0.5, 0.9, 0);
        group.add(legLeft);

        const legRight = new THREE.Mesh(legGeometry, legMaterial);
        legRight.castShadow = true;
        legRight.position.set(0.5, 0.9, 0);
        group.add(legRight);

        return group;
    }

    static createPaladin() {
        const group = new THREE.Group();
        group.characterType = 'paladin';

        // Armadura dorada
        const bodyGeometry = new THREE.BoxGeometry(2, 3, 1.1);
        const armorMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.95,
            roughness: 0.15
        });
        const body = new THREE.Mesh(bodyGeometry, armorMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.y = 1.5;
        group.add(body);

        // Placa pectoral con símbolo
        const plateGeometry = new THREE.BoxGeometry(1.3, 1.8, 0.4);
        const plateMaterial = new THREE.MeshStandardMaterial({
            color: 0xffa500,
            metalness: 0.9,
            roughness: 0.2
        });
        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        plate.castShadow = true;
        plate.position.y = 1.5;
        plate.position.z = 0.55;
        group.add(plate);

        // Cruz en el pecho
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.1), 
            new THREE.MeshStandardMaterial({ color: 0xffffff }));
        crossH.position.set(0, 1.5, 0.65);
        group.add(crossH);

        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.1), 
            new THREE.MeshStandardMaterial({ color: 0xffffff }));
        crossV.position.set(0, 1.5, 0.65);
        group.add(crossV);

        // Cabeza noble
        const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4a261,
            metalness: 0.2,
            roughness: 0.65
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.position.y = 3.2;
        group.add(head);

        // Corona
        const crownGeometry = new THREE.ConeGeometry(0.9, 0.8, 8);
        const crownMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.95,
            roughness: 0.1
        });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.castShadow = true;
        crown.position.y = 3.85;
        group.add(crown);

        // Joya de la corona
        const jewelGeometry = new THREE.OctahedronGeometry(0.25);
        const jewelMaterial = new THREE.MeshStandardMaterial({
            color: 0xff1493,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xff1493,
            emissiveIntensity: 0.4
        });
        const jewel = new THREE.Mesh(jewelGeometry, jewelMaterial);
        jewel.castShadow = true;
        jewel.position.set(0, 4.1, 0);
        jewel.name = 'jewel';
        group.add(jewel);

        // Brazos
        const armGeometry = new THREE.BoxGeometry(0.95, 2.2, 0.85);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.95,
            roughness: 0.15
        });

        const armLeft = new THREE.Mesh(armGeometry, armMaterial);
        armLeft.castShadow = true;
        armLeft.position.set(-1.4, 2, 0);
        armLeft.name = 'armLeft';
        group.add(armLeft);

        const armRight = new THREE.Mesh(armGeometry, armMaterial);
        armRight.castShadow = true;
        armRight.position.set(1.4, 2, 0);
        armRight.name = 'armRight';
        group.add(armRight);

        // Maza/Martillo sagrado
        const mazeHeadGeometry = new THREE.BoxGeometry(0.8, 1, 1.2);
        const mazeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.95,
            roughness: 0.1
        });
        const mazeHead = new THREE.Mesh(mazeHeadGeometry, mazeMaterial);
        mazeHead.castShadow = true;
        mazeHead.position.set(2.2, 3, 0);
        group.add(mazeHead);

        const mazeHandleGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
        const mazeHandle = new THREE.Mesh(mazeHandleGeometry, 
            new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
        mazeHandle.position.set(2.2, 1.5, 0);
        mazeHandle.name = 'weapon';
        group.add(mazeHandle);

        // Escudo sagrado
        const shieldGeometry = new THREE.ConeGeometry(1, 1.8, 4);
        const shieldMaterial = new THREE.MeshStandardMaterial({
            color: 0xffa500,
            metalness: 0.9,
            roughness: 0.2
        });
        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        shield.castShadow = true;
        shield.rotation.z = Math.PI / 2;
        shield.position.set(-2, 1.5, 0.5);
        shield.name = 'shield';
        group.add(shield);

        // Piernas
        const legGeometry = new THREE.BoxGeometry(0.85, 1.8, 0.85);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.9,
            roughness: 0.2
        });

        const legLeft = new THREE.Mesh(legGeometry, legMaterial);
        legLeft.castShadow = true;
        legLeft.position.set(-0.6, 0.9, 0);
        group.add(legLeft);

        const legRight = new THREE.Mesh(legGeometry, legMaterial);
        legRight.castShadow = true;
        legRight.position.set(0.6, 0.9, 0);
        group.add(legRight);

        return group;
    }

    // Crear enemigos variados
    static createGoblin() {
        const group = new THREE.Group();
        group.characterType = 'goblin';

        const bodyGeometry = new THREE.BoxGeometry(1.2, 2, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x7cb342,
            metalness: 0.2,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.position.y = 1;
        group.add(body);

        const headGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0x558b2f,
            metalness: 0.1,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.position.y = 2.5;
        group.add(head);

        const armGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
        const armLeft = new THREE.Mesh(armGeometry, bodyMaterial);
        armLeft.position.set(-0.9, 1.2, 0);
        armLeft.name = 'armLeft';
        group.add(armLeft);

        const armRight = new THREE.Mesh(armGeometry, bodyMaterial);
        armRight.position.set(0.9, 1.2, 0);
        armRight.name = 'armRight';
        group.add(armRight);

        const clubGeometry = new THREE.BoxGeometry(0.4, 2, 0.4);
        const clubMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            metalness: 0.4,
            roughness: 0.6
        });
        const club = new THREE.Mesh(clubGeometry, clubMaterial);
        club.position.set(1.2, 1, 0);
        club.name = 'weapon';
        group.add(club);

        return group;
    }

    static createOrc() {
        const group = new THREE.Group();
        group.characterType = 'orc';

        const bodyGeometry = new THREE.BoxGeometry(1.8, 3.2, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.position.y = 1.6;
        group.add(body);

        const headGeometry = new THREE.SphereGeometry(0.85, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0x6b5344,
            metalness: 0.2,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.position.y = 3.3;
        group.add(head);

        // Colmillos
        const tuskGeometry = new THREE.ConeGeometry(0.2, 0.8, 8);
        const tuskMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const tuskLeft = new THREE.Mesh(tuskGeometry, tuskMaterial);
        tuskLeft.position.set(-0.4, 2.8, 0.7);
        group.add(tuskLeft);

        const tuskRight = new THREE.Mesh(tuskGeometry, tuskMaterial);
        tuskRight.position.set(0.4, 2.8, 0.7);
        group.add(tuskRight);

        const armGeometry = new THREE.BoxGeometry(1, 2.5, 0.9);
        const armLeft = new THREE.Mesh(armGeometry, bodyMaterial);
        armLeft.castShadow = true;
        armLeft.position.set(-1.5, 2, 0);
        armLeft.name = 'armLeft';
        group.add(armLeft);

        const armRight = new THREE.Mesh(armGeometry, bodyMaterial);
        armRight.castShadow = true;
        armRight.position.set(1.5, 2, 0);
        armRight.name = 'armRight';
        group.add(armRight);

        const axeHeadGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.3);
        const axeMaterial = new THREE.MeshStandardMaterial({
            color: 0xb0b0b0,
            metalness: 0.8,
            roughness: 0.3
        });
        const axeHead = new THREE.Mesh(axeHeadGeometry, axeMaterial);
        axeHead.position.set(2, 2.5, 0);
        group.add(axeHead);

        const axeHandleGeometry = new THREE.BoxGeometry(0.2, 2, 0.2);
        const axeHandle = new THREE.Mesh(axeHandleGeometry, 
            new THREE.MeshStandardMaterial({ color: 0x654321 }));
        axeHandle.position.set(2, 0.5, 0);
        axeHandle.name = 'weapon';
        group.add(axeHandle);

        return group;
    }
}

// Funciones de exportación
function createPlayerCharacter(type) {
    switch(type) {
        case 'warrior': return CharacterBuilder.createWarrior();
        case 'mage': return CharacterBuilder.createMage();
        case 'archer': return CharacterBuilder.createArcher();
        case 'paladin': return CharacterBuilder.createPaladin();
        default: return CharacterBuilder.createWarrior();
    }
}

function createEnemyCharacter(enemyData) {
    const name = enemyData.name.toLowerCase();
    if (name.includes('goblin')) return CharacterBuilder.createGoblin();
    if (name.includes('orco')) return CharacterBuilder.createOrc();
    
    // Por defecto crear algo aleatorio
    return Math.random() > 0.5 ? CharacterBuilder.createGoblin() : CharacterBuilder.createOrc();
}

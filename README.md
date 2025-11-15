# 🎮 RPG Battle Arena 3D

Un juego de batalla RPG 3D completamente interactivo construido con Three.js, HTML5 y JavaScript.

## 🎯 Características

### Clases de Personajes
- **⚔️ Guerrero**: Armadura plateada, escudo y espada. Alto HP y defensa.
- **🔮 Mago**: Túnica azul, orbe mágico flotante. Ataque mágico poderoso.
- **🏹 Arquero**: Ropas verdes, arco y carcaj. Velocidad y precisión.
- **🛡️ Paladín**: Armadura dorada, corona brillante. Equilibrio perfecto.

### Mecánica de Batalla
- Sistema de turnos jugador vs enemigo
- 4 acciones disponibles en cada turno
- 10 olas de dificultad progresiva
- Sistema de niveles y experiencia
- Enemigos variados con atributos únicos

### Visualización 3D
- Arena 3D renderizada con Three.js
- Personajes vectoriales dinámicos
- Animaciones fluidas para cada acción
- Efectos de partículas
- Iluminación realista con sombras

## 🎮 Controles

### Acciones de Batalla
```
ATAQUE NORMAL
  - Mouse: Clic en botón "Ataque (Q)"
  - Teclado: Q, 1, A

HABILIDAD ESPECIAL
  - Mouse: Clic en botón "Especial (W)"
  - Teclado: W, 2, S

CURAR
  - Mouse: Clic en botón "Curar (E)"
  - Teclado: E, 3, D

DEFENDER
  - Mouse: Clic en botón "Defender (R)"
  - Teclado: R, 4, F
```

## 📊 Estadísticas

### Guerrero
- HP: 150
- ATK: 15
- DEF: 12
- Especial: Golpe Abrumador

### Mago
- HP: 100
- ATK: 20
- DEF: 8
- Especial: Llamarada Mágica

### Arquero
- HP: 120
- ATK: 18
- DEF: 10
- Especial: Lluvia de Flechas

### Paladín
- HP: 140
- ATK: 14
- DEF: 14
- Especial: Castigo Divino

## 🌊 Olas de Batalla

El juego tiene 10 olas de batalla cada vez más difíciles. Con cada ola:
- Los enemigos suben de nivel
- Aumenta su HP, ataque y defensa
- Los enemigos derrotados otorgan experiencia

## 🎁 Sistema de Progresión

- **Experiencia**: Cada enemigo derrotado otorga EXP
- **Niveles**: Sube de nivel cada 200 EXP
- **Mejoras**: Al subir de nivel aumentan ATK, DEF y HP máximo
- **Habilidades**: Las habilidades especiales tienen enfriamiento de 3 turnos

## 🎨 Animaciones

Cada acción tiene animaciones únicas:
- **Ataque**: Avance rápido hacia el oponente
- **Especial**: Animaciones especiales por clase
- **Curación**: Flotación y giro
- **Defensa**: Escudo se adelanta
- **Daño**: Retroceso y temblor

## 🔧 Estructura del Proyecto

```
juego/
├── index.html              # Estructura HTML
├── styles.css             # Estilos y diseño responsive
├── game.js                # Lógica principal del juego
├── three-setup.js         # Configuración de Three.js
├── character-builder.js   # Constructores de personajes 3D
├── animations.js          # Sistema de animaciones
└── README.md              # Este archivo
```

## 📦 Dependencias

- **Three.js**: Librería de gráficos 3D (CDN externo)
- Navegador moderno con soporte para WebGL

## 🚀 Cómo Ejecutar

1. Abre `index.html` en tu navegador
2. Selecciona tu clase de personaje
3. ¡Que comience la batalla!

## 🎯 Objetivo del Juego

Derrota todos los enemigos de las 10 olas para convertirte en una leyenda. 
¡Cada acción debe ser estratégica para aprovechar al máximo tus puntos de vida!

## 🏆 Tips

1. **Usa la Defensa**: No solo ataques. Defender reduce el daño recibido.
2. **Curación Estratégica**: Cura cuando tu HP esté bajo para evitar ser derrotado.
3. **Habilidades Especiales**: Son más poderosas pero tienen enfriamiento.
4. **Tipo de Enemigo**: Diferentes enemigos tienen diferentes fortalezas.
5. **Acelera el juego**: Usa las teclas en lugar del ratón para una experiencia más fluida.

---

**¡Que disfrutes del juego! ⚔️✨**

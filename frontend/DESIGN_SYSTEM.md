# 🎨 Sistema de Diseño - Full 7x24

## 🎭 Tema: Neón Futurista con Transparencias

### 🔤 Tipografía

**Principal (Contenido):**
- Familia: `'Inter', sans-serif`
- Pesos: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Tamaño base: 16px
- Line height: 1.6

**Títulos Neón:**
- Familia: `'Monoton', cursive`
- Uso: Títulos principales, branding
- Efecto: Text-shadow con múltiples capas de brillo

### 🎨 Paleta de Colores

#### Colores Neón Principales
- **Cian primario**: `#0ff` / `rgb(0, 255, 255)`
- **Magenta títulos**: `#ec05c1` / `rgb(236, 5, 193)`
- **Azul secundario**: `rgb(0, 150, 255)`

#### Fondos con Transparencia
- **Card principal**: `rgba(0, 0, 0, 0.75)` + backdrop-filter: blur(15px)
- **Header**: `rgba(0, 0, 0, 0.9)` + backdrop-filter: blur(10px)
- **Container**: `rgba(0, 0, 0, 0.85)` + backdrop-filter: blur(10px)
- **Sidebar**: `rgba(0, 0, 0, 0.8)` + backdrop-filter: blur(10px)
- **Modal**: `rgba(0, 0, 0, 0.9)` + backdrop-filter: blur(15px)

#### Bordes Luminosos
- **Normal**: `1px solid rgba(0, 255, 255, 0.3)`
- **Hover**: `1px solid rgba(0, 255, 255, 0.5)`
- **Activo**: `2px solid rgba(0, 255, 255, 0.6)`

#### Texto
- **Principal**: `rgba(255, 255, 255, 0.95)`
- **Secundario**: `rgba(255, 255, 255, 0.7)`
- **Terciario**: `rgba(255, 255, 255, 0.5)`
- **Títulos neón**: `#0ff` con text-shadow

### 💫 Efectos de Brillo (Text Shadow)

**Títulos Principales:**
```css
text-shadow:
  0 0 10px rgb(0, 225, 255),
  0 0 20px rgb(0, 221, 255),
  0 0 30px #0ff,
  0 0 40px #f0f,
  0 0 70px #f0f,
  0 0 80px #f0f,
  0 0 100px #f0f,
  0 0 150px #f0f;
```

**Subtítulos:**
```css
text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
```

**Hover Interactivo:**
```css
text-shadow: 0 0 10px #0ff;
```

### 📦 Componentes Principales

#### Clases Reutilizables

**`.page-header`**
- Header de página con título y botones
- Fondo negro translúcido con borde cian inferior
- Altura flexible, padding 1.5rem 2rem

**`.content-wrapper`**
- Container principal de contenido
- Padding 2rem, permite scroll
- z-index: 1

**`.content-card`**
- Card de contenido con transparencia
- Border radius 12px, blur 15px
- Box-shadow con brillo cian

**`.neon-container`**
- Container genérico con efectos neón
- Padding 2rem, margin 1rem
- Border y shadow con brillo

#### Tablas
- Background transparente
- Header con gradiente cian
- Hover con brillo luminoso
- Filas alternadas con opacidad sutil

#### Botones
- **Primary**: Cian con hover brillante
- **Success**: Verde con hover luminoso
- **Warning**: Amarillo con brillo
- **Danger**: Rosa/rojo con brillo
- **Secondary**: Blanco con brillo neutral

Todos con:
- Border 1px solid del color correspondiente
- Background transparente con alpha 0.1
- Hover aumenta alpha a 0.2 y agrega box-shadow

#### Modales
- Overlay con backdrop-filter: blur(5px)
- Content con borde cian 2px
- Box-shadow intenso: `0 0 50px rgba(0, 255, 255, 0.3)`
- Botón cerrar con rotación en hover

### 📐 Espaciado y Bordes

**Border Radius:**
- Cards grandes: 12px
- Cards pequeñas: 8px
- Botones: 4-6px
- Inputs: 4px

**Padding:**
- Headers: 1.5rem 2rem
- Cards: 2rem
- Contenedores: 1.5rem
- Celdas de tabla: 1rem 0.75rem

**Box Shadow:**
- Sutil: `0 0 20px rgba(0, 255, 255, 0.2)`
- Normal: `0 0 30px rgba(0, 255, 255, 0.3)`
- Intenso: `0 0 40px rgba(0, 255, 255, 0.4)`
- Modal: `0 0 50px rgba(0, 255, 255, 0.3)`

### 🎬 Animaciones

**Gradiente de Fondo:**
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

**Spinner:**
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

**Transiciones:**
- Botones y hover: `all 0.3s ease`
- Modales: `transform 0.3s, opacity 0.3s`

### 🖼️ Imagen de Fondo

**Ubicación:** `/assets/img/4975900.jpg`

**Aplicación:**
```css
background-image: url('/assets/img/4975900.jpg');
background-size: cover;
background-position: center center;
background-repeat: no-repeat;
```

**Overlay:**
```css
.container::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 0;
}
```

### ✨ Consejos de Uso

1. **Siempre usar `position: relative` y `z-index: 1`** en contenido sobre fondo
2. **Backdrop-filter: blur()** mejora legibilidad sobre imagen
3. **Text-shadow en texto claro** mejora contraste
4. **Hover states** siempre incrementan brillo y opacidad
5. **Inter para cuerpo, Monoton para impacto**

---

🏪 **Full 7x24** - Sistema de Gestión con Estética Neón

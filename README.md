# TennisScore (Zepp OS)

TennisScore es una aplicacion para **anotar puntos de un partido de tenis** en un reloj/pulsera con Zepp OS.

La app incluye:
- Marcador para dos jugadores/lados (`Nosotros (N)` y `Ellos (E)`)
- Boton `+ N` para sumar puntos a Nosotros (Se puede dejar apretado mas de un segundo para restar el ultimo tanto)
- Boton `+ E` para sumar puntos a Ellos (Se puede dejar apretado mas de un segundo para restar el ultimo tanto)
- Boton `Reiniciar` para volver a cero
- Logica de puntuacion de tenis por game: `0`, `15`, `30`, `40`, `AD` (ventaja)

## Dispositivos objetivo
- `194x368-amazfit-band-7` (Amazfit Band 7)

## Requisitos

- Node.js instalado
- Dependencias del proyecto instaladas (`npm install`)
- Zeus CLI disponible en tu entorno
- Simulador de Zepp OS instalado

## Como ejecutar la app

1. Instalar dependencias (si todavia no lo hiciste):

```bash
npm install
```

2. Ejecutar en modo desarrollo:

```bash
Zeus dev
```

Este comando compila la app en modo desarrollo y mantiene el proceso activo para iterar cambios.

## Como visualizarla en el simulador con `Zeus dev`

1. Abri una terminal en la raiz del proyecto.
2. Ejecuta:

```bash
Zeus dev
```

3. Abri el simulador de Zepp OS.
4. En el simulador, selecciona el dispositivo objetivo (por ejemplo, **Amazfit Band 7**).
5. Carga/ejecuta el paquete generado por Zeus (segun el flujo del simulador que tengas configurado).
6. Cada vez que guardes cambios en el codigo, Zeus vuelve a compilar y podras recargar en el simulador para verlos.

## Estructura basica del proyecto

- `app.json`: metadatos de la app y targets/dispositivos
- `page/index.js`: interfaz principal y logica del marcador
- `app.js`: ciclo de vida principal de la app

## Notas

- Si `Zeus dev` no es reconocido, verifica que Zeus CLI este instalado y disponible en el `PATH`.
- Si el simulador no muestra la app, valida que el target elegido coincida con el dispositivo (Band 7: `194x368-amazfit-band-7`).

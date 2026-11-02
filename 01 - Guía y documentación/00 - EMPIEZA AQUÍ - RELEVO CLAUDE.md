# Empieza aquí — Relevo para Claude

Actualizado el 2 de noviembre de 2026. Usuario: Josemi. Proyecto: `C:\Users\soyjo\Desktop\ANIMESURVIVOR`.

## Qué quiere Josemi

Lee `Cambios propuestos por Josemi.md` en esta misma carpeta: es el documento completo de sus ideas y requisitos. Quiere que seas un colaborador que aporte ideas concretas, explique sus motivos, respete sus decisiones visuales y trabaje por bloques, sin ejecutar todo de golpe. La petición que te haga ahora tiene prioridad. Habla con él en español, claro y sin hacerlo esperar con preguntas repetidas.

Objetivos: incorporar gradualmente los personajes y formas útiles de `sprites/`, con ataques identificados y fieles a sus personajes; mejorar y equilibrar la progresión, los enemigos y el combate tanto a distancia como cuerpo a cuerpo; y mejorar menús, selección, estadísticas, gachapón y HUD con pixel art inspirado en PokéSurvivor y adaptado a Dragon Ball. El detalle y los puntos no decididos están en el documento.

## Lo primero que debes hacer

1. Lee `AGENTS.md`, este relevo, `ESTADO_ACTUAL.md` y `Cambios propuestos por Josemi.md`. Antes de modificar nada, comprueba la rama, los cambios existentes y las entradas recientes de la bitácora; no descartes trabajo ajeno.
2. Ten en cuenta que ya se realizaron cambios tras redactar las ideas: HUD más pequeño y nítido, ajustes iniciales de dificultad, efectos más pequeños y movimiento en vuelo bajo. Están documentados en la bitácora, pero falta la valoración de Josemi jugando; no los repitas sin comprobar el estado real.
3. Preséntale un plan breve por bloques y pregunta qué quiere priorizar o, si ya ha indicado una tarea concreta, comienza por ella. Para diseño y elecciones creativas importantes, enséñale opciones. Para validar los cambios de HUD, efectos y movimiento, facilita que pueda probarlos y recoger su opinión.
4. La rama `claude/quizzical-gates-9cf9c0` contiene siete personajes según la documentación y se observó separada de `main`; verifica su estado real y consulta con Josemi antes de fusionarla. No borres ni fusiones ramas por tu cuenta.

## Decisiones que siguen abiertas

- Josemi quiere todos los personajes y formas de sus sprites. Si faltan animaciones o hay duplicados o dudas, informa y acuerda con él cómo tratarlos; no inventes identificaciones ni nombres de técnicas.
- Él aportará los iconos pixel art del menú. Para la selección quiere un retrato fijo de la cara y debajo el personaje como se ve jugando; queda por aclarar si el retrato cambia con la transformación.
- Quiere una zona de noticias arriba a la izquierda y debajo un enlace al rap de Dragon Ball de Porta. Pide la versión o enlace concreto y acuerda la música del juego por separado.
- Quiere un HUD nítido, menos grande y con efectos que no tapen la acción; vida verde, velocidad azul y ataque rojo, y estadísticas visibles. Comprueba primero lo ya hecho y pregúntale si le gusta.

## Mapa y forma de trabajar

- `index.html`: abrir con doble clic. `02 - Código del juego/script.js`, `style.css` y `utilidades.js`: lógica y presentación. Los demás JS de esa carpeta contienen recursos, algunos generados.
- `sprites/`: originales. `herramientas/`: montaje y pruebas; para animaciones lee `herramientas/GUIA_ANIMACIONES.md`. Usa `INDICE_SPRITES.md` para localizar selecciones y `PRUEBAS_RAPIDAS.md` para elegir comprobaciones.
- Ahorra contexto: busca nombres y fragmentos concretos; evita leer completos los JS generados grandes y recorrer todos los sprites para una tarea localizada. Si haces un inventario, procésalo por lotes y registra resultados. Esto no garantiza ningún ahorro concreto.
- Personajes y enemigos: sprites del proyecto; revisar animaciones a ojo. Conserva la apertura con doble clic y no inventes que se ha probado lo que no se ha probado.
- Actualiza este relevo o `ESTADO_ACTUAL.md` cuando cambie el estado y anota trabajo y pruebas en `BITACORA.md`. Respeta el trabajo existente y verifica Git antes de decidir cómo guardar cambios; no hagas push ni fusiones sin que correspondan a la petición del usuario.

## Qué se pudo verificar al preparar este relevo

El 2 de noviembre, `git branch -vv` mostró `main` en `6506e25` con referencia local a `origin/main`; esto no comprueba el remoto en directo. `git status` falló en el entorno de Codex, así que **no se pudo confirmar si había cambios sin guardar**. No se jugó una partida para este relevo. Vuelve a verificar todo antes de trabajar.

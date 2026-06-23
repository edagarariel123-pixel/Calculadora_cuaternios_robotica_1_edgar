const idsCuaternios = ["q1s", "q1x", "q1y", "q1z", "q2s", "q2x", "q2y", "q2z", "escalar"];
const idsMatriz = [
    "m00", "m01", "m02", "m03",
    "m10", "m11", "m12", "m13",
    "m20", "m21", "m22", "m23",
    "m30", "m31", "m32", "m33"
];
const idsTraslacion = ["px", "py", "pz", "ru", "rv", "rw"];

function mostrarPantalla(id) {
    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("cuaternios").classList.add("oculto");
    document.getElementById("matrices").classList.add("oculto");
    document.getElementById("traslacion").classList.add("oculto");
    document.getElementById(id).classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarCuaternios() {
    mostrarPantalla("cuaternios");
}

function mostrarMatrices() {
    mostrarPantalla("matrices");
}

function mostrarTraslacion() {
    mostrarPantalla("traslacion");
}

function volverInicio() {
    mostrarPantalla("inicio");
}

function numero(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function colocarValores(valores) {
    Object.entries(valores).forEach(([id, valor]) => {
        document.getElementById(id).value = valor;
    });
}

function limpiarCampos(ids) {
    ids.forEach((id) => {
        document.getElementById(id).value = "";
    });
}

function limpiarResultadosCuaternios() {
    ["suma", "multiplicacion", "norma", "inverso", "escalarResultado"].forEach((id) => {
        document.getElementById(id).textContent = "";
    });
}

function limpiarCuaternios() {
    limpiarCampos(idsCuaternios);
    limpiarResultadosCuaternios();
}

function cargarEjemploCuaternios() {
    colocarValores({
        q1s: 1,
        q1x: 2,
        q1y: 3,
        q1z: 4,
        q2s: 0.5,
        q2x: -1,
        q2y: 2,
        q2z: 1,
        escalar: 3
    });
    calcularCuaternios();
}

function calcularCuaternios() {
    const a = numero("q1s");
    const b = numero("q1x");
    const c = numero("q1y");
    const d = numero("q1z");
    const e = numero("q2s");
    const f = numero("q2x");
    const g = numero("q2y");
    const h = numero("q2z");
    const escalar = document.getElementById("escalar").value;

    const suma = `Q1 + Q2 = (${(a + e).toFixed(4)}, ${(b + f).toFixed(4)}, ${(c + g).toFixed(4)}, ${(d + h).toFixed(4)})`;

    const r0 = a * e - b * f - c * g - d * h;
    const r1 = a * f + b * e + c * h - d * g;
    const r2 = a * g - b * h + c * e + d * f;
    const r3 = a * h + b * g - c * f + d * e;

    const multiplicacion = `Q3 = Q1 \u00d7 Q2 = (${r0.toFixed(4)}, ${r1.toFixed(4)}, ${r2.toFixed(4)}, ${r3.toFixed(4)})`;
    const norma = Math.sqrt(r0 * r0 + r1 * r1 + r2 * r2 + r3 * r3);
    const textoNorma = `||Q3|| = ${norma.toFixed(4)}`;

    const denominador = a * a + b * b + c * c + d * d;
    const inverso = denominador === 0
        ? "Q1\u207b\u00b9 no existe porque la norma de Q1 es 0."
        : `Q1\u207b\u00b9 = (${(a / denominador).toFixed(4)}, ${(-b / denominador).toFixed(4)}, ${(-c / denominador).toFixed(4)}, ${(-d / denominador).toFixed(4)})`;

    let textoEscalar = "Escalar no ingresado";
    if (escalar !== "") {
        const k = parseFloat(escalar);
        textoEscalar = `k\u00b7Q1 = (${(k * a).toFixed(4)}, ${(k * b).toFixed(4)}, ${(k * c).toFixed(4)}, ${(k * d).toFixed(4)})`;
    }

    document.getElementById("suma").textContent = suma;
    document.getElementById("multiplicacion").textContent = multiplicacion;
    document.getElementById("norma").textContent = textoNorma;
    document.getElementById("inverso").textContent = inverso;
    document.getElementById("escalarResultado").textContent = textoEscalar;
}

function limpiarMatriz() {
    limpiarCampos(idsMatriz);
    document.getElementById("resultadoMatriz").textContent = "";
}

function cargarEjemploMatriz() {
    colocarValores({
        m00: 1,
        m01: 0,
        m02: 0,
        m03: 4,
        m10: 0,
        m11: 1,
        m12: 0,
        m13: -2,
        m20: 0,
        m21: 0,
        m22: 1,
        m23: 3,
        m30: 0,
        m31: 0,
        m32: 0,
        m33: 1
    });
    calcularInversa();
}

function calcularInversa() {
    const R = [
        [numero("m00"), numero("m01"), numero("m02")],
        [numero("m10"), numero("m11"), numero("m12")],
        [numero("m20"), numero("m21"), numero("m22")]
    ];

    const d = [numero("m03"), numero("m13"), numero("m23")];

    const Rt = [
        [R[0][0], R[1][0], R[2][0]],
        [R[0][1], R[1][1], R[2][1]],
        [R[0][2], R[1][2], R[2][2]]
    ];

    const dx = -(Rt[0][0] * d[0] + Rt[0][1] * d[1] + Rt[0][2] * d[2]);
    const dy = -(Rt[1][0] * d[0] + Rt[1][1] * d[1] + Rt[1][2] * d[2]);
    const dz = -(Rt[2][0] * d[0] + Rt[2][1] * d[1] + Rt[2][2] * d[2]);

    const resultado = `
\u250c                                             \u2510
  ${Rt[0][0].toFixed(4)}   ${Rt[0][1].toFixed(4)}   ${Rt[0][2].toFixed(4)}   ${dx.toFixed(4)}
  ${Rt[1][0].toFixed(4)}   ${Rt[1][1].toFixed(4)}   ${Rt[1][2].toFixed(4)}   ${dy.toFixed(4)}
  ${Rt[2][0].toFixed(4)}   ${Rt[2][1].toFixed(4)}   ${Rt[2][2].toFixed(4)}   ${dz.toFixed(4)}
  0.0000   0.0000   0.0000   1.0000
\u2514                                             \u2518`;

    document.getElementById("resultadoMatriz").textContent = resultado;
}

function limpiarTraslacion() {
    limpiarCampos(idsTraslacion);
    ["vectorTraslacion", "vectorOriginal", "vectorResultado", "matrizTraslacion", "productoTraslacion"].forEach((id) => {
        document.getElementById(id).textContent = "";
    });
}

function cargarEjemploTraslacion() {
    colocarValores({
        px: 6,
        py: -3,
        pz: 8,
        ru: -2,
        rv: 7,
        rw: 3
    });
    calcularTraslacion();
}

function calcularTraslacion() {
    const px = numero("px");
    const py = numero("py");
    const pz = numero("pz");
    const ru = numero("ru");
    const rv = numero("rv");
    const rw = numero("rw");

    const rx = ru + px;
    const ry = rv + py;
    const rz = rw + pz;
    const formato = (valor) => valor.toFixed(4).padStart(9);
    const celda = (valor) => `<span>${Number(valor).toFixed(4)}</span>`;

    document.getElementById("vectorTraslacion").textContent =
        `p = (${px.toFixed(4)}, ${py.toFixed(4)}, ${pz.toFixed(4)})`;
    document.getElementById("vectorOriginal").textContent =
        `r_uvw = (${ru.toFixed(4)}, ${rv.toFixed(4)}, ${rw.toFixed(4)})`;
    document.getElementById("vectorResultado").textContent =
        `r_xyz = (${rx.toFixed(4)}, ${ry.toFixed(4)}, ${rz.toFixed(4)})`;

    const matriz = `
T(p) =
\u250c                                  \u2510
  1.0000   0.0000   0.0000  ${formato(px)}
  0.0000   1.0000   0.0000  ${formato(py)}
  0.0000   0.0000   1.0000  ${formato(pz)}
  0.0000   0.0000   0.0000     1.0000
\u2514                                  \u2518`;

    document.getElementById("matrizTraslacion").textContent = matriz;
    document.getElementById("productoTraslacion").innerHTML = `
        <div class="producto-fila">
            <div class="producto-bloque">
                <span class="producto-titulo">T(p)</span>
                <div class="matriz-visual" aria-label="Matriz de traslacion">
                    ${celda(1)}${celda(0)}${celda(0)}${celda(px)}
                    ${celda(0)}${celda(1)}${celda(0)}${celda(py)}
                    ${celda(0)}${celda(0)}${celda(1)}${celda(pz)}
                    ${celda(0)}${celda(0)}${celda(0)}${celda(1)}
                </div>
            </div>
            <div class="producto-signo">\u00d7</div>
            <div class="producto-bloque">
                <span class="producto-titulo">r_uvw</span>
                <div class="vector-visual" aria-label="Vector en O'UVW">
                    ${celda(ru)}
                    ${celda(rv)}
                    ${celda(rw)}
                    ${celda(1)}
                </div>
            </div>
            <div class="producto-signo">=</div>
            <div class="producto-bloque">
                <span class="producto-titulo">r_xyz</span>
                <div class="vector-visual" aria-label="Resultado en OXYZ">
                    ${celda(rx)}
                    ${celda(ry)}
                    ${celda(rz)}
                    ${celda(1)}
                </div>
            </div>
        </div>`;
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").then((registration) => {
            registration.update();
        }).catch(() => {
            // La app sigue funcionando aunque el navegador no permita service workers en archivo local.
        });
    });
}

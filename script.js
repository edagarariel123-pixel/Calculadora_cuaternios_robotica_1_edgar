const idsCuaternios = ["q1s", "q1x", "q1y", "q1z", "q2s", "q2x", "q2y", "q2z", "escalar"];
const idsMatriz = [
    "m00", "m01", "m02", "m03",
    "m10", "m11", "m12", "m13",
    "m20", "m21", "m22", "m23",
    "m30", "m31", "m32", "m33"
];
const idsTraslacion = ["px", "py", "pz", "ru", "rv", "rw"];
const idsRotacion = ["anguloRotacion", "rotRu", "rotRv", "rotRw"];

function mostrarPantalla(id) {
    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("cuaternios").classList.add("oculto");
    document.getElementById("matrices").classList.add("oculto");
    document.getElementById("traslacion").classList.add("oculto");
    document.getElementById("rotacion").classList.add("oculto");
    document.getElementById("operacionesMatrices").classList.add("oculto");
    document.getElementById("denavitHartenberg").classList.add("oculto");
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

function mostrarRotacion() {
    mostrarPantalla("rotacion");
}

function mostrarOperacionesMatrices() {
    mostrarPantalla("operacionesMatrices");
}

function mostrarDenavitHartenberg() {
    mostrarPantalla("denavitHartenberg");
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

function limpiarNumero(valor) {
    return Math.abs(valor) < 1e-10 ? 0 : valor;
}

function celdaProducto(valor) {
    return `<span>${limpiarNumero(Number(valor)).toFixed(4)}</span>`;
}

function renderProductoHomogeneo(id, tituloMatriz, matriz, vector, resultado, vectorEntrada, vectorSalida) {
    document.getElementById(id).innerHTML = `
        <div class="producto-fila">
            <div class="producto-bloque">
                <span class="producto-titulo">${tituloMatriz}</span>
                <div class="matriz-visual" aria-label="${tituloMatriz}">
                    ${matriz.flat().map(celdaProducto).join("")}
                </div>
            </div>
            <div class="producto-signo">\u00d7</div>
            <div class="producto-bloque">
                <span class="producto-titulo">${vectorEntrada}</span>
                <div class="vector-visual" aria-label="${vectorEntrada}">
                    ${vector.map(celdaProducto).join("")}
                </div>
            </div>
            <div class="producto-signo">=</div>
            <div class="producto-bloque">
                <span class="producto-titulo">${vectorSalida}</span>
                <div class="vector-visual" aria-label="${vectorSalida}">
                    ${resultado.map(celdaProducto).join("")}
                </div>
            </div>
        </div>`;
}

function matrizTexto(titulo, matriz) {
    const formato = (valor) => limpiarNumero(valor).toFixed(4).padStart(9);
    return `
${titulo} =
\u250c                                  \u2510
  ${formato(matriz[0][0])} ${formato(matriz[0][1])} ${formato(matriz[0][2])} ${formato(matriz[0][3])}
  ${formato(matriz[1][0])} ${formato(matriz[1][1])} ${formato(matriz[1][2])} ${formato(matriz[1][3])}
  ${formato(matriz[2][0])} ${formato(matriz[2][1])} ${formato(matriz[2][2])} ${formato(matriz[2][3])}
  ${formato(matriz[3][0])} ${formato(matriz[3][1])} ${formato(matriz[3][2])} ${formato(matriz[3][3])}
\u2514                                  \u2518`;
}

function formatoNumeroGeneral(valor) {
    const limpio = limpiarNumero(valor);
    if (Number.isInteger(limpio)) {
        return String(limpio);
    }

    return limpio.toFixed(4).replace(/\.?0+$/, "");
}

function evaluarExpresionNumerica(texto) {
    const expresion = texto
        .toLowerCase()
        .replace(/,/g, ".")
        .replace(/\bsen\b/g, "sin")
        .replace(/\^/g, "**");
    const identificadores = expresion.match(/[a-z_]\w*/g) || [];
    const permitidos = new Set(["sin", "cos", "tan", "pi", "e"]);

    if (identificadores.some((id) => !permitidos.has(id))) {
        return null;
    }

    if (!/^[0-9+\-*/().\s*a-z_]+$/.test(expresion)) {
        return null;
    }

    try {
        const sin = (grados) => Math.sin(grados * Math.PI / 180);
        const cos = (grados) => Math.cos(grados * Math.PI / 180);
        const tan = (grados) => Math.tan(grados * Math.PI / 180);
        const valor = Function("sin", "cos", "tan", "pi", "e", `"use strict"; return (${expresion});`)(sin, cos, tan, Math.PI, Math.E);

        if (Number.isFinite(valor)) {
            return limpiarNumero(valor);
        }
    } catch {
        return null;
    }

    return null;
}

function expresionDesdeEntrada(valor) {
    const texto = valor.trim();

    if (texto === "") {
        return { numerico: true, valor: 0, texto: "0" };
    }

    const numeroCalculado = evaluarExpresionNumerica(texto);

    if (numeroCalculado !== null) {
        return {
            numerico: true,
            valor: numeroCalculado,
            texto: formatoNumeroGeneral(numeroCalculado)
        };
    }

    return {
        numerico: false,
        valor: null,
        texto: texto.replace(/\bsen\s*\(/gi, "sen(")
    };
}

function exprTexto(expr) {
    return expr.numerico ? formatoNumeroGeneral(expr.valor) : expr.texto;
}

function exprNumero(valor) {
    return { numerico: true, valor: limpiarNumero(valor), texto: formatoNumeroGeneral(valor) };
}

function exprEsCero(expr) {
    return expr.numerico && limpiarNumero(expr.valor) === 0;
}

function exprEsUno(expr) {
    return expr.numerico && limpiarNumero(expr.valor) === 1;
}

function exprSinSignoNegativo(expr) {
    if (expr.numerico) return null;

    if (expr.texto.startsWith("(-") && expr.texto.endsWith(")")) {
        return { numerico: false, valor: null, texto: expr.texto.slice(2, -1) };
    }

    if (expr.texto.startsWith("-")) {
        return { numerico: false, valor: null, texto: expr.texto.slice(1) };
    }

    return null;
}

function exprSuma(a, b) {
    if (exprEsCero(a)) return b;
    if (exprEsCero(b)) return a;
    if (a.numerico && b.numerico) return exprNumero(a.valor + b.valor);
    return { numerico: false, valor: null, texto: `(${exprTexto(a)} + ${exprTexto(b)})` };
}

function exprResta(a, b) {
    if (exprEsCero(b)) return a;
    if (a.numerico && b.numerico) return exprNumero(a.valor - b.valor);
    return { numerico: false, valor: null, texto: `(${exprTexto(a)} - ${exprTexto(b)})` };
}

function exprProducto(a, b) {
    if (exprEsCero(a) || exprEsCero(b)) return exprNumero(0);
    if (exprEsUno(a)) return b;
    if (exprEsUno(b)) return a;
    if (a.numerico && b.numerico) return exprNumero(a.valor * b.valor);
    if (a.numerico && limpiarNumero(a.valor) === -1) return exprNegativo(b);
    if (b.numerico && limpiarNumero(b.valor) === -1) return exprNegativo(a);

    const aSinSigno = exprSinSignoNegativo(a);
    const bSinSigno = exprSinSignoNegativo(b);

    if (aSinSigno && bSinSigno) return exprProducto(aSinSigno, bSinSigno);
    if (aSinSigno) return exprNegativo(exprProducto(aSinSigno, b));
    if (bSinSigno) return exprNegativo(exprProducto(a, bSinSigno));

    return { numerico: false, valor: null, texto: `(${exprTexto(a)}*${exprTexto(b)})` };
}

function exprNegativo(a) {
    if (a.numerico) return exprNumero(-a.valor);
    const sinSigno = exprSinSignoNegativo(a);
    if (sinSigno) return sinSigno;
    if (a.texto.startsWith("(") && a.texto.endsWith(")")) {
        return { numerico: false, valor: null, texto: `-${a.texto}` };
    }
    return { numerico: false, valor: null, texto: `(-${exprTexto(a)})` };
}

function exprTrigonometrica(funcion, expr) {
    if (expr.numerico) {
        const radianes = expr.valor * Math.PI / 180;
        if (funcion === "cos") return exprNumero(Math.cos(radianes));
        if (funcion === "sen") return exprNumero(Math.sin(radianes));
    }

    return { numerico: false, valor: null, texto: `${funcion}(${exprTexto(expr)})` };
}

function matrizCofactor(matriz, columnaExcluida) {
    return matriz.slice(1).map((fila) => fila.filter((_, columna) => columna !== columnaExcluida));
}

function determinanteExpresion(matriz) {
    const n = matriz.length;

    if (n === 1) {
        return matriz[0][0];
    }

    if (n === 2) {
        return exprResta(
            exprProducto(matriz[0][0], matriz[1][1]),
            exprProducto(matriz[0][1], matriz[1][0])
        );
    }

    return matriz[0].reduce((total, elemento, columna) => {
        const termino = exprProducto(elemento, determinanteExpresion(matrizCofactor(matriz, columna)));
        return columna % 2 === 0 ? exprSuma(total, termino) : exprResta(total, termino);
    }, exprNumero(0));
}

function multiplicarMatricesExpresion(A, B) {
    const filasA = A.length;
    const columnasA = A[0].length;
    const columnasB = B[0].length;
    const resultado = [];

    for (let fila = 0; fila < filasA; fila += 1) {
        const filaResultado = [];

        for (let columna = 0; columna < columnasB; columna += 1) {
            let total = exprNumero(0);

            for (let k = 0; k < columnasA; k += 1) {
                total = exprSuma(total, exprProducto(A[fila][k], B[k][columna]));
            }

            filaResultado.push(total);
        }

        resultado.push(filaResultado);
    }

    return resultado;
}

function matrizIdentidadExpresion(tamano) {
    return Array.from({ length: tamano }, (_, fila) =>
        Array.from({ length: tamano }, (_, columna) => exprNumero(fila === columna ? 1 : 0))
    );
}

function renderMatrizEnContenedor(contenedor, matriz) {
    contenedor.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "matriz-resultado-grid";
    grid.dataset.rows = String(matriz.length);
    grid.dataset.cols = String(matriz[0].length);

    matriz.flat().forEach((expr) => {
        const celda = document.createElement("span");
        celda.textContent = exprTexto(expr);
        grid.appendChild(celda);
    });

    contenedor.appendChild(grid);
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

function limpiarRotacion() {
    limpiarCampos(idsRotacion);
    document.getElementById("ejeRotacion").value = "z";
    ["rotacionParametros", "rotacionVectorOriginal", "rotacionVectorResultado", "matrizRotacion", "productoRotacion"].forEach((id) => {
        document.getElementById(id).textContent = "";
    });
}

function cargarEjemploRotacion() {
    document.getElementById("ejeRotacion").value = "z";
    colocarValores({
        anguloRotacion: -90,
        rotRu: 4,
        rotRv: 8,
        rotRw: 12
    });
    calcularRotacion();
}

function obtenerMatrizRotacion(eje, grados) {
    const radianes = grados * Math.PI / 180;
    const c = limpiarNumero(Math.cos(radianes));
    const s = limpiarNumero(Math.sin(radianes));

    if (eje === "x") {
        return [
            [1, 0, 0, 0],
            [0, c, -s, 0],
            [0, s, c, 0],
            [0, 0, 0, 1]
        ];
    }

    if (eje === "y") {
        return [
            [c, 0, s, 0],
            [0, 1, 0, 0],
            [-s, 0, c, 0],
            [0, 0, 0, 1]
        ];
    }

    return [
        [c, -s, 0, 0],
        [s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function nombreRotacion(eje) {
    if (eje === "x") {
        return "Rotx";
    }

    if (eje === "y") {
        return "Roty";
    }

    return "Rotz";
}

function calcularRotacion() {
    const eje = document.getElementById("ejeRotacion").value;
    const angulo = numero("anguloRotacion");
    const ru = numero("rotRu");
    const rv = numero("rotRv");
    const rw = numero("rotRw");
    const matriz = obtenerMatrizRotacion(eje, angulo);
    const vector = [ru, rv, rw, 1];

    const resultado = matriz.map((fila) =>
        limpiarNumero(fila.reduce((total, valor, indice) => total + valor * vector[indice], 0))
    );

    const rotacion = nombreRotacion(eje);

    document.getElementById("rotacionParametros").textContent =
        `${rotacion}(${angulo.toFixed(4)}°) alrededor del eje O${eje.toUpperCase()}`;
    document.getElementById("rotacionVectorOriginal").textContent =
        `r_uvw = (${ru.toFixed(4)}, ${rv.toFixed(4)}, ${rw.toFixed(4)})`;
    document.getElementById("rotacionVectorResultado").textContent =
        `r_xyz = (${resultado[0].toFixed(4)}, ${resultado[1].toFixed(4)}, ${resultado[2].toFixed(4)})`;

    document.getElementById("matrizRotacion").textContent = matrizTexto(rotacion, matriz);
    renderProductoHomogeneo("productoRotacion", rotacion, matriz, vector, resultado, "r_uvw", "r_xyz");
}

function actualizarMatricesGenerales() {
    const dimensiones = dimensionesMatricesGenerales();
    crearMatrizGeneral("A", dimensiones.filasA, dimensiones.columnasA);
    crearMatrizGeneral("B", dimensiones.filasB, dimensiones.columnasB);
    actualizarOperacionMatrices();
}

function dimensionesMatricesGenerales() {
    return {
        filasA: parseInt(document.getElementById("filasMatrizA").value, 10),
        columnasA: parseInt(document.getElementById("columnasMatrizA").value, 10),
        filasB: parseInt(document.getElementById("filasMatrizB").value, 10),
        columnasB: parseInt(document.getElementById("columnasMatrizB").value, 10)
    };
}

function crearMatrizGeneral(nombre, filas, columnas) {
    const contenedor = document.getElementById(`matrizGeneral${nombre}`);
    const valoresAnteriores = {};

    contenedor.querySelectorAll("input").forEach((input) => {
        valoresAnteriores[input.dataset.posicion] = input.value;
    });

    contenedor.innerHTML = "";
    contenedor.dataset.rows = String(filas);
    contenedor.dataset.cols = String(columnas);

    for (let fila = 0; fila < filas; fila += 1) {
        for (let columna = 0; columna < columnas; columna += 1) {
            const input = document.createElement("input");
            const posicion = `${fila}-${columna}`;
            input.type = "text";
            input.inputMode = "text";
            input.dataset.posicion = posicion;
            input.id = `mat${nombre}${fila}${columna}`;
            input.placeholder = fila === columna ? "1" : "0";
            input.setAttribute("aria-label", `Matriz ${nombre} fila ${fila + 1} columna ${columna + 1}`);
            input.value = valoresAnteriores[posicion] || "";
            contenedor.appendChild(input);
        }
    }
}

function actualizarOperacionMatrices() {
    const operacion = document.getElementById("operacionMatrices").value;
    const necesitaB = ["suma", "resta", "multiplicacion"].includes(operacion);
    const necesitaEscalar = operacion === "escalar";
    document.getElementById("cardMatrizB").classList.toggle("oculto-card", !necesitaB);
    document.getElementById("campoEscalarMatrices").classList.toggle("oculto-control", !necesitaEscalar);
}

function leerMatrizGeneral(nombre) {
    const dimensiones = dimensionesMatricesGenerales();
    const filas = nombre === "A" ? dimensiones.filasA : dimensiones.filasB;
    const columnas = nombre === "A" ? dimensiones.columnasA : dimensiones.columnasB;
    const matriz = [];

    for (let fila = 0; fila < filas; fila += 1) {
        const filaValores = [];

        for (let columna = 0; columna < columnas; columna += 1) {
            filaValores.push(expresionDesdeEntrada(document.getElementById(`mat${nombre}${fila}${columna}`).value));
        }

        matriz.push(filaValores);
    }

    return matriz;
}

function limpiarMatricesGenerales() {
    document.querySelectorAll("#matrizGeneralA input, #matrizGeneralB input").forEach((input) => {
        input.value = "";
    });
    document.getElementById("escalarMatrices").value = "";
    document.getElementById("detalleMatrices").textContent = "";
    document.getElementById("resultadoMatricesGenerales").innerHTML = "";
}

function cargarEjemploMatricesGenerales() {
    document.getElementById("filasMatrizA").value = "2";
    document.getElementById("columnasMatrizA").value = "3";
    document.getElementById("filasMatrizB").value = "3";
    document.getElementById("columnasMatrizB").value = "2";
    document.getElementById("operacionMatrices").value = "multiplicacion";
    actualizarMatricesGenerales();
    colocarValores({
        matA00: "cos(30)",
        matA01: "-sen(30)",
        matA02: "a",
        matA10: "sen(30)",
        matA11: "cos(30)",
        matA12: "b",
        matB00: "x",
        matB01: "1",
        matB10: "2",
        matB11: "y",
        matB20: "3",
        matB21: "z"
    });
    calcularMatricesGenerales();
}

function sumarMatrices(A, B) {
    return A.map((fila, i) => fila.map((valor, j) => exprSuma(valor, B[i][j])));
}

function restarMatrices(A, B) {
    return A.map((fila, i) => fila.map((valor, j) => exprResta(valor, B[i][j])));
}

function multiplicarMatrices(A, B) {
    const filasA = A.length;
    const columnasA = A[0].length;
    const columnasB = B[0].length;
    const resultado = [];

    for (let fila = 0; fila < filasA; fila += 1) {
        const filaResultado = [];

        for (let columna = 0; columna < columnasB; columna += 1) {
            let total = exprNumero(0);

            for (let k = 0; k < columnasA; k += 1) {
                total = exprSuma(total, exprProducto(A[fila][k], B[k][columna]));
            }

            filaResultado.push(total);
        }

        resultado.push(filaResultado);
    }

    return resultado;
}

function transponerMatriz(A) {
    return Array.from({ length: A[0].length }, (_, columna) =>
        Array.from({ length: A.length }, (_, fila) => A[fila][columna])
    );
}

function escalarPorMatriz(escalar, A) {
    return A.map((fila) => fila.map((valor) => exprProducto(escalar, valor)));
}

function renderMatrizResultado(matriz) {
    const contenedor = document.getElementById("resultadoMatricesGenerales");
    contenedor.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "matriz-resultado-grid";
    grid.dataset.rows = String(matriz.length);
    grid.dataset.cols = String(matriz[0].length);

    matriz.flat().forEach((expr) => {
        const celda = document.createElement("span");
        celda.textContent = exprTexto(expr);
        grid.appendChild(celda);
    });

    contenedor.appendChild(grid);
}

function mostrarErrorMatrices(mensaje) {
    document.getElementById("detalleMatrices").textContent = mensaje;
    document.getElementById("resultadoMatricesGenerales").innerHTML = "";
}

function calcularMatricesGenerales() {
    const operacion = document.getElementById("operacionMatrices").value;
    const A = leerMatrizGeneral("A");
    const B = leerMatrizGeneral("B");
    const dimensiones = dimensionesMatricesGenerales();
    const detalle = document.getElementById("detalleMatrices");
    let resultado;

    if (operacion === "suma") {
        if (dimensiones.filasA !== dimensiones.filasB || dimensiones.columnasA !== dimensiones.columnasB) {
            mostrarErrorMatrices("Para sumar, A y B deben tener las mismas dimensiones.");
            return;
        }

        resultado = sumarMatrices(A, B);
        detalle.textContent = "Resultado de A + B";
    } else if (operacion === "resta") {
        if (dimensiones.filasA !== dimensiones.filasB || dimensiones.columnasA !== dimensiones.columnasB) {
            mostrarErrorMatrices("Para restar, A y B deben tener las mismas dimensiones.");
            return;
        }

        resultado = restarMatrices(A, B);
        detalle.textContent = "Resultado de A - B";
    } else if (operacion === "multiplicacion") {
        if (dimensiones.columnasA !== dimensiones.filasB) {
            mostrarErrorMatrices("Para multiplicar A x B, las columnas de A deben coincidir con las filas de B.");
            return;
        }

        resultado = multiplicarMatrices(A, B);
        detalle.textContent = `Resultado de A(${dimensiones.filasA}x${dimensiones.columnasA}) x B(${dimensiones.filasB}x${dimensiones.columnasB})`;
    } else if (operacion === "transpuesta") {
        resultado = transponerMatriz(A);
        detalle.textContent = `Transpuesta de A: ${dimensiones.columnasA}x${dimensiones.filasA}`;
    } else if (operacion === "determinante") {
        if (dimensiones.filasA !== dimensiones.columnasA) {
            mostrarErrorMatrices("El determinante solo existe para matrices cuadradas. Ajusta A para que filas A = columnas A.");
            return;
        }

        resultado = [[determinanteExpresion(A)]];
        detalle.textContent = "Determinante de A";
    } else {
        const escalar = expresionDesdeEntrada(document.getElementById("escalarMatrices").value);
        resultado = escalarPorMatriz(escalar, A);
        detalle.textContent = `Resultado de ${exprTexto(escalar)} x A`;
    }

    renderMatrizResultado(resultado);
}

function actualizarTablaDH() {
    const cantidad = parseInt(document.getElementById("numeroEslabonesDH").value, 10);
    const contenedor = document.getElementById("tablaDH");
    const valores = {};

    contenedor.querySelectorAll("input").forEach((input) => {
        valores[input.id] = input.value;
    });

    contenedor.innerHTML = "";

    for (let i = 1; i <= cantidad; i += 1) {
        const fila = document.createElement("div");
        fila.className = "tabla-dh";
        fila.innerHTML = `
            <span>${i}</span>
            <input type="text" id="dhTheta${i}" placeholder="theta${i}">
            <input type="text" id="dhD${i}" placeholder="d${i}">
            <input type="text" id="dhA${i}" placeholder="a${i}">
            <input type="text" id="dhAlpha${i}" placeholder="alpha${i}">
        `;
        contenedor.appendChild(fila);
    }

    Object.entries(valores).forEach(([id, valor]) => {
        const input = document.getElementById(id);
        if (input) input.value = valor;
    });
}

function leerParametrosDH() {
    const cantidad = parseInt(document.getElementById("numeroEslabonesDH").value, 10);
    const parametros = [];

    for (let i = 1; i <= cantidad; i += 1) {
        parametros.push({
            theta: expresionDesdeEntrada(document.getElementById(`dhTheta${i}`).value),
            d: expresionDesdeEntrada(document.getElementById(`dhD${i}`).value),
            a: expresionDesdeEntrada(document.getElementById(`dhA${i}`).value),
            alpha: expresionDesdeEntrada(document.getElementById(`dhAlpha${i}`).value)
        });
    }

    return parametros;
}

function matrizDH(parametro) {
    const ct = exprTrigonometrica("cos", parametro.theta);
    const st = exprTrigonometrica("sen", parametro.theta);
    const ca = exprTrigonometrica("cos", parametro.alpha);
    const sa = exprTrigonometrica("sen", parametro.alpha);

    return [
        [ct, exprNegativo(exprProducto(ca, st)), exprProducto(sa, st), exprProducto(parametro.a, ct)],
        [st, exprProducto(ca, ct), exprNegativo(exprProducto(sa, ct)), exprProducto(parametro.a, st)],
        [exprNumero(0), sa, ca, parametro.d],
        [exprNumero(0), exprNumero(0), exprNumero(0), exprNumero(1)]
    ];
}

function limpiarDH() {
    document.querySelectorAll("#tablaDH input").forEach((input) => {
        input.value = "";
    });
    document.getElementById("detalleDH").textContent = "";
    document.getElementById("resultadoTDH").innerHTML = "";
    document.getElementById("matricesIntermediasDH").innerHTML = "";
    document.getElementById("explicacionDH").innerHTML = "";
}

function cargarEjemploDH() {
    document.getElementById("numeroEslabonesDH").value = "4";
    actualizarTablaDH();
    colocarValores({
        dhTheta1: "q1",
        dhD1: "l1",
        dhA1: "0",
        dhAlpha1: "0",
        dhTheta2: "90",
        dhD2: "d2",
        dhA2: "0",
        dhAlpha2: "90",
        dhTheta3: "0",
        dhD3: "d3",
        dhA3: "0",
        dhAlpha3: "0",
        dhTheta4: "q4",
        dhD4: "l4",
        dhA4: "0",
        dhAlpha4: "0"
    });
    calcularDH();
}

function renderMatricesIntermediasDH(matrices) {
    const contenedor = document.getElementById("matricesIntermediasDH");
    contenedor.innerHTML = "";

    matrices.forEach((matriz, indice) => {
        const bloque = document.createElement("div");
        bloque.className = "matriz-dh-item";
        const titulo = document.createElement("h3");
        titulo.textContent = `A_${indice + 1}`;
        const matrizContenedor = document.createElement("div");
        matrizContenedor.className = "matriz-resultado";
        renderMatrizEnContenedor(matrizContenedor, matriz);
        bloque.appendChild(titulo);
        bloque.appendChild(matrizContenedor);
        contenedor.appendChild(bloque);
    });
}

function explicarDH(parametros) {
    const contenedor = document.getElementById("explicacionDH");
    contenedor.innerHTML = "";
    const pasos = [
        "1. Por cada eslabon se toman cuatro parametros: theta_i, d_i, a_i y alpha_i.",
        "2. Con esos parametros se arma A_i = Rotz(theta_i) . Tz(d_i) . Tx(a_i) . Rotx(alpha_i).",
        "3. theta y alpha son angulos. Si ingresas numeros, la app usa grados; si ingresas variables, conserva sen(variable) y cos(variable).",
        `4. Como ingresaste ${parametros.length} eslabon(es), la matriz final se calcula como T = ${parametros.map((_, i) => `A_${i + 1}`).join(" . ")}.`,
        "5. La submatriz 3x3 superior izquierda representa orientacion; la ultima columna representa posicion del extremo respecto a la base."
    ];

    pasos.forEach((paso) => {
        const p = document.createElement("p");
        p.textContent = paso;
        contenedor.appendChild(p);
    });
}

function calcularDH() {
    const parametros = leerParametrosDH();
    const matrices = parametros.map(matrizDH);
    const total = matrices.reduce((acumulado, matriz) => multiplicarMatricesExpresion(acumulado, matriz), matrizIdentidadExpresion(4));

    document.getElementById("detalleDH").textContent =
        `Matriz final T calculada con ${parametros.length} eslabon(es): T = ${parametros.map((_, i) => `A_${i + 1}`).join(" . ")}`;
    renderMatrizEnContenedor(document.getElementById("resultadoTDH"), total);
    renderMatricesIntermediasDH(matrices);
    explicarDH(parametros);
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

window.addEventListener("DOMContentLoaded", () => {
    actualizarMatricesGenerales();
    actualizarTablaDH();
});

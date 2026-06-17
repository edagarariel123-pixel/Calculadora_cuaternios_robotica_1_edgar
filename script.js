function mostrarCuaternios() {
    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("cuaternios").classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarMatrices() {
    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("matrices").classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function volverInicio() {
    document.getElementById("inicio").classList.remove("oculto");
    document.getElementById("cuaternios").classList.add("oculto");
    document.getElementById("matrices").classList.add("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function numero(id) {
    return parseFloat(document.getElementById(id).value) || 0;
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

    const multiplicacion = `Q3 = Q1 × Q2 = (${r0.toFixed(4)}, ${r1.toFixed(4)}, ${r2.toFixed(4)}, ${r3.toFixed(4)})`;
    const norma = Math.sqrt(r0 * r0 + r1 * r1 + r2 * r2 + r3 * r3);
    const textoNorma = `||Q3|| = ${norma.toFixed(4)}`;

    const denominador = a * a + b * b + c * c + d * d;
    const inverso = denominador === 0
        ? "Q1⁻¹ no existe porque la norma de Q1 es 0."
        : `Q1⁻¹ = (${(a / denominador).toFixed(4)}, ${(-b / denominador).toFixed(4)}, ${(-c / denominador).toFixed(4)}, ${(-d / denominador).toFixed(4)})`;

    let textoEscalar = "Escalar no ingresado";
    if (escalar !== "") {
        const k = parseFloat(escalar);
        textoEscalar = `k·Q1 = (${(k * a).toFixed(4)}, ${(k * b).toFixed(4)}, ${(k * c).toFixed(4)}, ${(k * d).toFixed(4)})`;
    }

    document.getElementById("suma").textContent = suma;
    document.getElementById("multiplicacion").textContent = multiplicacion;
    document.getElementById("norma").textContent = textoNorma;
    document.getElementById("inverso").textContent = inverso;
    document.getElementById("escalarResultado").textContent = textoEscalar;
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
┌                                             ┐
  ${Rt[0][0].toFixed(4)}   ${Rt[0][1].toFixed(4)}   ${Rt[0][2].toFixed(4)}   ${dx.toFixed(4)}
  ${Rt[1][0].toFixed(4)}   ${Rt[1][1].toFixed(4)}   ${Rt[1][2].toFixed(4)}   ${dy.toFixed(4)}
  ${Rt[2][0].toFixed(4)}   ${Rt[2][1].toFixed(4)}   ${Rt[2][2].toFixed(4)}   ${dz.toFixed(4)}
  0.0000   0.0000   0.0000   1.0000
└                                             ┘`;

    document.getElementById("resultadoMatriz").textContent = resultado;
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").catch(() => {
            // La app sigue funcionando aunque el navegador no permita service workers en archivo local.
        });
    });
}

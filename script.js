function mostrarCuaternios() {

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("cuaternios").classList.remove("oculto");
}

function mostrarMatrices() {

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("matrices").classList.remove("oculto");
}

function volverInicio() {

    document.getElementById("inicio").classList.remove("oculto");

    document.getElementById("cuaternios").classList.add("oculto");
    document.getElementById("matrices").classList.add("oculto");
}

function calcularCuaternios() {

    let a = parseFloat(document.getElementById("q1s").value) || 0;
    let b = parseFloat(document.getElementById("q1x").value) || 0;
    let c = parseFloat(document.getElementById("q1y").value) || 0;
    let d = parseFloat(document.getElementById("q1z").value) || 0;

    let e = parseFloat(document.getElementById("q2s").value) || 0;
    let f = parseFloat(document.getElementById("q2x").value) || 0;
    let g = parseFloat(document.getElementById("q2y").value) || 0;
    let h = parseFloat(document.getElementById("q2z").value) || 0;

    let escalar = document.getElementById("escalar").value;

    // SUMA

    let suma =
        `Q1 + Q2 = (${(a + e).toFixed(4)}, ${(b + f).toFixed(4)}, ${(c + g).toFixed(4)}, ${(d + h).toFixed(4)})`;

    // MULTIPLICACIÓN

    let r0 = a * e - b * f - c * g - d * h;
    let r1 = a * f + b * e + c * h - d * g;
    let r2 = a * g - b * h + c * e + d * f;
    let r3 = a * h + b * g - c * f + d * e;

    let multiplicacion =
        `Q3 = Q1 × Q2 = (${r0.toFixed(4)}, ${r1.toFixed(4)}, ${r2.toFixed(4)}, ${r3.toFixed(4)})`;

    // NORMA DE Q3

    let norma =
        Math.sqrt(
            r0 * r0 +
            r1 * r1 +
            r2 * r2 +
            r3 * r3
        );

    let textoNorma =
        `||Q3|| = ${norma.toFixed(4)}`;

    // INVERSO DE Q1

    let denominador =
        (a * a + b * b + c * c + d * d);

    let inverso =
        `Q1⁻¹ = (${(a / denominador).toFixed(4)}, ${(-b / denominador).toFixed(4)}, ${(-c / denominador).toFixed(4)}, ${(-d / denominador).toFixed(4)})`;

    // PRODUCTO POR ESCALAR

    let textoEscalar = "Escalar no ingresado";

    if (escalar !== "") {

        let k = parseFloat(escalar);

        textoEscalar =
            `k·Q1 = (${(k * a).toFixed(4)}, ${(k * b).toFixed(4)}, ${(k * c).toFixed(4)}, ${(k * d).toFixed(4)})`;
    }

    document.getElementById("suma").innerHTML = suma;
    document.getElementById("multiplicacion").innerHTML = multiplicacion;
    document.getElementById("norma").innerHTML = textoNorma;
    document.getElementById("inverso").innerHTML = inverso;
    document.getElementById("escalarResultado").innerHTML = textoEscalar;
}

function calcularInversa() {

    let R = [

        [
            parseFloat(document.getElementById("m00").value) || 0,
            parseFloat(document.getElementById("m01").value) || 0,
            parseFloat(document.getElementById("m02").value) || 0
        ],

        [
            parseFloat(document.getElementById("m10").value) || 0,
            parseFloat(document.getElementById("m11").value) || 0,
            parseFloat(document.getElementById("m12").value) || 0
        ],

        [
            parseFloat(document.getElementById("m20").value) || 0,
            parseFloat(document.getElementById("m21").value) || 0,
            parseFloat(document.getElementById("m22").value) || 0
        ]
    ];

    let d = [

        parseFloat(document.getElementById("m03").value) || 0,
        parseFloat(document.getElementById("m13").value) || 0,
        parseFloat(document.getElementById("m23").value) || 0

    ];

    // TRANSPUESTA

    let Rt = [

        [R[0][0], R[1][0], R[2][0]],
        [R[0][1], R[1][1], R[2][1]],
        [R[0][2], R[1][2], R[2][2]]

    ];

    // -Rᵀd

    let dx = -(
        Rt[0][0] * d[0] +
        Rt[0][1] * d[1] +
        Rt[0][2] * d[2]
    );

    let dy = -(
        Rt[1][0] * d[0] +
        Rt[1][1] * d[1] +
        Rt[1][2] * d[2]
    );

    let dz = -(
        Rt[2][0] * d[0] +
        Rt[2][1] * d[1] +
        Rt[2][2] * d[2]
    );

    let resultado =

`
┌                                             ┐

  ${Rt[0][0].toFixed(4)}   ${Rt[0][1].toFixed(4)}   ${Rt[0][2].toFixed(4)}   ${dx.toFixed(4)}

  ${Rt[1][0].toFixed(4)}   ${Rt[1][1].toFixed(4)}   ${Rt[1][2].toFixed(4)}   ${dy.toFixed(4)}

  ${Rt[2][0].toFixed(4)}   ${Rt[2][1].toFixed(4)}   ${Rt[2][2].toFixed(4)}   ${dz.toFixed(4)}

  0.0000   0.0000   0.0000   1.0000

└                                             ┘
`;

    document.getElementById("resultadoMatriz").innerHTML =
        resultado;
}
let categoriaActual = "Agujas";

let inventario = JSON.parse(localStorage.getItem("inventario")) || {
    Agujas: [],
    Consumibles: [],
    Otros: []
};
const nombrePedido = document.getElementById("nombrePedido");
const fechaPedido = document.getElementById("fechaPedido");

nombrePedido.value = localStorage.getItem("nombrePedido") || "";
fechaPedido.value = localStorage.getItem("fechaPedido") || "";

nombrePedido.addEventListener("input", () => {
    localStorage.setItem("nombrePedido", nombrePedido.value);
});

fechaPedido.addEventListener("change", () => {
    localStorage.setItem("fechaPedido", fechaPedido.value);
});

function guardarInventario() {
    localStorage.setItem("inventario", JSON.stringify(inventario));
}

function cambiarCategoria(categoria) {
    categoriaActual = categoria;

    document.getElementById("tituloCategoria").textContent = categoria;

    mostrarMateriales();
    
}

function añadirMaterial() {
    inventario[categoriaActual].push({
        material: "",
        cantidad: 1,
        precio: 0
    });

    guardarInventario();
    mostrarMateriales();
}

function eliminarMaterial(indice) {
    inventario[categoriaActual].splice(indice, 1);

    guardarInventario();
    mostrarMateriales();
}

function actualizarMaterial(indice, campo, valor) {
    inventario[categoriaActual][indice][campo] = valor;

    guardarInventario();
    mostrarMateriales();
}

function mostrarMateriales() {
    const tabla = document.getElementById("tablaMateriales");

    tabla.innerHTML = "";

    let total = 0;

    inventario[categoriaActual].forEach((item, indice) => {

        const precioTotal = item.cantidad * item.precio;

        total += precioTotal;

        tabla.innerHTML += `
            <tr>
                <td>
                    <input 
                        type="text"
                        value="${item.material}"
                        placeholder="Material"
                        onchange="actualizarMaterial(${indice}, 'material', this.value)"
                    >
                </td>

                <td>
                    <input 
                        type="number"
                        min="0"
                        value="${item.cantidad}"
                        onchange="actualizarMaterial(${indice}, 'cantidad', Number(this.value))"
                    >
                </td>

                <td>
                    <input 
                        type="number"
                        min="0"
                        step="0.01"
                        value="${item.precio}"
                        onchange="actualizarMaterial(${indice}, 'precio', Number(this.value))"
                    >
                </td>

                <td>
                    ${precioTotal.toFixed(2)} €
                </td>

                <td>
                    <button onclick="eliminarMaterial(${indice})">❌</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalCategoria").textContent =
    `Total categoría: ${total.toFixed(2)} €`;

let totalInventario = 0;

Object.values(inventario).forEach(categoria => {
    categoria.forEach(item => {
        totalInventario += item.cantidad * item.precio;
    });
});

document.getElementById("totalInventario").textContent =
    `TOTAL INVENTARIO: ${totalInventario.toFixed(2)} €`;
}

mostrarMateriales();function limpiarCantidades() {
    const confirmar = confirm(
        "¿Quieres poner todas las cantidades a 0?\n\nLos precios se conservarán."
    );

    if (!confirmar) {
        return;
    }

    inventario[categoriaActual].forEach(item => {
        item.cantidad = 0;
    });

    guardarInventario();
    mostrarMateriales();
}

function limpiarPedido() {
    const confirmar = confirm(
        "¿Quieres limpiar el pedido completo?\n\nSe eliminarán cantidades y precios. Los materiales no se borrarán."
    );

    if (!confirmar) {
        return;
    }

    Object.values(inventario).forEach(categoria => {
        categoria.forEach(item => {
            item.cantidad = 0;
            item.precio = 0;
        });
    });

    nombrePedido.value = "";
    fechaPedido.value = new Date().toISOString().split("T")[0];

    localStorage.removeItem("nombrePedido");
    localStorage.setItem("fechaPedido", fechaPedido.value);

    guardarInventario();
    mostrarMateriales();
}
function generarPedido() {
    let contenido = "";

    let totalPedido = 0;

    Object.entries(inventario).forEach(([categoria, materiales]) => {

        const materialesConCantidad = materiales.filter(item => item.cantidad > 0);

        if (materialesConCantidad.length === 0) {
            return;
        }

        let totalCategoria = 0;

        contenido += `
            <section class="categoriaPedido">
                <h2>${categoria}</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Cantidad</th>
                            <th>Precio unidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
        `;

        materialesConCantidad.forEach(item => {

            const total = item.cantidad * item.precio;

            totalCategoria += total;

            contenido += `
                <tr>
                    <td>${item.material}</td>
                    <td>${item.cantidad}</td>
                    <td>${item.precio.toFixed(2)} €</td>
                    <td>${total.toFixed(2)} €</td>
                </tr>
            `;
        });

        totalPedido += totalCategoria;

        contenido += `
                    </tbody>
                </table>

                <h3>Total ${categoria}: ${totalCategoria.toFixed(2)} €</h3>
            </section>
        `;
    });

    contenido += `
        <div class="totalPedido">
            TOTAL PEDIDO: ${totalPedido.toFixed(2)} €
        </div>
    `;

    document.getElementById("contenidoPedido").innerHTML = `
    <div class="cabeceraPedido">

        <div class="datosPedido">
            <div><strong>Pedido:</strong> ${nombrePedido.value || "Sin nombre"}</div>
            <div><strong>Fecha:</strong> ${fechaPedido.value || "Sin fecha"}</div>
        </div>
    </div>

    ${contenido}
    `;

    document.getElementById("pedidoLimpio").style.display = "block";

    document.getElementById("botonGenerar").style.display = "none";

    document.getElementById("categorias").style.display = "none";
    document.getElementById("tituloCategoria").style.display = "none";
    document.querySelector("table").style.display = "none";
    document.getElementById("botonesPedido").style.display = "none";
    document.getElementById("totalCategoria").style.display = "none";
    document.getElementById("totalInventario").style.display = "none";
    document.getElementById("datosPedido").style.display = "none";
    document.getElementById("datosPedido").style.setProperty("display", "none", "important");
}

function volverAlPedido() {
    document.getElementById("pedidoLimpio").style.display = "none";

    document.getElementById("botonGenerar").style.display = "inline-block";

    document.getElementById("categorias").style.display = "flex";
    document.getElementById("tituloCategoria").style.display = "block";
    document.querySelector("table").style.display = "table";
    document.getElementById("botonesPedido").style.display = "flex";
    document.getElementById("totalCategoria").style.display = "block";
    document.getElementById("totalInventario").style.display = "block";
    document.getElementById("datosPedido").style.display = "flex";
}
function imprimirPedido() {
    window.print();
}

function exportarMateriales() {
    const datosExportar = {};

    Object.entries(inventario).forEach(([categoria, materiales]) => {
        datosExportar[categoria] = materiales.map(item => ({
            material: item.material
        }));
    });

    const archivo = new Blob(
        [JSON.stringify(datosExportar, null, 2)],
        { type: "application/json" }
    );

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "materiales_pedidos.json";

    enlace.click();

    URL.revokeObjectURL(enlace.href);
}

function importarMateriales(event) {
    const archivo = event.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function(e) {
        try {
            const datos = JSON.parse(e.target.result);

            if (typeof datos !== "object" || datos === null) {
                throw new Error("Formato no válido");
            }

            Object.entries(datos).forEach(([categoria, materiales]) => {
    datos[categoria] = materiales.map(item => ({
        material: item.material,
        precio: 0,
        cantidad: 0
    }));
});

        inventario = datos;

            localStorage.setItem("inventario", JSON.stringify(inventario));

            alert("Materiales importados correctamente.");

            location.reload();

        } catch (error) {
            alert("No se ha podido importar el archivo. Comprueba que sea un archivo de materiales válido.");
        }
    };

    lector.readAsText(archivo);
}
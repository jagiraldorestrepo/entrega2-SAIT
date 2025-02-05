document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("agregarHerramientaForm");
const herramientasList = document.getElementById("herramientas-list");

// Cargar herramientas almacenadas en localStorage al iniciar
cargarHerramientas();

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener datos del formulario
    const modulo = document.getElementById("modulo").value;
    const nombre = document.getElementById("nombre").value;
    const id = document.getElementById("id").value;
    const estado = document.getElementById("estado").value;
    const fotoInput = document.getElementById("foto");
    const fotoFile = fotoInput.files[0];

    const herramientas = JSON.parse(localStorage.getItem("herramientas")) || [];

    const existe = herramientas.some(herramienta => herramienta.id === id);
    if (existe) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "El ID ya está registrado. Ingresa un ID diferente.",
            showConfirmButton: true
        });
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        const fotoUrl = e.target.result;

        // Crear objeto herramienta
        const herramienta = { modulo, nombre, id, foto: fotoUrl, estado};

        // Guardar en localStorage
        guardarHerramienta(herramienta);

        // Mostrar en la vista
        mostrarHerramienta(herramienta);

        // Limpiar formulario
        form.reset();

        // Mostrar alerta con SweetAlert
        Swal.fire({
            icon: "success",
            title: "Herramienta Agregada",
            text: `${nombre} ha sido guardado correctamente.`,
            showConfirmButton: false,
            timer: 2000
        });
    };

    if (fotoFile) {
        reader.readAsDataURL(fotoFile);
    } else {
        // Usar una imagen predeterminada
        const defaultFotoUrl = "/imagenes/herramientaPredeterminada.jpg"; // Cambia esta ruta a la de tu imagen predeterminada

        // Crear objeto herramienta con imagen predeterminada
        const herramienta = { modulo, nombre, id, foto: defaultFotoUrl, estado};

        // Guardar en localStorage
        guardarHerramienta(herramienta);

        // Mostrar en la vista
        mostrarHerramienta(herramienta);

        // Limpiar formulario
        form.reset();

        // Mostrar alerta con SweetAlert
        Swal.fire({
            icon: "success",
            title: "Herramienta Agregada",
            text: `${nombre} ha sido guardado correctamente.`,
            showConfirmButton: false,
            timer: 2000
        });
    }
});

function guardarHerramienta(herramienta) {
    const herramientas = JSON.parse(localStorage.getItem("herramientas")) || [];
    herramientas.push(herramienta);
    localStorage.setItem("herramientas", JSON.stringify(herramientas));
}

function cargarHerramientas() {
    const herramientas = JSON.parse(localStorage.getItem("herramientas")) || [];
    herramientasList.innerHTML = ""; // Limpiar lista

    if (herramientas.length === 0) {
        herramientasList.innerHTML = "<p>No hay herramientas agregadas aún.</p>";
    } else {
        herramientas.forEach(mostrarHerramienta);
    }
}

function mostrarHerramienta(herramienta) {
    const card = document.createElement("div");
    card.classList.add("herramienta-card");

    card.innerHTML = `
        <img src="${herramienta.foto}" alt="${herramienta.nombre}">
        <h3>${herramienta.nombre}</h3>
        <p><strong>Modulo:</strong> ${herramienta.modulo}</p>
        <p><strong>ID:</strong> ${herramienta.id}</p>
        <p><strong>estado:</strong> ${herramienta.estado}</p>
        <button class="eliminar-btn" data-id="${herramienta.id}" aria-label="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="Red" class="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
          </svg>
      </button>
    `;
    card.querySelector(".eliminar-btn").addEventListener("click", () => {
      eliminarPersona(herramienta.id);
  });
  herramientasList.appendChild(card);
}

function eliminarPersona(id) {
  let herramientas = JSON.parse(localStorage.getItem("herramientas")) || [];
  herramientas = herramientas.filter(herramienta => herramienta.id !== id);
  localStorage.setItem("herramientas", JSON.stringify(herramientas));

  // Volver a cargar la lista
  cargarHerramientas();

  // Mostrar alerta de eliminación
  Swal.fire({
      icon: "warning",
      title: "Herramienta Eliminada",
      text: "La Herramienta ha sido eliminada correctamente.",
      showConfirmButton: false,
      timer: 2000
  });
}
});
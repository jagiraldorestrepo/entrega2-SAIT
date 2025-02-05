document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("agregarConsumibleForm");
  const consumiblesList = document.getElementById("consumibles-list");

  // Cargar consumible almacenadas en localStorage al iniciar
  cargarConsumibles();

  form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Obtener datos del formulario
      const modulo = document.getElementById("modulo").value;
      const nombre = document.getElementById("nombre").value;
      const id = document.getElementById("id").value;
      const estado = document.getElementById("estado").value;
      const cantidad = document.getElementById("cantidad").value;
      const costo = document.getElementById("costo").value;
      const fotoInput = document.getElementById("foto");
      const fotoFile = fotoInput.files[0];

      const reader = new FileReader();
      reader.onload = function (e) {
          const fotoUrl = e.target.result;

          // Crear objeto consumible
          const consumible = { modulo, nombre, id, foto: fotoUrl, estado, cantidad, costo};

          // Guardar en localStorage
          guardarConsumible(consumible);

          // Mostrar en la vista
          mostrarConsumible(consumible);

          // Limpiar formulario
          form.reset();

          // Mostrar alerta con SweetAlert
          Swal.fire({
              icon: "success",
              title: "Consumible Agregada",
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

          // Crear objeto consumible con imagen predeterminada
          const consumible = { modulo, nombre, id, foto: defaultFotoUrl, estado, cantidad, costo};

          // Guardar en localStorage
          guardarConsumible(consumible);

          // Mostrar en la vista
          mostrarConsumible(consumible);
          // Limpiar formulario
          form.reset();

          // Mostrar alerta con SweetAlert
          Swal.fire({
              icon: "success",
              title: "Consumible Agregada",
              text: `${nombre} ha sido guardado correctamente.`,
              showConfirmButton: false,
              timer: 2000
          });
      }
  });

  function guardarConsumible(consumible) {
      const consumibles = JSON.parse(localStorage.getItem("consumibles")) || [];
      consumibles.push(consumible);
      localStorage.setItem("consumibles", JSON.stringify(consumibles));
  }

  function cargarConsumibles() {
      const consumibles = JSON.parse(localStorage.getItem("consumibles")) || [];
      consumiblesList.innerHTML = ""; // Limpiar lista

      if (consumibles.length === 0) {
          consumiblesList.innerHTML = "<p>No hay consumibles agregados aún.</p>";
      } else {
          consumibles.forEach(mostrarConsumible);
      }
  }

  function mostrarConsumible(consumible) {
      const card = document.createElement("div");
      card.classList.add("consumible-card");

      card.innerHTML = `
          <img src="${consumible.foto}" alt="${consumible.nombre}">
          <h3>${consumible.nombre}</h3>
          <p><strong>Modulo:</strong> ${consumible.modulo}</p>
          <p><strong>ID:</strong> ${consumible.id}</p>
          <p><strong>estado:</strong> ${consumible.estado}</p>
          <p><strong>cantidad:</strong> ${consumible.cantidad}</p>
          <p><strong>costo:</strong> ${consumible.costo}</p>
      `;

      consumiblesList.appendChild(card);
  }
});
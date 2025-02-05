document.addEventListener("DOMContentLoaded", () => {
  const mechanicList = document.getElementById("mechanicList");
  const toolList = document.getElementById("toolList");
  const viewTableBody = document.getElementById("viewTableBody");

  // Cargar mecánicos y herramientas almacenadas en localStorage al iniciar
  cargarMecanicos();
  cargarHerramientas();
  cargarVista();

  function cargarMecanicos() {
      const mechanics = JSON.parse(localStorage.getItem("personas")) || [];
      mechanicList.innerHTML = ""; // Limpiar lista

      if (mechanics.length === 0) {
          mechanicList.innerHTML = "<p>No hay mecánicos agregados aún.</p>";
      } else {
          mechanics.forEach(mostrarMecanico);
      }
  }

  function cargarHerramientas() {
      const tools = JSON.parse(localStorage.getItem("herramientas")) || [];
      toolList.innerHTML = ""; // Limpiar lista

      if (tools.length === 0) {
          toolList.innerHTML = "<p>No hay herramientas agregadas aún.</p>";
      } else {
          tools.forEach(mostrarHerramienta);
      }
  }

  function cargarVista() {
      const tools = JSON.parse(localStorage.getItem("herramientas")) || [];
      viewTableBody.innerHTML = ""; // Limpiar tabla

      tools.filter(tool => tool.estado !== "Disponible").forEach(tool => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${tool.mecanico}</td>
              <td>${tool.nombre}</td>
              <td>${tool.fechaEntrega || 'N/A'}</td>
          `;
          viewTableBody.appendChild(row);
      });
  }

  function mostrarMecanico(mecanico) {
      const div = document.createElement("div");
      div.className = "mechanic";
      div.innerHTML = `<img src="${mecanico.foto}" alt="${mecanico.nombre}"><p>${mecanico.nombre}</p>`;
      div.onclick = () => selectMechanic(mecanico.nombre);
      mechanicList.appendChild(div);
  }

  function mostrarHerramienta(herramienta) {
      const div = document.createElement("div");
      div.className = "tool";
      div.innerHTML = `<img src="${herramienta.foto}" alt="${herramienta.nombre}"><p>${herramienta.nombre}</p>`;
      div.onclick = () => selectTool(herramienta.id);
      toolList.appendChild(div);
  }

  function selectMechanic(name) {
      document.getElementById("selectedMechanic").textContent = name;
  }

  function selectTool(id) {
      const tools = JSON.parse(localStorage.getItem("herramientas")) || [];
      const tool = tools.find(tool => tool.id === id);
      if (tool) {
          document.getElementById("selectedTool").textContent = tool.nombre;
          document.getElementById("selectedToolId").value = tool.id;
          toggleButtons(tool.estado, tool.mecanico);
      }
  }

  function toggleButtons(estado, mecanico) {
      const entregaButton = document.getElementById("entregaButton");
      const recibeButton = document.getElementById("recibeButton");
      const selectedMechanic = document.getElementById("selectedMechanic").textContent;

      if (estado === "Disponible") {
          entregaButton.style.display = "inline-block";
          recibeButton.style.display = "none";
      } else if (mecanico === selectedMechanic) {
          entregaButton.style.display = "none";
          recibeButton.style.display = "inline-block";
      } else {
          entregaButton.style.display = "none";
          recibeButton.style.display = "none";
      }
  }

  window.registerAction = function (action) {
      const selectedMechanic = document.getElementById("selectedMechanic").textContent;
      const selectedToolId = document.getElementById("selectedToolId").value;
      const dateTime = document.getElementById("dateTime").value;

      if (action === 'entrega' && selectedMechanic !== 'N/A' && selectedToolId) {
          const tools = JSON.parse(localStorage.getItem("herramientas")) || [];
          const toolIndex = tools.findIndex(tool => tool.id === selectedToolId);
          if (toolIndex !== -1) {
              tools[toolIndex].estado = "No disponible";
              tools[toolIndex].mecanico = selectedMechanic;
              tools[toolIndex].fechaEntrega = dateTime;
              localStorage.setItem("herramientas", JSON.stringify(tools));
              cargarHerramientas(); // Recargar la lista de herramientas
              cargarVista(); // Recargar la vista
              Swal.fire({
                  icon: "success",
                  title: "Herramienta Entregada",
                  text: "La herramienta ha sido entregada correctamente.",
                  showConfirmButton: false,
                  timer: 2000
              });
          }
      } else if (action === 'recibe' && selectedToolId) {
          const tools = JSON.parse(localStorage.getItem("herramientas")) || [];
          const toolIndex = tools.findIndex(tool => tool.id === selectedToolId);
          if (toolIndex !== -1 && tools[toolIndex].mecanico === selectedMechanic) {
              tools[toolIndex].estado = "Disponible";
              tools[toolIndex].mecanico = null;
              tools[toolIndex].fechaEntrega = null;
              localStorage.setItem("herramientas", JSON.stringify(tools));
              cargarHerramientas(); // Recargar la lista de herramientas
              cargarVista(); // Recargar la vista
              Swal.fire({
                  icon: "success",
                  title: "Herramienta Recibida",
                  text: "La herramienta ha sido recibida correctamente.",
                  showConfirmButton: false,
                  timer: 2000
              });
          } else {
              Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Solo el mecánico que alquiló la herramienta puede devolverla.",
                  showConfirmButton: true
              });
          }
      }
  }
});
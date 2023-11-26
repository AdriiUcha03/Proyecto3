//Implementación de nuevas cosas vistas en clases

//Selector Principal
document.addEventListener("DOMContentLoaded",iniciarApp)

function iniciarApp() {  
  //Obtener todos los cursos
  const obtenerCursos = () => {
    const url = './cursos.json';
    fetch(url)
      .then((result) => result.json())
      .then((data) => mostrarCursos(data))
  }

  obtenerCursos()

  const obtenerCursosPorAutor = (autor) => {
    const url = './cursos.json';
  
    fetch(url)
      .then((result) => result.json())
      .then((data) => {
        const cursosEncontrados = data.filter((curso) => curso.autor === autor);
        mostrarCursos(cursosEncontrados);
      })
  };

  // Selector para filtrar autores
  const selectAutores = document.querySelector("#buscador")
    if(selectAutores){
        selectAutores.addEventListener("change", () =>{
          const autorSeleccionado = selectAutores.value;
          obtenerCursosPorAutor(autorSeleccionado);
        })
    }

  //Selector donde se insertan las tarjetas
  const resultado = document.querySelector("#resultado")

  // Instanciamos el modal que vamos a usar para la gestion de las tarjetas
  const modal = new bootstrap.Modal("#modal", {})
  
  // Limpiar la sección de las tarjetas del HTML
  const limpiarHTML = (selector) => {
    while(selector.firstChild) {
        selector.removeChild(selector.firstChild)
    }
  }

  //Seleccionar el curso por nombre
  const seleccionarCurso = (nombrecurso) => {
    const url = './cursos.json'; 
    fetch(url)
        .then((result) => result.json())
        .then((data) => {
          mostrarCursoModal(cursoFind = data.find((curso) => curso.nombrecurso === nombrecurso))
        })
      }


  //Muestra Curso Modal
  const mostrarCursoModal = (curso = [] ) => {
    const{nombrecurso, autor, img ,precio} = curso
    const modalTitle = document.querySelector(".modal .modal-title")
    const modalBody = document.querySelector(".modal .modal-body")
    modalTitle.textContent = nombrecurso
    modalBody.innerHTML = `
      <img class="img-fluid" src=${img} alt="Imagen de autor ${autor}">
      <h2 class="my-3">Profesor: ${autor}.</h2>
      <hr><h4>Precio: ${precio}</h4><hr>
    `

    // Mostramos los botones 
    const modalFooter = document.querySelector(".modal-footer")
    // Limpiamos footer para que no se dupliquen los botones
    limpiarHTML(modalFooter)
    // Btn Agregar al Carrito
    const btnAgregarCarrito = document.createElement("button")
    btnAgregarCarrito.classList.add("btn", "btn-warning", "col")
    btnAgregarCarrito.textContent = "Agregar al Carrito" 
    btnAgregarCarrito.addEventListener("click", () => {
      añadirCurso(nombrecurso);
    });
    modalFooter.appendChild(btnAgregarCarrito)

    // Btn cerrar
    const btnCerrar = document.createElement("button")
    btnCerrar.classList.add("btn", "btn-secondary", "col")
    btnCerrar.textContent = "Cerrar receta"
    // Funcionalidad del botón cerrar
    btnCerrar.onclick = () => {
        modal.hide()
    }
    modalFooter.appendChild(btnCerrar)

    modal.show()
  }

  // Mostrar Los Cursos
  const mostrarCursos = (cursos = []) =>{
    limpiarHTML(resultado)

    cursos.forEach(curso =>{ //Bucle para crear los cursos
      const contenedorCursos = document.createElement("div")
      contenedorCursos.classList.add("col-md-4", "mb-4", "border" ,"rounded", "m-4")
      const {nombrecurso, autor, img} = curso

      //Card de un curso
      const cursoCard = document.createElement("div")
      cursoCard.classList.add("card-img-top")

      //Creación de la imagen del curso
      const cursoImagen = document.createElement("img")
      cursoImagen.classList.add("card-img-top")
      cursoImagen.alt = `Imagen de ${autor}`
      cursoImagen.src= img

      // Body del Card
      const cursoCardBody = document.createElement("div")
      cursoCardBody.classList.add("card-body", "m-4")
      
      //Titulo del curso
      const cursoHead = document.createElement("h3")
      cursoHead.classList.add("card-title","mb-3")
      cursoHead.textContent = nombrecurso

      //Boton para ver Modal del curso dentro introduciremos el precio
      const cursoButton = document.createElement("button")
      cursoButton.classList.add("btn","btn-danger","w-100")
      cursoButton.textContent = "Ver Curso"
      cursoButton.addEventListener("click", () => {
        seleccionarCurso(nombrecurso);
      });

      //Montamos la tarjeta y la insertamos en su sitio
      cursoCardBody.appendChild(cursoHead)
      cursoCardBody.appendChild(cursoButton)
      cursoCard.appendChild(cursoImagen)
      cursoCard.appendChild(cursoCardBody)
      contenedorCursos.appendChild(cursoCard)
      resultado.appendChild(contenedorCursos)

    } )
  } 

  const añadirCurso = (nombrecurso) => {
    // Buscar el curso en los datos
    const url = './cursos.json'; 
    fetch(url)
        .then((result) => result.json())
        .then((data) => {
          //Le paso el curso al carrito
          leerDatosCurso(cursoFind = data.find((curso) => curso.nombrecurso === nombrecurso))
        })
      };



// Vaciando el carrito
//  *** Variables ***
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
//Le agregamos lo que haya en la variable localstorage si hay algo
let articulosCarrito = [];
if (localStorage.getItem("array") !== null) {
    articulosCarrito = JSON.parse(localStorage.getItem("array"));
}
//  *** Listeners ***
cargarEventListeners();
function cargarEventListeners() {
  carrito.addEventListener("click", eliminarCurso);

  // Vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; // Vaciamos el array
    limpiarCarrito(); // Limpiamos el HTML
  });
}

//  *** Funciones ***
// Elimina cursos del carrito
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
    carritoHTML(articulosCarrito);
  }
}

const mostrarToast = () => {
  const toastDiv = document.querySelector("#toast")
  const toastDivBody = document.querySelector(".toast-body")
  const toast = new bootstrap.Toast(toastDiv)
  toastDivBody.textContent = "Curso Agregado al Carrito"
  toast.show()
}

// Lee la información del curso seleccionado.
function leerDatosCurso(curso = {nombrecurso, autor, img, precio}) {
  const infoCurso = {
    imagen: curso.img,
    titulo: curso.nombrecurso,
    precio: curso.precio,
    id: curso.nombrecurso,
    cantidad: 1,
  };
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso;
      } else {
        return curso;
      }
    });
    articulosCarrito = [...cursos];
  } else {
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  //Una vez generado los articulosCarrito los almacenamos en localstorage con cada modificacion que se haga
  modal.hide()
  mostrarToast()
  localStorage.setItem("array", JSON.stringify(articulosCarrito))
  carritoHTML(articulosCarrito);
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
  limpiarCarrito();
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
            <td> 
                <img src="${curso.imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
            `;
    contenedorCarrito.appendChild(row);
  });
}

// Función para limpiar el HTML (elimina los cursos del tbody)
function limpiarCarrito() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.firstChild.remove();
  }
}

//Tendremos que cargar la lista por si hay algo en LocalStorage
document.addEventListener("DOMContentLoaded", () => {
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
            <td> 
                <img src="${curso.imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
            `;
    contenedorCarrito.appendChild(row);
  });
});

}
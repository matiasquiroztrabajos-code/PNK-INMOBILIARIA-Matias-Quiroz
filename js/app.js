// ===== FUNCIONES GLOBALES DE APLICACIÓN =====

// Función de búsqueda de propiedades
function buscar() {
  const tipoPropiedad = document.getElementById('tipo-propiedad')?.value;
  const ubicacion = document.getElementById('ubicacion-busqueda')?.value;
  
  if (!tipoPropiedad && !ubicacion) {
    alert('Por favor, ingresa al menos un criterio de búsqueda');
    return;
  }
  
  console.log(`Buscando: Tipo=${tipoPropiedad}, Ubicación=${ubicacion}`);
  alert(`Buscando propiedades en ${ubicacion || 'todas las ubicaciones'}...`);
}

// Función para solicitar visita
function solicitarVisita() {
  const nombrePropiedad = document.querySelector('.detail-header h1')?.textContent || 'la propiedad';
  alert(`Solicitud de visita para ${nombrePropiedad} enviada correctamente. Pronto nos pondremos en contacto.`);
}

// Función para enviar mensaje
function enviarMensaje() {
  alert('Abriendo formulario de contacto...');
}

// Función para compartir propiedad
function compartir() {
  if (navigator.share) {
    navigator.share({
      title: 'PNK Inmobiliaria',
      text: 'Te presento esta propiedad disponible',
      url: window.location.href
    }).catch(err => console.log('Error al compartir:', err));
  } else {
    const url = window.location.href;
    const text = `${url}\n\nVe esta propiedad en PNK Inmobiliaria`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Enlace copiado al portapapeles');
    });
  }
}

// Validación de formularios
function validarFormulario(form) {
  const campos = form.querySelectorAll('[required]');
  let valido = true;
  
  campos.forEach(campo => {
    if (!campo.value.trim()) {
      campo.classList.add('error');
      valido = false;
    } else {
      campo.classList.remove('error');
    }
  });
  
  return valido;
}

// Validación de correo electrónico
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validación de RUT (formato chileno)
function validarRUT(rut) {
  const rutLimpio = rut.replace(/[^\dk]/gi, '').toLowerCase();
  if (rutLimpio.length < 7) return false;
  
  const numeros = rutLimpio.slice(0, -1);
  const digito = rutLimpio.slice(-1);
  
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numeros.length - 1; i >= 0; i--) {
    suma += parseInt(numeros[i]) * multiplicador;
    multiplicador++;
    if (multiplicador > 7) multiplicador = 2;
  }
  
  const digitoEsperado = 11 - (suma % 11);
  const digitoFinal = digitoEsperado === 11 ? '0' : digitoEsperado === 10 ? 'k' : digitoEsperado.toString();
  
  return digito === digitoFinal;
}

// Validación de contraseña segura
function validarContrasenya(password) {
  if (password.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*]/.test(password)) return false;
  return true;
}

// Formatear precio a moneda chilena
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(precio);
}

// Manejador de clicks en botones "Ver más" de propiedades
// Event listeners para formularios
document.addEventListener('DOMContentLoaded', function() {
  // Interceptar clicks en botones "Ver más" (tanto en propiedades.html como index.html)
  const botonesVerMas = document.querySelectorAll('.btn-more, .card a[href="detalle.html"]');
  
  botonesVerMas.forEach(boton => {
    boton.addEventListener('click', function(e) {
      // Encontrar la imagen dentro de la tarjeta
      const card = this.closest('.card');
      
      // Buscar imagen: primero en .card-image (propiedades.html), luego directamente en .card (index.html)
      let imagen = card?.querySelector('.card-image img');
      if (!imagen) {
        imagen = card?.querySelector('img');
      }
      
      if (imagen && imagen.src) {
        // Pasar la URL de la imagen como parámetro
        const imagenURL = encodeURIComponent(imagen.src);
        this.href = `detalle.html?imagen=${imagenURL}`;
      }
    });
  });
  
  // Inicializar tooltips y validaciones
  const forms = document.querySelectorAll('form[novalidate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validarFormulario(this)) {
        console.log('Formulario válido, enviando...');
        // Aquí iría la lógica de envío del formulario
        alert('Formulario enviado correctamente');
        this.reset();
      } else {
        alert('Por favor, completa todos los campos requeridos correctamente');
      }
    });
  });
  
  // Validación en tiempo real para campos de email
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !validarEmail(this.value)) {
        this.classList.add('error');
        this.setAttribute('aria-invalid', 'true');
      } else {
        this.classList.remove('error');
        this.setAttribute('aria-invalid', 'false');
      }
    });
  });
  
  // Validación en tiempo real para campos de RUT
  const rutInputs = document.querySelectorAll('input[name="rut"]');
  rutInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !validarRUT(this.value)) {
        this.classList.add('error');
        this.setAttribute('aria-invalid', 'true');
      } else {
        this.classList.remove('error');
        this.setAttribute('aria-invalid', 'false');
      }
    });
  });
  
  // Validación en tiempo real para contraseñas
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !validarContrasenya(this.value)) {
        this.classList.add('error');
        this.setAttribute('aria-invalid', 'true');
      } else {
        this.classList.remove('error');
        this.setAttribute('aria-invalid', 'false');
      }
    });
  });
});

// Funciones de utilidad para localStorage
const Storage = {
  set: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  },
  
  get: function(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error al leer de localStorage:', e);
      return null;
    }
  },
  
  remove: function(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error al eliminar de localStorage:', e);
    }
  }
};

// Gestión de favoritos
const Favoritos = {
  agregar: function(propiedadId) {
    const favoritos = Storage.get('favoritos') || [];
    if (!favoritos.includes(propiedadId)) {
      favoritos.push(propiedadId);
      Storage.set('favoritos', favoritos);
      console.log('Propiedad agregada a favoritos');
    }
  },
  
  remover: function(propiedadId) {
    const favoritos = Storage.get('favoritos') || [];
    const index = favoritos.indexOf(propiedadId);
    if (index > -1) {
      favoritos.splice(index, 1);
      Storage.set('favoritos', favoritos);
      console.log('Propiedad removida de favoritos');
    }
  },
  
  obtener: function() {
    return Storage.get('favoritos') || [];
  }
};

// Gestión de sesión
const Sesion = {
  iniciar: function(usuario) {
    Storage.set('usuarioActual', usuario);
    console.log('Sesión iniciada para:', usuario.email);
  },
  
  obtener: function() {
    return Storage.get('usuarioActual');
  },
  
  cerrar: function() {
    Storage.remove('usuarioActual');
    console.log('Sesión cerrada');
    window.location.href = 'index.html';
  },
  
  estaActivo: function() {
    return this.obtener() !== null;
  }
};

console.log('PNK Inmobiliaria - App cargada correctamente');

// Actualizar imagen en página de detalle si viene como parámetro
function actualizarImagenDetalle() {
  const urlParams = new URLSearchParams(window.location.search);
  const imagenURL = urlParams.get('imagen');
  
  if (imagenURL) {
    try {
      const urlDecodificada = decodeURIComponent(imagenURL);
      const mainImage = document.getElementById('main-image');
      
      if (mainImage) {
        mainImage.src = urlDecodificada;
        mainImage.alt = 'Imagen de la propiedad seleccionada';
        
        // También actualizar la primera miniatura
        const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
        if (thumbnails.length > 0) {
          thumbnails[0].src = urlDecodificada;
        }
        
        console.log('Imagen actualizada correctamente:', urlDecodificada);
      }
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
    }
  }
}

// Función para permitir hacer click en las miniaturas de la galería
function inicializarGaleria() {
  const mainImage = document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
  
  if (!mainImage || thumbnails.length === 0) return;
  
  thumbnails.forEach((thumbnail, index) => {
    // Hacer las miniaturas clickeables
    thumbnail.style.cursor = 'pointer';
    
    thumbnail.addEventListener('click', function() {
      // Cambiar la imagen principal a la miniatura clickeada
      mainImage.src = this.src;
      mainImage.alt = this.alt;
      
      // Remover clase activa de todas las miniaturas
      thumbnails.forEach(thumb => thumb.classList.remove('active'));
      
      // Agregar clase activa a la miniatura clickeada
      this.classList.add('active');
    });
  });
  
  // Marcar como activa la primera miniatura al cargar
  if (thumbnails.length > 0) {
    thumbnails[0].classList.add('active');
  }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    actualizarImagenDetalle();
    inicializarGaleria();
  });
} else {
  actualizarImagenDetalle();
  inicializarGaleria();
}
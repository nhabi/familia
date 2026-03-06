(function () {
  var STORAGE_KEY = 'mensajes';

  function createMessageNode(data) {
    var column = document.createElement('div');
    column.className = 'column';

    var container = document.createElement('div');
    container.className = 'mensaje-container';

    var paragraph = document.createElement('p');
    var strong = document.createElement('strong');
    strong.textContent = data.nombre + ':';
    paragraph.appendChild(strong);
    paragraph.appendChild(document.createTextNode(' ' + data.mensaje));
    container.appendChild(paragraph);

    if (data.mediaDataUrl && data.mediaType) {
      if (data.mediaType === 'image') {
        var img = document.createElement('img');
        img.src = data.mediaDataUrl;
        img.alt = 'Imagen compartida';
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        container.appendChild(img);
      } else if (data.mediaType === 'video') {
        var video = document.createElement('video');
        video.controls = true;
        video.style.objectFit = 'cover';
        video.style.width = '100%';

        var source = document.createElement('source');
        source.src = data.mediaDataUrl;
        source.type = 'video/mp4';
        video.appendChild(source);
        container.appendChild(video);
      }
    }

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Eliminar';
    removeBtn.addEventListener('click', function () {
      if (window.confirm('¿Seguro que quieres eliminar este mensaje?')) {
        column.remove();
        saveMessagesFromDOM();
      }
    });

    container.appendChild(removeBtn);
    column.appendChild(container);

    return column;
  }

  function getStoredMessages() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function setStoredMessages(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }

  function renderMessages() {
    var row = document.getElementById('galleryRow');
    row.innerHTML = '';
    getStoredMessages().forEach(function (msg) {
      row.appendChild(createMessageNode(msg));
    });
  }

  function saveMessagesFromDOM() {
    var messages = [];
    document.querySelectorAll('#galleryRow .mensaje-container').forEach(function (container) {
      var strong = container.querySelector('strong');
      var name = strong ? strong.textContent.replace(/:$/, '') : '';
      var text = container.querySelector('p') ? container.querySelector('p').textContent.replace(/^.*?:\s*/, '') : '';
      var img = container.querySelector('img');
      var videoSource = container.querySelector('video source');

      messages.push({
        nombre: name,
        mensaje: text,
        mediaType: img ? 'image' : (videoSource ? 'video' : null),
        mediaDataUrl: img ? img.src : (videoSource ? videoSource.src : null)
      });
    });

    setStoredMessages(messages);
  }

  function handleSubmit() {
    var nombre = document.getElementById('nombre').value.trim();
    var mensaje = document.getElementById('mensaje').value.trim();
    var archivoInput = document.getElementById('archivo');
    var archivo = archivoInput.files[0];

    if (!nombre || !mensaje) {
      return;
    }

    var persist = function (payload) {
      var messages = getStoredMessages();
      messages.push(payload);
      setStoredMessages(messages);
      renderMessages();
      document.getElementById('mensajeForm').reset();
    };

    if (!archivo) {
      persist({ nombre: nombre, mensaje: mensaje, mediaType: null, mediaDataUrl: null });
      return;
    }

    var mediaType = archivo.type.split('/')[0];
    if (mediaType !== 'image' && mediaType !== 'video') {
      window.alert('Solo se permiten imágenes o videos.');
      return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
      persist({
        nombre: nombre,
        mensaje: mensaje,
        mediaType: mediaType,
        mediaDataUrl: event.target.result
      });
    };
    reader.readAsDataURL(archivo);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderMessages();
    var submitBtn = document.getElementById('enviarMensajeBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', handleSubmit);
    }

    if (window.jQuery && jQuery.fn.lightGallery) {
      jQuery('#lightgallery').lightGallery();
    }
  });
})();

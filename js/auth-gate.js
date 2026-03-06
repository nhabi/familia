(function () {
  function setVisibility(elements, visible) {
    elements.forEach(function (element) {
      element.style.display = visible ? '' : 'none';
    });
  }

  function initPasswordGate(config) {
    var password = config.password || '';
    var selector = config.protectedSelector || '.protected-content';
    var promptText = config.promptText || 'Introduce la contraseña:';
    var successText = config.successText || 'Contraseña correcta. ¡Bienvenido!';
    var failureText = config.failureText || 'Contraseña incorrecta. Vuelve a intentarlo.';
    var cancelRedirect = config.cancelRedirect || null;

    var protectedElements = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!protectedElements.length) {
      return;
    }

    setVisibility(protectedElements, false);

    var input;
    do {
      input = window.prompt(promptText);
      if (input === password) {
        window.alert(successText);
        setVisibility(protectedElements, true);
        return;
      }
      if (input !== null) {
        window.alert(failureText);
      }
    } while (input !== null);

    if (cancelRedirect) {
      window.location.href = cancelRedirect;
    }
  }

  window.initPasswordGate = initPasswordGate;
})();

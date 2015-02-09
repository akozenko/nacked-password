(function() {
  'use strict';

  function addClass(el, className) {
    var classes = el.className.split(' ');
    classes.push(className);
    el.className = classes.join(' ');
  }

  function removeClass(el, className) {
    el.className = el.className.split(' ').filter(function(cn) {
      return cn !== className;
    }).join(' ');
  }

  function hasClass(el, className) {
    return el.className.split(' ').some(function(cn) {
      return cn === className;
    });
  }

  function addListener(arr, el, event, handler, capture) {
    el.addEventListener(event, handler, capture);
    arr.push([el, event, handler, capture]);
  }

  function removeListener(el, event, handler, capture) {
    el.removeEventListener(event, handler, capture);
  }

  var NackedPasswordElementPrototype = Object.create(window.HTMLElement.prototype);

  var currentScript = document._currentScript || document.currentScript;
  var owner = currentScript.ownerDocument || document;

  NackedPasswordElementPrototype.attachedCallback = function() {
    var nackedPassword = this,
        shadow = this.createShadowRoot(),
        tmpl = owner.querySelector('#nacked-password-template'),
        covertInput,
        outrightInput,
        wrapper;

    nackedPassword.listeners = [];
    nackedPassword.value = '';

    shadow.resetStyleInheritance = true;
    shadow.appendChild(tmpl.content.cloneNode(true));

    covertInput = shadow.querySelector('.covert');
    outrightInput = shadow.querySelector('.outright');
    wrapper = shadow.querySelector('.wrapper');

    addListener(nackedPassword.listeners, covertInput, 'keyup', function() {
      outrightInput.value = nackedPassword.value = this.value;
    });

    addListener(nackedPassword.listeners, outrightInput, 'keyup', function() {
      covertInput.value = nackedPassword.value = this.value;
    });

    addListener(nackedPassword.listeners, shadow.querySelector('.toggle'), 'click', function(e) {
      e.preventDefault();

      if (hasClass(wrapper, 'nacked')) {
        removeClass(wrapper, 'nacked');
      } else {
        addClass(wrapper, 'nacked');
      }

      return false;
    });
  };

  NackedPasswordElementPrototype.detachedCallback = function () {
    while (this.listeners.length) {
      removeListener.apply(this, this.listeners.shift());
    }
  };

  if (!window.NackedPasswordElement) {
    window.NackedPasswordElement = document.registerElement('nacked-password', {
      prototype: NackedPasswordElementPrototype
    });
  }
})();

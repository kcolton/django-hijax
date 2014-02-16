(function($) {

  window.Hijax = function($content, options) {

    var self = this;
    options = options || {};
    self.notSelector = options.notSelector || ':not([data-hijax-ignore],[target])';
    self.linksSelector = options.linksSelector || 'a[href]' + self.notSelector;
    self.formsSelector = options.formsSelector || 'form' + self.notSelector;
    self.ignoreHrefPattern = options.ignoreHrefPattern || /^#|javascript:/gi;

    $(document).on('click.hijax', self.linksSelector, function(e) {
      if (e.isDefaultPrevented() || e.isPropagationStopped()) return;
      var href = $(this).attr('href');
      if (href.match(self.ignoreHrefPattern)) return;

      return !self.get(href);
    });

    $(document).on('click.hijax', '[data-hijax-href]', function(e) {
      if (e.isDefaultPrevented() || e.isPropagationStopped()) return;
      return !app.page.get($(this).data('hijaxHref'));
    });

    $(document).on('submit', self.formsSelector, function(e) {
      if (e.isDefaultPrevented() || e.isPropagationStopped()) return;

      $(this).ajaxSubmit({
        data: {'_hijax': true },
        complete: function(xhr, status) {
          console.log('Hijax - ajaxSubmit complete', arguments);
          self.loadFromXhr(xhr);
        }
      });

      return false;
    });

    self.get = function(url, params) {
      console.log('Hijax.get:', url, 'params:', params);
      if (!self.isInternalUrl(url)) return false;

      if (params) {
        url = new URI(url).addQuery(params).toString();
      }
      History.pushState(null, document.title, url);

      return true;
    };

    self.post = function(url, data) {
      data = data || {'_post': true}; // Empty object would not trigger post. See statechange handler
      console.log('Hijax.post:', url, 'data:', data);
      if (!self.isInternalUrl(url)) return false;
      History.pushState(data, document.title, url);
    };

    self.isInternalUrl = function(url) {
      var newUri = new URI(url)
        , currentUri = new URI(History.getState().url);
      return !newUri.hostname() || newUri.hostname() == currentUri.hostname();
    };

    self.loadFromXhr = function(xhr) {
      var statusCode = xhr.status
        , contentType = xhr.getResponseHeader('content-type')
        , contentTypeIsHtml = contentType.indexOf('text/html') != -1
        , externalRedirect = xhr.getResponseHeader('x-external-redirect')
        , release = xhr.getResponseHeader('x-release')
        , requestPath = xhr.getResponseHeader('x-request-path')
        , title = xhr.getResponseHeader('x-title')
        , currentUri = new URI(History.getState().url).absoluteTo()
        , newUri = requestPath ? new URI(requestPath).removeQuery('_hijax').absoluteTo() : null;

      if (externalRedirect) {
        window.location = externalRedirect;
        return;
      }

      if (title) {
        document.title = title;
      }

      if (!newUri) {
        debug.warn('Hijax - warning: received no x-request-path header:', xhr);
      }

      if (newUri && newUri.resource() != currentUri.resource()) {
        // Disconnect between where browser thinks it is, and how it got there. Probably redirect
        console.log('Hijax - REDIRECT:', currentUri.resource(), '=>', newUri.resource());
        History.ignoreNextChange = true; // todo - gah! fix this!
        History.replaceState(null, title, newUri.resource());
      }

      console.log('Hijax - loadContentFromXhr - status:', statusCode, 'requestPath:', requestPath,
        'current uri:', currentUri, 'new uri:', newUri, 'xhr:', xhr,
        'statusCode:', 'contentType:', contentType, 'release:', release);

      var content = xhr.responseText;

      console.log('Hijax - loadContent:', content.length, contentType);

      $content.html(content.toString()).toggleClass('hijax-content-type-text-plain', !contentTypeIsHtml);
      $(document).scrollTop(0).trigger('page-loaded.hijax');

      // GA
      if (typeof _gaq != 'undefined') {
        _gaq.push(['_trackPageview', newUri.path()]);
      }
      // Todo - universal
      // Todo - GTM
    };

    History.Adapter.bind(window, 'statechange', function(e) {
      var state = History.getState();

      // Todo - kill
      // This state change has already been taken care of
      if (History.ignoreNextChange) {
        History.ignoreNextChange = false;
        return;
      }

      var uri = new URI(state.hash)
        .addQuery('_hijax', 'true')
        .removeQuery('_suid'); // remove history.js internal identifier before sending to server

      var options = {
        type: 'GET'
      };

      if (state.data && !History.isEmptyObject(state.data)) {
        options.type = 'POST';
        options.data = state.data;
      }

      console.log('Hijax - history stateChange - loading uri:', uri, 'options:', options);
      options.dataType = options.dataType || 'html';

      $.ajax(uri.toString(), options).always(function(dataOrXhr, textStatus, errorOrXhr) {
        var success = textStatus == 'success'
          , error = success ? null : errorOrXhr
          , xhr = success ? errorOrXhr : dataOrXhr;

        self.loadFromXhr(xhr);
      });
    });
  };

})(jQuery);
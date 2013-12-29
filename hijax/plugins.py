from urlparse import parse_qs, urlunsplit, urlsplit
from urllib import urlencode
from django.conf import settings
from django.http import HttpResponse


def context_processor(request):
    ctx = dict()

    try:
        ctx['IS_HIJAX'] = request.is_hijax
    except AttributeError:
        pass

    try:
        ctx['TITLE'] = request.title
    except AttributeError:
        pass

    return ctx


class Middleware(object):
    def process_request(self, request):
        request.is_hijax = '_hijax' in request.REQUEST

    def process_response(self, request, response):
        response['X-Request-Path'] = request.get_full_path()

        if not response.has_header('X-Title'):
            response['X-Title'] = settings.TITLE

        if hasattr(request, 'is_hijax') and request.is_hijax and 'Location' in response:

            # Todo - this parsing seems messy for the python world. Probably something better out there. URLObject?
            url = urlsplit(response['location'])

            if not url.scheme:  # Relative URL, add the _bare marker
                qs = parse_qs(url.query)
                qs['_bare'] = 'true'

                url = url._replace(query=urlencode(qs))
                response['Location'] = urlunsplit(url)
            else:
                # External redirect wil be handled on the front end to avoid XHR x-domain issues
                meta_redirect_response = HttpResponse()
                meta_redirect_response['X-External-Redirect'] = response['Location']
                return meta_redirect_response

        return response
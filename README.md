django-hijax
===============================================================================

Early Stage WIP!


## Features

*   Seamless integration. Drop in enhancement. No changes to views, templates or JS necessary.
*   Hijax forms even with file uploads that just work.
*   Handle title changing (kludgy atm)
*   Handle internal and external redirects
*   Plays nice with Google Analytics. Automatically fires pageview if GA present

## Required Statics:

*   hijax/hijax.js
*   hijax/hijax.css
*   Third-Party:
    *   jQuery
    *   URI.js
        *   third_party/URI.js
        *   http://medialize.github.io/URI.js/
    *   History.js
        *   third_party/jquery/jquery.history.js
        *   https://github.com/browserstate/history.js/

## Usage:

*   Add hijax to installed apps
*   Add hijax.plugins.context_processor
*   Add hijax.plugins.Middleware
*   Use the @set_title view decorator to set a title (kludgy)
    *   Pick up in your template using TITLE context, injected by the context processor


## Todo / Improvements

*   GA Universal Analytics support
*   GTM
*   Python3 compat
*   On / off by default for links, forms. Flexible ways to scope enabling
*   Enable / disable debug output?
*   Add compressed & uncompressed versions of assets
*   Hijax - deal with when URL does not change. Still want to "refresh"?
*   Hijax handle javascript:;, other protocols and #
*   Set a history point when submitting form
*   Handle file uploads with hijax. Do not use iframe fallback
*   Can we work with # fragments in hijax URLs?
*   File upload progress w/ fancy progress spinner from forms
*   Mark state changes as isLoaded. Save cards or responses for future use w/o going back to server.
    Make that configurable too. Remove History.ignoreNext hack

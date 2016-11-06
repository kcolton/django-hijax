django-hijax
===============================================================================

**DEAD** - I was an interesting concept - but most SPA libraries have their own implementation of using history and it's better to work with them than against them.


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


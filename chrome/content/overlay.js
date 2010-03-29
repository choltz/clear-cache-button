if(!com) var com={};
if(!com.chrisholtz) com.chrisholtz={};

com.chrisholtz.clearcache = function()
{
    var public  = {};
    var private = {};

    private.alertService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
    private.preferences  = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    private.cacheService = Components.classes["@mozilla.org/network/cache-service;1"].getService(Components.interfaces.nsICacheService);
    
    private.notify = function(title, body)
    {
        try
        {
            private.alertService.showAlertNotification("chrome://clearcache/skin/logo_32.png", title, body, false, "", null);
        }
        catch(exception)
        {
            // don't do anything if notification services aren't set up on the computer
        }
    }

    public.clearcache = function()
    {
        try
        {
            private.cacheService.evictEntries(Components.interfaces.nsICache.STORE_ON_DISK);
            private.cacheService.evictEntries(Components.interfaces.nsICache.STORE_IN_MEMORY);

            //var loc          = new localizedStrings();
            //alert(loc.popupTitle);

            // show the notification if the user hasn't yet set the
            // preference or they've explicitly enabled it
            try
            {
                if (private.preferences.getBoolPref("extension.clearcache.showNotification") == true)
                {
                    private.notify(loc.popupTitle, loc.successMessage);
                }
            }
            catch(exception)
            {
                // if there's an error it's likely because the preference value
                // hasn't been set yet. If that's the case then show the
                // preferences dialog
                openDialog("chrome://clearcache/content/options.xul");
            }

        }
        catch(e)
        {
            private.notify("Error", e.description);
        }
    };

    return public;
}();

com.chrisholtz.clearcache.clearcache();



//
// Clear the cache
//
function clearcachebutton_clearcache()
{
    try
    {
        var cacheService = getCacheService();
        var alertService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
        var prefs        = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
        var loc          = new localizedStrings();

        cacheService.evictEntries(Components.interfaces.nsICache.STORE_ON_DISK);
        cacheService.evictEntries(Components.interfaces.nsICache.STORE_IN_MEMORY);

        // show the notification if the user hasn't yet set the
        // preference or they've explicitly enabled it
        try
        {
          showNotification = prefs.getBoolPref("extension.clearcache.showNotification");

          if (showNotification == true)
          {
            notify(loc.popupTitle, loc.successMessage);
          }
        }
        catch(exception)
        {
            // if there's an error it's likely because the preference value
            // hasn't been set yet. If that's the case then show the
            // preferences dialog
            openDialog("chrome://clearcache/content/options.xul");
        }
    }
    catch(e)
    {
        notify("Error", e.description);
    }

    //
    // return a reference to the cache service
    //
    function getCacheService()
    {
        var cacheClass = Components.classes["@mozilla.org/network/cache-service;1"];
        var service    = cacheClass.getService(Components.interfaces.nsICacheService);

        return service;
    }

    // Notify user
    function notify(title, body)
    {
        try
        {
            alertService.showAlertNotification("chrome://clearcache/skin/logo_32.png", title, body, false, "", null);
        }
        catch(exception)
        {
            // don't do anything if notification services aren't set up on the computer
        }
    }
}

//
// Encapsulate localized string functionality in its own object.
// Include fail-safes if local strings are not found
//
function localizedStrings()
{
    var loc                                   = document.getElementById("cachebundle");
    localizedStrings.prototype.popupTitle     = getString("popupTitle");
    localizedStrings.prototype.successMessage = getString("popupSuccess");

    // get the specificed string from the cache bundle. Trap error if property is not found
    function getString(key)
    {
        var value = "";

        try
        {
            value = loc.getString("extensions.{563e4790-7e70-11da-a72b-0800200c9a66}." + key);
        }
        catch(e) {} // If there is trouble retrieving the localized string, then we'll assign defaults

        // assign defaults if there was a problem retrieving the string
        if (value == "")
        {
            value = (key == "popupTitle" ? "Clear Cache" : "The cache has been cleared");
        }

        return value;
    }
}


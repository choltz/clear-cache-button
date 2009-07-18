//
// Clear the cache
//
function clearcachebutton_clearCache()
{
    var cacheService     = getCacheService();
    var alertService     = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
    var loc              = new localizedStrings();

    try
    {
        cacheService.evictEntries(Components.interfaces.nsICache.STORE_ON_DISK);
        cacheService.evictEntries(Components.interfaces.nsICache.STORE_IN_MEMORY);
        notify(loc.popupTitle, loc.successMessage);
    }
    catch(exception)
    {
        notify("Exception", exception);
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
        alertService.showAlertNotification("chrome://clearcache/skin/logo_32.png", title, body, false, "", null);
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
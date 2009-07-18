//
// Clear the cache
//
function clearcachebutton_clearCache()
{
    var cacheService     = getCacheService();
    var alertService     = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
    var localizedStrings = document.getElementById("cachebundle");

    try
    {
        cacheService.evictEntries(Components.interfaces.nsICache.STORE_ON_DISK);
        cacheService.evictEntries(Components.interfaces.nsICache.STORE_IN_MEMORY);
        notify("Cache Cleared", "Cache has been cleared");
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
        alertService.showAlertNotification("chrome://clearcache/skin/logo_32.png", "Clear Cache", body, false, "", null);
    }

}
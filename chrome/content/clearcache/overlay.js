//
// Clear the cache
//

function clearcachebutton_clearCache()
{
    var cacheService = getCacheService();

    try
    {
        cacheService.evictEntries(Components.interfaces.nsICache.STORE_ON_DISK);
        cacheService.evictEntries(Components.interfaces.nsICache.STORE_IN_MEMORY);
    }
    catch(exception)
    {
        alert(exception.description);
    }
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

//
// Work in progress. not in use
//
function VersionChecker()
{
    var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var x = pref.getCharPref("extensions.{563e4790-7e70-11da-a72b-0800200c9a66}.description");
    alert(x);
}
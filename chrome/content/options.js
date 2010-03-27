//
// Keeping things super simple. Just a couple functions to load and save preferences.
//


function savePreferences()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    prefs.setBoolPref("extension.clearcache.showNotification", document.getElementById("clearcache_dialog").checked);
}

function loadPreferences()
{
    var prefs        = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    showNotification = prefs.getBoolPref("extension.clearcache.showNotification");
    document.getElementById("clearcache_dialog").checked = showNotification;
}

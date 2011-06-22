if(!com) var com={};
if(!com.chrisholtz) com.chrisholtz={};
if(!com.chrisholtz.clearcache) com.chrisholtz.clearcache={};

//
// Object to encapsulate clear cache admin behavior
//
com.chrisholtz.clearcache.admin = function()
{
    var public          = {};
    var private         = {};
    private.preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

    // save preferences from the options window
    public.savePreferences = function()
    {
        private.preferences.setBoolPref("extension.clearcache.showNotification", document.getElementById("clearcache_dialog").checked);
    }

    // load preferences into the options window
    public.loadPreferences = function()
    {
        showNotification = private.preferences.getBoolPref("extension.clearcache.showNotification");
        document.getElementById("clearcache_dialog").checked = showNotification;
    }

    return public;
}();


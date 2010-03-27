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
        }
        catch(exception)
        {
            // if there's an error - it's probably because the preference hasn't
            // been set yet - so set it to the default behavior
            prefs.setBoolPref("extension.clearcache.showNotification", true);
            showNotification = true;
        }

        if (showNotification == true)
        {
          notify(loc.popupTitle, loc.successMessage);
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


// var ClearCache = function() {
//         
//         var Cc = Components.classes,
//         Ci = Components.interfaces,
//         
//         ramCurrent,
//         ramMax,
//         diskCurrent,
//         diskMax,
//         
//         strBundle,
//         toolbarbutton,
//         notificationBox,
//         title,
//         icon = "chrome://clearcache/skin/logo_32.png",
//         bodyFail,
//         
//         cacheService = Cc["@mozilla.org/network/cache-service;1"].getService(Ci.nsICacheService),
//         alertService = Cc["@mozilla.org/alerts-service;1"].getService(Ci.nsIAlertsService),
//         promptService = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
//         
//         // Inspired from the Cache Status add-on
//         // Update current and max vars
//         function getCacheStatus(deviceId, deviceInfo) {
//         	var precision = 1,
//         	current = (deviceInfo.totalSize/1024/1024).toFixed(precision),
//         	max = (deviceInfo.maximumSize/1024/1024).toFixed(precision);
//         	
//         	if (deviceId == 'memory') {
//         		ramCurrent = current;
//         		ramMax = max;
//         		
//         		// this is some sort of random bug workaround
//         		if (ramCurrent > ramMax && ramCurrent == 4096) { 
//         			//alert("4096 Bug: " + deviceInfo.totalSize + " / " + deviceInfo.maximumSize);
//         			ramCurrent = 0.0;
//         		}
//         	} else if (deviceId == 'disk') {
//         		diskCurrent = current;
//         		diskMax = max;
//         	}
//         };
//         
//         // Get latest cache status
//         function updateStatus() {
//         	cacheService.visitEntries(cacheVisitor);
//         	
//         	// Update tooltip
//         	toolbarbutton.tooltipText = strBundle.getFormattedString("clearcache.tooltipText", [ramCurrent, ramMax, diskCurrent, diskMax]);
//         };
//         
//         // Notify user
//         function notify(title, body) {
//         	if(alertService) {
//         		// Firefox 3.0+
//         		alertService.showAlertNotification(icon, title, body, false, "", null);
//         	} else {
//         		promptService.alert(window, title, body);
//         	}
//         	
//         	// Information bar popup
//         	// https://developer.mozilla.org/en/XUL/Method/appendNotification
//         	/*notificationBox.appendNotification(body, "clearcache-notebox", icon, notificationBox.PRIORITY_INFO_MEDIUM);*/
//         };
//         
//         var cacheVisitor = {
//         	visitEntry: function(deviceID, entryInfo) {},
//         	visitDevice: getCacheStatus
//         };
//         
//         // Init
//         this.startup = function() {
//         	strBundle = document.getElementById("clearcache-note");
//         	title = strBundle.getString("clearcache.noteTitle");
//         	toolbarbutton = document.getElementById("clearcache-toolbarbutton");
//         	bodyFail = strBundle.getString("clearcache.noteMessageFailure");
//         	//notificationBox = gBrowser.getNotificationBox();
//         	updateStatus();
//         	window.setInterval(updateStatus, 10*1000);
//         };
//         
//         this.clearCache = function() {
//         	// Get latest cache status
//         	updateStatus();
//         	
//         	// Clear cache
//         	try {
//         		cacheService.evictEntries(Ci.nsICache.STORE_ON_DISK);
//         		cacheService.evictEntries(Ci.nsICache.STORE_IN_MEMORY);
//         		notify(title, strBundle.getFormattedString("clearcache.noteMessageSuccess", [ramCurrent, diskCurrent]));
//         	} catch(exception) {
//         		notify(title, bodyFail + " - " + exception);
//         	}
//         	
//         	// Update tooltip after cache has been cleared
//         	updateStatus();
//         };
// };
//  
// var cc = new ClearCache();
//  
// window.addEventListener("load", function(e) { cc.startup(); }, false);
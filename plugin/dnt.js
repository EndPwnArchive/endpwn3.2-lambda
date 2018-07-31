exports.manifest = {
    author: "Cynosphere",
    name: "DNT",
    description: "heck off trackers",
    replacements:[
        {
            signature:"t.default=o({},u.default,{track:_})}",
            payload:`t.default=o({},u.default,{track:function(){console.debug("[dnt] tracking: science")}})}`
        },
        {
            signature:/_postReports=function\([a-zA-Z]\){.+},([a-zA-Z])\.prototype\._sendQualityReports`/,
            payload:`_postReports=function(){console.debug("[dnt] rtc: quality report")},$1.prototype._sendQualityReports`
        }
    ]
}
exports.start = function(){
    /*var sentry = wc.findFunc("_originalConsoleMethods")[0].exports;
    window.console = Object.assign(window.console, sentry._originalConsoleMethods); // console
    sentry._wrappedBuiltIns.forEach(x => x[0][x[1]] = x[2]); // other stuff
    sentry._breadcrumbEventHandler = () => () => { }; // break most event logging
    sentry.captureBreadcrumb = () => { }; // disable breadcrumb logging*/
}
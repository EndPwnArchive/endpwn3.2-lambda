exports.manifest = {
    author: "Cynosphere",
    name: "CSP",
    description: "heck off policies"
};
exports.preload = function() {
    require("electron").remote.session.defaultSession.webRequest.onHeadersReceived(
        function(details, callback) {
            details.responseHeaders["content-security-policy-report-only"] = "";
            details.responseHeaders["content-security-policy"] = "";
            delete details.responseHeaders[
                "content-security-policy-report-only"
            ];

            callback({ responseHeaders: details.responseHeaders });
        }
    );
};

/*

    EndPwn3 System (bootstrap)
    
    Copyright 2018 EndPwn Project
    
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    DO NOT EDIT THIS FILE! Your bootstrap may overwrite changes to it, and you will lose your work!
    EndPwn3 users: You can prevent this by creating a file in the same directory named DONTUPDATE
    
    https://github.com/endpwn/

*/

var internal = {

    print: function (str) {
        console.log(`%c[EndPwn3]%c ` + str, 'font-weight:bold;color:#c8f', '');
    }

}

exports = {

    preload: function () {

        window.reload = () => { app.relaunch(); app.exit(); };
        window.endpwn = {

            // safemode
            safemode: function () {
                $api.ui.showDialog({
                    title: 'EndPwn: safe mode',
                    body: 'This will restart your client in a state without plugin support.',
                    confirmText: 'Yes', cancelText: 'No',

                    onConfirm: () => {

                        $api.localStorage.set('safemode', 1);
                        window.electron.getCurrentWindow().reload();

                    }
                });
            },

            // uninstaller
            uninstall: function () {
                $api.ui.showDialog({
                    title: 'EndPwn: confirm uninstallation',
                    body: 'Are you sure you want to remove EndPwn from your client? You can reinstall it at any time.',
                    confirmText: 'Yes', cancelText: 'No',

                    onConfirm: () => {

                        var data = $api.data;

                        $api.settings.set('WEBAPP_ENDPOINT');
                        $api.settings.set('WEBAPP_PATH');

                        reload();

                    }
                });
            },

            // endpwn customizer
            customizer: krequire('customizer'),

            // settings page stuff
            settings: krequire('settings'),

            // wrapper function for dispatch()
            // intended to simplify using executeJavaScript() from other windows as a bad IPC method
            // we do this since afaik we cant use electron.ipc in a useful way (maybe im wrong? if i am ill make this better later on lol)
            pseudoipc: function (e) {
                $api.events.dispatch({
                    type: 'ENDPWN_PSEUDO_IPC',
                    data: e
                });
            },

            __eval: e => eval(e)

        };

        // fetch the changelog
        internal.print('retrieving changelog...');
        fetch('https://lambda.cynfoxwell.cf/changelog.md?_=' + Date.now()).then(r => r.text()).then(l => {
            var data = l.split(';;');
            window.endpwn.changelog = {
                date: data[0],
                body: data[1]
            };
        });

        // early init payload
        document.addEventListener('ep-prepared', () => {

            // disable that obnoxious warning about not pasting shit in the console
            internal.print('disabling self xss warning...');
            $api.util.findFuncExports('consoleWarning').consoleWarning = e => { };

            // fuck sentry
            internal.print('fucking sentry...');
            var sentry = wc.findCache('_originalConsoleMethods')[0].exports;
            window.console = Object.assign(window.console, sentry._originalConsoleMethods); // console
            sentry._wrappedBuiltIns.forEach(x => x[0][x[1]] = x[2]); // other stuff
            sentry._breadcrumbEventHandler = () => () => { }; // break most event logging
            sentry.captureBreadcrumb = () => { }; // disable breadcrumb logging

        });

    },

    replacements: {

        // changelog injection
        'key:"changeLog",get:function(){return E}':
            'key:"changeLog",get:function(){if(!E.injected){E.injected=1;E.date=E.date<=window.endpwn.changelog.date?window.endpwn.changelog.date:E.date;E.body=window.endpwn.changelog.body+"\\n\\n"+E.body}return E}',

        // crash screen hijack
        'var e=o("div",{},void 0,o("p",{},void 0,a.default.Messages.ERRORS_UNEXPECTED_CRASH),o("p",{},void 0,a.default.Messages.ERRORS_ACTION_TO_TAKE)),t=o(c.default,{size:l.ButtonSizes.LARGE,onClick:this._handleSubmitReport},void 0,a.default.Messages.ERRORS_RELOAD);return o(u.default,{theme:this.props.theme,title:a.default.Messages.UNSUPPORTED_BROWSER_TITLE,':
            `var e=o("div",{},void 0,o("p",{},void 0,"Something has gone very, very wrong, and Discord has crashed."),o("p",{},void 0,"If this is the first time you've seen this error screen, reload and hope for the best. If this screen appears again, follow these steps:"),o("p",{},void 0,"Try removing any new plugins and restarting again. If this solves the problem there may be a bug in a plugin or a conflict."),o("p",{},void 0,"If problems continue, it's likely that there is a bug in EndPwn or Discord."),o("p",{},void 0,"If you need help, join the EndPwn Discord server (https://discord.gg/wXdPNf2)"),o("p",{},void 0,"Details may be available in the console (Ctrl+Shift+I), but at this level of crash we can't be certain.")),t=o("div",{},void 0,o(c.default,{size:l.ButtonSizes.LARGE,onClick:()=>window.electron.getCurrentWindow().reload()},void 0,"Reload"),o(c.default,{size:l.ButtonSizes.LARGE,onClick:()=>{window.$api.localStorage.set('safemode',1);window.electron.getCurrentWindow().reload()}},void 0,"Reload in safe mode"));return o(u.default,{theme:this.props.theme,title:"Discord: Fatal Error",`

    },

    start: function () {

        // disable analytics
        internal.print('disabling analytics...');
        $api.util.findFuncExports("AnalyticEventConfigs").default.track = () => { };

        // enable experiments
        internal.print('enabling experiments menu...');
        $api.util.findFuncExports('isDeveloper').__defineGetter__('isDeveloper', () => true);

        // if we used start() in the other files, it would create a different instance -- we dont want that
        endpwn.customizer.init();
        endpwn.settings.init();

        // check for epapi updates
        if ($api.lite || !fs.existsSync($api.data + '/DONTUPDATE'))
            (function () {

                internal.print('checking for EPAPI updates...');

                // fetch the latest build of epapi
                fetch('https://endpwn.github.io/epapi/epapi.js?_=' + Date.now()).then(x => x.text()).then(x => {

                    // check the version
                    if (kparse(x).version > $api.version) {

                        // if the version on the server is newer, pester the user
                        $api.ui.showDialog({

                            title: 'EndPwn3: EPAPI Update Available',
                            body: 'An update to EPAPI has been released. It is recommended that you restart your client in order to gain access to new features and maintain compatibility.',
                            confirmText: 'Restart Now', cancelText: 'Later',

                            // user pressed "Restart Now"
                            onConfirm: () => {

                                // refresh the page if we're running in a browser, reboot the app if we're running outside of lite mode
                                reload();

                            },

                            // they pressed "Later", for some reason
                            onCancel: () => {

                                // bother them again in 6 hrs (* 60 min * 60 sec * 1000 ms)
                                setTimeout(arguments.callee, 6 * 60 * 60 * 1000);

                            }

                        });

                    }
                    else setTimeout(arguments.callee, 6 * 60 * 60 * 1000);

                });

            })();

    }

}

/*
    Now all this crazy drama
    All up in my face
    All I really wanted
    Was to be alone in space
*/
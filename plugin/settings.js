/*

    EndPwn3 System (settings UI)
    
    Copyright 2018 EndPwn Project
    
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    DO NOT EDIT THIS FILE! Your bootstrap may overwrite changes to it, and you will lose your work!
    EndPwn3 users: You can prevent this by creating a file in the same directory named DONTUPDATE
    
    https://github.com/endpwn/

*/

if (window.$api === undefined && typeof $api != "undefined") {
    console.warn(
        "$api is defined, but window.$api is not! assuming we are running under epapi6 and exporting an empty object..."
    );
    exports = {};
} else
    exports = {
        manifest: {
            replacements: [
                {
                    signature: /{section:(\w)\.SectionTypes\.DIVIDER},{section:"logout",/g,
                    payload:
                        '{section:$1.SectionTypes.DIVIDER},{section:"ENDPWN",label:"Lλmbda Settings",element:window.BlankSettingsElement,color:"#c080ff"},{section:$1.SectionTypes.DIVIDER},{section:"logout",'
                }
            ]
        },

        init: function() {
            delete endpwn.settings.init;

            var currentSection = "";

            window.BlankSettingsElement = $api.util.findConstructor(
                "FormSection",
                "FormSection"
            ).FormSection;

            var buttons = $api.util.findFuncExports("button-", "colorBlack");
            var checkboxes = $api.util.findFuncExports("checkboxEnabled");
            var misc = $api.util.findFuncExports("statusRed-", "inputDefault");
            var misc2 = $api.util.findFuncExports("multiInputField");
            var headers = $api.util.findFuncExports("h5-", "h5");

            var panels = wc.findFunc("flexChild-")[0].exports;
            var panels2 = $api.util.findFuncExports(
                "errorMessage-",
                "inputWrapper"
            );

            function createVerticalPanel() {
                return createElement("div").withClass(
                    panels2.vertical,
                    "epButtonPanel"
                );
            }

            function createHorizontalPanel() {
                return createElement("div").withClass(
                    panels.horizontal,
                    "epButtonPanel"
                );
            }

            function createButton(name) {
                return createElement("button")
                    .withContents(name)
                    .withClass(
                        buttons.button,
                        buttons.lookFilled,
                        buttons.colorBrand,
                        buttons.sizeSmall,
                        buttons.grow,
                        "epMargin"
                    );
            }

            function createWarnButton(name) {
                return createElement("button")
                    .withContents(name)
                    .withClass(
                        buttons.button,
                        buttons.lookOutlined,
                        buttons.colorYellow,
                        buttons.sizeSmall,
                        buttons.grow,
                        "epMargin"
                    );
            }

            function createDangerButton(name) {
                return createElement("button")
                    .withContents(name)
                    .withClass(
                        buttons.button,
                        buttons.lookOutlined,
                        buttons.colorRed,
                        buttons.sizeSmall,
                        buttons.grow,
                        "epMargin"
                    );
            }

            function createH2(text) {
                //h2-2gWE-o title-3sZWYQ size16-14cGz5 height20-mO2eIN weightSemiBold-NJexzi defaultColor-1_ajX0 defaultMarginh2-2LTaUL marginBottom20-32qID7
                return createElement("h2")
                    .withClass(
                        headers.h2,
                        headers.title,
                        headers.size16,
                        headers.height20,
                        headers.weightSemiBold,
                        headers.defaultColor,
                        "epMargin"
                    )
                    .withText(text);
            }

            function createH5(text) {
                return createElement("h5")
                    .withClass(
                        headers.h5,
                        headers.title,
                        headers.size12,
                        headers.height16,
                        headers.weightSemiBold
                    )
                    .withText(text);
            }

            function createInput(v) {
                return createElement("input")
                    .withClass(
                        misc.inputDefault,
                        misc.input,
                        misc.size16,
                        "epMargin"
                    )
                    .modify(x => (x.value = v));
            }

            //<input class="checkboxEnabled-CtinEn checkbox-2tyjJg" type="checkbox">
            //switchEnabled-V2WDBB switch-3wwwcV valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX
            //switchEnabled-V2WDBB switch-3wwwcV valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX
            function updateSwitch(s, w) {
                if (s.checked) {
                    w.classList.remove(checkboxes.valueUnchecked.split(" ")[0]);
                    w.classList.add(checkboxes.valueChecked.split(" ")[0]);
                } else {
                    w.classList.remove(checkboxes.valueChecked.split(" ")[0]);
                    w.classList.add(checkboxes.valueUnchecked.split(" ")[0]);
                }
            }
            function createSwitch(c, i) {
                if (c === undefined) c = () => {};
                if (i === undefined) i = false;
                var s,
                    w = createElement("div")
                        .withClass(
                            checkboxes.switch,
                            checkboxes.switchEnabled,
                            checkboxes.size,
                            checkboxes.sizeDefault,
                            checkboxes.themeDefault
                        )
                        .withChildren(
                            (s = createElement("input")
                                .withClass(
                                    checkboxes.checkbox,
                                    checkboxes.checkboxEnabled
                                )
                                .modify(x => (x.type = "checkbox"))
                                .modify(x => (x.checked = i))
                                .modify(
                                    x =>
                                        (x.onchange = () => {
                                            updateSwitch(s, w);
                                            c(s.checked);
                                        })
                                ))
                        );
                updateSwitch(s, w);
                return w;
            }

            function renderSettings(e) {
                currentSection = e;
                if ($("#ep_settings")) $("#ep_settings").remove();

                if (e.section == "ENDPWN") {
                    var pane = $(".content-column.default");
                    if (!pane) return;

                    var content = createElement("div")
                        .withId("ep_settings")
                        .withClass("flex-vertical")
                        .withChildren(
                            createElement("div")
                                .withClass("epSettingsHeader")
                                .withText("Lλmbda Settings")
                        )
                        .appendTo(pane);

                    createElement("div")
                        .withClass(panels.horizontal, "epButtonPanel")
                        .withChildren(
                            createButton("Open Data Folder").modify(
                                x =>
                                    (x.onclick = () => {
                                        electron.shell.openExternal($api.data);
                                    })
                            ),
                            createWarnButton("Restart in safe mode").modify(
                                x => (x.onclick = endpwn.safemode)
                            ),
                            createDangerButton("Uninstall EndPwn").modify(
                                x => (x.onclick = endpwn.uninstall)
                            )
                        )
                        .appendTo(content);
                }
            }

            $api.events.hook("USER_SETTINGS_MODAL_SET_SECTION", e =>
                setTimeout(_ => renderSettings(e), 200)
            );
            $api.events.hook("USER_SETTINGS_MODAL_INIT", e =>
                setTimeout(_ => renderSettings(e), 200)
            );
        }
    };

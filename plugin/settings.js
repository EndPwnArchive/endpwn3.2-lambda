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

exports = {

    manifest: {
        author: "Cynosphere, dr1ft",
        name: "Settings Page + Settings API",
        description: "Hijacking the settings pages.",
        replacements: [
            {signature:'/function z\\(\\){return\\[{(.+)}]}/',payload:'window.$settingsapi={sections:[{$1}]};function z(){return window.$settingsapi.sections;}'}
        ],
        loadAfter: ["system"]
    },

    init: function () {

        delete endpwn.settings.init;

        var buttons = $api.util.findFuncExports('button-', 'colorBlack');
        var checkboxes = $api.util.findFuncExports('checkboxEnabled');
        var misc = $api.util.findFuncExports('statusRed-', 'inputDefault');
        var misc2 = $api.util.findFuncExports('multiInputField');
        var misc3 = $api.util.findFuncExports('formText-','formText');
        var headers = $api.util.findFuncExports('h5-', 'h5');
        var dividers = wc.findFunc('divider-')[0].exports;

        var panels = wc.findFunc('flexChild-')[0].exports;
        var panels2 = $api.util.findFuncExports('errorMessage-', 'inputWrapper');

        let sections = window.$settingsapi.sections;

        window.$settingsapi = {
            sections: sections,
            ourSections: [],
            _callbacks: {},
            _panels: {},
            addSection: function(name,label,color=null,callback){
                let data = {};

                data.section = name || `SAPI_${Math.floor(Math.random()*10000)}`;
                data.label = label;
                data.color = color;
                data.element = $api.util.findConstructor('FormSection', 'FormSection').FormSection;

                $settingsapi.ourSections.push(data);
                $settingsapi.sections.splice($settingsapi.sections.length-4,0,data);
                $settingsapi._callbacks[name] = callback;
            },
            addDivider: function(){
                $settingsapi.ourSections.push({section:"DIVIDER"});
                $settingsapi.sections.splice($settingsapi.sections.length-4,0,{section:"DIVIDER"});
            },
            addHeader: function(label){
                $settingsapi.ourSections.push({section:"HEADER",label:label});
                $settingsapi.sections.splice($settingsapi.sections.length-4,0,{section:"HEADER",label:label});
            },
            //All of these allow us to use Discord's elements.
            elements: {
                createVerticalPanel: function() {
                    return createElement("div")
                        .withClass(panels2.vertical, 'epButtonPanel')
                },
                createHorizontalPanel: function() {
                    return createElement("div")
                        .withClass(panels.horizontal, 'epButtonPanel')
                },
                createButton: function(name) {
                    return createElement('button')
                        .withContents(name)
                        .withClass(
                            buttons.button,
                            buttons.lookFilled,
                            buttons.colorBrand,
                            buttons.sizeSmall,
                            buttons.grow,
                            'epMargin'
                        );
                },
                createWarnButton: function(name) {
                    return createElement('button')
                        .withContents(name)
                        .withClass(
                            buttons.button,
                            buttons.lookOutlined,
                            buttons.colorYellow,
                            buttons.sizeSmall,
                            buttons.grow,
                            'epMargin'
                        );
                },
                createDangerButton: function(name) {
                    return createElement('button')
                        .withContents(name)
                        .withClass(
                            buttons.button,
                            buttons.lookOutlined,
                            buttons.colorRed,
                            buttons.sizeSmall,
                            buttons.grow,
                            'epMargin'
                        );
                },
                createH2: function(text) {
                    return createElement("h2")
                        .withClass(
                            headers.h2,
                            headers.title,
                            headers.size16,
                            headers.height20,
                            headers.weightSemiBold,
                            headers.defaultColor,
                            'epMargin'
                        )
                        .withText(text);
                },
                createH5: function(text) {
                    return createElement("h5")
                        .withClass(
                            headers.h5,
                            headers.title,
                            headers.size12,
                            headers.height16,
                            headers.weightSemiBold
                        )
                        .withText(text);
                },
                createInput: function(v, p) {
                    return createElement("input")
                        .withClass(
                            misc.inputDefault,
                            misc.input,
                            misc.size16,
                            'epMargin'
                        )
                        .modify(x => x.value = v ? v : "")
                        .modify(x => x.placeholder = p ? p : "")
                },
                updateSwitch: function(s, w) {
                    if (s.checked) {
                        w.classList.remove(checkboxes.valueUnchecked.split(' ')[0]);
                        w.classList.add(checkboxes.valueChecked.split(' ')[0])
                    }
                    else {
                        w.classList.remove(checkboxes.valueChecked.split(' ')[0]);
                        w.classList.add(checkboxes.valueUnchecked.split(' ')[0])
                    }
                },
                createSwitch: function(c, i) {
                    if (c === undefined) c = () => { };
                    if (i === undefined) i = false;
                    var s, w = createElement('div')
                        .withClass(
                            checkboxes.switch,
                            checkboxes.switchEnabled,
                            checkboxes.size,
                            checkboxes.sizeDefault,
                            checkboxes.themeDefault
                        )
                        .withChildren(
                            s = createElement("input")
                                .withClass(
                                    checkboxes.checkbox,
                                    checkboxes.checkboxEnabled
                                )
                                .modify(x => x.type = 'checkbox')
                                .modify(x => x.checked = i)
                                .modify(x => x.onchange = () => {
                                    $settingsapi.elements.updateSwitch(s, w);
                                    c(s.checked);
                                })
                        )
                    $settingsapi.elements.updateSwitch(s, w);
                    return w;
                },
                internal:{
                    panels:panels,
                    panels2:panels2,
                    buttons:buttons,
                    checkboxes:checkboxes,
                    misc:misc,
                    misc2:misc2,
                    misc3:misc3,
                    headers:headers,
                    dividers:dividers
                }
            }
        }

        //Example settings tab
        /*$settingsapi.addDivider();
        $settingsapi.addHeader("Element Testing");
        $settingsapi.addSection("TESTING","Element Test Page",null,function(pnl){
            let em = $settingsapi.elements;
            em.createH2("Hello World! Heading 2").appendTo(pnl);
            em.createH5("Hello World! Heading 5").appendTo(pnl);
            em.createButton("Button!").appendTo(pnl);
            em.createWarnButton("Warning Button!").appendTo(pnl);
            em.createDangerButton("Danger Button!").appendTo(pnl);
            em.createInput("","Input Box!").appendTo(pnl);
            em.createSwitch().appendTo(pnl);

            let v = em.createVerticalPanel().appendTo(pnl);
            let h = em.createHorizontalPanel().appendTo(pnl);

            em.createH2("Vertical Panel!").appendTo(v);
            em.createButton("Beep Boop").appendTo(v);

            em.createH2("Horizontal Panel!").appendTo(h);
            em.createButton("Boop Beep").appendTo(h);
        });*/

        function setupSettings(e){
            for(let i in $settingsapi._panels){
                $settingsapi._panels[i].remove();
            }

            for(let i in $settingsapi.ourSections){
                let data = $settingsapi.ourSections[i];
                if(e.section == data.section){
                    var pane = $(".content-column.default");
                    if (!pane) return;

                    $settingsapi._panels[data.section] = createElement('div')
                    .withClass('flex-vertical')
                    .appendTo(pane);

                    $settingsapi._callbacks[data.section]($settingsapi._panels[data.section]);
                }
            }
        }

        $api.events.hook("USER_SETTINGS_MODAL_SET_SECTION",setupSettings);
        $api.events.hook("USER_SETTINGS_MODAL_INIT",e=>setTimeout(_=>setupSettings(e),200));

        $api.events.listen('ENDPWN_PSEUDO_IPC', msg => {
            $api.localStorage.set('customizer_signature', JSON.parse(msg.data).signature);
            console.log(currentSection);
            renderSettings(currentSection);
        });

        function authorizeCustomizer() {
            var endpoint = $api.internal.constants.API_HOST;
            var url = `https://${endpoint}/oauth2/authorize?client_id=436715820970803203&redirect_uri=https%3A%2F%2Fendpwn.cathoderay.tube%2Fauth%2Fdiscord%2Fintegratedcallback&response_type=code&scope=identify`;

            var win = new window.electron.BrowserWindow({
                width: 420,
                height: 500,
                transparent: false,
                frame: false,
                resizable: true,
                nodeIntegration: true
            });
            win.loadURL(url);
        }

        function submitCustomizer(d, b) {

            fetch('https://endpwn.cathoderay.tube/set', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    id: $me(),
                    signature: $api.localStorage.get('customizer_signature'),
                    discriminator: d,
                    bot: b
                })
            }).then(r => {

                r.text().then(k => {
                    $api.ui.showDialog({
                        title:'Server Response',
                        body: k
                    });
                });

                endpwn.customizer.update();

            });

        }

        function renderSettings(pane) {
            var em = $settingsapi.elements;
            var needAuth = !$api.localStorage.get('customizer_signature');

            var content = createElement('div')
            .withId('ep_settings')
            .withClass('flex-vertical')
            .withChildren(
                createElement("div")
                .withClass('epSettingsHeader')
                .withText('Cλnergy Settings'),
            )
            .appendTo(pane);

            em.createH2("Basic Settings")
            .modify(x=>x.className = x.className.replace("epMargin","margin-bottom-20"))
            .appendTo(content);
            createElement("div")
            .withClass(em.internal.panels.horizontal, 'epButtonPanel')
            .withChildren(
                em.createButton("Open Data Folder")
                .modify(x => x.onclick = () => { electron.shell.openExternal($api.data) }),
                em.createWarnButton("Restart in safe mode")
                .modify(x => x.onclick = endpwn.safemode),
                em.createDangerButton("Uninstall EndPwn")
                .modify(x => x.onclick = endpwn.uninstall)
            )
            .appendTo(content);

            createElement("div")
            .withClass(em.internal.dividers.divider,"margin-bottom-40","margin-top-40")
            .appendTo(content);

            em.createH2("Customizer")
            .modify(x=>x.className = x.className.replace("epMargin","margin-bottom-20"))
            .appendTo(content);
            if (!$api.localStorage.get('customizer_signature')) {
                em.createHorizontalPanel()
                .withChildren(
                    em.createButton("Authorize EndPwn Customizer")
                    .modify(x => x.onclick = authorizeCustomizer)
                )
                .appendTo(content);
            }
            else {
                var discrim, bot;

                em.createVerticalPanel()
                .withChildren(
                    em.createH5('Discriminator'),
                    em.createHorizontalPanel()
                    .withChildren(
                        discrim = em.createInput(endpwn.customizer.me.discrim ? endpwn.customizer.me.discrim : '')
                        .withClass('epDiscrimField')
                        .modify(x => x.maxLength = 4),
                        em.createVerticalPanel()
                        .withChildren(
                            em.createH5('Bot?'),
                            bot = em.createSwitch(() => { }, endpwn.customizer.me.bot)
                        ),
                        em.createButton("Submit")
                        .modify(x => x.onclick = () => submitCustomizer(discrim.value, bot.children[0].checked))
                    )
                )
                .appendTo(content);
            }
        }

        $settingsapi.addDivider();
        $settingsapi.addHeader("Cynergy");
        $settingsapi.addSection("ENDPWN","Cλnergy Settings","#c8f",renderSettings);
    }

}
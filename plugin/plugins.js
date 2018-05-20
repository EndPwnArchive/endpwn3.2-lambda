exports = {
    manifest: {
        author: "Cynosphere",
        name: "Plugins Page",
        description: "Shows what plugins you have",
        loadAfter:["settings"]
    },

    start:function(){
        let em = $settingsapi.elements;
        let int = em.internal;

        var createPlugin = function(id,data){
            var info = {};
            info.name = data.name ? data.name : (id ? id : "<unnamed plugin???>");
            info.description = data.description ? data.description : "Manifest is missing for this plugin.";
            info.author = data.author ? data.author : "Unknown";
            info.loadAfter = data.loadAfter ? data.loadAfter : [];
            info.priority = data.priority ? data.priority : 0;
            info.replacements = data.replacements ? data.replacements : [];

            var cont = em.createVerticalPanel();

            var head = em.createHorizontalPanel()
            .appendTo(cont);

            var title = createElement("h3")
            .withClass(
                int.headers.h3,
                int.headers.title,
                int.headers.size16,
                int.headers.height20,
                int.headers.defaultColor
            )
            .withText(info.name)
            .appendTo(head);

            em.createH5('By '+info.author)
            .appendTo(title);

            em.createSwitch(() => { }, true)
            .appendTo(head);

            createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .withText(info.description)
            .appendTo(cont);

            var body = em.createHorizontalPanel()
            .appendTo(cont);

            createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .withText(`Replacements: ${info.replacements.length}`)
            .appendTo(body);

            createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .modify(x=>x.style.marginLeft = "8px")
            .withText(`Priority: ${info.priority}`)
            .appendTo(body);

            createElement("div")
            .withClass(
                int.misc3.description,
                int.misc3.formText,
                int.misc3.modeDefault
            )
            .modify(x=>x.style.marginLeft = "8px")
            .withText(info.loadAfter.length > 0 ? `Depends on: ${info.loadAfter.join(", ")}` : "No dependencies")
            .appendTo(body);

            createElement("div")
            .withClass(em.internal.dividers.divider)
            .appendTo(cont);

            return cont;
        }

        $settingsapi.addSection("Plugins","Plugins",null,function(pnl){
            em.createH2("Plugins")
            .appendTo(pnl);

            let plugins = {}

            Object.keys($pluginStore).forEach(x=>{
                console.log(x);
                plugins[x] = {id:x,data:$pluginStore[x]};
            });

            Object.keys(plugins).forEach(x=>{
                let d = plugins[x];
                createPlugin(d.id,d.data)
                .appendTo(pnl);
            });
        });
    }
}
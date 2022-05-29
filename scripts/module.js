Hooks.once('init', async function() {
    //CONFIG.debug.hooks = true;
});

Hooks.once('ready', async function() {
});

const _spRegex = /^\d+\s+/i;
let _spAspectMarker = "📖".normalize();
let _spAspectMarkerLen = _spAspectMarker.length
function _spChatAspect(document, data, userId) {
    if(!document.folder) {
        return;
    }
    if(!document.folder.data) {
        return;
    }
    let ddata = document.data;
    let name = ddata.name;
    let content = ddata.content;
    if(data.name) {
        name = data.name;
    }
    if(data.content) {
        content = data.content;
    }
    if(ddata.name == name && ddata.content == content) {
        return;
    }
    let folder = document.folder.data.name.normalize();
    let info = folder.slice(0, _spAspectMarkerLen * -1).trim();
    info = info.replace(_spRegex, "");
    let text = `<p><b>${info}: ${name}</b></p><p>${content}</p>`
    if(folder.endsWith(_spAspectMarker)) {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({user: game.user}),
            content: text
        });
    }
}

Hooks.on("preUpdateJournalEntry", async function(document, change, options, userId) {
    if(change.permission) {
        change.permission.default = 3;
    } else {
        change.permission = {default: 3};
    }
    _spChatAspect(document, change, userId);
});

Hooks.on("renderJournalSheet", async function(app, html, data) {
    app.editors.content.button.onclick();
    window.setTimeout(function() {
        app.document.update({permission: {default: 3}});
    }, 1000);
});

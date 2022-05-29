Hooks.once('init', async function() {
    //CONFIG.debug.hooks = true;
});

Hooks.once('ready', async function() {
});

const _spRegex = /^\d+\s+/i;
let _spAspectMarker = "📖".normalize();
let _spAspectMarkerLen = _spAspectMarker.length

function _spChatAspectChange(document, data) {
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
    return _spChatAspect(document, name, content);
}

function _spChatAspect(document, name, content) {
    if(!document.folder) {
        return;
    }
    if(!document.folder.data) {
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
        return true;
    }
    return false;
}

Hooks.on("preUpdateJournalEntry", async function(document, change, options, userId) {
    if(_spChatAspectChange(document, change)) {
        if(change.permission) {
            change.permission.default = 3;
        } else {
            change.permission = {default: 3};
        }
    }
});

Hooks.on("closeJournalSheet", async function(app, html) {
    let document = app.document;
    let data = document.data;
    if(!document.getFlag("my-foundry-macros", "logged")) {
        if(!data.content) {
            if(_spChatAspect(document, data.name, data.content)) {
                document.update({permission: {default: 3}});
            }
        }
    }
    document.setFlag("my-foundry-macros", "logged", true);
});

Hooks.on("renderJournalSheet", async function(app, html, data) {
    if(app.document.getFlag("my-foundry-macros", "logged")) {
        app.editors.content.button.onclick();
    }
});

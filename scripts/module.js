Hooks.once('init', async function() {
    //CONFIG.debug.hooks = true;
});

Hooks.once('ready', async function() {
});

const _spRegex = /^\d+\s+/i;
let _spAspectMarker = "📖".normalize();
let _spAspectMarkerLen = _spAspectMarker.length
function _spChatAspect(document, userId) {
    if(!document.folder) {
        return;
    }
    if(!document.folder.data) {
        return;
    }
    if(userId != game.user.data._id) {
        return;
    }
    let folder = document.folder.data.name.normalize();
    let info = folder.slice(0, _spAspectMarkerLen * -1).trim();
    info = info.replace(_spRegex, "");
    let text = `<p><b>${info}: ${document.data.name}</b></p><p>${document.data.content}</p>`
    if(folder.endsWith(_spAspectMarker)) {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({user: game.user}),
            content: text
        });
    }
}

Hooks.on("updateJournalEntry", async function(document, change, options, userId) {
    document.update({permission: {default: 3}});
    if(change.name == undefined && change.content == undefined) {
        return;
    }
    _spChatAspect(document, userId);
});

Hooks.on("createJournalEntry", async function(document, options, userId) {
    document.data.permission.default = 3;
    _spChatAspect(document, userId);
});

Hooks.on("renderJournalSheet", async function(app, html, data) {
    app.editors.content.button.onclick();
});

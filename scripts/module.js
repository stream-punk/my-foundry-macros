Hooks.once('init', async function() {
    //CONFIG.debug.hooks = true;
});

Hooks.once('ready', async function() {
});

let _spAspectMarker = "📖".normalize();
let _spAspectMarkerLen = _spAspectMarker.length
Hooks.on("updateJournalEntry", async function(document, change, options, userId) {
    document.update({permission: {default: 3}});
    if(userId != game.user.data._id) {
        return;
    }
    if(change.name == undefined && change.content == undefined) {
        return;
    }
    let folder = document.folder.data.name.normalize();
    let info = folder.slice(2, _spAspectMarkerLen * -1).trim();
    let text = `<p><b>${info}: ${document.data.name}</b></p><p>${document.data.content}</p>`
    if(folder.endsWith(_spAspectMarker)) {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({user: game.user}),
            content: text
        });
    }
});

Hooks.on("renderJournalSheet", async function(app, html, data) {
    app.editors.content.button.onclick();
});

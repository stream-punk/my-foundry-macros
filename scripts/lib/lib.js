function spShowResult(rank, total, goal) {
    let msg = "Voller Erfolg"
    res = total - goal
    color = "green"
    if(res < 0) {
        msg = "Fehlschlag"
        color = "red"
    } else if (res == 0) {
        msg = "Gleichstand"
        color = "orange"
    } else if (res < 3) {
        msg = "Erfolg"
    }
    return `<p style="color: ${color};">${msg}, <b>Deine Erfolgsstufe: ${res}</b><br>(Total(${total}) + Fähigkeit(${rank}) - Ziel(${goal}))</p>`
}


async function spRollAgainstAction(game, actor, skill, goal) {
    await _spRollSkill(game, actor, skill, goal, true)
}

async function spRollSkill(game, actor, skill) {
    await _spRollSkill(game, actor, skill, 0, false)
}

async function _spRollSkill(game, actor, skill, goal, margin) {
    try {
        for(element of actor.data.items) {
            if(element.type == "skill" && element.name == skill) {
                let rank = element.data.data.rank
                let roll = new Roll("4df + @rank", {rank: rank})
                let res = await roll.evaluate({async: true})
                if(margin) {
                    let msg = spShowResult(rank, res.total, goal)
                    roll.toMessage({flavor: msg, speaker: ChatMessage.getSpeaker({token: actor})})
                } else {
                    roll.toMessage({speaker: ChatMessage.getSpeaker({token: actor})})
                }
                return
             }
        }
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({user: game.user}),
            content: "Du hast kein Talent"
        });
    } catch {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({user: game.user}),
            content: "Kein Charakter ausgewählt"
        });
    }
}

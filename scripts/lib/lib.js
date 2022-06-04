function spShowResult(total, rank, bonus, goal) {
    let msg = "Voller Erfolg"
    let wurf = total - rank - bonus
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
    return `<p style="color: ${color};">${msg}, <b>Deine Erfolgsstufe: ${res}</b><br>(Wurf(${wurf}) + Fähigkeit(${rank}) + Bonus(${bonus}) - Ziel(${goal}))</p>`
}


async function spRollAgainstAction(game, actor, skill, bonus, goal) {
    await spRollSkill(game, actor, skill, bonus, goal, true)
}

async function spRollSkill(game, actor, skill, bonus) {
    await spRollSkill(game, actor, skill, bonus, 0, false)
}

async function spRollSkill(game, actor, skill, bonus, goal, margin) {
    try {
        for(element of actor.data.items) {
            if(element.type == "skill" && element.name == skill) {
                let rank = element.data.data.rank
                let roll = new Roll("4df + @rank + @bonus", {rank: rank, bonus: bonus})
                let res = await roll.evaluate({async: true})
                if(margin) {
                    let msg = spShowResult(res.total, rank, bonus, goal)
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
    } catch(e) {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({user: game.user}),
            content: "Kein Charakter ausgewählt oder Fehler"
        });
        throw e;
    }
}

function spRollFromWindow(game, action, skill, bonus, goal) {
    if(!bonus.val()) {
        bonus = 0;
    } else {
        bonus = parseInt(bonus.val());
        if(Number.isNaN(bonus)) {
            bonus = 0
        }
    }
    if(!goal.val()) {
        goal = 0;
    } else {
        goal = parseInt(goal.val());
        if(Number.isNaN(goal)) {
            goal = 0
        }
    }
    spRollAgainstAction(game, action, skill.val(), bonus, goal);
}

function spRollWindowCallback(game, actor, dialog) {
    table = $("#spRollDialogTable");
    skill = table.find("#spSkillSelect");
    bonus = table.find("#spBonusInput");
    goal = table.find("#spGoalInput");
    button = table.find("#spRollButton");
    button.click(() => {spRollFromWindow(game, actor, skill, bonus, goal)});
}

async function spRollWindow(game, actor) {
    try {
        if($("#spRollDialogTable").length != 0) {
            return;
        }
        skills = []
        for(element of actor.data.items) {
            if(element.type == "skill") {
                skills.push(element.name)
            }
        }
        const myContent = await renderTemplate("modules/my-foundry-macros/templates/roll_window.hbs", {skills: skills});
        const myDialog = new Dialog({
            title: "4df Roller",
            content: myContent,
            buttons: {},
            render: (dialog) => {spRollWindowCallback(game, actor, dialog)}
        })
        myDialog.render(true, {height:0, width: 0});
    } catch(e) {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({user: game.user}),
            content: "Kein Charakter ausgewählt oder Fehler"
        });
        throw e;
    }
}

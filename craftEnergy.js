elements.ce_wire = {
    color: "#ffffff",
    category: "ce",
    behavior: behaviors.WALL,
    state: "solid",
    density: 2000,
    movable: false,
    tick: function(pixel){
        if(pixel.ce == undefined){
            pixel.ce = 0;
        }
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let neighbors = [pixel];
        let totalCE = pixel.ce;
        for(let dir of directions){
            let nPixel = getPixel(pixel.x+dir[0], pixel.y+dir[1]);
            if(nPixel != undefined){
                if(nPixel.ce != undefined){
                    neighbors.push(nPixel);
                    totalCE += nPixel.ce;
                }
            }
        }
        for(let nPixel of neighbors){
            nPixel.ce = totalCE/neighbors.length;
        }

        pixel.color = "rgb("+(Math.max(Math.min(pixel.ce*10, 0-pixel.ce*10+400), 0)+55/Math.max(pixel.ce/1000, 1))+", "+(Math.max(Math.min(pixel.ce*10-200, 0-pixel.ce*10+600), 0)+55/Math.max(pixel.ce/10000, 1))+", "+(Math.max(Math.min(pixel.ce*10-400, 200), 0)+55)+")";
    }
}
elements.ce_generator = {
    color: "#ffffff",
    category: "ce",
    behavior: behaviors.SOLID,
    state: "solid",
    density: 2000,
    movable: false,
    tick: function(pixel){
        if(pixel.ce == undefined){
            pixel.ce = 0;
        }
        if(pixel.genPixel){
            if(pixel.genPixel.x != pixel.x || pixel.genPixel.y != pixel.y-1){
                pixel.ce += 0.1;
            }
        }
        let genPixel = getPixel(pixel.x, pixel.y-1);
        if(genPixel){
            pixel.genPixel = genPixel;
        }else{
            pixel.genPixel = undefined;
        }
    }
}
elements.ce_heater = {
    color: "#ff0000",
    category: "ce",
    behavior: behaviors.SOLID,
    state: "solid",
    density: 2000,
    movable: false,
    tick: function(pixel){
        if(pixel.ce == undefined){
            pixel.ce = 0;
        }
        pixel.temp += pixel.ce;
        pixel.ce = 0;
    }
}
elements.ce_crafter_core = {
    color: "#ff8800",
    category: "ce",
    behavior: behaviors.SOLID,
    state: "solid",
    density: 2000,
    movable: false,
    tick: function(pixel){
        if(pixel.ce == undefined){
            pixel.ce = 0;
        }
        for(let craft of elements.ce_crafter_core.crafts){
            let isCraftable = true;
            for(let x = 0; x < craft.ingredients.length; x++){
                for(let y = 0; y < craft.ingredients[x].length; y++){
                    if(
                        isCraftable &&
                        getPixel(pixel.x+1+x, pixel.y+1+y) != undefined &&
                        getPixel(pixel.x+1+x, pixel.y+1+y).element == craft.ingredients[x][y]
                    ){
                        // nothing
                    }else{
                        isCraftable = false;
                    }
                }
            }
            if(isCraftable && pixel.ce >= craft.ce_cost){
                for(let x = 0; x < craft.ingredients.length; x++){
                    for(let y = 0; y < craft.ingredients[x].length; y++){
                        tryDelete(pixel.x+1+x, pixel.y+1+y);
                    }
                }
                tryCreate(craft.result, pixel.x+1, pixel.y+1);
                pixel.ce -= craft.ce_cost;
            }
        }
    }
}
if(elements.ce_crafter_core.crafts == undefined){
    elements.ce_crafter_core.crafts = [];
}
elements.ce_crafter_core.crafts.push({
    ingredients: [
        ["gunpowder", "sand", "gunpowder"],
        ["sand", "gunpowder", "sand"],
        ["gunpowder", "sand", "gunpowder"]
    ],
    result: "tnt",
    ce_cost: 10
});
elements.ce_pump = {
    color: "#ffffff",
    category: "ce",
    behavior: behaviors.WALL,
    state: "solid",
    density: 2000,
    onSelect: function(){
        promptChoose(
            "choose direction",
            ["←", "→", "↑", "↓"],
            function(choise){
                if(choise === null){
                    return;
                }
                elements.ce_pump.direction = ["←", "→", "↑", "↓"].indexOf(choise);
            }
        );
    },
    tick: function(pixel){
        if(!pixel.direction){
            let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            pixel.direction = directions[elements.ce_pump.direction];
        }
        pixelFrom = getPixel(pixel.x-pixel.direction[0], pixel.y-pixel.direction[1]);
        pixelTo = getPixel(pixel.x+pixel.direction[0], pixel.y+pixel.direction[1]);
        if(pixelFrom && pixelTo){
            if(pixelFrom.ce != undefined && pixelTo.ce != undefined){
                pixelTo.ce += pixelFrom.ce*0.9;
                pixelFrom.ce = 0;
            }
        }
    }
}
elements.ce_conventer = {
    color: "#ffffff",
    category: "ce",
    behavior: behaviors.WALL,
    state: "solid",
    density: 2000,
    movable: false,
    tick: function(pixel){
        if(pixel.ce == undefined){
            pixel.ce = 0;
        }
        if(pixel.ce >= 1){
            if(tryCreate("ce_powder", pixel.x, pixel.y+1)){
                pixel.ce -= 1;
            }
        }
        let topPixel = getPixel(pixel.x, pixel.y-1);
        if(topPixel && ["ce_powder", "molten_ce", "ce"].includes(topPixel.element)){
            tryDelete(pixel.x, pixel.y-1);
            pixel.ce += 1;
        }
    }
}
elements.ce_powder = {
    color: "#ffffff",
    category: "ce",
    behavior: behaviors.POWDER,
    state: "solid",
    density: 2000,
    tempHigh: 1024,
    stateHigh: "molten_ce"
}
elements.molten_ce = {
    color: "#ff9999",
    category: "ce",
    behavior: behaviors.MOLTEN,
    state: "solid",
    density: 2000,
    tempLow: 1024,
    stateLow: "ce"
}
elements.ce = {
    color: "#ffffff",
    category: "ce",
    behavior: behaviors.WALL,
    state: "solid",
    density: 2000,
    tempHigh: 1024,
    stateHigh: "molten_ce",
    breakInto: "ce_powder"
}
elements.ce_fan = {
    color: "#ffffff",
    category: "ce",
    behavior: behaviors.WALL,
    state: "solid",
    density: 2000,
    movable: false,
    onSelect: function(){
        promptChoose(
            "choose direction",
            ["←", "→", "↑", "↓"],
            function(choise){
                if(choise === null){
                    return;
                }
                elements.ce_fan.direction = ["←", "→", "↑", "↓"].indexOf(choise);
            }
        );
    },
    tick: function(pixel){
        if(pixel.ce == undefined){
            pixel.ce = 0;
        }
        if(!pixel.direction){
            let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            pixel.direction = directions[elements.ce_fan.direction];
        }
        let pixelProcessedCords = [pixel.x, pixel.y];
        let fanStrength = pixel.ce*12;
        pixel.ce = 0;
        while(!outOfBounds(pixelProcessedCords[0]+pixel.direction[0]*2, pixelProcessedCords[1]+pixel.direction[1]*2) && fanStrength > 0){
            pixelProcessedCords[0] += pixel.direction[0];
            pixelProcessedCords[1] += pixel.direction[1];
            let pixelProcessed = getPixel(pixelProcessedCords[0], pixelProcessedCords[1]);
            if(pixelProcessed){
                if(Math.random()*elements[pixelProcessed.element].density<=fanStrength){
                    tryMove(pixelProcessed, pixelProcessedCords[0]+pixel.direction[0], pixelProcessedCords[1]+pixel.direction[1]);
                }
            }
            fanStrength--;
        }
    }
}
elements.ce_grinder = {
    color: "#ffffff",
    category: "ce",
    behavior: behaviors.WALL,
    state: "solid",
    density: 2000,
    movable: false,
    tick: function(pixel){
        if(pixel.ce == undefined){
            pixel.ce = 0;
        }
        if(pixel.ce >= 1){
            if(getPixel(pixel.x, pixel.y-1) && isBreakable(getPixel(pixel.x, pixel.y-1))){
                breakPixel(getPixel(pixel.x, pixel.y-1));
                pixel.ce -= 1;
            }
        }
    }
}

/*
for(let element of Object.values(elements)){
    if(element.reactions != undefined){
        for(let reactionKey in element.reactions){
            let reaction = element.reactions[reactionKey];
            if(reaction.elem1 == "bone" || reaction.elem2 == "bone"){
                console.log(element);
            }
        }
    }
}
console.log("end");
*/
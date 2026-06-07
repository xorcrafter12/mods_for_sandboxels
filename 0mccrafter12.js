runPerPixel(function(pixel){
    if(pixel.temp > 20){
        pixel.temp -= 0.1;
    }else if(pixel.temp < 20){
        pixel.temp += 0.1;
    }
});

elements.steel.reactions["acid"] = {elem1:"battery", elem2:null};
elements.rock.reactions["water"] = {elem1:"wet_rock", elem2:null};
elements.copper.reactions["straw"] = {elem1:"filter", elem2:"filter", tempMin:300};
elements.mud.breakInto = ["dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "water", "rock"];
elements.dirt.reactions["dead_plant"] = {elem1:"dirt", elem2:"dirt", chance:0.001}
elements.straw.behavior = behaviors.STURDYPOWDER;

elements.filter.tempHigh = 1090;

elements.filter.stateHigh = ["copper", "straw"];
elements.grass.stateHigh = "straw";

elements.metal_scrap.tempHigh = 600;
elements.metal_scrap.stateHigh = ["molten_metal_scrap", "iron", "silver", "tin", "lead", "nickel", "aluminium", "aluminium", "aluminium", "aluminium", "tungsten", "zinc"];

elements.wet_rock = {
    color: ["#555555", "#777777"],
    behavior: behaviors.STURDYPOWDER,
    category: "land",
    state: "solid",
    density: 2900,
    breakInto: ["rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "slag", "slag", "slag", "slag", "water", "metal_scrap", "oxidized_copper"],
    tempHigh: 100,
    stateHigh: "rock_wall"
};

try {
    survivalShop["fire*100"] = 10;
} catch (error) {
    survivalShop = {};
    survivalShop["fire*100"] = 10;
}

if(false){
    delete elements.heat;
}
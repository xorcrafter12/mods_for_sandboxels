keybinds = {};

// не мой код
// ========== ДОБАВЛЯЕМ ЭКРАННЫЕ КНОПКИ ДЛЯ ТЕЛЕФОНА ==========
(function addMobileControls() {
    // Функция для создания кнопок
    function createButton(id, text, keyCode, key) {
        const btn = document.createElement("button");
        btn.id = id;
        btn.textContent = text;
        Object.assign(btn.style, {
            position: "fixed",
            bottom: "20px",
            width: "70px",
            height: "70px",
            fontSize: "24px",
            fontWeight: "bold",
            borderRadius: "40px",
            border: "none",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            textAlign: "center",
            zIndex: "10000",
            touchAction: "manipulation",
            cursor: "pointer"
        });
        
        // Обработчики для ПК (мышь)
        btn.addEventListener("mousedown", () => pressedKeys[key] = true);
        btn.addEventListener("mouseup", () => pressedKeys[key] = false);
        btn.addEventListener("mouseleave", () => pressedKeys[key] = false);
        
        // Обработчики для телефона (touch)
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            pressedKeys[key] = true;
        });
        btn.addEventListener("touchend", (e) => {
            e.preventDefault();
            pressedKeys[key] = false;
        });
        btn.addEventListener("touchcancel", (e) => {
            e.preventDefault();
            pressedKeys[key] = false;
        });
        
        return btn;
    }

    // Создаём и размещаем кнопки
    const leftBtn = createButton("ctrlLeft", "◀", "KeyA", "a");
    leftBtn.style.left = "20px";
    const rightBtn = createButton("ctrlRight", "▶", "KeyD", "d");
    rightBtn.style.left = "100px";
    const upBtn = createButton("ctrlUp", "▲", "KeyW", "w");
    upBtn.style.left = "180px";
    const downBtn = createButton("ctrlDown", "▼", "KeyS", "s");
    downBtn.style.left = "260px";
    const breakBtn = createButton("ctrlBreak", "💥", "KeyB", "b");
    breakBtn.style.left = "20px";
    breakBtn.style.bottom = "100px";
    const grabBtn = createButton("ctrlGrab", "🎒", "KeyG", "g");
    grabBtn.style.left = "100px";
    grabBtn.style.bottom = "100px";
    
    document.body.appendChild(leftBtn);
    document.body.appendChild(rightBtn);
    document.body.appendChild(upBtn);
    document.body.appendChild(downBtn);
    document.body.appendChild(breakBtn);
    document.body.appendChild(grabBtn);
    
    // Небольшой лог для проверки загрузки
    console.log("Mobile control buttons added");
})();
// конец не моего кода

runAfterReset(function(){
    worldGenerationStage = 0;
});
runEveryTick(function(){
    if(worldGenerationStage == 0){
        for(let i = 0; i < width; i++){
            createPixel("basalt", Math.floor(Math.random()*width), Math.floor(Math.random()*height/4+height/4*3-(pixelTicks/width)));
        }
        if(pixelTicks/height*4 >= 1){
            worldGenerationStage = 1;
        }
    }
    if(worldGenerationStage == 1){
        createPixel("rock", Math.floor(Math.random()*width), Math.floor(Math.random()*height/4+height/4*3-(pixelTicks/width)));
        if(pixelTicks/width/height*12/5 >= 1){
            worldGenerationStage = 2;
        }
    }
    if(worldGenerationStage == 2){
        createPixel("dirt", Math.floor(Math.random()*width), Math.floor(Math.random()*height/4+height/4*3-(pixelTicks/width)));
        if(pixelTicks/width/height*2 >= 1){
            worldGenerationStage = 3;
        }
    }
    if(worldGenerationStage == 3){
        for(let i = 0; i < width; i++){
            if(Math.random() > 0.05){
                createPixel("grass", i, Math.floor(height/4));
            }else{
                createPixel("sapling", i, Math.floor(height/4));
            }
        }
        worldGenerationStage = 4;
    }
});
pressedKeys = {};
document.addEventListener("keydown", function(event){
    pressedKeys[event.key] = true;
});
document.addEventListener("keyup", function(event){
    pressedKeys[event.key] = false;
});


elements.player = {
    color: "#ffffff",
    state: "solid",
    density: 2000,
    onPlace: function(){
        
    },
    tick: function(pixel){
        if(!pixel.moveTimer){
            pixel.moveTimer = 0;
        }

        if(pressedKeys.w && !isEmpty(pixel.x, pixel.y+1)){
            tryMove(pixel, pixel.x, pixel.y-1);
        }
        if(pixel.moveTimer == 0){
            if(pressedKeys.a){
                pixel.direction = [-1, 0];
                tryMove(pixel, pixel.x-1, pixel.y);
                pixel.moveTimer = 6;
            }
            if(pressedKeys.d){
                pixel.direction = [1, 0];
                tryMove(pixel, pixel.x+1, pixel.y);
                pixel.moveTimer = 6;
            }
        }else{
            pixel.moveTimer--;
        }
        if(pressedKeys.s){
            pixel.direction = [0, 1];
        }
        if(isEmpty(pixel.x, pixel.y+1)){
            if(!pressedKeys.w || isEmpty(pixel.x, pixel.y+2)){
                tryMove(pixel, pixel.x, pixel.y+1)
            };
        }
        if(pressedKeys.b && getPixel(pixel.x+pixel.direction[0], pixel.y+pixel.direction[1])){
            breakPixel(getPixel(pixel.x+pixel.direction[0], pixel.y+pixel.direction[1]));
        }
        if(pressedKeys.g && !pixel.bagUsed){
            if(pixel.bag){
                pixel.bag.x = pixel.x+pixel.direction[0];
                pixel.bag.y = pixel.y+pixel.direction[1];
                pixel.bag.del = false;
                if(tryCreate(pixel.bag.element, pixel.x+pixel.direction[0], pixel.y+pixel.direction[1])){
                    for(let key of Object.keys(pixel.bag)){
                        if(["del", "x", "y", "element"].includes(key)){
                            continue;
                        }
                        pixelMap[pixel.x+pixel.direction[0]][pixel.y+pixel.direction[1]][key] = pixel.bag[key];
                    }
                    pixel.bag = undefined;
                }
            }else{
                pixel.bag = getPixel(pixel.x+pixel.direction[0], pixel.y+pixel.direction[1]);
                tryDelete(pixel.x+pixel.direction[0], pixel.y+pixel.direction[1]);
            }
            pixel.bagUsed = true;
        }else if(!pressedKeys.g && pixel.bagUsed){
            pixel.bagUsed = false;
        }
        if(pressedKeys.h){
            if(getPixel(pixel.x+pixel.direction[0], pixel.y+pixel.direction[1])){
                tryMove(getPixel(pixel.x+pixel.direction[0], pixel.y+pixel.direction[1]), pixel.x+pixel.direction[0]*2, pixel.y+pixel.direction[1]*2);
            }
        }
        if(pressedKeys.l){
            if(getPixel(pixel.x+pixel.direction[0]*2, pixel.y+pixel.direction[1]*2)){
                tryMove(getPixel(pixel.x+pixel.direction[0]*2, pixel.y+pixel.direction[1]*2), pixel.x+pixel.direction[0], pixel.y+pixel.direction[1]);
            }
        }
        if(pressedKeys.h || pressedKeys.l){
            let stick;
            if(pressedKeys.h){
                stick = getPixel(pixel.x+pixel.direction[0]*2, pixel.y+pixel.direction[1]*2);
            }else{
                stick = getPixel(pixel.x+pixel.direction[0], pixel.y+pixel.direction[1]);
            }
            if(stick && ["wood", "tree_branch"].includes(stick.element)){
                let fuel = getPixel(stick.x, stick.y+1);
                if(fuel && ["grass", "straw", "charcoal"].includes(fuel.element)){
                    stick.temp += 1;
                    fuel.temp += 1;
                    console.log(stick.temp);
                }
            }
        }
    }
}

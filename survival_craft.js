keybinds = {};

// не мой код
// === ЭКРАННЫЕ КНОПКИ (с возможностью скрыть/показать) ===
(function addMobileButtons() {
    if (!window.pressedKeys) window.pressedKeys = {};
    
    // Флаг видимости кнопок (по умолчанию видны)
    let buttonsVisible = true;
    
    // Создаём панель с кнопками
    var panel = document.createElement('div');
    panel.id = 'mobileControlPanel';
    panel.style.cssText = 'position:fixed; bottom:20px; left:0; right:0; display:flex; justify-content:center; gap:12px; z-index:99999; background:rgba(0,0,0,0.7); padding:12px; border-radius:50px; flex-wrap:wrap; transition: opacity 0.3s;';
    
    var buttons = [
        { sym: '←', key: 'a', color: '#333' },
        { sym: '→', key: 'd', color: '#333' },
        { sym: '↑', key: 'w', color: '#333' },
        { sym: '↓', key: 's', color: '#333' },
        { sym: '💥', key: 'b', color: '#aa0000' },
        { sym: '🎒', key: 'g', color: '#00aa00' },
        { sym: 'PULL', key: 'l', color: '#ff8800' },
        { sym: 'PUSH', key: 'h', color: '#ff8800' }
    ];
    
    buttons.forEach(function(btn) {
        var button = document.createElement('button');
        button.textContent = btn.sym;
        button.style.cssText = 'width:70px; height:70px; font-size:24px; background:' + btn.color + '; color:white; border:none; border-radius:50%; touch-action:manipulation; cursor:pointer;';
        if (btn.sym === 'PULL' || btn.sym === 'PUSH') {
            button.style.width = '80px';
            button.style.fontSize = '18px';
        }
        
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            window.pressedKeys[btn.key] = true;
        });
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            window.pressedKeys[btn.key] = false;
        });
        button.addEventListener('mousedown', function() { window.pressedKeys[btn.key] = true; });
        button.addEventListener('mouseup', function() { window.pressedKeys[btn.key] = false; });
        
        panel.appendChild(button);
    });
    
    // Кнопка "Скрыть/Показать" (красный крестик)
    var toggleBtn = document.createElement('button');
    toggleBtn.textContent = '❌';
    toggleBtn.style.cssText = 'width:70px; height:70px; font-size:28px; background:#880000; color:white; border:none; border-radius:50%; touch-action:manipulation; cursor:pointer;';
    toggleBtn.title = 'Скрыть панель';
    
    toggleBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        togglePanel();
    });
    toggleBtn.addEventListener('click', function() {
        togglePanel();
    });
    
    panel.appendChild(toggleBtn);
    
    // Кнопка для показа панели (появляется только когда панель скрыта)
    var showBtn = document.createElement('button');
    showBtn.textContent = '🎮';
    showBtn.style.cssText = 'position:fixed; bottom:20px; right:20px; width:60px; height:60px; font-size:28px; background:#00aa00; color:white; border:none; border-radius:50%; touch-action:manipulation; cursor:pointer; z-index:99998;';
    showBtn.title = 'Показать панель';
    showBtn.style.display = 'none';
    
    showBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        togglePanel();
    });
    showBtn.addEventListener('click', function() {
        togglePanel();
    });
    
    function togglePanel() {
        buttonsVisible = !buttonsVisible;
        if (buttonsVisible) {
            panel.style.opacity = '1';
            panel.style.visibility = 'visible';
            showBtn.style.display = 'none';
            toggleBtn.textContent = '❌';
            toggleBtn.title = 'Скрыть панель';
        } else {
            panel.style.opacity = '0';
            panel.style.visibility = 'hidden';
            showBtn.style.display = 'flex';
            toggleBtn.textContent = '▶';
            toggleBtn.title = 'Показать панель';
        }
    }
    
    document.body.appendChild(panel);
    document.body.appendChild(showBtn);
    
    console.log('Кнопки добавлены. Нажмите ❌, чтобы скрыть панель, и 🎮 — чтобы показать.');
})();
// конец не моего кода

runAfterReset(function(){
    worldGenerationStage = 0;
});
runEveryTick(function(){
    if(worldGenerationStage == 0){
        for(let i = 0; i < width; i++){
            createPixel("basalt", Math.floor(Math.random()*width), Math.floor(Math.random()*height/4+height/4*3-(pixelTicks)));
        }
        if(pixelTicks/height*4 >= 1){
            worldGenerationStage = 1;
        }
    }
    if(worldGenerationStage == 1){
        for(let i = 0; i < width; i++){
            createPixel("rock", Math.floor(Math.random()*width), Math.floor(Math.random()*height/4+height/4*3-(pixelTicks)));
        }
        if(pixelTicks/height*12/5 >= 1){
            worldGenerationStage = 2;
        }
    }
    if(worldGenerationStage == 2){
        for(let i = 0; i < width; i++){
            createPixel("dirt", Math.floor(Math.random()*width), Math.floor(Math.random()*height/4+height/4*3-(pixelTicks)));
        }
        if(pixelTicks/height*2 >= 1){
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

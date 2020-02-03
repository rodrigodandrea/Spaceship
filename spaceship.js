window.addEventListener('load',init,false);

var KEY_ENTER=13;
var KEY_SPACE=32;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;

var canvas=null;
var ctx=null;
var lastPress=null;
var pressing=[];
var pause;
var player=new Rectangle(90,280,10,10);
var shots=[];
var pause=true;
var gameover=true;
var score=0;
var enemies=[];
var health=3;
var damaged=0;
    
function init(){
    canvas=document.getElementById('canvas');
    ctx=canvas.getContext('2d');
    
    run();
    repaint();
}
    
function run(){
    setTimeout(run,50);
    act();
}
    
function repaint(){
    requestAnimationFrame(repaint);
    paint(ctx);
}
  
function random(max){
    return ~~(Math.random()*max);
}

function reset(){
    score=0;
    player.x=90;
    player.y=280;
    shots.length=0;
    enemies.length=0;
    enemies.push(new Rectangle(10,0,10,10));
    gameover=false;
    health=3;
    damaged=0;
}

function act(){
    if(!pause){
        // GameOver Reset
        if(gameover)
        reset();
    
        // Move Rect
        //if(pressing[KEY_UP])
        // player.y-=10;
        if(pressing[KEY_RIGHT])
            player.x+=10;
        //if(pressing[KEY_DOWN])
            // player.y+=10;
        if(pressing[KEY_LEFT])
            player.x-=10;
    
        // Out Screen
        if(player.x>canvas.width-player.width)
            player.x=canvas.width-player.width;
        if(player.x<0)
            player.x=0;
    
        // New Shot
        if(lastPress==KEY_SPACE){
            shots.push(new Rectangle(player.x+3,player.y,5,5));
            lastPress=null;
        }

        // Move Enemies
        for(var i=0,l=enemies.length;i<l;i++){
            
            // Shot Intersects Enemy
            for(var j=0,ll=shots.length;j<ll;j++){
                if(shots[j].intersects(enemies[i])){
                    score++;
                    enemies[i].x=random(canvas.width/10)*10;
                    enemies[i].y=0;
                    enemies.push(new Rectangle(random(canvas.width/10)*10,0,10,10));
                    shots.splice(j--,1);
                    ll--;
                }
            }        
            
            enemies[i].y+=10;
            if(enemies[i].y>canvas.height){
                enemies[i].x=random(canvas.width/10)*10;
                enemies[i].y=0;
            }
    
            // Player Intersects Enemy
            if(player.intersects(enemies[i])&&damaged<1){
                health--;
                damaged=20
            }
        
            // Shot Intersects Enemy
            for(var j=0,ll=shots.length;j<ll;j++){
                if(shots[j].intersects(enemies[i])){
                    score++;
                    enemies[i].x=random(canvas.width/10)*10;
                    enemies[i].y=0;
                    enemies.push(new Rectangle(random(canvas.width/10)*10,0,10,10));
                    shots.splice(j--,1);
                    ll--;
                }
            }
        }

        // Move Shots
        for(var i=0,l=shots.length;i<l;i++){
            shots[i].y-=10;
            if(shots[i].y<0){
                shots.splice(i--,1);
                l--;
            }
        }
    }

    // Damaged
    if(damaged>0)
        damaged--;

    // Pause/Unpause
    if(lastPress==KEY_ENTER){
        pause=!pause;
        lastPress=null;
    }

    // GameOver
    if(health<1){
        gameover=true;
        pause=true;
    }
}
    
function paint(ctx){
    
    // Clear canvas 
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    ctx.fillStyle='#0f0';
    player.fill(ctx);

    // Enemies
    ctx.fillStyle='#00f';
    for(var i=0,l=enemies.length;i<l;i++)
        enemies[i].fill(ctx);
    
    // Draw shot
    ctx.fillStyle='#f00';
    for(var i=0,l=shots.length;i<l;i++)
        shots[i].fill(ctx);
    
    // Inmunity
    if(damaged%2==0)
        player.fill(ctx);

    // Show health    
    ctx.fillStyle='#fff'
    ctx.fillText('Health: '+health,100,20);

    // Show score
    ctx.fillStyle='#fff';
    ctx.fillText('Score: '+score,0,20);
    //ctx.fillText('Last Press: '+lastPress,0,20);
    //ctx.fillText('Shots: '+shots.length,0,30);
    
    if(pause){
        ctx.textAlign='center';
        if(gameover)
        ctx.fillText('GAME OVER',100,150);
        else
        ctx.fillText('PAUSE',100,150);
        ctx.textAlign='left';
    }
}
    
document.addEventListener('keydown',function(evt){
    lastPress=evt.keyCode;
    pressing[evt.keyCode]=true;
},false);
    
document.addEventListener('keyup',function(evt){
    pressing[evt.keyCode]=false;
},false);

function Rectangle(x,y,width,height){
    this.x=(x==null)?0:x;
    this.y=(y==null)?0:y;
    this.width=(width==null)?0:width;
    this.height=(height==null)?this.width:height;
}

Rectangle.prototype.intersects=function(rect){
    if(rect!=null){
    return(this.x<rect.x+rect.width&&
    this.x+this.width>rect.x&&
    this.y<rect.y+rect.height&&
    this.y+this.height>rect.y);
    }
}

Rectangle.prototype.fill=function(ctx){
    ctx.fillRect(this.x,this.y,this.width,this.height);
}

window.requestAnimationFrame=(function(){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback){window.setTimeout(callback,17);};
})();


var canvas = document.getElementById('drawing_canvas');
var context = canvas.getContext('2d');
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint = false;
var pixels;

function addClick(x, y, dragging){
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function redraw(){
    context.clearRect(0, 0, 280, 280);

    context.strokeStyle = "#000000";
    context.lineJoin = "round";
    context.lineWidth = 10;

    for(var i=0; i<clickX.length; i++){
        
        if(clickDrag[i] && i){
            context.beginPath();
            context.moveTo(clickX[i-1], clickY[i-1]);
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
        
    }
}

function prepare_canvas(){
    
    $('#drawing_canvas').mousedown(function(e){
        paint = true;
        rect = canvas.getBoundingClientRect();
        addClick(e.clientX - rect.left, e.clientY - rect.top, false);
        redraw();
    });
    
    $('#drawing_canvas').mousemove(function(e){
        if(paint==true){
            rect = canvas.getBoundingClientRect();
            addClick(e.clientX - rect.left, e.clientY - rect.top, true);
            redraw();
        }
    });
    
    $('#drawing_canvas').mouseup(function(e){
        paint = false;
        redraw();
    });
    
    $('#drawing_canvas').mouseleave(function(e){
        paint = false;
    });
}

function prepare_clear(){
    $('#clear_btn').click(function(){
        context.clearRect(0, 0, 280, 280);
        clickX = new Array();
        clickY = new Array();
        clickDrag = new Array();
        paint = false;
        $('#prediction_output').html("")
    });
}

function prepare_predict(){
    $('#prediction_btn').click(function(){
        pixels = new Array(28*28);
        for(var j=0; j<784; j++){
            pixels[j] = 0;
        }
        for(var i=0; i<clickX.length; i++){
            x = parseInt(clickX[i]/10);
            y = parseInt(clickY[i]/10);
            len = 28;
            weight = 255.0 / 5; //%9
            positions = get_positions(x, y, len);
            for(var k=0; k<positions.length; k++){
                if(pixels[positions[k]] + weight < 255.0){
                    pixels[positions[k]] += weight;
                }else{
                    pixels[positions[k]] = 255.0
                }
                
            }
        }
        api_call(pixels)
        //api_call(canvas.toDataURL())
    });
}

function get_positions(x, y, len){
    // SQUARED
    // 1 2 3
    // 4 5 6
    // 7 8 9
    // x,y = (5)
    var positions = new Array();
    var val;
    //1
    if(x>0 && y>0){
        val = len * (y-1) + (x-1);
        positions.push(val); 
    }
    //2
    if(y>0){
        val = len * (y-1) + x;
        positions.push(val); 
    }
    //3
    if(x<len-1 && y>0){
        val = len * (y-1) + (x+1);
        positions.push(val); 
    }
    //4
    if(x>0){
        val = len * y + (x-1);
        positions.push(val); 
    }
    //6
    if(x<len-1){
        val = len * y + (x+1);
        positions.push(val);
    }
    //7
    if(x>0 && y<len-1){
        val = len * (y+1) + (x-1);
        positions.push(val); 
    }
    //8
    if(y<len-1){
        val = len * (y+1) + x;
        positions.push(val); 
    }
    //9
    if(x<len-1 && y<len-1){
        val = len * (y+1) + (x+1);
        positions.push(val); 
    }
    //5
    val = len * y + x;
    positions.push(val);

    return positions;
}

$(document).ready(function(){
    prepare_canvas();
    prepare_clear();
    prepare_predict();
});


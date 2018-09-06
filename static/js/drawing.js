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
    context.fillStyle = "#ffffff"
    context.lineJoin = "round";
    context.lineWidth = 20;

    context.fillRect(0, 0, 280, 280)

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
        api_call(canvas.toDataURL())
    });
}


$(document).ready(function(){
    prepare_canvas();
    prepare_clear();
    prepare_predict();
});


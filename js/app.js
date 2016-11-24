var chosenFont;
var canvas = document.getElementById('canvas');
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var letter = 'D';
var letters = [];

opentype.load('fonts/GothamNarrow-Ultra.otf', function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    }
    else {
        chosenFont = font;
        initWebGL();
    }
});

function initShaderParameters(prg){
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);
    prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
}
function initScene(){
    letters = [];
    letters.push(new Letter(letter, 0.4, 0.5, 0.7 ,chosenFont));
    letters.push(new Letter('C', -0.25, 0.5, 0.7 ,chosenFont));
    letters.push(new Letter('O', -1, 0.5, 0.7 ,chosenFont));
}
function drawScene(){
    glContext.clearColor(0.9, 0.9, 1.0, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);
    mat4.ortho(pMatrix, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
    mat4.identity(mvMatrix);
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
    for (var i = 0; i < letters.length; i++) {
        letters[i].draw();
    }
}
function initWebGL(){
    glContext = getGLContext('canvas');
    initProgram();
    initScene();
    renderLoop();
}

var chosenFont;
var canvas = document.getElementById('canvas');
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var text = '';
var letter = 'D';
var letters = [];
var fontSize = 0.3;
var letterSpacing = 0.02;
var fontsURLList = {};
fontsURLList['Gotham'] = 'fonts/GothamNarrow-Ultra.otf';
var fontsList;

opentype.load(fontsURLList['Gotham'], function(err, font) {
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
    var characters = text.split('');
    var y = 0;
    if (characters.length <= 0) {
        characters = 'Hello_World!'.split('');
    }
    if (characters.length > 1) {
        letters.push(new Letter(characters[0], -1, y, fontSize, chosenFont));
        lastLetter = letters[letters.length -1];
        for (let i = 1; i < characters.length; i++) {
            letters.push(new Letter(characters[i], lastLetter.xMax + letterSpacing, y, fontSize ,chosenFont));
            lastLetter = letters[letters.length -1];
        }
    }
    else {
        letters.push(new Letter(characters[0], 0, y, fontSize ,chosenFont));
    }
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
function updateScene() {
    // Pas forcément la bonne fonction à appeler. A optimiser.
    initScene();
}
function updateFontsList() {
    fontsList.empty();
    for (let fontName in fontsURLList) {
        if (fontsURLList.hasOwnProperty(fontName)) {
            fontsList.append(
                $('<a/>')
                .addClass('list-group-item list-group-item-action')
                .text(fontName)
            );
        }
    }
}
/**
 * User Interface interaction
 */
$( document ).ready(function() {
    fontsList = $('#fonts_list');
    $('#font_size').val(fontSize);
    // $('#letter_spacing').val(letterSpacing);
    $('#parameters-forms').submit(false);
    $('#font_size').on('change', function() {
        fontSize = $(this).val();
        updateScene();
    });
    // $('#letter_spacing').on('change', function() {
    //     letterSpacing = $(this).val();
    //     console.log($(this).val());
    //     updateScene();
    // });
    $('#text').on('change input', function() {
        text = $(this).val();
        // console.log(text.split(''));
        updateScene();
    });
    $('#font_file').on('change', function() {
        console.log("New file chosen!");
        updateFontsList();
    });
    updateFontsList();
});

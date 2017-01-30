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
var render = true;

var fileURL = 'fonts/GothamNarrow-Ultra.otf';

opentype.load(fontsURLList['Gotham'], function(err, font) {
    if (err) {
        alert('Font could not be loaded: ' + err);
    }
    else {
        chosenFont = font;
        // initWebGL();
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
        letters.push(LetterConstructor.createLetter3D(characters[0], -1, y, 0, 0.1, fontSize, chosenFont, render));
        lastLetter = letters[letters.length -1];
        for (let i = 1; i < characters.length; i++) {
            letters.push(LetterConstructor.createLetter3D(characters[i], lastLetter.xMax + letterSpacing, y, 0, 0.1, fontSize ,chosenFont, render));
            lastLetter = letters[letters.length -1];
        }
    }
    else {
        letters.push(new Letter(characters[0], 0, y, fontSize ,chosenFont, render));
    }
}
function drawScene(){
    glContext.clearColor(0.9, 0.9, 1.0, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);
    mat4.ortho(pMatrix, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
    rotateModelViewMatrixUsingQuaternion(true);
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
    for (var i = 0; i < letters.length; i++) {
        letters[i].draw(mvMatrix);
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
                .addClass('list-group-item list-group-item-action font-name')
                .data('url', fontsURLList[fontName])
                .text(fontName)
            );
        }
    }
    $('.font-name').on('click', function () {
        // console.log($(this).data('url'));
        loadFont($(this).data('url'));
        updateScene();
    });
}

function loadFont(fontFileURL) {
    opentype.load(fontFileURL, function(err, font) {
        if (err) {
            alert('Font could not be loaded: ' + err);
        }
        else {
            chosenFont = font;
        }
    });
}
/**
 * User Interface interaction
 */
$( document ).ready(function() {
    render = true;
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
        updateScene();
    });
    $('#fullrender').on('click', function () {
        render = true;
        updateScene();
    });
    $('#wireframe').on('click', function () {
        render = false;
        updateScene();
    });
    $('#font_file').on('change', function() {
        var file = $(this).prop('files')[0];
        if (!fontsURLList.hasOwnProperty(file.name)) {
            var fileURL = window.URL.createObjectURL(file);
            fontsURLList[file.name] = fileURL;
            console.log(fileURL);
            loadFont(fileURL);
            updateFontsList();
            updateScene();
        }
    });
    updateFontsList();
    initWebGL();
});

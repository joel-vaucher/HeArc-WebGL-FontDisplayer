/** @module LetterTriangularizer */
var LetterConstructor = (function() {
    var createLetter3D = function (letter, x, y, z, weight, fontSize, font, render) {
        letter = new Letter(letter, x, y, fontSize, font, render);

        var prelength = letter.vertices.length;
        var nbVertices = prelength / 3;
        for(let i = 0; i < prelength; i++){
            if(i % 3 == 2){
                letter.vertices[i] += z;
                letter.vertices.push(z + weight);
            } else {
                letter.vertices.push(letter.vertices[i]);
            }
        }

        prelength = letter.colors.length;
        for(let i = 0; i < prelength; i++){
            letter.colors.push(letter.colors[i])
        }

        prelength = letter.indices.length;
        for(let i = 0; i < prelength; i++){
            letter.indices.push(letter.indices[i] + nbVertices);
        }

        for(let i = 0; i + 1 < nbVertices; i++){
            if(letter.holes.indexOf(i+2) == -1){
                letter.indices.push(i);
                letter.indices.push(i + 1 + nbVertices);
                letter.indices.push(i + nbVertices);
                letter.indices.push(i);
                letter.indices.push(i + 1 + nbVertices);
                letter.indices.push(i + 1);
            }
        }


        letter.indices.push(nbVertices*2-1);
        letter.indices.push(nbVertices-1);
        letter.indices.push(nbVertices);
        letter.indices.push(nbVertices-1);
        letter.indices.push(0);
        letter.indices.push(nbVertices);

        return letter;
    }
    var createLetter2D = function (letter, x, y, z, fontSize, font, render) {
        letter = new Letter(letter, x, y, fontSize, font, render);

        var prelength = letter.vertices.length;
        for(let i = 0; i < prelength; i++){
            if(i % 3 == 2){
                letter.vertices[i] += z;
            }
        }

        return letter;
    }
    return {
        createLetter3D: createLetter3D,
        createLetter2D: createLetter2D
    };
})();

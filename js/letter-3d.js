/**
 * Class representing a 2D WebGL
 */
class Letter3D {
    /**
     * @param {String} letter - Letter that must be drawn.
     * @param {Number} x - Letter's horizontal position.
     * @param {Number} y - Letter's vertical position.
     * @param {Number} fontSize - Letter's font size.
     * @param {Font} font - Letter's font used to draw.
     */
    constructor(letter, x, y, z, weight, fontSize, font, render) {
        this.letter = new Letter(letter, x, y, fontSize, font, render);
        this.x = x;
        this.y = y;
        this.z = z;
        this.weight = weight;
        this.xMax = -10000; //this.xMax = Number.MIN_VALUE; doesn't work here
        this.init();
    }
    /**
     * Initialises letter's vertices, indices for WebGl and connect them
     * to buffers.
     * Colors are computed randomly to allow user to see the triangles composing
     * the letter.
     */
    init() {
        this.xMax = this.letter.xMax

        var prelength = this.letter.vertices.length;
        var nbVertices = prelength / 3;
        for(let i = 0; i < prelength; i++){
            if(i % 3 == 2){
                this.letter.vertices[i] += this.z;
                this.letter.vertices.push(this.z + this.weight);
            } else {
                this.letter.vertices.push(this.letter.vertices[i]);
            }
        }

        prelength = this.letter.colors.length;
        for(let i = 0; i < prelength; i++){
            this.letter.colors.push(this.letter.colors[i])
        }

        prelength = this.letter.indices.length;
        for(let i = 0; i < prelength; i++){
            this.letter.indices.push(this.letter.indices[i] + nbVertices);
        }

        for(let i = 0; i + 1 < nbVertices; i++){
            this.letter.indices.push(i);
            this.letter.indices.push(i + 1 + nbVertices);
            this.letter.indices.push(i + nbVertices);
            this.letter.indices.push(i);
            this.letter.indices.push(i + 1 + nbVertices);
            this.letter.indices.push(i + 1);
        }




    }
    /**
     * Draws the letter using WebGL's context.
     */
    draw(mvMatrix) {
        this.letter.draw(mvMatrix);
	}
}

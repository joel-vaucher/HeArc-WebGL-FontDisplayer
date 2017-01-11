/**
 * Class representing a 2D WebGL
 */
class Letter {
    /**
     * @param {String} letter - Letter that must be drawn.
     * @param {Number} x - Letter's horizontal position.
     * @param {Number} y - Letter's vertical position.
     * @param {Number} fontSize - Letter's font size.
     * @param {Font} font - Letter's font used to draw.
     */
    constructor(letter, x, y, fontSize, font, render) {
        this.letter = letter;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.font = font;
        this.render = render;
        this.shapes = [];
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
        var array_vertices = LetterTriangularizer.createVertices(this.letter, this.x, this.y, this.fontSize ,this.font);
        // We try to find the maximum x to dertermine where to write the first letter
        for (let i = 0; i < array_vertices.length; i += 3) {
            for (let j = 0; j < array_vertices[i].length; j += 3) {
                if (array_vertices[i][j] > this.xMax) {
                    this.xMax = array_vertices[i][j];
                }
            }
        }

        for (let i = 0; i < array_vertices.length; i += 1) {
            this.shapes.push(new Shape(array_vertices[i], this.render));
        }
    }
    /**
     * Draws the letter using WebGL's context.
     */
    draw() {
        for(let i = 0; i < this.shapes.length; i += 1){
            this.shapes[i].draw();
        }
	}
}

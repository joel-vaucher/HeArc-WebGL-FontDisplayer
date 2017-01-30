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
        this.vertices = [];
        this.holes = [];
        this.indices = [];
        this.colors = [];
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.colorBuffer = null;
        this.mvMatrix = mat4.create();
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

        for(let i = 0; i < this.shapes.length; i += 1){
            this.vertices = this.vertices.concat(this.shapes[i].vertices);
            this.holes.push(this.vertices.length/3);
        }
        this.holes.pop();

        this.indices = earcut(this.vertices, this.holes, 3);

        var colorFunction = Math.random;
        if (this.render) {
            colorFunction = () => { return 0.0; }
        }

        for (let i = 0; i < this.vertices.length; i++) {
            this.colors.push(colorFunction());
            this.colors.push(colorFunction());
            this.colors.push(colorFunction());
            this.colors.push(1.0);
        }
    }
    /**
     * Draws the letter using WebGL's context.
     */
    draw(mvMatrix) {

        this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
        this.indexBuffer = getIndexBufferWithIndices(this.indices);
        this.colorBuffer = getVertexBufferWithVertices(this.colors);

        //Sends the mvMatrix to the shader
        glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
        //Links and sends the vertexBuffer to the shader, defining the format to send it as
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
        //Links and sends the colorBuffer to the shader, defining the format to send it as
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
        //Links the indexBuffer with the shader
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        //Renders the object as triangles
        glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT,0);

	}
}

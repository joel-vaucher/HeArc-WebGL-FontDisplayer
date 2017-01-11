/**
 * Class representing a 2D WebGL
 */
class Shape {
    /**
     *
     */
    constructor(vertices, render) {
        this.render = render
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.colorBuffer = null;
        this.indices = [];
        this.vertices = vertices;
        this.colors = [];
        this.mvMatrix = mat4.create();
        this.init();
    }
    /**
     * Initialises letter's vertices, indices for WebGl and connect them
     * to buffers.
     * Colors are computed randomly to allow user to see the triangles composing
     * the letter.
     */
    init() {

        this.indices = LetterTriangularizer.createIndicesFromPoints(this.vertices);
        this.colors = [];

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

        this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
        this.indexBuffer = getIndexBufferWithIndices(this.indices);
        this.colorBuffer = getVertexBufferWithVertices(this.colors);
    }
    /**
     * Draws the letter using WebGL's context.
     */
    draw() {
        //Sends the mvMatrix to the shader
        glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.mvMatrix);
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

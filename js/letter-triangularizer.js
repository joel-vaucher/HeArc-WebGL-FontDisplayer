/** @module LetterTriangularizer */
var LetterTriangularizer = (function() {
    /**
     * Crée une liste de points à partir d'une lettre et d'un font.
     * @param  {String} letter  - Lettre  dont on veut récupérer le nuage de points.
     * @param  {font} x  - Position horizontale de la lettre.
     * @param  {font} y  - Position verticale de la lettre.
     * @param  {font} fontSize  - Taille de la lettre en pixels.
     * @param  {font} font  - Font décodé par opentype utilisé pour la lettre.
     * @return {Array}
     */
    var createVertices = function (letter, x, y, fontSize, font) {
        return this.createVerticesFromPath(font.getPath(letter, x, y, fontSize));
    }
    /**
     * Crée un liste de points à partir d'un path.
     * @param  {path} path - Chemin contenant l'ensemble de commandes à exécuter pour dessiner la lettre dans le canevas.
     * @return {Array}
     */
    var createVerticesFromPath = function (path) {
        var vertices = [];
        var step = 0;
        var accuracy = 10;
        path.commands.forEach(function (command){
            //ajoute les extrémités d'une ligne d'une ligne
            if(command.type == 'L' || command.type == 'M') {
                vertices.push(command.x);
                vertices.push(-command.y);
                vertices.push(0);
            //ajoute accuracy+1 points répartit le long d'une courbe de bézier
            }
            else if (command.type == 'C') {
                step = 1/accuracy;
                for(let t = step; t < 1; t += step){
                    //OPTIMISATION NECESSAIRE
                    //formule de bézier
                    px = (1-t)*(1-t)*(1-t)*lastcommand.x + 3*(1-t)*(1-t)*t*command.x1 + 3*(1-t)*t*t*command.x2 + t*t*t * command.x;
                    py = (1-t)*(1-t)*(1-t)*lastcommand.y + 3*(1-t)*(1-t)*t*command.y1 + 3*(1-t)*t*t*command.y2 + t*t*t * command.y;
                    vertices.push(px);
                    vertices.push(-py);
                    vertices.push(0);
                }
                vertices.push(command.x);
                vertices.push(-command.y);
                vertices.push(0);
                //ajoute accuracy+1 point répartit le long d'une courbe de bézier
            }
            else if(command.type == 'Q'){
                step = 1/accuracy;
                for(let t = step; t < 1; t += step){
                    //OPTIMISATION NECESSAIRE
                    //formule de bézier
                    px = (1-t)*(1-t)*lastcommand.x + 2*(1-t)*t*command.x1 + t*t * command.x;
                    py = (1-t)*(1-t)*lastcommand.y + 2*(1-t)*t*command.y1 + t*t * command.y;
                    vertices.push(px);
                    vertices.push(-py);
                    vertices.push(0);
                }
                vertices.push(command.x);
                vertices.push(-command.y);
                vertices.push(0);
                //ajout le point d'origine pour fermer la forme
                //Optimisation ?
            }
            else if(command.type == 'Z'){
                vertices.push(vertices[0]);
                vertices.push(vertices[1]);
                vertices.push(0);
            }
            lastcommand = command;
        });

        return vertices;
    }
    /**
     * Retourne la liste des indexes pour dessiner les triangles à partir des points du path.
     * @param  {Array} vertices  - Contient la liste des points composant la lettre.
     * @return {Array}
     */
    var createIndicesFromPoints = function(vertices) {
        return earcut(vertices, null, 3);
    }
    return {
        createVertices: createVertices,
        createVerticesFromPath: createVerticesFromPath,
        createIndicesFromPoints, createIndicesFromPoints
    };
})();

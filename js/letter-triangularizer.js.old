/** @module LetterTriangularizer */
var LetterTriangularizer = (function() {
    /**
     * Crée une liste de points à partir d'une lettre et d'un font.
     * @param  {String} letter  - Lettre  dont on veut récupérer le nuage de points.
     * @param  {font} font  - Font décodé par opentype utilisé pour la lettre.
     * @return {Array}
     */
    var createPoints = function (letter, font) {
        return this.createPointsFromPath(font.getPath(letter, 0, 150, 72));
    }
    /**
     * Crée un liste de points à partir d'un path.
     * @param  {path} path - Chemin contenant l'ensemble de commandes à exécuter pour dessiner la lettre dans le canevas.
     * @return {Array}
     */
    var createPointsFromPath = function (path) {
        var points = [];
        var accuracy = 10;
        var step;
        //permet de connaitre de le point d'origine dans la création des courbes de bézier
        var lastcommand = {x: 0, y:0};

        path.commands.forEach(function (command){
            //ajoute les extrémités d'une ligne d'une ligne
            if(command.type == 'L' || command.type == 'M') {
                points.push(command.x);
                points.push(command.y);
            //ajoute accuracy+1 points répartit le long d'une courbe de bézier
            }
            else if (command.type == 'C') {
                step = 1/accuracy;
                for(t = step; t < 1; t += step){
                    //OPTIMISATION NECESSAIRE
                    //formule de bézier
                    px = (1-t)*(1-t)*(1-t)*lastcommand.x + 3*(1-t)*(1-t)*t*command.x1 + 3*(1-t)*t*t*command.x2 + t*t*t * command.x;
                    py = (1-t)*(1-t)*(1-t)*lastcommand.y + 3*(1-t)*(1-t)*t*command.y1 + 3*(1-t)*t*t*command.y2 + t*t*t * command.y;
                    points.push(px);
                    points.push(py);
                }
                points.push(command.x);
                points.push(command.y);
            //ajoute accuracy+1 point répartit le long d'une courbe de bézier
            }
            else if(command.type == 'Q'){
                step = 1/accuracy;
                for(t = step; t < 1; t += step){
                    //OPTIMISATION NECESSAIRE
                    //formule de bézier
                    px = (1-t)*(1-t)*lastcommand.x + 2*(1-t)*t*command.x1 + t*t * command.x;
                    py = (1-t)*(1-t)*lastcommand.y + 2*(1-t)*t*command.y1 + t*t * command.y;
                    points.push(px);
                    points.push(py);
                }
                points.push(command.x);
                points.push(command.y);
            //ajout le point d'origine pour fermer la forme
            //Optimisation ?
            }
            else if(command.type == 'Z'){
                points.push(points[0]);
                points.push(points[1]);
            }
            lastcommand = command;
        });
        // Pour une meilleure visualisation, on multiplie les coordonnées
        for(i = 0; i < points.length; i++){
            points[i] *= 4;
        }
        return points;
    }
    /**
     * Retourne la liste des indexes pour dessiner les triangles à partir des points du path.
     * @param  {Array} points  - Contient la liste des points composant la lettre.
     * @return {Array}
     */
    var createTrianglesFromPoints = function(points) {
        return earcut(points);
    }
    return {
        createPoints: createPoints,
        createPointsFromPath: createPointsFromPath,
        createTrianglesFromPoints, createTrianglesFromPoints
    };
})();

/** VERSION NIPPONE: TESTS D'IMPLEMENTATION D'IMAGES 
¤ Comment "calculer" la cible ?
    = Utilisation d'un dictionnaire
    = Découpage en syllabes
    = Utilisation algorithme pour que nombre syllabes = longueur*largeur
    = ???
************************************************************************/

/* Déclencheurs */
$(document).ready(function(){
    creationTableDeJeu();
    ecouteurCasesCliquees();
    choisirCible();

    $("#Cible").text(nbCible);

    affectationImages();

})

/* Définition des constantes */
var nbMin=1, nbCible=0; 
var donnees=Array(); // Contient des zéros pour chaque case cachée, utile pour altérer les données.


/* Gestion de la difficulté */
var nbCasesLargeur=3,
    nbCasesLongueur=9,
    nbMinCasesCliquables=2,
    nbMaxCasesCliquables=5,
    nbMax=2;

/* Initialisation du tableau de jeu */
var creationTableDeJeu = function(){
    var main=document.getElementsByTagName("main")[0];
    var tbl=document.createElement("table");

    donnees=_.times(nbCasesLargeur*nbCasesLongueur, _.random.bind(_, nbMin, nbMax)); 
    // ^ Tirage aléatoire avec remise de largeur*longueur nombres compris entre nbMin et nbMax.

    var idCase=0;
    for(var i=0;i<nbCasesLargeur;i++){
        var tr=document.createElement("tr");
        for(var j=0;j<nbCasesLongueur;j++){
            var td=document.createElement("td");
            td.setAttribute("id",idCase);
            td.appendChild(document.createTextNode(donnees[idCase]));
            tr.appendChild(td);
            idCase++;
            }
        tbl.appendChild(tr);
    }
    main.appendChild(tbl);
}

/* Choix du nombre cible */
var choisirCible = function(){
    if(_.compact(donnees).length<nbMaxCasesCliquables && _.compact(donnees).length != 0){ nbMaxCasesCliquables=_.compact(donnees).length; }
// ^ Le nombre maximal de cases cliquables est égal au nombre de cases restantes, si celui-ci est inférieur à la constante.
    var nbValeursPiochees=_.random(nbMinCasesCliquables,nbMaxCasesCliquables);
// ^ Le nombre de nombres(=cases) à piocher, utilisé par la suite

    var tblValeursChoisies = Array();
    tblValeursChoisies = _.sample(_.compact(donnees),nbValeursPiochees);

    nbCible=_.reduce(tblValeursChoisies, function(memo, num){ return memo + num; }, 0);
// ^ Somme à atteindre (nbCible) comme simple addition du contenu de tblValeursChoisies.

    console.log("Somme à atteindre : "+nbCible);
}

/* Gestion des cases cliquées */
var ecouteurCasesCliquees = function(){
    var total=0, valeurCaseCliquee=0;

    $("main").on("click","td",function(e){

        if($(this).attr("class")!="caseCachee"){
            $(this).toggleClass("caseCliquee"); // Ici pour le score (futur)
            $("td .caseCliquee").toggleClass("caseCliquee")
            e.preventDefault();
            valeurCaseCliquee = parseInt($(this).text());
            ($(this).attr("class").indexOf("caseCliquee")>=0) ? total=total+valeurCaseCliquee : total=total-valeurCaseCliquee;
            console.log(total);
        }

    if(total==nbCible){ //!\ FIN DE ROUND. À extraire ?
        altererDonnees();
        nbCible=0; // À mettre dans Creation de la cible
        choisirCible();
        total=0; // Réinitialisation
        $("#Cible").text(nbCible); 

        if (_.compact(donnees).length<2) {victoire()}; // Condition de victoire. 
        }
    })
}

/* Alteration de la liste 'donnees' */
var altererDonnees = function(){
// Debug    console.log("avant : "+donnees);

    $(".caseCliquee").each(function(){
        var indice=parseInt($(this).attr("id"));
        donnees[indice]=0;
        $(this).removeAttr("class");
        $(this).toggleClass("caseCachee");
        //$(this).removeClass("caseCliquee");
        $(this).text(' ');        
    })
// Debug    console.log("après : "+donnees);

// Debug    console.log("enfin : "+_.compact(donnees));
}

/* Implémentation des Images */
var affectationImages = function(){
    $("main").find('td').each (function() {
    switch($(this).text()){
        case '1':
            $(this).toggleClass("ma");
            break;
        case '2':
            $(this).toggleClass("chi");
            break;
        default:
            break;
    }

});      
}

/* Fonction de victoire */
var victoire = function(){
    alert("win");
}

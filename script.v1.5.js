/* Palette */
var palette=Array();
palette=["#0FADD4", "#F1EB52", "#90C13E", "#FBC319", "#CF65A2", "#80C8CF", "#FBC319","#BAD432", "#F07FA2"];
paletteSelection=["#EEE", "#EEE", "#EEE", "#EEE", "#EEE", "#EEE", "#EEE", "#EEE", "#EEE"];
//paletteSelection=["#2CC2E0", "#FCF05F", "#A7CF4A", "#FDBD1E", "#DC74AE", "#95D6DD", "#FDBD1E","#CEDD40", "#F287B1"];
// ^ palette éclaircie abandonnée pour l'instant, #EEE étant beaucoup plus lisible, en attendant de plus amples travaux.

/* Déclencheurs */
$(document).ready(function(){
    creationTableDeJeu();
    ecouteurCasesCliquees();
    choisirCible();

    $("#Cible").text(nbCible);
    $("#Score").text(nbScore);

})

/* Définition des constantes */
var nbMin=1, nbCible=0, nbScore=0, nbCasesCachees=0;
var donnees=Array(); // Contient des zéros pour chaque case cachée, utile pour altérer les données.


/* Gestion de la difficulté */
var nbCasesLargeur=6,
    nbCasesLongueur=6,
    nbMinCasesCliquables=2,
    nbMaxCasesCliquables=5,
    nbMax=15;

/* Initialisation du tableau de jeu */
var creationTableDeJeu = function(){
    var content=document.getElementsByTagName("content")[0];
    var tbl=document.createElement("table");

    donnees=_.times(nbCasesLargeur*nbCasesLongueur, _.random.bind(_, nbMin, nbMax)); 
    // ^ Tirage aléatoire avec remise de largeur*longueur nombres compris entre nbMin et nbMax.

    var idCase=0;
    for(var i=0;i<nbCasesLargeur;i++){
        var tr=document.createElement("tr");
        for(var j=0;j<nbCasesLongueur;j++){
            var td=document.createElement("td");
            td.setAttribute("id",idCase);
            td.style.background = palette[donnees[idCase]%palette.length];
            td.appendChild(document.createTextNode(donnees[idCase]));
            tr.appendChild(td);
            idCase++;
            }
        tbl.appendChild(tr);
    }
    content.appendChild(tbl);
}

/* Choix du nombre cible */
var choisirCible = function(){
    nbCible=0;

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

    $("content").on("click","td",function(e){
        if($(this).attr("class")!="caseCachee"){
            e.preventDefault();
            $(this).toggleClass("caseCliquee"); // Ici pour le score (futur)
            $("td .caseCliquee").toggleClass("caseCliquee");
            valeurCaseCliquee = parseInt($(this).text());
            $(this).css("background",paletteSelection[parseInt($(this).text())%paletteSelection.length]);
            if($(this).attr("class").indexOf("caseCliquee")>=0){
                total=total+valeurCaseCliquee;
            }
            else{
                total=total-valeurCaseCliquee;
                $(this).css("background",palette[parseInt($(this).text())%palette.length]);
            }
// Debug            console.log(total);
        }

    if(total==nbCible){ //!\ FIN DE ROUND. À extraire ?
      

        altererDonnees();
        
        $("#Score").text(nbScore); //!\ DISCUTABLE
        var bonus=document.createElement("span");
        document.getElementById("score-div").appendChild(bonus);
        bonus.setAttribute("id", "bonus-fade");
        bonus.innerHTML = " +"+5*nbCasesCachees+" !";
        
        $("#Score").fadeTo(125, 0, function () {
            $("#bonus-fade").fadeOut(1000,0);
            $(this).text(nbScore);
            $(this).fadeTo(125, 1);
            setTimeout(function() { $('#bonus-fade').remove(); }, 1000);
        });

        nbScore+=(5*nbCasesCachees);
        console.log("GAIN DE : " + 5*nbCasesCachees + " POINTS.");  

        nbCasesCachees=0;
                                // ^ DISCUTABLE /!\\

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

        nbCasesCachees++; //!\ DISCUTABLE.
        $(this).removeAttr("class");
        $(this).css("background","");
        $(this).toggleClass("caseCachee");
        $(this).text(' ');        
    })
// Debug    console.log("après : "+donnees);

// Debug    console.log("enfin : "+_.compact(donnees));
}

/* Fonction de victoire */
var victoire = function(){
    if(!alert('You won!')){window.location.reload();}
}

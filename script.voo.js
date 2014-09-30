function Partie(){
	this.theme = "classique";	// VpD.
	this.typedejeu = "simple";	// VdP. Modes : simple, chronométré, multi-j. coop. ou multi-j. compét.
	this.joueur = "Anonyme";	// VpD.
	this.difficultee = 1;		// VpD. Voir la méthode calculerDifficultee Penser aux "boss"es.
	this.score = 0;				// Init.

	this.chargerLeTheme = function(){}
	this.calculerDifficultee = function(){}
	this.initialiseLePlateau = function(){}
}

function Case(){
	this.id = -1 ;			// VpD.
	this.valeur = -1 ;		// VpD.
	this.estCochee = -1;	// VpD.
	this.estCachee = -1;	// VpD.
	this.couleur = "#0FADD4";		// VpD.
	this.estSpeciale = -1;	// VpD.
	//this. = -1;	// VpD.
}
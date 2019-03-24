export class ProblematiqueItemService {

    problematiques: any;
    problematiquescat: any;
    Id: any;
    Libelle: any;
    testprobcomponent: any;
    afficher_spinner = false;
    afficher_spinner_probgen = false;

    switchOnOne(i: number, Idprob: number, libelle: any) {
        this.Id = Idprob;
        this.Libelle = libelle;
    }



}
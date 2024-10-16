export class AdemeApiResult {
  id?: string;
  type?: string;
  numero?: string;
  adresse?: string;
  codePostal?: string;
  commune?: string;
  region?: string;
  departement?: string;
  typeBatiment?: string;
  anneeConstruction?: number;
  periodeConstruction?: string;
  surfaceHabitable?: number;
  dateRealisation?: string;
  dateFinValidite?: string;
  consommation?: number;
  consommationEnergieFinale?: number;
  emission?: number;
  etiquetteEnergie?: string;
  etiquetteEmission?: string;
  etiquetteEmissionPetiteSurface?: string;
  etiquetteEnergiePetiteSurface?: string;
  etiquetteBilan?: string;
  etiquetteBilanPetiteSurface?: string;
  ancienneEtiquetteEnergie?: string;
  ancienneEtiquetteBilan?: string;
  typeGenerateurEcs?: string[];
  typeEnergieEcs?: string[];
  typeGenerateurCh?: string[];
  typeEnergieCh?: string[];
  numeroDPERemplace?: string;
  motifRemplacement?: string;
  statut?: string;
  numeroDPERemplacant?: string;

}

import type { Meta, StoryObj } from '@storybook/vue3';
import DiagnosticResult from '../../../owner/src/components/property/PropertyDiagnosticResult.vue';

const meta = {
  title: 'DossierFacile/DiagnosticResult',
  component: DiagnosticResult,
  tags: ['autodocs'],
} satisfies Meta<typeof DiagnosticResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sample: Story = {
  args: {
    dpe:
      { "id": null, "type": "DPE 3CL 2021 méthode logement", "numero": "2237E1085381X", "adresse": "164 Rue Giraudeau", "codePostal": "37000", "commune": "Tours", "region": null, "departement": null, "epci": null, "typeBatiment": "maison", "anneeConstruction": "avant 1948", "surfaceHabitable": 96.0, "diagnostiqueurNom": null, "diagnostiqueurPrenom": null, "diagnostiqueurFullName": null, "diagnostiqueurCertificat": null, "dateRealisation": "2022-05-17T22:00:00Z", "dateFinValidite": "2032-05-16T22:00:00Z", "consommation": 226.0, "consommationEnergieFinale": 220.0, "emission": 49.0, "etiquetteEmission": "D", "etiquetteEmissionPetiteSurface": null, "etiquetteEnergiePetiteSurface": null, "etiquetteBilan": "D", "etiquetteBilanPetiteSurface": null, "typeGenerateurEcs": ["Chaudière gaz à condensation 2001-2015"], "typeEnergieEcs": ["Gaz naturel"], "typeGenerateurCh": ["Chaudière gaz à condensation 2001-2015"], "typeEnergieCh": ["Gaz naturel"], "numeroDPERemplace": null, "motifRemplacement": "", "statut": "ACTIF", "masquerDiag": true, "numeroDPERemplacant": null, "anonymise": false, "suppressionEnCours": false, "dpe2012": false }
    ,
  },
};

export const Replaced: Story = {
  args: {
    dpe:
    {
      "id": null,
      "type": "DPE 3CL 2021 méthode logement",
      "numero": "2237E1085381X",
      "adresse": "164 Rue Giraudeau", "codePostal": "37000",
      "commune": "Tours",
      "region": null,
      "departement": null,
      "epci": null,
      "typeBatiment": "maison",
      "anneeConstruction": "avant 1948",
      "surfaceHabitable": 96.0,
      "diagnostiqueurNom": null,
      "diagnostiqueurPrenom": null,
      "diagnostiqueurFullName": null,
      "diagnostiqueurCertificat": null,
      "dateRealisation": "2022-05-17T22:00:00Z",
      "dateFinValidite": "2032-05-16T22:00:00Z",
      "consommation": 226.0,
      "consommationEnergieFinale": 220.0,
      "emission": 49.0,
      "etiquetteEmission": "D",
      "etiquetteEmissionPetiteSurface": null,
      "etiquetteEnergiePetiteSurface": null,
      "etiquetteBilan": "D",
      "etiquetteBilanPetiteSurface": null,
      "typeGenerateurEcs": ["Chaudière gaz à condensation 2001-2015"],
      "typeEnergieEcs": ["Gaz naturel"],
      "typeGenerateurCh": ["Chaudière gaz à condensation 2001-2015"],
      "typeEnergieCh": ["Gaz naturel"],
      "numeroDPERemplace": "1117E1085381X",
      "motifRemplacement": "Test remplacement",
      "statut": "ACTIF",
      "masquerDiag": true,
      "numeroDPERemplacant": null,
      "anonymise": false,
      "suppressionEnCours": false,
      "dpe2012": false
    }
    ,
  },
};
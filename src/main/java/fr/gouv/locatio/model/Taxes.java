package fr.gouv.locatio.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties(ignoreUnknown = true)
public class Taxes {
    private Declarant declarant1;
    private Declarant declarant2;
    private FoyerFiscal foyerFiscal;
    private String dateRecouvrement;
    private String dateEtablissement;
    private String nombreParts;
    private String situationFamille;
    private int nombrePersonnesCharge;
    private int revenuBrutGlobal;
    private int revenuImposable;
    private int impotRevenuNetAvantCorrections;
    private int montantImpot;
    private int revenuFiscalReference;
    private String anneeImpots;
    private String anneeRevenus;

    public Declarant getDeclarant1() {
        return declarant1;
    }

    public void setDeclarant1(Declarant declarant1) {
        this.declarant1 = declarant1;
    }

    public Declarant getDeclarant2() {
        return declarant2;
    }

    public void setDeclarant2(Declarant declarant2) {
        this.declarant2 = declarant2;
    }

    public FoyerFiscal getFoyerFiscal() {
        return foyerFiscal;
    }

    public void setFoyerFiscal(FoyerFiscal foyerFiscal) {
        this.foyerFiscal = foyerFiscal;
    }

    public String getDateRecouvrement() {
        return dateRecouvrement;
    }

    public void setDateRecouvrement(String dateRecouvrement) {
        this.dateRecouvrement = dateRecouvrement;
    }

    public String getDateEtablissement() {
        return dateEtablissement;
    }

    public void setDateEtablissement(String dateEtablissement) {
        this.dateEtablissement = dateEtablissement;
    }

    public String getNombreParts() {
        return nombreParts;
    }

    public void setNombreParts(String nombreParts) {
        this.nombreParts = nombreParts;
    }

    public String getSituationFamille() {
        return situationFamille;
    }

    public void setSituationFamille(String situationFamille) {
        this.situationFamille = situationFamille;
    }

    public int getNombrePersonnesCharge() {
        return nombrePersonnesCharge;
    }

    public void setNombrePersonnesCharge(int nombrePersonnesCharge) {
        this.nombrePersonnesCharge = nombrePersonnesCharge;
    }

    public int getRevenuBrutGlobal() {
        return revenuBrutGlobal;
    }

    public void setRevenuBrutGlobal(int revenuBrutGlobal) {
        this.revenuBrutGlobal = revenuBrutGlobal;
    }

    public int getRevenuImposable() {
        return revenuImposable;
    }

    public void setRevenuImposable(int revenuImposable) {
        this.revenuImposable = revenuImposable;
    }

    public int getImpotRevenuNetAvantCorrections() {
        return impotRevenuNetAvantCorrections;
    }

    public void setImpotRevenuNetAvantCorrections(int impotRevenuNetAvantCorrections) {
        this.impotRevenuNetAvantCorrections = impotRevenuNetAvantCorrections;
    }

    public int getMontantImpot() {
        return montantImpot;
    }

    public void setMontantImpot(int montantImpot) {
        this.montantImpot = montantImpot;
    }

    public int getRevenuFiscalReference() {
        return revenuFiscalReference;
    }

    public void setRevenuFiscalReference(int revenuFiscalReference) {
        this.revenuFiscalReference = revenuFiscalReference;
    }

    public String getAnneeImpots() {
        return anneeImpots;
    }

    public void setAnneeImpots(String anneeImpots) {
        this.anneeImpots = anneeImpots;
    }

    public String getAnneeRevenus() {
        return anneeRevenus;
    }

    public void setAnneeRevenus(String anneeRevenus) {
        this.anneeRevenus = anneeRevenus;
    }
}

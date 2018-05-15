package fr.gouv.locatio.model;

public class InfoFourFile {
    private String fiscalNumber;
    private String referenceNumber;
    private String name;
    private String referenceTax;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getReferenceTax() {
        return referenceTax;
    }

    public void setReferenceTax(String referenceTax) {
        this.referenceTax = referenceTax;
    }

    public String getFiscalNumber() {
        return fiscalNumber;
    }

    public void setFiscalNumber(String fiscalNumber) {
        this.fiscalNumber = fiscalNumber;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
}

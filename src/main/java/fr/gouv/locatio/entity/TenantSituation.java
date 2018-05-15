package fr.gouv.locatio.entity;

public enum TenantSituation {
    CDI("CDI"),
    CDI_TRIAL("CDI (période d'essai)"),
    CDD("CDD"),
    INTERNSHIP("Stage"),
    STUDENT("Études"),
    PUBLIC("Fonction publique");

    String label;
    TenantSituation(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

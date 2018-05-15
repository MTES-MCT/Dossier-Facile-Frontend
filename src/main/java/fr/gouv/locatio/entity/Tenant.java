package fr.gouv.locatio.entity;


import fr.gouv.locatio.dto.TenantDTO;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tenant")
public class Tenant extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @OneToMany(mappedBy = "tenantApartmentSharing", cascade = CascadeType.ALL)
    private List<ApartmentSharing> apartmentSharings = new ArrayList<>();

    @OneToOne(mappedBy = "tenant", cascade = CascadeType.ALL,
            fetch = FetchType.LAZY, optional = false)
    private Guarantor guarantor;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "tenant_apartment_sharing",
            joinColumns = @JoinColumn(name = "Tenant_ID", referencedColumnName = "ID"),
            inverseJoinColumns = @JoinColumn(name = "Apartment_Sharing_ID", referencedColumnName = "ID"))
    private List<ApartmentSharing> joinedApartmentSharings = new ArrayList<>();


    @Column(nullable = false)
    private String upload1;

    @Column(nullable = false)
    private String upload2;

    @Column(nullable = false)
    private String upload3;

    @Column(nullable = false)
    private String upload4;

    @Column(nullable = false)
    private String upload5;

    @Column(nullable = false)
    private TenantFileStatus tenantFileStatus;

    @Column(nullable = false)
    private TenantSituation tenantSituation;

    @Column(nullable = false)
    private Integer salary;


    public Tenant() {
    }

    public Tenant(TenantDTO tenantDTO) {
       super.setEmail(tenantDTO.getEmail());
       super.setFirstName(tenantDTO.getFirstName().trim().replaceAll("\\s+", " "));
       super.setLastName(tenantDTO.getLastName().trim().replaceAll("\\s+", " "));
       this.tenantFileStatus = TenantFileStatus.TO_PROCESS;
       this.salary = tenantDTO.getSalary();
       this.setTenantSituation(TenantSituation.values()[tenantDTO.getSituation()]);

    }

    public List<ApartmentSharing> getApartmentSharings() {
        return apartmentSharings;
    }

    public void setApartmentSharings(List<ApartmentSharing> apartmentSharings) {
        this.apartmentSharings = apartmentSharings;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUpload1() {
        return upload1;
    }

    public void setUpload1(String upload1) {
        this.upload1 = upload1;
    }

    public String getUpload2() {
        return upload2;
    }

    public void setUpload2(String upload2) {
        this.upload2 = upload2;
    }

    public String getUpload3() {
        return upload3;
    }

    public void setUpload3(String upload3) {
        this.upload3 = upload3;
    }

    public String getUpload4() {
        return upload4;
    }

    public void setUpload4(String upload4) {
        this.upload4 = upload4;
    }

    public String getUpload5() {
        return upload5;
    }

    public void setUpload5(String upload5) {
        this.upload5 = upload5;
    }

    public TenantFileStatus getTenantFileStatus() {
        return tenantFileStatus;
    }

    public void setTenantFileStatus(TenantFileStatus tenantFileStatus) {
        this.tenantFileStatus = tenantFileStatus;
    }

    public TenantSituation getTenantSituation() {
        return tenantSituation;
    }

    public void setTenantSituation(TenantSituation tenantSituation) {
        this.tenantSituation = tenantSituation;
    }

    public Integer getSalary() {
        return salary;
    }

    public void setSalary(Integer salary) {
        this.salary = salary;
    }

    public String getSituationText() {
        return TenantSituation.values()[this.getTenantSituation().ordinal()].getLabel();
    }

    public boolean isValidated() {
        return tenantFileStatus == TenantFileStatus.VALIDATED;
    }


    public List<ApartmentSharing> getJoinedApartmentSharings() {
        return joinedApartmentSharings;
    }

    public void setJoinedApartmentSharings(List<ApartmentSharing> joinedApartmentSharings) {
        this.joinedApartmentSharings = joinedApartmentSharings;
    }

    public void addJoinedApartmentSharings(ApartmentSharing apartmentSharing) {
        this.joinedApartmentSharings.add(apartmentSharing);
    }


    public Guarantor getGuarantor() {
        return guarantor;
    }

    public void setGuarantor(Guarantor guarantor) {
        this.guarantor = guarantor;
    }

    @Override
    public String toString() {
        return super.getFirstName() + " " + super.getLastName();
    }
}

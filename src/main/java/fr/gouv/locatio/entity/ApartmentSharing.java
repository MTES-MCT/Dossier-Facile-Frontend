package fr.gouv.locatio.entity;


import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "apartment_sharing")
public class ApartmentSharing {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "tenant_apartment_sharing_id")
    private Tenant tenantApartmentSharing;


    @ManyToMany(mappedBy = "joinedApartmentSharings", cascade = CascadeType.ALL)
    private List<Tenant> tenants = new ArrayList<>();

    @OneToMany(mappedBy = "apartmentSharing", cascade = CascadeType.ALL)
    private Set<OwnerApartmentSharing> ownerApartmentSharing = new HashSet<>();

    @Column
    private String token;

    @Column(nullable = false)
    private TenantFileStatus tenantFileStatus;

    @Column
    private String tokenPublic;

    @Column
    private Integer numberOfTenants;

    @Column(name = "creation_date")
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    private LocalDateTime creationDateTime = LocalDateTime.now();

    public List<Tenant> getTenants() {
        return tenants;
    }

    public void setTenants(List<Tenant> tenants) {
        this.tenants = tenants;
    }

    public void addTenant(Tenant tenant) {
        this.tenants.add(tenant);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(LocalDateTime creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public String getTokenPublic() {
        return tokenPublic;
    }

    public void setTokenPublic(String tokenPublic) {
        this.tokenPublic = tokenPublic;
    }


    public boolean isValidated() {
        return tenantFileStatus == TenantFileStatus.VALIDATED;
    }

    public Set<OwnerApartmentSharing> getOwnerApartmentSharing() {
        return ownerApartmentSharing;
    }

    public void setOwnerApartmentSharing(Set<OwnerApartmentSharing> ownerApartmentSharing) {
        this.ownerApartmentSharing = ownerApartmentSharing;
    }

    public Tenant getTenantApartmentSharing() {
        return tenantApartmentSharing;
    }

    public void setTenantApartmentSharing(Tenant tenantApartmentSharing) {
        this.tenantApartmentSharing = tenantApartmentSharing;
    }

    public TenantFileStatus getTenantFileStatus() {
        return tenantFileStatus;
    }

    public void setTenantFileStatus(TenantFileStatus tenantFileStatus) {
        this.tenantFileStatus = tenantFileStatus;
    }

    public Integer getNumberOfTenants() {
        return numberOfTenants;
    }

    public void setNumberOfTenants(Integer numberOfTenants) {
        this.numberOfTenants = numberOfTenants;
    }

    public boolean isForOneTenant() {
        return this.getNumberOfTenants() == 1;
    }

    public int totalSalary() {
        int suma = this.getTenantApartmentSharing().getSalary();
        List<Tenant> tenantList = this.getTenants();
        for (int i = 0; i < tenantList.size(); i++) {
            suma += tenantList.get(i).getSalary();
        }
        return suma;
    }
}

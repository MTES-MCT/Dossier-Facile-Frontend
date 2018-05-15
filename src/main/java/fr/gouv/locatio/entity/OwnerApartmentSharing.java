package fr.gouv.locatio.entity;


import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "owner_apartment_sharing")
public class OwnerApartmentSharing {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column()
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_sharing_id")
    private ApartmentSharing apartmentSharing;

    @Column(nullable = false)
    private Boolean accessFull;

    public OwnerApartmentSharing() {
    }

    public OwnerApartmentSharing(Owner owner, ApartmentSharing apartmentSharing) {
        this.owner = owner;
        this.apartmentSharing = apartmentSharing;
    }

    public OwnerApartmentSharing(Owner owner, ApartmentSharing apartmentSharing, Boolean access) {
        this.owner = owner;
        this.apartmentSharing = apartmentSharing;
        this.accessFull = access;
    }

    public OwnerApartmentSharing(Owner owner, ApartmentSharing apartmentSharing, String token) {
        this.owner = owner;
        this.apartmentSharing = apartmentSharing;
        if (apartmentSharing.getToken().equals(token)) {
            this.accessFull = true;
        } else {
            this.accessFull = false;
        }
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public ApartmentSharing getApartmentSharing() {
        return apartmentSharing;
    }

    public void setApartmentSharing(ApartmentSharing apartmentSharing) {
        this.apartmentSharing = apartmentSharing;
    }

    public Boolean getAccessFull() {
        return accessFull;
    }

    public void setAccessFull(Boolean accessFull) {
        this.accessFull = accessFull;
    }
}

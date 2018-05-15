package fr.gouv.locatio.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "owner")
public class Owner extends User {

    @Column
    private String token;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private Set<OwnerApartmentSharing> ownerApartmentSharings = new HashSet<>();

    public Set<OwnerApartmentSharing> getOwnerApartmentSharings() {
        return ownerApartmentSharings;
    }

    public void setOwnerApartmentSharings(Set<OwnerApartmentSharing> ownerApartmentSharings) {
        this.ownerApartmentSharings = ownerApartmentSharings;
    }

    public void addOwnerApartmentSharings(OwnerApartmentSharing ownerApartmentSharing) {
        this.ownerApartmentSharings.add(ownerApartmentSharing);
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}

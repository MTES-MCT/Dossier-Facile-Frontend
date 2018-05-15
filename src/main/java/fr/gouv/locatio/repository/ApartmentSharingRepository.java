package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.ApartmentSharing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ApartmentSharingRepository extends JpaRepository<ApartmentSharing, Integer> {

    public ApartmentSharing findByToken(String token);

    public ApartmentSharing findByTokenPublic(String tokenPublic);

    public ApartmentSharing findOneByToken(String token);

    public ApartmentSharing findOneByTokenPublic(String token);

    @Query("SELECT c FROM ApartmentSharing c where c.numberOfTenants>1")
    public List<ApartmentSharing> findAllMoreOne();
}

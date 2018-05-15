package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.ApartmentSharing;
import fr.gouv.locatio.entity.Owner;
import fr.gouv.locatio.entity.OwnerApartmentSharing;
import org.springframework.data.repository.CrudRepository;

public interface OwnerApartmentSharingRepository extends CrudRepository<OwnerApartmentSharing, Integer>{

    OwnerApartmentSharing findOneByOwnerAndApartmentSharing(Owner owner, ApartmentSharing apartmentSharing);
}

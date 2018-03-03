package fr.gouv.locatio.repositories;

import fr.gouv.locatio.entities.Subscription;
import org.springframework.data.repository.CrudRepository;

public interface OwnerRepository extends CrudRepository<Subscription,Integer>{
}

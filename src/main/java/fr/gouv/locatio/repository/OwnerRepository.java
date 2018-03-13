package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.Subscription;
import org.springframework.data.repository.CrudRepository;

public interface OwnerRepository extends CrudRepository<Subscription,Integer>{
}

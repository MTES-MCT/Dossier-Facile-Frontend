package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.Owner;
import org.springframework.data.repository.CrudRepository;

public interface OwnerRepository extends CrudRepository<Owner,Integer>{
    Owner findOneByEmail(String email);
    Owner findOneByToken(String email);
}

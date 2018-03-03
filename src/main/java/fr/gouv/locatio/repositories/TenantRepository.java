package fr.gouv.locatio.repositories;

import fr.gouv.locatio.entities.Tenant;
import org.springframework.data.repository.CrudRepository;

public interface TenantRepository extends CrudRepository<Tenant,Integer>{
}

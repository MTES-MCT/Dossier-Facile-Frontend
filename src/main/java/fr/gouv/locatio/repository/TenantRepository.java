package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface TenantRepository extends CrudRepository<Tenant, Integer> {

    Tenant findByUser(User user);

    Tenant findByToken(String token);
}

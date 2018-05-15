package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface TenantRepository extends JpaRepository<Tenant, Integer> {

    Tenant findOneByEmail(String email);

}

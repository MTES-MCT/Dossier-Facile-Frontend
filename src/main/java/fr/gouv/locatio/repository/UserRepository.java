package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.User;
import org.springframework.data.repository.CrudRepository;


public interface UserRepository extends CrudRepository<User, Integer> {
    User findOneByEmail(String email);
}

package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.PasswordRecoveryToken;
import org.springframework.data.repository.CrudRepository;


public interface PasswordRecoveryTokenRepository extends CrudRepository<PasswordRecoveryToken, Integer> {

    PasswordRecoveryToken findByToken(String token);

}

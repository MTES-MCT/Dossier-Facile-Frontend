package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.Owner;
import fr.gouv.locatio.entity.PasswordRecoveryToken;
import fr.gouv.locatio.entity.User;
import org.springframework.data.repository.CrudRepository;


public interface PasswordRecoveryTokenRepository extends CrudRepository<PasswordRecoveryToken, Integer> {

    PasswordRecoveryToken findByToken(String token);

    PasswordRecoveryToken findOneByUser(User user);
}

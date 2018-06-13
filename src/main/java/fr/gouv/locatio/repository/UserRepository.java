package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.User;
import org.joda.time.LocalDateTime;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface UserRepository extends CrudRepository<User, Integer> {
    User findOneByEmail(String email);

    @Modifying
    @Transactional
    void deleteByLastLoginDateBefore(LocalDateTime threeWeekLater);
}

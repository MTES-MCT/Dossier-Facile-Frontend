package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.Guarantor;
import org.springframework.data.repository.CrudRepository;

public interface GuarantorRepository extends CrudRepository<Guarantor, Integer> {
}

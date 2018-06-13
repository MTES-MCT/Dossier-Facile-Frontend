package fr.gouv.locatio.repository;

import fr.gouv.locatio.entity.Statistic;
import org.springframework.data.repository.CrudRepository;

public interface StaticRepository extends CrudRepository<Statistic,Integer> {

    Statistic findOneByPartnerId(String partnerId);
}

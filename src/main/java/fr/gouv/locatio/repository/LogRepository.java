package fr.gouv.locatio.repository;


import fr.gouv.locatio.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, Integer> {
}

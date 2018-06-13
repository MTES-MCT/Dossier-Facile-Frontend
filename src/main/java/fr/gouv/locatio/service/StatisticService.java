package fr.gouv.locatio.service;


import fr.gouv.locatio.entity.Statistic;
import fr.gouv.locatio.repository.StaticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatisticService {
    @Autowired
    private StaticRepository staticRepository;

    public void create(String partnerId) {
        Statistic aStatistic = new Statistic(partnerId);
        staticRepository.save(aStatistic);

    }
}

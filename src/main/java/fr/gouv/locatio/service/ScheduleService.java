package fr.gouv.locatio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


@Service
public class ScheduleService {

    @Autowired
    private UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(ScheduleService.class);

    public void deleteOldAccounts() {
        logger.info("Delete old accounts");
        userService.deleteOldAccount();
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void mainScheduler() {
        deleteOldAccounts();
    }
}

package fr.gouv.locatio.service;

import fr.gouv.locatio.entity.Log;
import fr.gouv.locatio.entity.User;
import fr.gouv.locatio.enums.LogType;
import fr.gouv.locatio.repository.LogRepository;
import fr.gouv.locatio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogService {

    @Autowired
    public LogRepository logRepository;
    @Autowired
    public UserService userService;

    public void save(int tenantId, LogType logType) {
        User user = userService.find(tenantId);
        Log log = new Log(user, logType);
        logRepository.save(log);
    }
}

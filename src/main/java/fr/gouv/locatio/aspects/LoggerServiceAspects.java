package fr.gouv.locatio.aspects;

import fr.gouv.locatio.enums.LogType;
import fr.gouv.locatio.service.LogService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Aspect
@Service
public class LoggerServiceAspects {

    @Autowired
    private LogService logService;


    @After("execution(* fr.gouv.locatio.service.TenantService.sendCustomMail(..)) && args(tenantId,..))")
    public void beforeSampleCreation(JoinPoint joinPoint,int tenantId) {
        logService.save(tenantId, LogType.CUSTOM_EMAIL);
    }

}

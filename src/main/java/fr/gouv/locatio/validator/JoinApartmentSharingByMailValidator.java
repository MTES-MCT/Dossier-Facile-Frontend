package fr.gouv.locatio.validator;


import fr.gouv.locatio.annotation.JoinApartmentSharingByMail;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class JoinApartmentSharingByMailValidator implements ConstraintValidator<JoinApartmentSharingByMail,String> {

    @Autowired
    TenantRepository tenantRepository;

    @Override
    public void initialize(JoinApartmentSharingByMail joinApartmentSharingByMail) {

    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext constraintValidatorContext) {
        Tenant tenant = tenantRepository.findOneByEmail(email);
        return tenant != null && tenant.getApartmentSharings().size() > 0;
    }
}

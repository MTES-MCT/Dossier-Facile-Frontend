package fr.gouv.locatio.validator;


import fr.gouv.locatio.annotation.UniqueEmail;
import fr.gouv.locatio.repository.UserRepository;
import fr.gouv.locatio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail,String>{
    @Autowired
    private UserRepository userRepository;

    @Override
    public void initialize(UniqueEmail uniqueEmail) {
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext constraintValidatorContext) {
        return userRepository.findOneByEmail(email)==null;
    }
}

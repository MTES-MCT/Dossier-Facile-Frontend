package fr.gouv.locatio.annotation;

import fr.gouv.locatio.validator.JoinApartmentSharingByMailValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)

@Constraint(
        validatedBy = {JoinApartmentSharingByMailValidator.class}
)

public @interface JoinApartmentSharingByMail {

    String message();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

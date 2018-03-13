package fr.gouv.locatio.service;

import fr.gouv.locatio.displayer.UserDisplayer;
import fr.gouv.locatio.entity.PasswordRecoveryToken;
import fr.gouv.locatio.entity.User;
import fr.gouv.locatio.repository.PasswordRecoveryTokenRepository;
import fr.gouv.locatio.repository.UserRepository;
import fr.gouv.locatio.security.ChangePasswordStatus;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordRecoveryTokenRepository passwordRecoveryTokenRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public void launchPasswordRecoveryProcedure(String recoveryEmail, boolean accountCreation) {
        User user = userRepository.findOneByEmail(recoveryEmail);
        if (null != user) {
            PasswordRecoveryToken passwordRecoveryToken = new PasswordRecoveryToken();
            passwordRecoveryToken.setUser(user);
            passwordRecoveryToken.setExpirationDate((new LocalDateTime()).plusDays(1));
            passwordRecoveryToken.setToken(RandomStringUtils.randomAlphabetic(64));
            passwordRecoveryTokenRepository.save(passwordRecoveryToken);
            String mailTitle = accountCreation ? "Bienvenue sur Locatio !" : "Mot de passe oublié !";
            String tokenLink = "https://locatio.beta.gouv.fr/changer-de-mot-de-passe/" + passwordRecoveryToken.getToken();

            String mailMessage = "Bonjour,<br/><br/>Vous avez fait une demande de changement de mot de passe. Pour obtenir un nouveau mot de passe cliquez sur le lien suivant :<br/><br/><a href=\"\" + tokenLink + \"\\\">\" + tokenLink + \"</a>https://locatio.beta.gouv.fr/passwordRecovery?token=\" + passwordRecoveryToken.getToken() + \"</a><br/><br/>L'équipe Locatio<br/><br/>Pour toute question, vous pouvez nous écrire à : contact@locatio.beta.gouv.fr";
            if (accountCreation) {
                mailMessage = "Bonjour,<br/><br/>Merci de faire confiance à Locatio. Pour activer votre compte cliquer sur le lien suivant :<br/><br/><a href=\"" + tokenLink + "\">" + tokenLink + "</a><br/><br/>Vous recevrez un email dès que les pièces de votre dossier auront été vérifiées. Cette opération nous prend généralement moins de 24 heures.<br/><br/>Une fois votre dossier vérifié, vous pourrez l'envoyer directement sous forme d'un lien aux propriétaires de votre choix.<br/><br/>L'équipe Locatio<br/><br/>Pour toute question, vous pouvez nous écrire à : contact@locatio.beta.gouv.fr";
            }
            mailService.sendAsyncMail("contact@locatio.beta.gouv.fr", recoveryEmail, "contact@locatio.beta.gouv.fr", mailTitle, mailMessage);
        }
    }

    @Transactional
    public ChangePasswordStatus changePassword(String token, String password, String passwordConfirmation) {
        PasswordRecoveryToken passwordRecoveryToken = passwordRecoveryTokenRepository.findByToken(token);
        if (null == passwordRecoveryToken) {
            return ChangePasswordStatus.TOKEN_DOES_NOT_EXIST;
        }
        if (passwordRecoveryToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ChangePasswordStatus.TOKEN_TOO_OLD;
        }
        if (StringUtils.isEmpty(password) || StringUtils.isEmpty(passwordConfirmation) || !password.equals(passwordConfirmation)) {
            return ChangePasswordStatus.WRONG_PASSWORD;
        }

        User user = passwordRecoveryToken.getUser();
        user.setPassword(bCryptPasswordEncoder.encode(password));
        userRepository.save(user);
        passwordRecoveryTokenRepository.delete(passwordRecoveryToken);
        return ChangePasswordStatus.SUCCESS;
    }

    public User getLoggedUser() {
        if (SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken) {
            return null;
        }
        org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findOneByEmail(user.getUsername());
    }

    public UserDisplayer createConnectedUserDisplayer() {
        User user = getLoggedUser();
        UserDisplayer userDisplayer = new UserDisplayer();
        if (null != user) {
            userDisplayer.setConnected(true);
            userDisplayer.setUsername(user.getFirstName() + " " + user.getLastName());
        }
        return userDisplayer;
    }
}

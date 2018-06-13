package fr.gouv.locatio.security;

import fr.gouv.locatio.entity.Owner;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.entity.User;
import fr.gouv.locatio.repository.OwnerRepository;
import fr.gouv.locatio.repository.TenantRepository;
import fr.gouv.locatio.repository.UserRepository;
import fr.gouv.locatio.service.OwnerService;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class RedirectAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private OwnerService ownerService;
    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User user = userRepository.findOneByEmail(authentication.getName());
        user.setLastLoginDate(LocalDateTime.now());
        userRepository.save(user);
        Owner owner = null;
        Tenant tenant = null;
        String redirectUrl = null;
        if (user instanceof Tenant) {
            tenant = (Tenant) user;
        } else {
            owner = (Owner) user;
        }
        if (null != session) {
            String tenantToken = (String) session.getAttribute("token");
            if (null != tenantToken) {
                if (null != owner) {
                    ownerService.linkOwnerTenant(owner, tenantToken);
                }
                session.removeAttribute("token");
            }
            String ownerToken = (String) session.getAttribute("ownerToken");
            if (null != ownerToken) {
                if (null != tenant) {
                    redirectUrl = "/proprietaire/contacter/" + ownerToken;
                }
                session.removeAttribute("ownerToken");
            }
        }

        if (redirectUrl == null) {
            if (tenant != null) {
                redirectUrl = "/locataire/mon-compte";
            } else if (owner != null) {
                redirectUrl = "/proprietaire/mon-compte";
            }
        }
        if (redirectUrl != null) {
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}

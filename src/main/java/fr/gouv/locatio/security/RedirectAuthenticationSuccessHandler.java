package fr.gouv.locatio.security;

import fr.gouv.locatio.entity.Owner;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.repository.OwnerRepository;
import fr.gouv.locatio.repository.TenantRepository;
import fr.gouv.locatio.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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
    private OwnerRepository ownerRepository;
    @Autowired
    private TenantRepository tenantRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        HttpSession session = request.getSession();
        DefaultSavedRequest defaultSavedRequest = null;
        Owner owner = ownerRepository.findOneByEmail(authentication.getName());
        Tenant tenant = tenantRepository.findOneByEmail(authentication.getName());
        if (null != session) {
        defaultSavedRequest = ((DefaultSavedRequest) request.getSession().getAttribute("SPRING_SECURITY_SAVED_REQUEST"));
            String tenantToken = (String) session.getAttribute("token");
            if (null != tenantToken) {
                if (null != owner) {
                    ownerService.linkOwnerTenant(owner, tenantToken);
                    session.removeAttribute("token");
                }
            }
        }
        String redirectUrl = null;
        String returnURL = "";
        if (defaultSavedRequest != null) {
            returnURL = defaultSavedRequest.getRequestURL();
        }

        if (returnURL.contains("/proprietaire/contacter/") && tenant != null) {
            redirectUrl = returnURL;
        } else if (tenant != null) {
            redirectUrl = "/locataire/mon-compte";
        } else if (owner != null) {
            redirectUrl = "/proprietaire/mon-compte";
        }
        if (redirectUrl != null) {
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}

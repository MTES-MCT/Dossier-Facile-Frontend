package fr.gouv.locatio.configuration;

import fr.gouv.locatio.security.RedirectAuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.web.client.RestTemplate;

import java.util.Properties;
import java.util.concurrent.Executor;

@Configuration
@EnableWebSecurity
@EnableAsync
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("${spring.mail.username}")
    private String username;
    @Value("${spring.mail.password}")
    private String password;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf()
                .csrfTokenRepository(csrfTokenRepository())
                .and()
                .authorizeRequests()
                .antMatchers("/bo", "/bo/**","/stats").access("hasAnyRole('ROLE_ADMIN')")
                .antMatchers("/locataire/mon-compte", "/locataire/modifier-mon-compte").access("hasAnyRole('ROLE_TENANT')")
                .antMatchers("/proprietaire/mon-compte").access("hasAnyRole('ROLE_OWNER')")
                .anyRequest().permitAll()
                .and()
                .formLogin()
                .loginPage("/login")
                .successForwardUrl("/mon-compte")
                .permitAll()
                .successHandler(redirectAuthenticationSuccessHandler())
                .and()
                .logout()
                .permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
    }

//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//        auth.inMemoryAuthentication().withUser(username).password(password).roles("ADMIN");
//    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RedirectAuthenticationSuccessHandler redirectAuthenticationSuccessHandler() {
        return new RedirectAuthenticationSuccessHandler();
    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setSessionAttributeName("_csrf");
        return repository;
    }

    @Autowired
    public void registerGlobalAuthentication(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication();
    }

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    @Profile("prod")
    public JavaMailSender mailSenderProd() {
        return config("in-v3.mailjet.com");
    }

    @Bean
    @Profile("dev")
    public JavaMailSender mailSenderDev() {
        return config("smtp.gmail.com");
    }

    private JavaMailSender config(String host) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setDefaultEncoding("UTF-8");
        mailSender.setHost(host);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", true);
        properties.put("mail.smtp.starttls.enable", true);
        mailSender.setJavaMailProperties(properties);
        return mailSender;
    }

    @Bean
    public Executor asyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("Mailer-");
        executor.initialize();
        return executor;
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }

}

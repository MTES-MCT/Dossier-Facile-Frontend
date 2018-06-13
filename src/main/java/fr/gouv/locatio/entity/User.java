package fr.gouv.locatio.entity;

import org.hibernate.annotations.Type;
import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "user")
@Inheritance(
        strategy = InheritanceType.JOINED
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column()
    private String firstName;

    @Column()
    private String lastName;

    @Column(nullable = true, unique = true)
    private String email;

    @Column
    private String password;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Set<UserRole> userRoles;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Set<Log> logs;

    @Column(name = "creation_date")
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    private LocalDateTime creationDateTime = LocalDateTime.now();

    @Column(name = "last_login_date")
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    private LocalDateTime lastLoginDate = LocalDateTime.now();

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private PasswordRecoveryToken passwordRecoveryToken;

    public User(String firstName, String lastName) {
        this.firstName = firstName.trim().replaceAll("\\s+", " ");
        this.lastName = lastName.trim().replaceAll("\\s+", " ");
    }

    public User() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<UserRole> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(Set<UserRole> userRoles) {
        this.userRoles = userRoles;
    }

    public LocalDateTime getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(LocalDateTime creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public PasswordRecoveryToken getPasswordRecoveryToken() {
        return passwordRecoveryToken;
    }

    public void setPasswordRecoveryToken(PasswordRecoveryToken passwordRecoveryToken) {
        this.passwordRecoveryToken = passwordRecoveryToken;
    }

    public LocalDateTime getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(LocalDateTime lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public Set<Log> getLogs() {
        return logs;
    }

    public void setLogs(Set<Log> logs) {
        this.logs = logs;
    }

    public String getFullName() {
        return this.firstName + " " + this.getLastName();
    }
}

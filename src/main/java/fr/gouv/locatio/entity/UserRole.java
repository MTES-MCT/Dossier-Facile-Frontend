package fr.gouv.locatio.entity;

import fr.gouv.locatio.security.Role;

import javax.persistence.*;

@Entity
@Table(name = "user_roles")
public class UserRole {

    public UserRole() {
    }

    public UserRole(Owner owner) {
        this.user = owner;
        this.role = Role.ROLE_OWNER;
    }

    public UserRole(Tenant tenant) {
        this.user = tenant;
        this.role = Role.ROLE_TENANT;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Role role;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}

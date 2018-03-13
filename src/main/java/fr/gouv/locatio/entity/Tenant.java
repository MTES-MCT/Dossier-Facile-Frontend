package fr.gouv.locatio.entity;

import org.hibernate.annotations.Type;
import org.joda.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "tenant")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String upload1;

    @Column(nullable = false)
    private String upload2;

    @Column(nullable = false)
    private String upload3;

    @Column(nullable = false)
    private String upload4;

    @Column(nullable = false)
    private TenantFileStatus tenantFileStatus;

    @Column(nullable = false)
    private String emailsList;

    @Column
    private String token;

    @Column(name = "creation_date")
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentLocalDateTime")
    private LocalDateTime tokenEndDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUpload1() {
        return upload1;
    }

    public void setUpload1(String upload1) {
        this.upload1 = upload1;
    }

    public String getUpload2() {
        return upload2;
    }

    public void setUpload2(String upload2) {
        this.upload2 = upload2;
    }

    public String getUpload3() {
        return upload3;
    }

    public void setUpload3(String upload3) {
        this.upload3 = upload3;
    }

    public String getUpload4() {
        return upload4;
    }

    public void setUpload4(String upload4) {
        this.upload4 = upload4;
    }

    public TenantFileStatus getTenantFileStatus() {
        return tenantFileStatus;
    }

    public void setTenantFileStatus(TenantFileStatus tenantFileStatus) {
        this.tenantFileStatus = tenantFileStatus;
    }

    public String getEmailsList() {
        return emailsList;
    }

    public void setEmailsList(String emailsList) {
        this.emailsList = emailsList;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getTokenEndDate() {
        return tokenEndDate;
    }

    public void setTokenEndDate(LocalDateTime tokenEndDate) {
        this.tokenEndDate = tokenEndDate;
    }
}

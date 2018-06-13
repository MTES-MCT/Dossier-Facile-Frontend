package fr.gouv.locatio.entity;


import org.hibernate.annotations.Type;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "guarantor")
public class Guarantor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column()
    private String firstName;

    @Column()
    private String lastName;

    @Column(nullable = true)
    private String upload1;

    @Column(nullable = true)
    private String upload2;

    @Column(nullable = true)
    private String upload3;

    @Column(nullable = true)
    private String upload4;

    @Column(nullable = true)
    private String upload5;

    @Column(nullable = true)
    private TenantFileStatus tenantFileStatus;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    public Guarantor(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Guarantor() {
    }
    public Guarantor(Tenant tenant) {
        this.tenant = tenant;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getUpload5() {
        return upload5;
    }

    public void setUpload5(String upload5) {
        this.upload5 = upload5;
    }

    public TenantFileStatus getTenantFileStatus() {
        return tenantFileStatus;
    }

    public void setTenantFileStatus(TenantFileStatus tenantFileStatus) {
        this.tenantFileStatus = tenantFileStatus;
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

    public boolean isValidated() {
        return tenantFileStatus == TenantFileStatus.VALIDATED;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    @Override
    public String toString() {
        return getFirstName() + " " + getLastName();
    }

    public int getFileNumber() {
        if (upload1 == null) {
            return 1;
        }
        if (upload2 == null) {
            return 2;
        }
        if (upload3 == null) {
            return 3;
        }
        if (upload4 == null) {
            return 4;
        }
        return 5;
    }
}

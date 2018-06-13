package fr.gouv.locatio.dto;

import fr.gouv.locatio.annotation.JoinApartmentSharingByMail;
import fr.gouv.locatio.annotation.UniqueEmail;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.validator.*;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.Range;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public class TenantDTO {


    private Integer id;

    @NotBlank(groups = {Step1.class})
    @NotEmpty(groups = {Step1.class})
    @Pattern(regexp = "^[a-zA-Z0-9- ]*$", message = "Caractères non autorisés", groups = {Step1.class})
    private String firstName;

    @NotBlank(groups = {Step1.class})
    @NotEmpty(groups = {Step1.class})
    @Pattern(regexp = "^[a-zA-Z0-9- ]*$", message = "Caractères non autorisés", groups = {Step1.class})
    private String lastName;


    @NotNull(groups = {TenantCreateApartmentSharing.class, TenantJoinApartmentSharing.class, TenantAlone.class})
    private Integer situation;

    @NotNull(groups = {TenantCreateApartmentSharing.class, TenantJoinApartmentSharing.class, TenantAlone.class})
    private Integer salary;

    @Pattern(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}", groups = {Step2.class})
    @UniqueEmail(message = "Cette adresse email est déjà utilisée", groups = {Step2.class})
    private String email;

    private MultipartFile[][] files;

    @NotBlank(groups = {Step2.class})
    @NotEmpty(groups = {Step2.class})
    private String password;

    @Range(min = 2, max = 6, groups = {TenantCreateApartmentSharing.class})
    private Integer numberOfTenants;

    private Boolean hasGuarantor;

    @NotNull(groups = {Step3.class})
    private String tenantType;

    @Pattern(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}", groups = {TenantJoinApartmentSharing.class})
    @JoinApartmentSharingByMail(message = "Cette adresse email n'a pas été utilisée pour créer une colocation", groups = {TenantJoinApartmentSharing.class})
    private String tenantEmail;

    private String partnerId;

    private GuarantorDTO guarantor;

    public TenantDTO() {
    }

    public String getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(String partnerId) {
        this.partnerId = partnerId;
    }

    public TenantDTO(Tenant tenant) {
        this.id = tenant.getId();
        this.firstName = tenant.getFirstName();
        this.lastName = tenant.getLastName();
        this.salary = tenant.getSalary();
        if (tenant.getTenantSituation() != null) {
            this.situation = tenant.getTenantSituation().ordinal();
        }
        this.email = tenant.getEmail();
        if (tenant.getGuarantor() != null) {
            this.setGuarantor(new GuarantorDTO(tenant.getGuarantor()));
        }
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

    public MultipartFile[][] getFiles() {
        return files;
    }

    public void setFiles(MultipartFile[][] files) {
        this.files = files;
    }

    public Integer getSituation() {
        return situation;
    }

    public void setSituation(Integer situation) {
        this.situation = situation;
    }

    public Integer getSalary() {
        return salary;
    }

    public void setSalary(Integer salary) {
        this.salary = salary;
    }

    public Integer getNumberOfTenants() {
        return numberOfTenants;
    }

    public void setNumberOfTenants(Integer numberOfTenants) {
        this.numberOfTenants = numberOfTenants;
    }

    public String getTenantType() {
        return tenantType;
    }

    public void setTenantType(String tenantType) {
        this.tenantType = tenantType;
    }

    public String getTenantEmail() {
        return tenantEmail;
    }

    public void setTenantEmail(String tenantEmail) {
        this.tenantEmail = tenantEmail;
    }

    public Boolean getHasGuarantor() {
        return hasGuarantor;
    }

    public void setHasGuarantor(Boolean hasGuarantor) {
        this.hasGuarantor = hasGuarantor;
    }

    public GuarantorDTO getGuarantor() {
        return guarantor;
    }

    public void setGuarantor(GuarantorDTO guarantor) {
        this.guarantor = guarantor;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

package fr.gouv.locatio.dto;

import fr.gouv.locatio.entity.Guarantor;
import fr.gouv.locatio.validator.CreateTenant;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public class GuarantorDTO {

    @NotNull
    @NotEmpty
    @Pattern(regexp = "^[a-zA-Z0-9- ]*$",message = "Caractères non autorisés")
    private String firstName;

    @NotNull
    @NotEmpty
    @Pattern(regexp = "^[a-zA-Z0-9- ]*$",message = "Caractères non autorisés")
    private String lastName;

    @NotNull
    private Integer situation;

    @NotNull
    private Integer salary;

    @NotNull(groups = {CreateTenant.class})
    @NotEmpty(groups = {CreateTenant.class})
    @Pattern(regexp="[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",groups = {CreateTenant.class})
    private String email;

    private MultipartFile[][] files;

    public GuarantorDTO() {
    }
    public GuarantorDTO(Guarantor guarantor){
        this.firstName = guarantor.getFirstName();
        this.lastName = guarantor.getLastName();
    }

    public GuarantorDTO(String firstName, String lastName, Integer salary, Integer situation, String email, String emailsList) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.salary = salary;
        this.situation = situation;
        this.email = email;
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

}

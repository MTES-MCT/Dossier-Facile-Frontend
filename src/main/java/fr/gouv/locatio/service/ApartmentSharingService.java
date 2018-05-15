package fr.gouv.locatio.service;

import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.ApartmentSharing;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.entity.TenantFileStatus;
import fr.gouv.locatio.repository.ApartmentSharingRepository;
import fr.gouv.locatio.repository.TenantRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApartmentSharingService {

    @Autowired
    private ApartmentSharingRepository apartmentSharingRepository;

    @Autowired
    private TenantRepository tenantRepository;


    public void createApartmentSharing(Tenant tenant, TenantDTO tenantDTO) {
        ApartmentSharing apartmentSharing = new ApartmentSharing();
        if (tenantDTO.getTenantType().equals("alone")) {
            apartmentSharing.setTenantApartmentSharing(tenant);
            apartmentSharing.setNumberOfTenants(1);
        } else if (tenantDTO.getTenantType().equals("create")) {
            apartmentSharing.setTenantApartmentSharing(tenant);
            apartmentSharing.setNumberOfTenants(tenantDTO.getNumberOfTenants());
        } else {
            apartmentSharing = findApartmentSharingByOwnerEmail(tenantDTO.getTenantEmail());
            tenant.addJoinedApartmentSharings(apartmentSharing);
        }
        apartmentSharing.setTenantFileStatus(TenantFileStatus.TO_PROCESS);
        apartmentSharingRepository.save(apartmentSharing);
    }

    public ApartmentSharing findApartmentSharingByOwnerEmail(String email) {
        ApartmentSharing apartmentSharing = null;
        Tenant tenant = tenantRepository.findOneByEmail(email);
        if (tenant != null && tenant.getApartmentSharings().size() > 0) {
            apartmentSharing = tenant.getApartmentSharings().get(0);
        }
        return apartmentSharing;
    }

    public boolean validateApartmentSharing(ApartmentSharing apartmentSharing) {
        if (apartmentSharing == null) {
            return false;
        }
        int validTenants = 0;
        for (int i = 0; i < apartmentSharing.getTenants().size(); i++) {
            if (apartmentSharing.getTenants().get(i).isValidated()) {
                validTenants++;
            }
        }

        if (apartmentSharing.getTenantApartmentSharing().isValidated() && validTenants == apartmentSharing.getNumberOfTenants() - 1) {
            if (apartmentSharing.getToken() == null) {
                apartmentSharing.setToken(RandomStringUtils.randomAlphanumeric(8));

            }
            if (apartmentSharing.getTokenPublic() == null) {
                apartmentSharing.setTokenPublic(RandomStringUtils.randomAlphanumeric(8));
            }
            apartmentSharing.setTenantFileStatus(TenantFileStatus.VALIDATED);
            apartmentSharingRepository.save(apartmentSharing);
            return true;
        } else {
            apartmentSharing.setTokenPublic(null);
            apartmentSharing.setToken(null);
            apartmentSharing.setTenantFileStatus(TenantFileStatus.TO_PROCESS);
            apartmentSharingRepository.save(apartmentSharing);
            return false;
        }
    }


    public ApartmentSharing findApartmentSharingFromToken(String token) {
        ApartmentSharing apartmentSharing = apartmentSharingRepository.findOneByToken(token);
        return apartmentSharing;
    }

    public ApartmentSharing findApartmentSharingByBothToken(String token) {
        ApartmentSharing apartmentSharing = apartmentSharingRepository.findOneByTokenPublic(token);
        if (apartmentSharing != null) {
            return apartmentSharing;
        }
        apartmentSharing = apartmentSharingRepository.findOneByToken(token);
        if (apartmentSharing != null) {
            return apartmentSharing;
        }
        return null;
    }

    public ApartmentSharing findApartmentSharingFromTokenPublic(String token) {
        ApartmentSharing apartmentSharing = apartmentSharingRepository.findByTokenPublic(token);
        return apartmentSharing;
    }

    public int totalSalary(ApartmentSharing apartmentSharing) {
        int suma = apartmentSharing.getTenantApartmentSharing().getSalary();
        List<Tenant> tenantList = apartmentSharing.getTenants();
        for (int i = 0; i < tenantList.size(); i++) {
            suma += tenantList.get(i).getSalary();
        }
        return suma;
    }

    public List<ApartmentSharing> findAll() {
        return apartmentSharingRepository.findAll();
    }

    public List<ApartmentSharing> findAllMoreOne() {
        return apartmentSharingRepository.findAllMoreOne();
    }

    public ApartmentSharing find(int id) {
        return apartmentSharingRepository.findOne(id);
    }

    public void delete(int id) {
        apartmentSharingRepository.delete(id);
    }
}

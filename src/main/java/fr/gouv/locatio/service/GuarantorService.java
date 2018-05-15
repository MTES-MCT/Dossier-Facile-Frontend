package fr.gouv.locatio.service;

import fr.gouv.locatio.entity.Guarantor;
import fr.gouv.locatio.repository.GuarantorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GuarantorService {

    @Autowired
    private GuarantorRepository guarantorRepository;

    public Guarantor getGuarantor(Integer id){
        return guarantorRepository.findOne(id);
    }
}

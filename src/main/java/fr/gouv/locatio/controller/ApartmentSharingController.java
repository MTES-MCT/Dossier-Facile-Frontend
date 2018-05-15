package fr.gouv.locatio.controller;


import fr.gouv.locatio.repository.OwnerRepository;
import fr.gouv.locatio.service.ApartmentSharingService;
import fr.gouv.locatio.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ApartmentSharingController {


    @Autowired
    ApartmentSharingService apartmentSharingService;

    @Autowired
    OwnerRepository ownerRepository;

    @Autowired
    OwnerService ownerService;



}

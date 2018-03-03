package fr.gouv.locatio.services;

import fr.gouv.locatio.entities.Subscription;
import fr.gouv.locatio.repositories.OwnerRepository;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerService {

    @Autowired
    OwnerRepository ownerRepository;

    public Subscription saveSubscription(Subscription subscription) {
        subscription.setCreationDateTime(new LocalDateTime());
        return ownerRepository.save(subscription);
    }

    public List<Subscription> listSubscribedOwners() {
        List<Subscription> subscriptions = (List<Subscription>) ownerRepository.findAll();
        return subscriptions;
    }

    public void deleteSubscribedOwner(Integer subscriptionId) {
        Subscription subscription = ownerRepository.findOne(subscriptionId);
        ownerRepository.delete(subscription);
    }
}

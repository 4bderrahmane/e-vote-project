package org.krino.voting_system.service;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.krino.voting_system.dto.party.PartyCreateDto;
import org.krino.voting_system.entity.Party;
import org.krino.voting_system.exception.ResourceNotFoundException;
import org.krino.voting_system.repository.PartyRepository;

import java.util.List;
import java.util.UUID;

@Transactional
@Service
@RequiredArgsConstructor
public class PartyService
{
    private final PartyRepository partyRepository;

    public List<Party> findAllParties()
    {
        return partyRepository.findAll();
    }

    public Party getPartyByPublicId(UUID publicId)
    {
        return partyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException(Party.class.getSimpleName(), "UUID", publicId));
    }

    public Party createParty(PartyCreateDto partyDto)
    {
        Party party = new Party();
        party.setName(partyDto.getName());
        return partyRepository.save(party);
    }

    public Party updateParty(UUID publicId, PartyCreateDto partyDto)
    {
        Party party = partyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException(Party.class.getSimpleName(), "UUID", publicId));
        party.setName(partyDto.getName());
        return partyRepository.save(party);
    }

    public void deletePartyByPublicId(UUID publicId)
    {
        Party party = partyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException(Party.class.getSimpleName(), "UUID", publicId));
        partyRepository.delete(party);
    }
}

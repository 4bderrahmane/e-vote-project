package org.krino.voting_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.krino.voting_system.dto.candidate.CandidateCreateDto;
import org.krino.voting_system.entity.Candidate;
import org.krino.voting_system.entity.Citizen;
import org.krino.voting_system.entity.Election;
import org.krino.voting_system.entity.Party;
import org.krino.voting_system.exception.ResourceNotFoundException;
import org.krino.voting_system.repository.CandidateRepository;
import org.krino.voting_system.repository.CitizenRepository;
import org.krino.voting_system.repository.ElectionRepository;
import org.krino.voting_system.repository.PartyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Transactional
@Service
@RequiredArgsConstructor
public class CandidateService
{
    private final CandidateRepository candidateRepository;
    private final CitizenRepository citizenRepository;
    private final ElectionRepository electionRepository;
    private final PartyRepository partyRepository;

    public List<Candidate> getAllCandidates()
    {
        return candidateRepository.findAll();
    }

    public Candidate getCandidateByPublicId(UUID publicId)
    {
        return candidateRepository.findCandidateByCitizenKeycloakId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException(Candidate.class.getSimpleName(), "UUID", publicId));
    }

    public Candidate createCandidate(CandidateCreateDto candidateDto)
    {
        Citizen citizen = citizenRepository.findByKeycloakId(candidateDto.getCitizenPublicId())
                .orElseThrow(() -> new ResourceNotFoundException(Citizen.class.getSimpleName(), "UUID", candidateDto.getCitizenPublicId()));

        Election election = electionRepository.findByPublicId(candidateDto.getElectionPublicId())
                .orElseThrow(() -> new ResourceNotFoundException(Election.class.getSimpleName(), "UUID", candidateDto.getElectionPublicId()));

        Party party = null;
        if (candidateDto.getPartyPublicId() != null)
        {
            party = partyRepository.findByPublicId(candidateDto.getPartyPublicId())
                    .orElseThrow(() -> new ResourceNotFoundException(Party.class.getSimpleName(), "UUID", candidateDto.getPartyPublicId()));
        }

        Candidate candidate = new Candidate();
        candidate.setCitizen(citizen);
        candidate.setElection(election);
        candidate.setParty(party);

        if (candidateDto.getStatus() != null)
        {
            candidate.setStatus(candidateDto.getStatus());
        }

        return candidateRepository.save(candidate);
    }

    public Candidate updateCandidate(UUID publicId, CandidateCreateDto candidateDto)
    {
        Candidate candidate = candidateRepository.findCandidateByCitizenKeycloakId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException(Candidate.class.getSimpleName(), "UUID", publicId));

        if (candidateDto.getPartyPublicId() != null)
        {
            Party party = partyRepository.findByPublicId(candidateDto.getPartyPublicId())
                    .orElseThrow(() -> new ResourceNotFoundException(Party.class.getSimpleName(), "UUID", candidateDto.getPartyPublicId()));
            candidate.setParty(party);
        }

        if (candidateDto.getStatus() != null)
        {
            candidate.setStatus(candidateDto.getStatus());
        }

        return candidateRepository.save(candidate);
    }

    public void deleteCandidateByPublicId(UUID publicId)
    {
        Candidate candidate = candidateRepository.findCandidateByCitizenKeycloakId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException(Candidate.class.getSimpleName(), "UUID", publicId));
        candidateRepository.delete(candidate);
    }
}

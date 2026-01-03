package org.krino.voting_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.krino.voting_system.dto.election.ElectionCreateDto;
import org.krino.voting_system.entity.Election;
import org.krino.voting_system.exception.ResourceNotFoundException;
import org.krino.voting_system.repository.ElectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Transactional
@Service
@RequiredArgsConstructor
public class ElectionService
{
    public final ElectionRepository electionRepository;


    public List<Election> findAllElections()
    {
        return electionRepository.findAll();
    }

    public Election getElectionById(Long id)
    {
        return electionRepository.findById(id).orElse(null);
    }

    public Election getElectionByPublicId(UUID publicId)
    {
        return electionRepository.findByPublicId(publicId).orElse(null);
    }

    public void deleteElectionByPublicId(UUID uuid)
    {
        Election election = electionRepository.findByPublicId(uuid)
                        .orElseThrow(() -> new ResourceNotFoundException(Election.class.getSimpleName(), "UUID", uuid));
        electionRepository.delete(election);
    }

//    public Election createElection(ElectionCreateDto electionDto)
//    {
//        Election election = new Election();
//        election.setTitle(electionDto.getTitle());
//        election.setDescription(electionDto.getDescription());
//        election.setStartDate(electionDto.getStartDate());
//        election.setEndDate(electionDto.getEndDate());
//        election.setStatus(electionDto.getStatus());
//        return electionRepository.save(election);
//    }
//
//    public Election updateElection(UUID publicId, ElectionCreateDto electionDto)
//    {
//        Election election = electionRepository.findByPublicId(publicId)
//                .orElseThrow(() -> new ResourceNotFoundException(Election.class.getSimpleName(), "UUID", publicId));
//        election.setTitle(electionDto.getTitle());
//        election.setDescription(electionDto.getDescription());
//        election.setStartDate(electionDto.getStartDate());
//        election.setEndDate(electionDto.getEndDate());
//        election.setStatus(electionDto.getStatus());
//        return electionRepository.save(election);
//    }
}

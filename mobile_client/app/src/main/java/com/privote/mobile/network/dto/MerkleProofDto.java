package com.privote.mobile.network.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MerkleProofDto
{
    private String groupId;
    private Integer expectedDepth;
    private String root;
    private String leaf;
    private List<String> siblings;
    private Long index;
}

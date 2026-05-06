package com.privote.mobile.ui.elections;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.privote.mobile.R;
import com.privote.mobile.network.dto.CandidateDto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CandidateAdapter extends RecyclerView.Adapter<CandidateAdapter.CandidateViewHolder>
{
    public interface OnCandidateSelected
    {
        void onSelected(CandidateDto candidate);
    }

    private final List<CandidateDto> candidates = new ArrayList<>();
    private final OnCandidateSelected listener;
    private UUID selectedId;

    public CandidateAdapter(OnCandidateSelected listener)
    {
        this.listener = listener;
    }

    public void setCandidates(List<CandidateDto> next)
    {
        candidates.clear();
        if (next != null)
        {
            candidates.addAll(next);
        }
        notifyDataSetChanged();
    }

    public CandidateDto getSelected()
    {
        if (selectedId == null) return null;
        for (CandidateDto candidate : candidates)
        {
            if (selectedId.equals(candidate.publicId)) return candidate;
        }
        return null;
    }

    @NonNull
    @Override
    public CandidateViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_candidate, parent, false);
        return new CandidateViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CandidateViewHolder holder, int position)
    {
        CandidateDto candidate = candidates.get(position);
        holder.bind(candidate);
    }

    @Override
    public int getItemCount()
    {
        return candidates.size();
    }

    class CandidateViewHolder extends RecyclerView.ViewHolder
    {
        private final LinearLayout row;
        private final RadioButton radio;
        private final TextView name;
        private final TextView party;

        CandidateViewHolder(@NonNull View itemView)
        {
            super(itemView);
            row = itemView.findViewById(R.id.candidateRow);
            radio = itemView.findViewById(R.id.radioCandidate);
            name = itemView.findViewById(R.id.tvCandidateName);
            party = itemView.findViewById(R.id.tvCandidateParty);
        }

        void bind(CandidateDto candidate)
        {
            name.setText(candidate.fullName == null ? "Unnamed candidate" : candidate.fullName);
            party.setText(candidate.partyName == null ? "Independent" : candidate.partyName);
            radio.setChecked(candidate.publicId != null && candidate.publicId.equals(selectedId));

            row.setOnClickListener(v -> select(candidate));
            radio.setOnClickListener(v -> select(candidate));
        }

        private void select(CandidateDto candidate)
        {
            if (candidate.publicId == null) return;
            UUID previous = selectedId;
            selectedId = candidate.publicId;

            if (previous != null)
            {
                int previousPosition = indexOf(previous);
                if (previousPosition >= 0)
                {
                    notifyItemChanged(previousPosition);
                }
            }
            notifyItemChanged(getBindingAdapterPosition());

            if (listener != null)
            {
                listener.onSelected(candidate);
            }
        }
        private int indexOf(UUID id)
        {
            for (int i = 0; i < candidates.size(); i++)
            {
                if (id.equals(candidates.get(i).publicId)) return i;
            }
            return -1;
        }
    }

}

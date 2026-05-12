package com.privote.mobile.ui.elections;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.privote.mobile.R;
import com.privote.mobile.network.dto.ElectionDto;
import com.privote.mobile.util.DateFormatUtils;

import java.util.ArrayList;
import java.util.List;

public class ElectionAdapter extends RecyclerView.Adapter<ElectionAdapter.ViewHolder>
{

    public interface OnElectionClickListener
    {
        void onElectionClick(ElectionDto election);
    }

    private final List<ElectionDto> elections = new ArrayList<>();
    private final OnElectionClickListener listener;

    public ElectionAdapter(OnElectionClickListener listener)
    {
        this.listener = listener;
    }

    public void setElections(List<ElectionDto> data)
    {
        elections.clear();
        if (data != null) elections.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_election, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position)
    {
        holder.bind(elections.get(position), listener);
    }

    @Override
    public int getItemCount()
    {
        return elections.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder
    {
        private final TextView tvTitle;
        private final TextView tvDescription;
        private final TextView tvPhase;
        private final TextView tvDates;

        ViewHolder(@NonNull View itemView)
        {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvDescription = itemView.findViewById(R.id.tvDescription);
            tvPhase = itemView.findViewById(R.id.tvPhase);
            tvDates = itemView.findViewById(R.id.tvDates);
        }

        void bind(ElectionDto election, OnElectionClickListener listener)
        {
            tvTitle.setText(nonEmpty(election.getTitle(), "Untitled election"));
            tvDescription.setText(nonEmpty(election.getDescription(), "No description"));
            String phase = nonEmpty(election.getPhase(), "UNKNOWN");
            tvPhase.setText(phase);
            applyPhaseChip(tvPhase, phase);
            tvDates.setText(formatDates(election));
            itemView.setOnClickListener(v -> listener.onElectionClick(election));
        }

        private static void applyPhaseChip(TextView chip, String phase)
        {
            Context ctx = chip.getContext();
            if ("VOTING".equalsIgnoreCase(phase))
            {
                chip.setBackgroundResource(R.drawable.chip_success_bg);
                chip.setTextColor(ContextCompat.getColor(ctx, R.color.phase_vote_text));
            }
            else if ("TALLY".equalsIgnoreCase(phase))
            {
                chip.setBackgroundResource(R.drawable.chip_warning_bg);
                chip.setTextColor(ContextCompat.getColor(ctx, R.color.phase_tally_text));
            }
            else
            {
                chip.setBackgroundResource(R.drawable.chip_neutral_bg);
                chip.setTextColor(ContextCompat.getColor(ctx, R.color.phase_reg_text));
            }
        }

        private static String formatDates(ElectionDto election)
        {
            String start = DateFormatUtils.dateTime(election.getStartTime());
            String end = DateFormatUtils.dateTime(election.getEndTime());
            return start + " – " + end;
        }

        private static String nonEmpty(String value, String fallback)
        {
            return value == null || value.trim().isEmpty() ? fallback : value;
        }
    }
}

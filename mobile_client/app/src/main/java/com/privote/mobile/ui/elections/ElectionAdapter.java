package com.privote.mobile.ui.elections;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.privote.mobile.R;
import com.privote.mobile.network.dto.ElectionDto;

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

        ViewHolder(@NonNull View itemView)
        {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvDescription = itemView.findViewById(R.id.tvDescription);
            tvPhase = itemView.findViewById(R.id.tvPhase);
        }

        void bind(ElectionDto election, OnElectionClickListener listener)
        {
            tvTitle.setText(election.title);
            tvDescription.setText(election.description != null ? election.description : "");
            tvPhase.setText(election.phase);
            itemView.setOnClickListener(v -> listener.onElectionClick(election));
        }
    }
}

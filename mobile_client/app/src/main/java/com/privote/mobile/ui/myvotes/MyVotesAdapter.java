package com.privote.mobile.ui.myvotes;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.privote.mobile.R;
import com.privote.mobile.repository.MyVotesRepository;
import com.privote.mobile.util.DateFormatUtils;

import java.util.ArrayList;
import java.util.List;

public class MyVotesAdapter extends RecyclerView.Adapter<MyVotesAdapter.ViewHolder>
{
    private final List<MyVotesRepository.MyVoteItem> votes = new ArrayList<>();

    public void setVotes(List<MyVotesRepository.MyVoteItem> data)
    {
        votes.clear();
        if (data != null) votes.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_my_vote, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position)
    {
        holder.bind(votes.get(position));
    }

    @Override
    public int getItemCount()
    {
        return votes.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder
    {
        private final TextView tvTitle;
        private final TextView tvStatus;
        private final TextView tvDetails;

        ViewHolder(@NonNull View itemView)
        {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvStatus = itemView.findViewById(R.id.tvStatus);
            tvDetails = itemView.findViewById(R.id.tvDetails);
        }

        void bind(MyVotesRepository.MyVoteItem item)
        {
            tvTitle.setText(item.election.getTitle() == null ? "Election" : item.election.getTitle());
            tvStatus.setText(formatStatus(item.registration.getParticipationStatus()));
            tvDetails.setText(
                    "Commitment: " + nonEmpty(item.registration.getCommitmentStatus(), "-") + "\n"
                            + "Registered at: " + DateFormatUtils.dateTime(item.registration.getRegisteredAt()) + "\n"
                            + "Transaction: " + nonEmpty(item.registration.getTransactionHash(), "-")
            );
        }

        private static String formatStatus(String status)
        {
            if (status == null || status.trim().isEmpty())
            {
                return "UNKNOWN";
            }

            if ("CAST".equalsIgnoreCase(status))
            {
                return "VOTE CAST";
            }

            return status.replace('_', ' ');
        }

        private static String nonEmpty(String value, String fallback)
        {
            return value == null || value.trim().isEmpty() ? fallback : value;
        }
    }
}

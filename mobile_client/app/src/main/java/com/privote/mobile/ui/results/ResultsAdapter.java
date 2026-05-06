package com.privote.mobile.ui.results;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.privote.mobile.R;
import com.privote.mobile.network.dto.ElectionResultCandidateDto;
import com.privote.mobile.network.dto.ElectionResultDto;

import java.util.ArrayList;
import java.util.List;

public class ResultsAdapter extends RecyclerView.Adapter<ResultsAdapter.ViewHolder>
{
    private final List<ElectionResultDto> results = new ArrayList<>();

    public void setResults(List<ElectionResultDto> data)
    {
        results.clear();
        if (data != null) results.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_result, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position)
    {
        holder.bind(results.get(position));
    }

    @Override
    public int getItemCount()
    {
        return results.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder
    {
        private final TextView tvTitle;
        private final TextView tvSummary;
        private final TextView tvCandidates;

        ViewHolder(@NonNull View itemView)
        {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvSummary = itemView.findViewById(R.id.tvSummary);
            tvCandidates = itemView.findViewById(R.id.tvCandidates);
        }

        void bind(ElectionResultDto result)
        {
            tvTitle.setText(nonEmpty(result.electionTitle, "Election results"));
            tvSummary.setText(
                    (result.published ? "Published" : "Not published") + "\n"
                            + result.talliedBallots + " of " + result.totalVotes + " ballots tallied\n"
                            + result.registeredVoters + " registered voters\n"
                            + "Turnout " + String.format("%.1f%%", result.turnoutPercentage)
            );
            tvCandidates.setText(formatCandidates(result.candidates));
        }

        private static String formatCandidates(List<ElectionResultCandidateDto> candidates)
        {
            if (candidates == null || candidates.isEmpty())
            {
                return "No candidate results yet";
            }

            StringBuilder builder = new StringBuilder();
            for (ElectionResultCandidateDto candidate : candidates)
            {
                if (builder.length() > 0) builder.append('\n');
                builder.append(nonEmpty(candidate.fullName, "Candidate"))
                        .append(" - ")
                        .append(candidate.votes)
                        .append(" votes (")
                        .append(String.format("%.1f%%", candidate.percentage))
                        .append(')');
                if (candidate.partyName != null && !candidate.partyName.trim().isEmpty())
                {
                    builder.append(" / ").append(candidate.partyName);
                }
            }
            return builder.toString();
        }

        private static String nonEmpty(String value, String fallback)
        {
            return value == null || value.trim().isEmpty() ? fallback : value;
        }
    }
}

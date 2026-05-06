package com.privote.mobile.ui.parties;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.privote.mobile.R;
import com.privote.mobile.network.dto.PartyDto;

import java.util.ArrayList;
import java.util.List;

public class PartyAdapter extends RecyclerView.Adapter<PartyAdapter.ViewHolder>
{
    private final List<PartyDto> parties = new ArrayList<>();

    @SuppressLint("NotifyDataSetChanged")
    public void setParties(List<PartyDto> data)
    {
        parties.clear();
        if (data != null) parties.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_party, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position)
    {
        holder.bind(parties.get(position));
    }

    @Override
    public int getItemCount()
    {
        return parties.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder
    {
        private final TextView tvName;
        private final TextView tvAbbreviation;
        private final TextView tvDescription;

        ViewHolder(@NonNull View itemView)
        {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvName);
            tvAbbreviation = itemView.findViewById(R.id.tvAbbreviation);
            tvDescription = itemView.findViewById(R.id.tvDescription);
        }

        void bind(PartyDto party)
        {
            tvName.setText(nonEmpty(party.name, "Unnamed party"));
            tvAbbreviation.setText(nonEmpty(party.abbreviation, "PARTY"));
            tvDescription.setText(nonEmpty(party.description, "No description"));
        }

        private static String nonEmpty(String value, String fallback)
        {
            return value == null || value.trim().isEmpty() ? fallback : value;
        }
    }
}

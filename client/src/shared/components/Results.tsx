import React from "react";
import { useTranslation } from "react-i18next";

import "../styles/Dashboard.css";

const Results: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Results</h2>
        <p className="dashboard-subtitle">Published election results will appear here.</p>

        <div className="dashboard-status" style={{ paddingTop: 0 }}>
          {/* placeholder */}
          <div style={{ color: "#6b7280" }}>{t("app.loading")}</div>
        </div>
      </div>
    </div>
  );
};

export default Results;

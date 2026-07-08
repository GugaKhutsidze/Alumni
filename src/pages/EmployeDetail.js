import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EmployDetail.css";
import { useTranslation } from "react-i18next";

const API_BASE_URL =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api";


function EmployDetail() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const token = localStorage.getItem("token");

  const { t } = useTranslation();


  const fetchJobData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };


      const jobRes = await axios.get(
        `${API_BASE_URL}/jobs/${id}`,
        config
      );


      if (jobRes.data) {
        setJob(jobRes.data);
      }


    } catch (e) {
      console.error("Fetch job error:", e);

    } finally {
      setLoading(false);
    }

  }, [id, token]);



  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);



  if (loading || !job) {
    return (
      <div className="page-loading">
        <span className="spinner"></span>
      </div>
    );
  }



  return (
    <div className="employ-detail">

      <div className="employ-main-content">


        <div className="employ-info-body">

          <h1>
            {job.title}
          </h1>


          <div className="employ-meta">


            <p>
              <strong>
                {t("Description")}:
              </strong>{" "}
              {job.description}
            </p>


            <p>
              <strong>
                {t("Salary")}:
              </strong>{" "}
              {job.salary}
            </p>


            <p>
              <strong>
                {t("Start Date")}:
              </strong>{" "}
              {job.startDate
                ? new Date(job.startDate).toLocaleDateString("ka-GE")
                : ""}
            </p>


            <p>
              <strong>
                {t("End Date")}:
              </strong>{" "}
              {job.endDate
                ? new Date(job.endDate).toLocaleDateString("ka-GE")
                : ""}
            </p>


          </div>


        </div>


      </div>


    </div>
  );
}


export default EmployDetail;
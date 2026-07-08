import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./Alumni.css";

function Alumni() {
  const { t } = useTranslation();

  const [alumniList, setAlumniList] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("firstName");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(
          "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/alumni",
          {
            headers: {
              accept: "*/*",
            },
          }
        );

        setAlumniList(response.data);
        setFilteredAlumni(response.data);
      } catch (err) {
        console.error("Error fetching alumni:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  useEffect(() => {
    let result = [...alumniList];

    if (search.trim()) {
      result = result.filter((person) =>
        `${person.studentFirstName} ${person.studentLastName} ${person.email} ${person.phoneNumber}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortType === "firstName") {
        return a.studentFirstName.localeCompare(b.studentFirstName);
      }

      if (sortType === "lastName") {
        return a.studentLastName.localeCompare(b.studentLastName);
      }

      return 0;
    });

    setFilteredAlumni(result);
  }, [search, sortType, alumniList]);

  if (loading) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div className="alumni-page">
      <div className="alumni-header">
        <h1>{t("Alumni List")}</h1>

        <div className="alumni-controls">
          <input
            type="text"
            placeholder={t("Search alumni...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="firstName">
              {t("Sort by First Name")}
            </option>

            <option value="lastName">
              {t("Sort by Last Name")}
            </option>
          </select>
        </div>
      </div>

      <table className="alumni-table">
        <thead>
          <tr>
            <th>{t("First Name")}</th>
            <th>{t("Last Name")}</th>
            <th>{t("Email")}</th>
            <th>{t("Phone Number")}</th>
          </tr>
        </thead>

        <tbody>
          {filteredAlumni.map((person) => (
            <tr key={person.studentId}>
              <td>{person.studentFirstName}</td>
              <td>{person.studentLastName}</td>
              <td>{person.email}</td>
              <td>{person.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Alumni;
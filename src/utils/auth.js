import { jwtDecode } from "jwt-decode";

export function getUserRole() {
  const token = localStorage.getItem("token");

  if (!token) return "";

  try {
    const decoded = jwtDecode(token);

    console.log("JWT DATA:", decoded);

    const role =
      decoded.role ||
      decoded.Role ||
      decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ||
      "";

    console.log("ROLE:", role);

    return String(role).trim();

  } catch (error) {
    console.log(error);
    return "";
  }
}
import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      console.log({
        name,
        email,
        password,
        role,
      });
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      toast.success("Registered successfully");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data);

      toast.success("Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <input
        className="border p-2 m-2"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 m-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 m-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="border p-2 m-2"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="candidate">Candidate</option>
        <option value="recruiter">Recruiter</option>
      </select>

      <button
        className="bg-green-500 text-white px-4 py-2 mt-3"
        onClick={handleRegister}
      >
        Register
      </button>
      <p className="mt-4">
        Already have an account?{" "}
        <a href="/" className="text-blue-500">
          Login
        </a>
      </p>
    </div>
  );
}

export default Register;

// import { useState } from "react";
// import { register } from "../services/api";
// import "../styles/auth.css";

// function Register({ onNavigate }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setError("");
//     setSuccess("");

//     try {
//       await register({ username, password });
//       setSuccess("Registration successful. Redirecting to login...");
//       setUsername("");
//       setPassword("");

//       setTimeout(() => {
//         onNavigate("login");
//       }, 1000);
//     } catch (apiError) {
//       setError(
//         apiError.response?.data?.detail ||
//           "Unable to register. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="auth">
//       <div className="auth__panel">
//         <h1>Create Account</h1>

//         <form className="auth__form" onSubmit={handleSubmit}>
//           <label>
//             Username
//             <input
//               type="text"
//               value={username}
//               onChange={(event) => setUsername(event.target.value)}
//               required
//             />
//           </label>

//           <label>
//             Password
//             <input
//               type="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               required
//             />
//           </label>

//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Creating..." : "Register"}
//           </button>
//         </form>

//         {success && <p className="auth__success">{success}</p>}
//         {error && <p className="auth__error">{error}</p>}
//       </div>
//     </section>
//   );
// }

// export default Register;

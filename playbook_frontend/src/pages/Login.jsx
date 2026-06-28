// import { useState } from "react";
// import { login } from "../services/api";
// import "../styles/auth.css";

// function Login({ onNavigate }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setError("");

//     try {
//       await login({ username, password });
//       localStorage.setItem("user", JSON.stringify({ username }));
//       onNavigate("generator");
//     } catch (apiError) {
//       setError(
//         apiError.response?.data?.detail ||
//           "Unable to log in. Please check your credentials."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="auth">
//       <div className="auth__panel">
//         <h1>Login</h1>

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
//             {isSubmitting ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {error && <p className="auth__error">{error}</p>}
//       </div>
//     </section>
//   );
// }

// export default Login;

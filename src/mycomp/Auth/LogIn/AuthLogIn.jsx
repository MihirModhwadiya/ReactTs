import "./AuthLogIn.css";
import { auth } from "../../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Authcomp = () => {
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const logg = await signInWithEmailAndPassword(auth, email, password);
      alert("Sign in successful " + logg.user.email);
      navigate("/Body");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          alert("Invalid e-mail address format.");
          break;
        case "auth/too-many-requests":
          alert("Too many request. Try again in a minute.");
          break;
        case "auth/wrong-password":
          alert("Enter correct password.");
          break;
        default:
          alert("Check your internet connection.");
          break;
      }
    }
  };

  return (
    <div className="">
      <div className="widthh position-absolute top-50 start-50 translate-middle blurr">
        <form
          onSubmit={signIn}
          className="padd container border bgg border-light rounded-5 shadow-lg p-5"
          >
          <h1 className="text-center pb-3 text-light">Sign-In</h1>
          <input
            required
            className="form-control my-3 shadow-none"
            type="email"
            placeholder="Email"
          />

          <input
            required
            className="form-control my-3 shadow-none"
            type="password"
            placeholder="Password"
          />
          <div className="text-center d-flex justify-content-center">
            {/* <button onClick={signUp} className="btn btn-primary">
              Sign up
            </button> */}
            <button type="submit" className="btn btn-light">
              Sign In
            </button>
          </div>
          <div className="text-center d-flex justify-content-center">
            <p>
              Create Account?
              <Link to="/Authcomp" className="text-light">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Authcomp;

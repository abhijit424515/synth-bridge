import React from "react";
import { useReducer, useState } from "react";
import toast from "react-hot-toast";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

// login and signup page
export default function LoginSignup() {
  function reducer(state, action) {
    if (["email", "password"].includes(action.type)) {
      return {
        ...state,
        [action.type]: action.value,
      };
    }
  }

  // const [state, dispatch] = useReducer(reducer, { email: "", password: "" });
  const [isLogin, setLogin] = useState(true);

  async function submit(e) {
    e.preventDefault();
    toast.success("Submitted");
  }

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Pattern"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        {isLogin ? (
          <Login updateLogin={() => setLogin(!isLogin)} />
        ) : (
          <SignUp updateLogin={() => setLogin(!isLogin)} />
        )}
        {/* {
					!isLogin ?
						<div>
							<p className="mt-4 text-sm text-gray-500 sm:mt-0">
								Already have an account?
								<a href="#" className="text-gray-700 underline" onClick={() => setLogin(!isLogin)}>Log in</a>.
							</p>
						</div> :
						<div>
							<p className="mt-4 text-sm text-gray-500 sm:mt-0">
								New User?
								<a href="#" className="text-gray-700 underline" onClick={() => setLogin(!isLogin)}>Sign Up</a>.
							</p>
						</div>

				} */}
      </div>
    </section>
  );
}

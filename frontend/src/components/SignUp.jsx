import React from "react";
import GoogleButton from "./GoogleButton";

export default function SignUp({ updateLogin }) {
  return (
    <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 mx-auto">
      <div className="max-w-xl lg:max-w-xl">
        <a className="block text-blue-600" href="/">
          <span className="sr-only">Home</span>
          <img
            className="w-50 h-10"
            src="https://trumio.ai/wp-content/uploads/2021/11/Horizontal-layout-400-x-100-pixels-1.png"
            alt=""
          />
        </a>

        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Welcome to Trumio.AI
        </h1>

        <p className="mt-4 leading-relaxed text-gray-500">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam
          dolorum aliquam, quibusdam aperiam voluptatum.
        </p>

        <form action="#" className="mt-8 grid grid-cols-6 gap-6">
          <div className="col-span-6">
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              type="email"
              id="Email"
              name="email"
              className="mt-1 w-full h-10 pl-3 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="Password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              type="password"
              id="Password"
              name="password"
              className="mt-1 w-full h-10 pl-3 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="PasswordConfirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Password Confirmation
            </label>

            <input
              type="password"
              id="PasswordConfirmation"
              name="password_confirmation"
              className="mt-1 w-full h-10 pl-3 rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="MarketingAccept" className="flex gap-4">
              <input
                type="checkbox"
                id="MarketingAccept"
                name="marketing_accept"
                className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
              />

              <span className="text-sm text-gray-700">
                I want to receive emails about events, product updates and
                company announcements.
              </span>
            </label>
          </div>

          <div className="col-span-6">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our
              <a href="#" className="text-gray-700 underline">
                terms and conditions
              </a>
              and
              <a href="#" className="text-gray-700 underline">
                privacy policy
              </a>
              .
            </p>
          </div>

          <div className="col-span-6 sm:flex sm:flex-col sm:items-left sm:gap-4 flex-col">
            <a href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A5050%2Fapi%2Fauth%2Fgoogle&client_id=569520056942-g22s3ph519utfktvk3v46l71hvvgaato.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email">
              <GoogleButton />
            </a>
            <button className="mt-3 inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
              Create an account
            </button>

            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              Already have an account?
              <a
                href="#"
                className="text-gray-700 underline"
                onClick={updateLogin}
              >
                Log in
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

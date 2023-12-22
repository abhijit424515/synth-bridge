import React from "react";
/*
 * Renders a highlighted component with a link.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the component.
 * @param {string} props.href - The URL for the link.
 * @param {string} props.highType - The type of highlight.
 * @returns {React.ReactNode} The rendered highlighted component.
 */
const Highlighted = ({ children, href }) => {
  return (
    <span className="relative group z-10">
      <a href={href} target="_blank">
        <span className="transition-transform invisible group-hover:visible translate-x-2 group-hover:-translate-y-6 rounded-t-lg rounded-r-lg absolute bg-gray-100 text-sm px-2 z-10">
          <span>
            <img
              className="float-left p-1"
              src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${href}`}
            />
            <p className="line-clamp-1">{href}</p>
          </span>
        </span>
        <span className="px-3 rounded-lg bg-slate-300 hover:bg-emerald-300 z-20">
          {children}
        </span>
      </a>
    </span>
  );
};

export default Highlighted;

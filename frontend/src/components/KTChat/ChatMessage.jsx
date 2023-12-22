import React from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import Highlighted from "./Highlighted";

/*
 * ChatMessage component renders a chat message.
 * @param {Object} message - The message object.
 * @returns {JSX.Element} - The rendered chat message.
 */
export default function ChatMessage({ message }) {
  const isUserMessage = message.type === "human";

  return (
    <div
      className={`mt-4 p-2 rounded-t-lg ${
        message.type === "human"
          ? "bg-[#85bded] rounded-bl-lg"
          : "bg-slate-200 rounded-br-lg"
      }`}
    >
      {isUserMessage ? (
        <p>{message.content}</p>
      ) : (
        <Markdown
          children={message.content}
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="span"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
            a(props) {
              const { children, className, href, node, ...rest } = props;
              return href ? (
                <Highlighted
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  href={href}
                />
              ) : (
                <a {...rest} href={href} className={className} target="_black">
                  {children}
                </a>
              );
            },
          }}
        />
      )}
    </div>
  );
}

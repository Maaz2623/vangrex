import Link from "next/link";
import React from "react";

const AuthErrorPage = () => {
  return (
    <div>
      Something went wrong. Return to{" "}
      <Link href={`/`} className="underline">
        Vangrex
      </Link>
    </div>
  );
};

export default AuthErrorPage;

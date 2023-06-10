import type { NextPage } from "next";

import Image from "next/image";

import styles from "./login.module.scss";

import { useRouter } from "next/router";

import logo from "../assets/images/logo/logo.png";
import { FormEvent } from "react";

const Login: NextPage = () => {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("menu");
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src={logo} width={700} alt="Picture of the author" />
      </div>

      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <span>Log in to your account</span>
          <input type="text" placeholder="User" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

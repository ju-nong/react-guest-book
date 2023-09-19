import React from "react";
import styled from "@emotion/styled";
import { authService } from "../firebase";
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
} from "firebase/auth";

const AccountModalStyled = styled.div`
    position: relative;
    border-radius: 0.5rem;
    box-shadow: 0 0 4px 0 rgba(17, 22, 26, 0.16),
        0 2px 4px 0 rgba(17, 22, 26, 0.08), 0 4px 8px 0 rgba(17, 22, 26, 0.08);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 400px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;

    @media screen and (max-width: 466px) {
        padding: 2rem 1rem;
    }
`;

const TitleStyled = styled.h1`
    text-align: center;

    @media screen and (max-width: 466px) {
        font-size: 6.5vw;
    }
`;

const DescriptionStyled = styled.p`
    text-align: center;

    @media screen and (max-width: 466px) {
        font-size: 3vw;
    }
`;

const ButtonContainerStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    row-gap: 1rem;
    padding-top: 2rem;

    > button {
        box-shadow: 0 0 8px 0 rgba(17, 22, 26, 0.16),
            0 4px 8px 0 rgba(17, 22, 26, 0.08),
            0 8px 16px 0 rgba(17, 22, 26, 0.08);
        cursor: pointer;
        font-family: Roboto;
        width: 240px;
        height: 50px;
        display: flex;
        column-gap: 4px;
        align-items: center;
        justify-content: center;
        padding: 6px 24px;
        font-size: 1rem;
        color: rgba(75, 85, 99);

        > img {
            height: 100%;
        }
    }

    @media screen and (max-width: 400px) {
        > button {
            font-size: 4vw;
        }
    }
`;

const GoogleAccountButtonStyled = styled.button`
    background-color: #fff;
`;

const GithubAccountButtonStyled = styled.button`
    background-color: #fff;
`;

function AccountModal() {
    async function handleAccountClick(social: "google" | "github") {
        let provider = null;

        if (social === "google") {
            provider = new GoogleAuthProvider();
        } else {
            provider = new GithubAuthProvider();
        }

        await signInWithPopup(authService, provider);
    }

    return (
        <AccountModalStyled>
            <TitleStyled>react-guest-book</TitleStyled>
            <DescriptionStyled>
                방명록을 사용하시려면 로그인을 해주세요.
            </DescriptionStyled>
            <ButtonContainerStyled>
                <GoogleAccountButtonStyled
                    onClick={() => handleAccountClick("google")}
                >
                    <img src="/images/google-logo.png" alt="Google Logo" />
                    Sign in with Google
                </GoogleAccountButtonStyled>
                <GithubAccountButtonStyled
                    onClick={() => handleAccountClick("github")}
                >
                    <img src="/images/github-logo.png" alt="Github Logo" />
                    Sign in with Github
                </GithubAccountButtonStyled>
            </ButtonContainerStyled>
        </AccountModalStyled>
    );
}

export { AccountModal };

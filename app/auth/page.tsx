"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { GetSaltRequest, LoginResponse, UserKeyData, ZKPPayload, ZKPRequest } from "../types/zklogin";
import { jwtToAddress } from '@mysten/sui/zklogin';
import axios from "axios";
import { toBigIntBE } from "bigint-buffer";
import { fromB64 } from "@mysten/bcs";
import { useSui } from "../hooks/useSui";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Blocks } from 'react-loader-spinner';

export default function AuthPage() {
    const [error, setError] = useState<string | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [jwtEncoded, setJwtEncoded] = useState<string | null>(null);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [subjectID, setSubjectID] = useState<string | null>(null);
    const [zkProof, setZkProof] = useState<any | null>(null);
    const [userSalt, setUserSalt] = useState<string | null>(null);
    const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

    const { suiClient } = useSui();

    async function getSalt(subject: string, jwtEncoded: string) {
        const getSaltRequest: GetSaltRequest = {
            subject: subject,
            jwt: jwtEncoded!
        }
        console.log("Getting salt...");
        console.log("Subject = ", subject);
        console.log("jwt = ", jwtEncoded);
        const response = await axios.post('/api/userinfo/get/salt', getSaltRequest);
        console.log("getSalt response = ", response);
        if (response?.data.status == 200) {
            const userSalt = response.data.salt;
            console.log("Salt fetched! Salt = ", userSalt);
            return userSalt;
        } else {
            console.log("Error Getting SALT");
            return null;
        }
    }

    function printUsefulInfo(decodedJwt: LoginResponse, userKeyData: UserKeyData) {
        console.log("iat  = " + decodedJwt.iat);
        console.log("iss  = " + decodedJwt.iss);
        console.log("sub = " + decodedJwt.sub);
        console.log("aud = " + decodedJwt.aud);
        console.log("exp = " + decodedJwt.exp);
        console.log("nonce = " + decodedJwt.nonce);
        console.log("ephemeralPublicKey b64 =", userKeyData.ephemeralPublicKey);
    }

    async function getZkProof(forceUpdate = false) {
        setError(null);
        setTransactionInProgress(true);
        const decodedJwt: LoginResponse = jwt_decode(jwtEncoded!) as LoginResponse;
        const { userKeyData, ephemeralKeyPair } = getEphemeralKeyPair();

        printUsefulInfo(decodedJwt, userKeyData);

        const ephemeralPublicKeyArray: Uint8Array = fromB64(userKeyData.ephemeralPublicKey);

        const zkpPayload: ZKPPayload = {
            jwt: jwtEncoded!,
            extendedEphemeralPublicKey: toBigIntBE(
                Buffer.from(ephemeralPublicKeyArray),
            ).toString(),
            jwtRandomness: userKeyData.randomness,
            maxEpoch: userKeyData.maxEpoch,
            salt: userSalt!,
            keyClaimName: "sub"
        };

        const ZKPRequest: ZKPRequest = {
            zkpPayload,
            forceUpdate
        }
        console.log("about to post zkpPayload = ", ZKPRequest);
        setPublicKey(zkpPayload.extendedEphemeralPublicKey);

        // Invoking our custom backend to delegate Proof Request to Mysten backend.
        // Delegation was done to avoid CORS errors.
        const proofResponse = await axios.post('/api/zkp/get', ZKPRequest);

        if (!proofResponse?.data?.zkp) {
            createRuntimeError("Error getting Zero Knowledge Proof. Please check that Prover Service is running.");
            return;
        }
        console.log("zkp response = ", proofResponse.data.zkp);

        setZkProof(proofResponse.data.zkp);
        setTransactionInProgress(false);
    }

    function getEphemeralKeyPair() {
        const userKeyData: UserKeyData = JSON.parse(localStorage.getItem("userKeyData")!);
        // 使用 fromSecretKey 方法从 base64 私钥重建密钥对
        const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(userKeyData.ephemeralPrivateKey!);
        return { userKeyData, ephemeralKeyPair };
    }

    async function loadRequiredData(encodedJwt: string) {
        // Decoding JWT to get useful Info
        const decodedJwt: LoginResponse = await jwt_decode(encodedJwt!) as LoginResponse;

        setSubjectID(decodedJwt.sub);
        // Getting Salt
        const userSalt = await getSalt(decodedJwt.sub, encodedJwt);
        if (!userSalt) {
            createRuntimeError("Error getting userSalt");
            return;
        }

        // Generating User Address
        const address = jwtToAddress(encodedJwt!, BigInt(userSalt!));

        setUserAddress(address);
        setUserSalt(userSalt!);

        console.log("All required data loaded. ZK Address =", address);
        console.log("ZK Login Authentication Successful!");
        // toast.success("ZK Login Authentication Successful!", { duration: 4000 });
    }

    useLayoutEffect(() => {
        setError(null);
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const jwt_token_encoded = hash.get("id_token");

        const userKeyData: UserKeyData = JSON.parse(localStorage.getItem("userKeyData")!);

        if (!jwt_token_encoded) {
            createRuntimeError("Could not retrieve a valid JWT Token!")
            return;
        }

        if (!userKeyData) {
            createRuntimeError("user Data is null");
            return;
        }

        setJwtEncoded(jwt_token_encoded);
        loadRequiredData(jwt_token_encoded);
    }, []);

    useEffect(() => {
        if (jwtEncoded && userSalt) {
            console.log("jwtEncoded is defined. Getting ZK Proof...");
            getZkProof();
        }
    }, [jwtEncoded, userSalt]);

    function createRuntimeError(message: string) {
        setError(message);
        console.log(message);
        setTransactionInProgress(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AC</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">AI Carbon Wallet</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                ✓ Authenticated
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Success Banner */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Authentication Successful!
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    Your Web3 identity has been verified using zero-knowledge proof technology
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Information Cards */}
                <div className="grid gap-6 mb-8">
                    {userAddress && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    </div>
                                    Your Sui Blockchain Address
                                </h4>
                                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    TESTNET
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <code className="text-sm font-mono text-gray-800 break-all">
                                    {userAddress}
                                </code>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => {
                                    navigator.clipboard.writeText(userAddress!)
                                    alert("Address copied to clipboard!");
                                }}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                                Copy Address
                            </button>
                        </div>
                    )}

                    {/* Technical Details */}
                    {userSalt && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                </div>
                                Authentication Details
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">User Salt</label>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <code className="text-xs font-mono text-gray-600 break-all">{userSalt}</code>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject ID</label>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <code className="text-xs font-mono text-gray-600 break-all">{subjectID}</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Zero Knowledge Proof */}
                    {zkProof && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    Zero Knowledge Proof
                                </h4>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                    onClick={() => getZkProof(true)}
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Regenerate
                                </button>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Proof Point A</label>
                                <code className="text-xs font-mono text-gray-600 break-all">
                                    {zkProof?.proofPoints?.a.toString().slice(0, 80)}...
                                </code>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {transactionInProgress && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Blocks
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="blocks-loading"
                            wrapperStyle={{}}
                            wrapperClass="blocks-wrapper"
                        />
                        <p className="mt-4 text-gray-600">Generating zero knowledge proof...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {zkProof && userAddress && !transactionInProgress && !error && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                🎉 Welcome to AI Carbon Wallet!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your zero-knowledge authentication is complete. You can now securely access Web3 services.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0H8v0z"></path>
                                    </svg>
                                    Explore Wallet
                                </button>
                                <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                    View Documentation
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-5 blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-green-400 to-blue-400 rounded-full opacity-5 blur-3xl"></div>
            </div>
        </div>
    );
}

"use client";

import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { useSui } from "./hooks/useSui";
import { useLayoutEffect, useState } from "react";
import { UserKeyData } from "./types/zklogin";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Keypair, PublicKey } from "@mysten/sui/cryptography";

export default function Home() {
    const { suiClient } = useSui();
    const [loginUrl, setLoginUrl] = useState<string | null>();

    async function prepareLogin() {
        const { epoch, epochDurationMs, epochStartTimestampMs } = await suiClient.getLatestSuiSystemState();

        const maxEpoch = parseInt(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
        const ephemeralKeyPair: Keypair = new Ed25519Keypair();
        // 在新版本中，getSecretKey() 直接返回 base64 字符串
        const ephemeralPrivateKeyB64 = ephemeralKeyPair.getSecretKey();

        const ephemeralPublicKey: PublicKey = ephemeralKeyPair.getPublicKey()
        const ephemeralPublicKeyB64 = ephemeralPublicKey.toBase64();

        const jwt_randomness = generateRandomness();
        const nonce = generateNonce(ephemeralPublicKey, maxEpoch, jwt_randomness);

        console.log("current epoch = " + epoch);
        console.log("maxEpoch = " + maxEpoch);
        console.log("jwt_randomness = " + jwt_randomness);
        console.log("ephemeral public key = " + ephemeralPublicKeyB64);
        console.log("nonce = " + nonce);

        const userKeyData: UserKeyData = {
            randomness: jwt_randomness.toString(),
            nonce: nonce,
            ephemeralPublicKey: ephemeralPublicKeyB64,
            ephemeralPrivateKey: ephemeralPrivateKeyB64,
            maxEpoch: maxEpoch
        }
        localStorage.setItem("userKeyData", JSON.stringify(userKeyData));
        return userKeyData
    }

    function getRedirectUri() {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const customRedirectUri = protocol + "//" + host + "/auth";
        console.log("customRedirectUri = " + customRedirectUri);
        return customRedirectUri;
    }

    useLayoutEffect(() => {
        prepareLogin().then((userKeyData) => {
            const REDIRECT_URI = 'https://zklogin-dev-redirect.vercel.app/api/auth';
            const customRedirectUri = getRedirectUri();
            const params = new URLSearchParams({
                // When using the provided test client ID + redirect site, the redirect_uri needs to be provided in the state.
                state: new URLSearchParams({
                    redirect_uri: customRedirectUri
                }).toString(),
                // Your Google OAuth Client ID (set in .env.development.local):
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '595966210064-3nnnqvmaelqnqsmq448kv05po362smt2.apps.googleusercontent.com',
                redirect_uri: REDIRECT_URI,
                response_type: 'id_token',
                scope: 'openid',
                nonce: userKeyData.nonce,
            });

            setLoginUrl(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <header className="relative z-10 px-6 py-4">
                <nav className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AC</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">AI Carbon Wallet</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a>
                            <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors">Docs</a>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center justify-center px-6 py-12 min-h-[80vh]">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <div className="mb-6">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                            🔐 Zero Knowledge Authentication
                        </div>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Secure 
                        <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Web3 </span>
                        Authentication
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Experience the future of digital identity with zkLogin technology. 
                        Authenticate securely using your Google account while preserving your privacy on the Sui blockchain.
                    </p>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Zero Knowledge</h3>
                            <p className="text-sm text-gray-600">Your identity remains private while proving authenticity</p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                            <p className="text-sm text-gray-600">Instant authentication powered by Sui blockchain</p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Secure by Design</h3>
                            <p className="text-sm text-gray-600">Built on proven cryptographic foundations</p>
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className="flex flex-col items-center space-y-4">
                        <a href={loginUrl!}
                           className="group relative inline-flex items-center justify-center"
                           target="_blank">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                            <button
                                className="relative bg-white text-gray-900 font-semibold py-4 px-8 rounded-xl flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:border-transparent">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24"
                                     viewBox="0 0 48 48">
                                    <path fill="#FFC107"
                                          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                    <path fill="#FF3D00"
                                          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                    <path fill="#4CAF50"
                                          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                    <path fill="#1976D2"
                                          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                </svg>
                                <span className="text-lg">Continue with Google</span>
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </button>
                        </a>
                        
                        <p className="text-sm text-gray-500 max-w-md">
                            By continuing, you agree to our Terms of Service and Privacy Policy. 
                            Your data is protected by zero-knowledge cryptography.
                        </p>
                    </div>
                </div>
            </main>

            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400 to-blue-400 rounded-full opacity-10 blur-3xl"></div>
            </div>
        </div>
    );
}

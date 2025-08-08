"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { GetSaltRequest, LoginResponse, UserKeyData, ZKPRequest } from "~~/types/zklogin";
import { jwtToAddress } from '@mysten/sui/zklogin';
import axios from "axios";
import { toBigIntBE } from "bigint-buffer";
import { fromB64 } from "@mysten/bcs";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { useAuth } from "~~/context/AuthContext";

export default function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [step, setStep] = useState<string>("Parsing authentication response...");
  
  // 使用 useRef 防止重复执行
  const isProcessingRef = useRef(false);
  
  const { login, suiClient } = useAuth();
  const router = useRouter();

  async function getSalt(subject: string, jwtEncoded: string) {
    try {
      const getSaltRequest: GetSaltRequest = {
        subject: subject,
        jwt: jwtEncoded
      };
      
      const response = await axios.post('/api/userinfo/get/salt', getSaltRequest);
      
      if (response?.data.status === 200) {
        return response.data.salt;
      } else {
        throw new Error('Failed to get salt from server');
      }
    } catch (error) {
      console.error("Error getting salt:", error);
      throw error;
    }
  }

  async function getZKProof(zkpRequestPayload: ZKPRequest) {
    try {
      // 检查本地存储是否已有相同请求的缓存
      const cacheKey = `zkproof_${zkpRequestPayload.jwt.slice(-10)}_${zkpRequestPayload.jwtRandomness}`;
      const cachedProof = localStorage.getItem(cacheKey);
      
      if (cachedProof) {
        console.log("Using cached ZK proof from localStorage");
        return JSON.parse(cachedProof);
      }
      
      const response = await axios.post('/api/zkp/get', zkpRequestPayload);
      
      if (response?.data) {
        // 缓存成功的响应
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error('Failed to get ZK proof from server');
      }
    } catch (error) {
      console.error("Error getting ZK proof:", error);
      throw error;
    }
  }

  useEffect(() => {
    async function handleAuthCallback() {
      // 如果已经在处理，直接返回
      if (isProcessingRef.current) {
        console.log("Already processing authentication, skipping...");
        return;
      }
      
      try {
        isProcessingRef.current = true;
        setIsProcessing(true);
        
        // Get the JWT from URL hash
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const jwtEncoded = params.get('id_token');

        if (!jwtEncoded) {
          throw new Error('No JWT token found in callback');
        }

        setStep("Decoding JWT token...");
        const decodedJwt: LoginResponse = jwtDecode(jwtEncoded);
        
        // Get user key data from localStorage
        const userKeyDataString = localStorage.getItem("userKeyData");
        if (!userKeyDataString) {
          throw new Error('No user key data found. Please restart the login process.');
        }

        const userKeyData: UserKeyData = JSON.parse(userKeyDataString);

        setStep("Getting user salt...");
        const userSalt = await getSalt(decodedJwt.sub, jwtEncoded);

        setStep("Calculating user address...");
        const userAddress = jwtToAddress(jwtEncoded, userSalt);

        setStep("Generating zero-knowledge proof...");
        // Prepare ZK proof request
        // 使用存储的公钥，而不是重新生成
        const extendedEphemeralPublicKey = userKeyData.ephemeralPublicKey;

        const zkpRequestPayload: ZKPRequest = {
          jwt: jwtEncoded,
          extendedEphemeralPublicKey: extendedEphemeralPublicKey,
          maxEpoch: userKeyData.maxEpoch.toString(),
          jwtRandomness: userKeyData.randomness,
          salt: userSalt.toString(),
          keyClaimName: "sub"
        };

        // 转换为证明服务期望的格式
        const proverPayload = {
          jwt: jwtEncoded,
          extendedEphemeralPublicKey: extendedEphemeralPublicKey,
          maxEpoch: userKeyData.maxEpoch.toString(),
          jwtRandomness: userKeyData.randomness,
          salt: userSalt.toString(),
          keyClaimName: "sub",
          nonce: userKeyData.nonce // Add the nonce that was used in OAuth
        };

        console.log("ZK Proof Request Payload:", proverPayload);
        const zkProof = await getZKProof(proverPayload);

        setStep("Completing authentication...");
        // Store authentication data
        login(userKeyData, userAddress);
        
        // Store additional auth info
        localStorage.setItem('zkProof', JSON.stringify(zkProof));
        localStorage.setItem('userSalt', userSalt.toString());
        localStorage.setItem('jwtToken', jwtEncoded);

        setStep("Redirecting to dashboard...");
        // Small delay to show success message
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);

      } catch (error) {
        console.error('Authentication error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setIsProcessing(false);
        isProcessingRef.current = false;
      }
    }

    // 只有当JWT存在时才执行，使用ref防止重复执行
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const jwtToken = params.get('id_token');
    
    if (jwtToken && !isProcessingRef.current) {
      handleAuthCallback();
    }
  }, []); // 空依赖数组确保只在组件挂载时执行一次

  const handleRetry = () => {
    // Clear any stored data and redirect to home
    localStorage.clear();
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="loading loading-spinner loading-md text-blue-600"></div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Authenticating</h2>
        <p className="text-gray-600 mb-6">{step}</p>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">JWT token received</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${step.includes('salt') || step.includes('address') || step.includes('proof') || step.includes('Completing') || step.includes('Redirecting') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm text-gray-600">Validating identity</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${step.includes('proof') || step.includes('Completing') || step.includes('Redirecting') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm text-gray-600">Generating proof</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${step.includes('Redirecting') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm text-gray-600">Completing setup</span>
          </div>
        </div>
      </div>
    </div>
  );
}

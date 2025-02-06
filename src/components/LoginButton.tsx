"use client"; // ← これを追加

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

export default function LoginButton() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  return (
    <Flex height="100vh" align="center" justify="center">
      {account && (
        <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Text>Connected Account:</Text>
        <Text>{account}</Text>
      </Box>
      )}
      {!account && (
        <Button colorScheme="blue" size="lg" onClick={connectWallet}>
          Connect wallet
        </Button>
      )}
    </Flex>
  );
}

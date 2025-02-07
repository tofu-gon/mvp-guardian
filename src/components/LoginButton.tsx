"use client";

import { Box, Button, Card, CardBody, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

interface NewsItem {
  id: number;
  type: "twitter" | "discord";
  content: string;
  project: string;
  author: string;
  timestamp: string;
}

export default function LoginButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [projects, setProjects] = useState<string[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // setAccount(accounts[0]);
        setAccount('0xccB82218c6F82a2B750Cf0D65e21AE6eAE14070c')
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  useEffect(() => {
    if(!account) return;

    const fetchProjects = async() => {
      try {
        const response = await fetch(`/api/pjlist?address=${account}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project list");
        }
        const data: {serviceList: string[]} = await response.json();
        console.log(data.serviceList)
        setProjects(data.serviceList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news`);
        if (!response.ok) throw new Error("Failed to fetch news");
        const data: NewsItem[] = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
    fetchNews()
  }, [account])

  return (<>
      {!account && (
        <Flex height="100vh" align="center" justify="start" direction="column">
          <Button colorScheme="blue" size="lg" onClick={connectWallet}>
            Connect wallet
          </Button>
        </Flex>
      )}
      {account && (
        <>
          <Flex height="100vh" align="center" justify="start" direction="column">
            <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
              <Text>Connected Account:</Text>
              <Text>{account}</Text>
            </Box>

          {/* pjのリスト */}
          <Flex wrap="wrap" justify="center" gap={4} width="100%">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <Card
                  key={index}
                  width={["100%", "45%"]} // 画面サイズによってレスポンシブ対応
                  minWidth="250px"
                  borderWidth={1}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold">
                      {project}
                    </Text>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Text>No projects found</Text>
            )}
          </Flex>
          </Flex>
        </>
      )}

    </>
    );
}

"use client";

import { Box, Button, Card, CardBody, Flex, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';

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
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  const showComingAlert = () => {
    alert("Revoke Coming soon.")
  }

  const targetPjList = ["Aave", "Uniswap", "security"];
  const isTargetPj = (pjName: string) => {
    return targetPjList.map(item => item.toLowerCase()).includes(pjName.toLowerCase());
  }

  useEffect(() => {
    if(!account) return;

    const fetchProjects = async() => {
      try {
        const response = await fetch(`/api/pjlist?address=${account}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project list");
        }
        const data = await response.json();
        const serviceList: string[] = data.serviceList
        if(serviceList.length != 0){
          serviceList.push('security')


          const sortedArray = [
            ...targetPjList.filter(item => serviceList.includes(item)), // 存在する要素だけを追加
            ...serviceList.filter(item => !targetPjList.includes(item)) // 残りの要素
          ];
          setProjects(sortedArray);
        }

      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news`);
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        const news: NewsItem[] = data.news
        setNews(news)
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
    fetchNews()
  }, [account])

  return (
    <Flex height="100vh" align="center" justify="center" p={4}>
      <Box
        maxWidth="900px"
        minHeight="100vh"
        width="100%"
        border="1px solid lightgray"
        borderRadius="lg"
        boxShadow="md"
        p={6}
        bg="white"
        margin="0 auto"
      >
        {account ? (
          <>
            <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md" textAlign="center">
              <Text fontSize="lg" fontWeight="bold">Connected Account:</Text>
              <Text fontSize="md" color="blue.500">{account}</Text>
            </Box>

            {projects.length > 0 ? (
              <Tabs variant="enclosed" mt={6}>
                {/* タブリスト（スクロール可能で、スクロール目印付き） */}
                <TabList
                  overflowX="auto"
                  maxW="100%"
                  whiteSpace="nowrap"
                  bg="gray.50"
                  borderRadius="lg"
                  p={2}
                  position="sticky"
                  top={0}
                  zIndex={1}
                  css={{
                    "&::-webkit-scrollbar": { width: "12px" }, // スクロールバーの幅を指定
                    "&::-webkit-scrollbar-track": { background: "#f1f1f1" }, // スクロールバーのトラック部分
                    "&::-webkit-scrollbar-thumb": { background: "#888" }, // スクロールバーのつまみ部分
                    "&::-webkit-scrollbar-thumb:hover": { background: "#555" } // スクロールバーのつまみ部分がホバーされた時
                  }}
                >
                  {projects.map((project, index) => (
                    <Tab key={index} flexShrink={0} px={4}>
                      {project}
                    </Tab>
                  ))}
                </TabList>

                <TabPanels maxHeight="calc(100vh - 230px)" overflowY="auto">
                  {projects.map((project, index) => (
                    <TabPanel key={index} position="relative" pt={4}>

                      {news.some(item => item.project.toLowerCase() === project.toLowerCase()) && (
                        <Button colorScheme="red" mb={4} onClick={showComingAlert}>
                          revoke!
                        </Button>
                      )}

                      <VStack spacing={4} align="stretch">
                        {news.filter(item => item.project.toLowerCase() === project.toLowerCase()).length > 0 ? (
                          news.filter(item => item.project.toLowerCase() === project.toLowerCase())
                            .map((item) => (
                              <Card key={item.id} borderWidth={1} borderRadius="lg" boxShadow="md">
                                <CardBody>
                                  <Flex align="center" gap={2}>
                                    <Icon as={item.type === "twitter" ? FaTwitter : FaDiscord} boxSize={6} />
                                    <Text fontSize="sm" color="gray.500">
                                      {new Date(item.timestamp).toLocaleString()}
                                    </Text>
                                  </Flex>
                                  <Text fontWeight="bold">{item.author}</Text>
                                  <Text mt={2}>{item.content}</Text>
                                </CardBody>
                              </Card>
                            ))
                        ) : (
                          isTargetPj(project) ? (
                            <Text>No news available.</Text>
                          ): (
                            <Text>Coming soon.</Text>
                          )
                        )}
                      </VStack>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            ) : (
              <>
                {loading ? (
                  <Text>Loading news...</Text>
                ):(
                  <Text textAlign="center" fontSize="lg" color="gray.600" mt={4}>
                    No projects found
                  </Text>
                )}
              </>
            )}
          </>
        ) : (
          <Flex justify="center">
            <Button colorScheme="blue" size="lg" onClick={connectWallet}>
              Connect wallet
            </Button>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

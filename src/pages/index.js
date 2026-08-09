import Head from "next/head";
import React, { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
// Components
import Header from "../components/landingPage/Header";
import HeroSection from "../components/landingPage/HeaderAndParagraph";
import PrevTCACRecap from "../components/landingPage/PreviousTCACRecap";
import ActivitiesSection from "../components/landingPage/ActivitiesSession";
import TCACUpdates from "../components/landingPage/TCACUpdates";
import Footer from "../components/landingPage/Footer";
import NewsModal from "@/components/landingPage/NewsModal";
import BankDetailsModal from "../components/landingPage/BankDetailsModal";

// 1. Receive the props from the server here
export default function Home({ updates, news }) {
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false);

  return (
    <>
      <Head>
        <title>TCAC &apos;25</title>
      </Head>
      <Box>
        <Header />
        <HeroSection />
        <PrevTCACRecap />
        <ActivitiesSection />

        {/* 2. Pass the server-side updates to the Slider component */}
        <TCACUpdates updates={updates} />

        <NewsModal
          isOpen={isNewsOpen}
          onClose={() => setIsNewsOpen(false)}
          newsArray={news} // Using server-side news
        />

        <BankDetailsModal 
          isOpen={isBankDetailsOpen} 
          onClose={() => setIsBankDetailsOpen(false)} 
        />

        <VStack spacing={0} align="stretch">
          {/* Dynamic content rendering loop goes here */}
        </VStack>
        <Footer />
      </Box>
    </>
  );
}

// 3. THE SSR LOGIC AT THE BOTTOM
export async function getServerSideProps(context) {
  try {
    // In a real scenario, you would fetch from your API:
    // const res = await fetch('https://your-api.com/api/updates');
    // const data = await res.json();

    // For now, we define the data here. Because it's inside getServerSideProps,
    // it is technically "rendered on the server" before reaching the browser.
    const updates = [
      {
        imgSrc: "/images/image5.png",
        title: "TILETS",
        description: "TIMSAN Southwest TILETS is... ",
      },
      {
        imgSrc: "/images/image5.png",
        title: "Reading Club",
        description: "TIMSAN Southwest reading club is...",
      },
      {
        imgSrc: "/images/image5.png",
        title: "Congress",
        description: "TIMSAN Southwest congress is...",
      },
      {
        imgSrc: "/images/image26.png",
        title: "TCAC'25",
        description: "TCAC'25 is the premier event of TIMSAN Southwest..."
      }
    ];

    const news = [
      {
        id: 1,
        title: "TCAC '25 Registration Open",
        date: "May 02, 2026",
        description: "Registration for TIMSAN Southwest TCAC 2025 is officially open.",
      }
    ];

    return {
      props: {
        updates,
        news,
      },
    };
  } catch (error) {
    console.error("SSR Data Fetch Error:", error);
    return {
      props: {
        updates: [],
        news: [],
      },
    };
  }
}
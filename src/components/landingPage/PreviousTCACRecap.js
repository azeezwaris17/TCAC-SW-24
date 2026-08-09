import React from "react";
import { Box, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import SliderModule from "react-slick";

// Safely unwrap Slider to avoid server/client mismatch
const Slider = SliderModule.default || SliderModule;

const updates = [
  {
    id: 1,
    image: "/images/prev1.png",
    title: "TCAC'21",
    description: "TIMSAN Southwest TCAC 2021.",
  },
  {
    id: 2,
    image: "/images/prev2.png",
    title: "TCAC'22",
    description: "TIMSAN Southwest TCAC 2022.",
  },
  {
    id: 3,
    image: "/images/prev1.png",
    title: "TCAC'23",
    description: "TIMSAN Southwest TCAC 2023.",
  },
  {
    id: 4,
    image: "/images/prev2.png",
    title: "TCAC'24",
    description: "TIMSAN Southwest TCAC 2024.",
  },
  {
    id: 5,
    image: "/images/prev1.png",
    title: "TCAC'25",
    description: "TIMSAN Southwest TCAC 2025.",
  },
  {
    id: 6,
    image: "/images/prev2.png",
    title: "TCAC'26",
    description: "TIMSAN Southwest TCAC 2026.",
  },
];

const PrevTCACRecap = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    fade: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box bg="green.500" py={6} px={4}>
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        maxW="fit-content"
        mb={6}
        p="2"
        border="2px solid black"
        boxShadow="4px 4px 12px rgba(0, 0, 0, 0.8)"
        bg="#E1EDDF"
      >
        <Heading as="h2" textAlign="center" fontSize="2xl">
          Previous TCAC Recap
        </Heading>
      </Flex>

      <Slider {...settings}>
        {updates.map((update) => (
          <Box key={update.id} px={2}>
            <VStack spacing={2} align="start">
              <Image
                src={update.image}
                alt={update.title}
                objectFit="cover"
                borderRadius="md"
                fallbackSrc="https://via.placeholder.com/300x200?text=TCAC+Recap"
                w="full"
                h={{ base: "200px", md: "250px" }}
              />
              <Text fontWeight="bold" color="white" fontSize="lg">
                {update.title}
              </Text>
              <Text color="white" fontSize="sm">
                {update.description}
              </Text>
            </VStack>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PrevTCACRecap;
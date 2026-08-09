import React from "react";
import { Box, Flex, Image, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import SliderModule from "react-slick";

const Slider = SliderModule.default || SliderModule;

const activities = [
  { name: "Promote Civility", image: "/images/image.png" },
  { name: "Free Medical Care", image: "/images/image24.png" },
  { name: "Skills Acquisition", image: "/images/image26.png" },
  { name: "Empowerment Programs", image: "/images/image24.png" },
  { name: "Community Development", image: "/images/image26.png" },
];

const ActivitiesSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
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
    <Box as="section" py={12} px={8} id="activities" bg="#E1EDDF">
      {/* Section Header */}
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        mb={6}
        p={2}
        border="2px solid black"
        boxShadow="4px 4px 12px rgba(0, 0, 0, 0.8)"
        bg="lime.100"
        maxW="fit-content"
      >
        <Heading as="h2" textAlign="center" fontSize="2xl">
          TCAC Activities
        </Heading>
      </Flex>

      {/* Slider Component */}
      <Slider {...settings}>
        {activities.map((activity, index) => (
          <Box key={index} px={2}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <VStack
                bg="white"
                borderRadius="md"
                boxShadow="lg"
                p={4}
                textAlign="center"
                spacing={4}
              >
                <Image
                  src={activity.image}
                  alt={activity.name}
                  borderRadius="md"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/300x200?text=Activity"
                />
                <Text fontWeight="bold" fontSize="lg" color="gray.700">
                  {activity.name}
                </Text>
              </VStack>
            </motion.div>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ActivitiesSection;
import React from "react";
import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";

// 1. Import the default module
import SliderModule from "react-slick";
// 2. Safely unwrap the Slider component function 
const Slider = SliderModule.default || SliderModule;

const defaultUpdates = [
  {
    imgSrc: "/images/image5.png",
    title: "TILETS",
    description: "TIMSAN Southwest TILETS is...",
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
    description: "TCAC'25 is the premier event of TIMSAN Southwest, bringing together students, professionals, and industry leaders for a day of learning, networking, and celebration.",
  },
];

const TCACUpdates = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    fade: true,
    arrows: false,
  };

  return (
    <Box as="section" py={12} px={8} id="tcac-updates" bg="#DFFBA4">
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        mb={10}
        p={3}
        border="2px solid black"
        boxShadow="6px 6px 0px black"
        bg="green.500"
        maxW="fit-content"
      >
        <Heading as="h2" fontSize="2xl" color="white">
          TCAC Updates
        </Heading>
      </Flex>

      <Box mx="auto" maxW="1000px">
        {/* Line 61: Slider will now safely run as a function/component instead of an object */}
        <Slider {...settings}>
          {defaultUpdates.map((update, idx) => (
            <Box key={idx} p={4} outline="none">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}
              >
                <Image
                  src={update.imgSrc}
                  alt={update.title}
                  objectFit="cover"
                  w="full"
                  h={{ base: "350px", md: "550px" }}
                  fallbackSrc="https://via.placeholder.com/800x500?text=Loading+Update..."
                />

                <Box
                  position="absolute"
                  bottom={{ base: 4, md: 8 }}
                  left={{ base: 4, md: 8 }}
                  right={{ base: 4, md: 8 }}
                  p={6}
                  bg="rgba(0, 0, 0, 0.6)"
                  backdropFilter="blur(8px)"
                  color="white"
                  borderRadius="xl"
                  textAlign="center"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  boxShadow="2xl"
                >
                  <Text fontSize="2xl" fontWeight="bold" mb={2}>
                    {update.title}
                  </Text>
                  <Text fontSize="md" noOfLines={3}>
                    {update.description}
                  </Text>
                </Box>
              </motion.div>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default TCACUpdates;
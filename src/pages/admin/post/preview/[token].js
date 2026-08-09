import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Image,
  VStack,
  HStack,
  Badge,
  Icon,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AspectRatio,
  Flex,
  Container,
  useBreakpointValue,
  useToast
} from "@chakra-ui/react";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaInfoCircle,
  FaDownload
} from "react-icons/fa";
import Header from "../../../../components/landingPage/Header";
import Footer from "../../../../components/landingPage/Footer";
import ModalRenderer from "../../../../components/ModalRenderer";
import ImageLightboxModal from '../../../../components/landingPage/ImageLightboxModal'

const PostPreview = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { token, postId } = router.query;
  const toast = useToast();

  // Utility function to convert YouTube URLs to embed URLs
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  useEffect(() => {
    if (!token || !postId) return;
    (async () => {
      try {
        const r = await fetch(`/api/preview/post/${token}?postId=${postId}`);
        const j = await r.json();
        if (j.success) setPost(j.data);
        else setError(j.message || "Failed to fetch post");
      } catch {
        setError("Failed to load preview");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, postId]);

  const VideoEmbedPreview = ({ post }) => (
    <Box maxW="800px" px={4}>
      {/* Video Title - styled like slider title, left-aligned */}
      {post.name && (
        <Box mb={6}>
          <Box
            bg={post.content?.showCustomStyling ? post.content.titleBackgroundColor : '#e9f5e1'}
            border="1px solid black"
            px={6}
            py={3}
            borderRadius="sm"
            display="inline-block"
          >
            <Text 
              fontSize={{ base: "2xl", md: "4xl" }} 
              fontWeight="bold" 
              color={post.content?.showCustomStyling ? post.content.titleTextColor : 'black'}
            >
              {post.name}
            </Text>
          </Box>
        </Box>
      )}
      
      <Box>
        <AspectRatio ratio={16 / 9} w="100%">
          <Box bg="gray.900" borderRadius="md" overflow="hidden">
            {post.content.uploadType === 'file' && post.content.videoFile ? (
              <video
                src={post.content.videoFile}
                controls
                autoPlay
                muted
                style={{ width: "100%", height: "100%" }}
              />
            ) : post.content.videoUrl ? (
              <iframe
                src={`${getEmbedUrl(post.content.videoUrl)}?autoplay=1`}
                title={post.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                h="100%"
                color="white"
              >
                <Icon as={FaPlay} boxSize={12} mb={4} />
                <Text>No video provided</Text>
              </Flex>
            )}
          </Box>
        </AspectRatio>
      </Box>
      
      {/* Video Caption - left-aligned with padding */}
      {post.content.caption && (
        <Box mt={6}>
          <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" fontWeight="medium">
            {post.content.caption}
          </Text>
        </Box>
      )}
    </Box>
  );

  const PopoutModalPreview = ({ post }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Trigger modal to open after component mounts
    useEffect(() => {
      const timer = setTimeout(() => {
        onOpen();
      }, post.content?.showDelay * 1000 || 0);
      
      return () => clearTimeout(timer);
    }, [post.content?.showDelay, onOpen]);

    return (
      <>
        <Box textAlign="center" py={8}>
          <Text fontSize="lg" color="gray.600">
            Popout/Modal Preview - Modal will appear automatically
          </Text>
        </Box>
        
        <ModalRenderer
          post={post}
          onClose={onClose}
        />
      </>
    );
  };

  const GalleryPreview = ({ post }) => {
    const images = post.content.images ?? [];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
      <Container maxW="1200px">
        {/* Gallery Title with styled box */}
        {post.name && (
          <Box mb={8}>
            <Box
              bg="#e9f5e1"
              border="1px solid black"
              px={6}
              py={3}
              borderRadius="sm"
              display="inline-block"
            >
              <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" color="black">
                {post.name}
              </Text>
            </Box>
          </Box>
        )}
        
        {images.length ? (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)"
            }}
            gap={6}
            w="100%"
          >
            {images.map((img, i) => (
              <GridItem key={i}>
                <Box
                  overflow="hidden"
                  cursor="pointer"
                  borderRadius="lg"
                  bg="white"
                  shadow="md"
                  transition="all 0.3s"
                  _hover={{ 
                    transform: "translateY(-4px)",
                    shadow: "xl"
                  }}
                  onClick={() => {
                    setSelectedImage(img);
                    onOpen();
                  }}
                >
                  <AspectRatio ratio={4 / 3}>
                    <Image 
                      src={img.url} 
                      alt={img.caption ?? `Gallery image ${i + 1}`}
                      objectFit="cover"
                    />
                  </AspectRatio>
                  
                  {/* Caption Section */}
                  {img.caption && (
                    <Box p={4} borderTop="1px solid" borderColor="gray.100">
                      <Text 
                        fontSize="sm" 
                        color="gray.700" 
                        lineHeight="1.4"
                        textAlign="center"
                        fontStyle="italic"
                      >
                        {img.caption}
                      </Text>
                    </Box>
                  )}
                </Box>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Box bg="gray.100" p={12} borderRadius="md" textAlign="center">
            <Text color="gray.500" fontSize="lg">No images in gallery</Text>
          </Box>
        )}

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody p={0}>
              {selectedImage && (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.caption || post.name}
                  w="100%"
                  h="auto"
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    );
  };

  const SliderPreview = ({ post }) => {
    const slides = post.content.slides ?? [];
    const cfgPerSlide = post.content.imagesPerSlide ?? 3;
    const perSlide = useBreakpointValue({ base: 1, md: cfgPerSlide });
    const sliderTitle = post.content.sliderTitle;
    const bg = post.content.showBackgroundColor
      ? post.content.backgroundColor ?? "#43b02a"
      : "transparent";
    const titleBg = post.content.showTitleBackgroundColor
      ? post.content.titleBackgroundColor ?? "#e9f5e1"
      : "transparent";

    const chunks = useMemo(() => {
      const out = [];
      for (let i = 0; i < slides.length; i += perSlide) {
        out.push(slides.slice(i, i + perSlide));
      }
      return out;
    }, [slides, perSlide]);

    const [idx, setIdx] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIdx, setLightboxIdx] = useState(0);

    useEffect(() => {
      if (chunks.length <= 1) return;
      const id = setInterval(
        () => setIdx((i) => (i + 1) % chunks.length),
        3000
      );
      return () => clearInterval(id);
    }, [chunks.length]);

    const prev = () => setIdx((i) => (i === 0 ? chunks.length - 1 : i - 1));
    const next = () => setIdx((i) => (i + 1) % chunks.length);

    if (!slides.length) {
      return (
        <Box bg={bg} p={12} textAlign="center">
          <Text color="gray.500">No slides in slider</Text>
        </Box>
      );
    }

    return (
      <Box bg={bg} py={8}>
        {sliderTitle && (
          <Box mb={6} px={4}>
            <Box
              bg={titleBg}
              border="1px solid black"
              px={6}
              py={3}
              borderRadius="sm"
              display="inline-block"
            >
              <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
                {sliderTitle}
              </Text>
            </Box>
          </Box>
        )}
        <Box position="relative" overflow="hidden">
          <Box
            display="flex"
            transition="transform .5s ease"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {chunks.map((grp, gi) => (
              <Box
                key={gi}
                minW="100%"
                display="flex"
                gap={{ base: 2, md: 6 }}
                px={2}
              >
                {grp.map((s, si) => {
                  const localBg = s.showBackgroundColor
                    ? s.backgroundColor ?? "#43b02a"
                    : "transparent";
                  const border =
                    localBg === "transparent"
                      ? `1px solid ${bg === "transparent" ? "black" : bg}`
                      : "none";
                  const titleColor = s.showTitleTextColor
                    ? s.titleTextColor ?? "#fff"
                    : localBg === "transparent"
                    ? "black"
                    : "white";
                  const subtitleColor = s.showSubtitleTextColor
                    ? s.subtitleTextColor ?? "#fff"
                    : titleColor;
                  return (
                    <Box
                      key={s.id ?? si}
                      flex="1 1 0"
                      bg={localBg}
                      border={border}
                      borderRadius="lg"
                      overflow="hidden"
                    >
                      {s.image && (
                        <Image
                          src={s.image}
                          alt={s.title}
                          w="100%"
                          h={{ base: "200px", md: "220px" }}
                          objectFit="cover"
                        />
                      )}
                      <Box p={4}>
                        <Text fontWeight="bold" fontSize="xl" color={titleColor}>
                          {s.title}
                        </Text>
                        {s.subtitle && (
                          <Text fontSize="md" color={subtitleColor}>
                            {s.subtitle}
                          </Text>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
          {chunks.length > 1 && (
            <>
              <Button
                position="absolute"
                left={2}
                top="50%"
                transform="translateY(-50%)"
                variant="ghost"
                size="sm"
                onClick={prev}
                display={{ base: "none", md: "flex" }}
              >
                <Icon as={FaChevronLeft} />
              </Button>
              <Button
                position="absolute"
                right={2}
                top="50%"
                transform="translateY(-50%)"
                variant="ghost"
                size="sm"
                onClick={next}
                display={{ base: "none", md: "flex" }}
              >
                <Icon as={FaChevronRight} />
              </Button>
            </>
          )}
          {chunks.length > 1 && (
            <HStack justify="center" mt={4}>
              {chunks.map((_, i) => (
                <Box
                  key={i}
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg={i === idx ? "gray.800" : "gray.400"}
                  cursor="pointer"
                  onClick={() => setIdx(i)}
                />
              ))}
            </HStack>
          )}
        </Box>
      </Box>
    );
  };

  const HeaderAndParagraphPreview = ({ post }) => (
    <Box textAlign="center" px={4} py={10}>
      <Heading size="xl" mb={6}>
        {post.content.title}
      </Heading>
      <Text fontSize="lg" maxW="3xl" mx="auto" lineHeight="1.6">
        {post.content.subtitle}
      </Text>
    </Box>
  );

  const renderPostContent = (post) => {
    switch (post.postType) {
      case "Header and Paragraph":
        return <HeaderAndParagraphPreview post={post} />;
      case "Video Embed":
        return <VideoEmbedPreview post={post} />;
      case "Popout/Modal":
        return <PopoutModalPreview post={post} />;
      case "Gallery":
        return <GalleryPreview post={post} />;
      case "Slider":
        return <SliderPreview post={post} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box p={8}>
        <Alert status="warning">
          <AlertIcon />
          Post not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box borderBottom="2px solid" borderColor="gray.100">
        <Header />
      </Box>
      <Box p={4} bg="red.100" textAlign="center">
        <Text fontWeight="bold" color="red.800">
          ADMIN PREVIEW MODE
        </Text>
      </Box>
      <Box py={8}>{renderPostContent(post)}</Box>
      <Box mt={8} textAlign="center" pb={8}>
        <Button onClick={() => window.close()} colorScheme="blue" variant="outline">
          Close Preview
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default PostPreview;

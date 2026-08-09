import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Image,
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
  Button,
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
  FaInfoCircle,
  FaDownload
} from "react-icons/fa";
import Header from "../../../../components/landingPage/Header";
import Footer from "../../../../components/landingPage/Footer";
import ModalRenderer from "../../../../components/ModalRenderer";
import ImageLightboxModal from '../../../../components/landingPage/ImageLightboxModal'

const HomepagePreview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { token } = router.query;
  const [modalPosts, setModalPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // You can adjust this as needed
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

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
    if (!token) return;
    fetchPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchPosts = async (pageToFetch, initial = false) => {
    if (initial) setLoading(true);
    else setLoadingMore(true);
    try {
      const r = await fetch(`/api/preview/home/${token}?page=${pageToFetch}&limit=${limit}`);
      if (!r.ok) throw new Error();
      const j = await r.json();
      if (j.success) {
        if (initial) {
          setPosts(j.data);
        } else {
          setPosts((prev) => [...prev, ...j.data]);
        }
        setTotal(j.total);
        setPage(j.page);
        // Only show modal posts from loaded posts
        const modals = (initial ? j.data : [...posts, ...j.data]).filter(p => p.postType === "Popout/Modal" && p.isPublished);
        setModalPosts(modals);
      } else setError(j.message || "Failed to fetch posts");
    } catch {
      setError("Failed to load preview");
    } finally {
      if (initial) setLoading(false);
      else setLoadingMore(false);
    }
  };

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
        {post.content.caption && (
          <Box mt={4} textAlign="center">
            <Text fontSize="sm" color="gray.600">
              {post.content.caption}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );

  const GalleryPreview = ({ post }) => {
    const images = post.content.images ?? [];
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
    const allImages = slides.filter(s => s.image);

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
                          cursor="pointer"
                          onClick={() => {
                            const imgIdx = allImages.findIndex(img => img.image === s.image);
                            setLightboxIdx(imgIdx);
                            setLightboxOpen(true);
                          }}
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
        <ImageLightboxModal images={allImages.map(img => ({ url: img.image, caption: img.title }))} initialIndex={lightboxIdx} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
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
      <VStack spacing={0} align="stretch">
        {posts.length ? (
          posts.map((p, i) => (
            <Box key={p._id} mt={8} mb={i === posts.length - 1 ? 8 : 0} w="100%">
              {renderPostContent(p)}
            </Box>
          ))
        ) : (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              No posts available for preview
            </Text>
          </Box>
        )}
      </VStack>
      {/* Load More Button */}
      {posts.length < total && (
        <Box textAlign="center" my={8}>
          <Button
            onClick={() => fetchPosts(page + 1)}
            isLoading={loadingMore}
            loadingText="Loading..."
            disabled={loadingMore}
            colorScheme="green"
            size="lg"
          >
            Load More
          </Button>
        </Box>
      )}
      {/* Render modals */}
      {modalPosts.map((modalPost) => (
        <ModalRenderer
          key={modalPost._id}
          post={modalPost}
          onClose={() => {
            // Modal will handle its own closing logic
          }}
        />
      ))}
      
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" />
          <ModalBody p={0}>
            {selectedImage && (
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || "Gallery image"}
                w="100%"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Footer />
    </Box>
  );
};

export default HomepagePreview;

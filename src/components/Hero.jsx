import React, { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Image,
  useColorModeValue
} from '@chakra-ui/react';
import { gsap } from 'gsap';
import { 
  FaInstagram, 
  FaTiktok, 
  FaFacebook 
} from 'react-icons/fa';
import { SiXiaohongshu, SiDouban } from 'react-icons/si';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const platformsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.5'
    )
    .fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(
      platformsRef.current.filter(Boolean),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      '-=0.3'
    );
  }, []);

  const bgGradient = useColorModeValue(
    'linear(to-br, red.500, red.700, red.900)',
    'linear(to-br, red.600, red.800, red.950)'
  );

  const platforms = [
    { 
      name: '小红书', 
      icon: SiXiaohongshu, 
      color: 'red.500',
      desc: '种草营销·KOL合作'
    },
    { 
      name: '抖音', 
      icon: SiDouban, 
      color: 'gray.800',
      desc: '短视频·直播带货'
    },
    { 
      name: 'TikTok', 
      icon: FaTiktok, 
      color: 'gray.900',
      desc: '海外推广·本地化'
    },
    { 
      name: 'Instagram', 
      icon: FaInstagram, 
      color: 'purple.500',
      desc: '品牌形象·社群运营'
    },
    { 
      name: 'Facebook', 
      icon: FaFacebook, 
      color: 'blue.600',
      desc: '广告投放·粉丝增长'
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      ref={heroRef}
      position="relative"
      minH={{ base: '100vh', md: '90vh' }}
      bgGradient={bgGradient}
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgImage="url('https://hpi-hub.tos-cn-beijing.volces.com/static/physics/ai-generated-8228845_1280.jpg')"
        bgSize="cover"
        bgPosition="center"
        opacity="0.15"
        filter="blur(2px)"
      />

      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(to-b, transparent 0%, rgba(0,0,0,0.3) 100%)"
      />

      <Container
        maxW="1200px"
        position="relative"
        zIndex={1}
        h="full"
        display="flex"
        alignItems="center"
        py={{ base: 20, md: 24 }}
      >
        <VStack
          spacing={{ base: 6, md: 8 }}
          align="center"
          textAlign="center"
          w="full"
        >
          <VStack spacing={4} maxW="800px">
            <Heading
              ref={titleRef}
              as="h1"
              size={{ base: '2xl', md: '3xl', lg: '4xl' }}
              color="white"
              fontWeight="extrabold"
              lineHeight="1.2"
            >
              专业新媒体代运营服务
            </Heading>

            <Text
              ref={subtitleRef}
              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
              color="whiteAlpha.900"
              fontWeight="medium"
              maxW="700px"
            >
              助力品牌在小红书、抖音、TikTok等平台实现爆发式增长
            </Text>

            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              color="whiteAlpha.800"
              maxW="600px"
              mt={2}
            >
              数据驱动 · 内容为王 · 精准投放
            </Text>
          </VStack>

          <Button
            ref={ctaRef}
            size="lg"
            bg="white"
            color="red.600"
            px={10}
            py={7}
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight="bold"
            _hover={{
              bg: 'red.50',
              transform: 'translateY(-4px)',
              shadow: '2xl'
            }}
            _active={{
              transform: 'translateY(-2px)'
            }}
            transition="all 0.3s ease"
            onClick={scrollToContact}
          >
            立即咨询
          </Button>

          <SimpleGrid
            columns={{ base: 2, sm: 3, md: 5 }}
            spacing={{ base: 4, md: 6 }}
            w="full"
            maxW="900px"
            mt={{ base: 8, md: 12 }}
          >
            {platforms.map((platform, index) => (
              <VStack
                key={platform.name}
                ref={(el) => (platformsRef.current[index] = el)}
                spacing={3}
                p={{ base: 4, md: 5 }}
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.300"
                transition="all 0.3s ease"
                _hover={{
                  bg: 'whiteAlpha.300',
                  transform: 'translateY(-8px)',
                  shadow: 'xl'
                }}
                cursor="pointer"
              >
                <Box
                  p={3}
                  bg="white"
                  borderRadius="full"
                  boxShadow="md"
                >
                  <Icon
                    as={platform.icon}
                    boxSize={{ base: 6, md: 8 }}
                    color={platform.color}
                  />
                </Box>
                <VStack spacing={1}>
                  <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="bold"
                    color="white"
                  >
                    {platform.name}
                  </Text>
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color="whiteAlpha.800"
                    textAlign="center"
                    noOfLines={2}
                  >
                    {platform.desc}
                  </Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="100px"
        bgGradient="linear(to-t, white 0%, transparent 100%)"
      />
    </Box>
  );
};

export default Hero;
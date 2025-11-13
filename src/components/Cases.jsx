import React, { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  Badge,
  Skeleton,
  Alert,
  AlertIcon,
  useColorModeValue
} from '@chakra-ui/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore from '../utils/store';

gsap.registerPlugin(ScrollTrigger);

const Cases = () => {
  const { cases, loading, error, fetchCases } = useStore();
  const cardsRef = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    if (!loading.cases && cases.length > 0) {
      const cards = cardsRef.current.filter(Boolean);
      
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, [loading.cases, cases]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const shadowColor = useColorModeValue('md', 'dark-lg');

  if (error.cases) {
    return (
      <Box as="section" py={{ base: 16, md: 24 }} px={{ base: 4, md: 8 }} bg={bgColor}>
        <Container maxW="1200px">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {error.cases}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      as="section"
      id="cases"
      ref={sectionRef}
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      bg={bgColor}
    >
      <Container maxW="1200px">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading
            as="h2"
            size={{ base: 'xl', md: '2xl' }}
            bgGradient="linear(to-r, red.600, red.800)"
            bgClip="text"
            fontWeight="extrabold"
          >
            成功案例
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.600"
            maxW="600px"
          >
            数据驱动增长，内容创造价值
          </Text>
        </VStack>

        {loading.cases ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {[1, 2, 3].map((i) => (
              <Box key={i} bg={cardBg} borderRadius="xl" overflow="hidden" shadow={shadowColor}>
                <Skeleton height="200px" />
                <Box p={6}>
                  <Skeleton height="24px" mb={3} />
                  <Skeleton height="16px" mb={2} />
                  <Skeleton height="16px" mb={4} />
                  <HStack spacing={2}>
                    <Skeleton height="20px" width="60px" />
                    <Skeleton height="20px" width="60px" />
                    <Skeleton height="20px" width="60px" />
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        ) : cases.length === 0 ? (
          <Text textAlign="center" color="gray.500" py={12}>
            暂无案例数据
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {cases.map((caseItem, index) => (
              <Box
                key={caseItem.id}
                ref={(el) => (cardsRef.current[index] = el)}
                bg={cardBg}
                borderRadius="xl"
                overflow="hidden"
                shadow={shadowColor}
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-8px)',
                  shadow: 'xl'
                }}
                cursor="pointer"
              >
                <Box
                  position="relative"
                  height="200px"
                  overflow="hidden"
                  bg="gray.200"
                >
                  <Image
                    src={caseItem.image_url}
                    alt={caseItem.title}
                    objectFit="cover"
                    w="full"
                    h="full"
                    transition="transform 0.3s ease"
                    _hover={{
                      transform: 'scale(1.1)'
                    }}
                    fallbackSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
                  />
                  {caseItem.platform && (
                    <Badge
                      position="absolute"
                      top={4}
                      left={4}
                      colorScheme="red"
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                      textTransform="none"
                    >
                      {caseItem.platform}
                    </Badge>
                  )}
                </Box>

                <VStack align="stretch" p={6} spacing={3}>
                  <Heading
                    as="h3"
                    size="md"
                    color="gray.800"
                    noOfLines={2}
                    minH="56px"
                  >
                    {caseItem.title}
                  </Heading>

                  <Text
                    fontSize="sm"
                    color="gray.600"
                    noOfLines={3}
                    minH="60px"
                  >
                    {caseItem.description}
                  </Text>

                  {caseItem.metrics && Object.keys(caseItem.metrics).length > 0 && (
                    <HStack spacing={2} flexWrap="wrap" pt={2}>
                      {Object.entries(caseItem.metrics).slice(0, 3).map(([key, value]) => (
                        <Badge
                          key={key}
                          variant="subtle"
                          colorScheme="blue"
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {value}
                        </Badge>
                      ))}
                    </HStack>
                  )}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default Cases;
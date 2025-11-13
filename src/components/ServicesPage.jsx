import React, { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
  Badge,
  Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaStore,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaBullhorn,
  FaGlobe
} from 'react-icons/fa';
import { SiXiaohongshu } from 'react-icons/si';
import { MdTrendingUp, MdSupportAgent, MdStorefront } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger);

const ServicesPage = () => {
  const cardsRef = useRef([]);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/');
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 300);
  };

  const services = [
    {
      title: '小红书代运营',
      description: '专业团队为您的小红书账号提供内容策划、发布和数据分析服务。通过精准定位目标用户，打造爆款笔记，实现品牌曝光和转化双提升。',
      icon: SiXiaohongshu,
      color: 'red.500',
      features: ['内容策划', 'KOL合作', '数据分析', '粉丝运营']
    },
    {
      title: '抖音代运营',
      description: '从内容制作到粉丝增长，一站式抖音运营解决方案。短视频创作、直播策划、达人对接，助力品牌在抖音平台快速崛起。',
      icon: MdTrendingUp,
      color: 'gray.800',
      features: ['短视频制作', '直播带货', '达人合作', '流量投放']
    },
    {
      title: '小红书本地生活',
      description: '专注本地生活服务商家在小红书平台的营销推广。通过精准的地域定位和内容策略，帮助本地商家实现线上线下联动增长。',
      icon: MdStorefront,
      color: 'orange.500',
      features: ['本地推广', '到店转化', '活动策划', 'UGC引导']
    },
    {
      title: '千帆店铺运营',
      description: '抖音千帆电商平台专业运营服务。从店铺装修到商品上架，从流量获取到订单转化，全链路电商运营支持。',
      icon: FaStore,
      color: 'blue.600',
      features: ['店铺运营', '商品优化', '流量获取', '转化提升']
    },
    {
      title: '差评公关处理',
      description: '专业的舆情监控和危机公关服务。快速响应负面信息，制定应对策略，维护品牌形象，化危为机转化用户信任。',
      icon: FaShieldAlt,
      color: 'purple.600',
      features: ['舆情监控', '危机应对', '品牌维护', '口碑管理']
    },
    {
      title: '陪跑计划',
      description: '一对一专业运营陪跑服务。从战略规划到执行落地，全程陪伴指导，手把手教学，培养企业内部运营能力。',
      icon: MdSupportAgent,
      color: 'green.600',
      features: ['战略规划', '执行指导', '团队培训', '能力提升']
    },
    {
      title: '聚光投放优化',
      description: '抖音聚光广告投放专业服务。精准定向、创意优化、数据分析，最大化ROI，让每一分广告预算都花在刀刃上。',
      icon: FaBullhorn,
      color: 'yellow.600',
      features: ['精准定向', '创意优化', '数据监控', 'ROI优化']
    },
    {
      title: '博主种草合作',
      description: '海量优质博主资源对接。根据品牌调性匹配合适的KOL/KOC，策划种草内容，实现品效合一的营销目标。',
      icon: FaUsers,
      color: 'pink.500',
      features: ['博主匹配', '内容策划', '效果追踪', '数据复盘']
    },
    {
      title: 'TikTok海外运营',
      description: 'TikTok国际版专业运营服务。本地化内容策略、海外用户运营、跨境电商支持，助力品牌出海全球化布局。',
      icon: FaTiktok,
      color: 'gray.900',
      features: ['本地化运营', '海外推广', '跨境电商', '数据分析']
    },
    {
      title: 'Instagram运营',
      description: '专业的Instagram品牌运营服务。视觉内容策划、Story互动、Reels创作、社群运营，打造国际化品牌形象。',
      icon: FaInstagram,
      color: 'purple.500',
      features: ['视觉策划', '互动运营', '社群管理', '品牌建设']
    },
    {
      title: 'Facebook广告投放',
      description: 'Facebook/Meta平台广告投放专业服务。精准受众定位、广告创意优化、数据分析优化，实现高效获客。',
      icon: FaFacebook,
      color: 'blue.600',
      features: ['广告投放', '受众定向', '创意优化', '效果分析']
    },
    {
      title: '独立站搭建',
      description: '一站式独立站建设服务。从域名注册到网站设计，从SEO优化到运营推广，助力品牌打造自主流量池。',
      icon: FaGlobe,
      color: 'teal.600',
      features: ['网站建设', 'SEO优化', '支付对接', '运营推广']
    }
  ];

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const shadowColor = useColorModeValue('md', 'dark-lg');

  return (
    <Box bg={bgColor} minH="100vh" pt={{ base: 24, md: 28 }} pb={{ base: 16, md: 20 }}>
      <Container maxW="1200px" px={{ base: 4, md: 8 }}>
        <VStack ref={headerRef} spacing={4} mb={{ base: 12, md: 16 }} textAlign="center">
          <Badge
            colorScheme="red"
            fontSize="sm"
            px={4}
            py={2}
            borderRadius="full"
            textTransform="none"
          >
            专业服务
          </Badge>
          <Heading
            as="h1"
            size={{ base: 'xl', md: '2xl', lg: '3xl' }}
            bgGradient="linear(to-r, red.600, red.800)"
            bgClip="text"
            fontWeight="extrabold"
          >
            我们的服务项目
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.600"
            maxW="700px"
          >
            覆盖全平台的新媒体运营解决方案，从内容创作到数据分析，从品牌建设到效果转化，助力您的品牌在数字化时代脱颖而出
          </Text>
        </VStack>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 6, md: 8 }}
        >
          {services.map((service, index) => (
            <Box
              key={index}
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
                bgGradient={`linear(to-br, ${service.color}, ${service.color.replace('.500', '.700')})`}
                p={6}
              >
                <Flex align="center" justify="space-between" mb={3}>
                  <Box
                    bg="white"
                    p={3}
                    borderRadius="lg"
                    display="inline-flex"
                  >
                    <Icon
                      as={service.icon}
                      boxSize={8}
                      color={service.color}
                    />
                  </Box>
                </Flex>
                <Heading
                  as="h3"
                  size="md"
                  color="white"
                  mb={2}
                >
                  {service.title}
                </Heading>
              </Box>

              <VStack align="stretch" p={6} spacing={4}>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  lineHeight="1.7"
                  minH="80px"
                >
                  {service.description}
                </Text>

                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.700"
                    mb={2}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    核心服务
                  </Text>
                  <Flex flexWrap="wrap" gap={2}>
                    {service.features.map((feature, idx) => (
                      <Badge
                        key={idx}
                        variant="subtle"
                        colorScheme="red"
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Box
          mt={{ base: 12, md: 16 }}
          p={{ base: 6, md: 8 }}
          bg={cardBg}
          borderRadius="xl"
          shadow={shadowColor}
          textAlign="center"
        >
          <Heading size="md" mb={4} color="gray.800">
            需要定制化服务方案？
          </Heading>
          <Text fontSize="md" color="gray.600" mb={6}>
            联系我们的专业团队，为您量身打造最适合的新媒体运营解决方案
          </Text>
          <Flex
            justify="center"
            gap={4}
            flexDirection={{ base: 'column', sm: 'row' }}
          >
            <Box
              as="button"
              onClick={handleContactClick}
              px={6}
              py={3}
              bgGradient="linear(to-r, red.500, red.700)"
              color="white"
              borderRadius="lg"
              fontWeight="bold"
              cursor="pointer"
              border="none"
              _hover={{
                bgGradient: 'linear(to-r, red.600, red.800)',
                transform: 'translateY(-2px)',
                shadow: 'lg'
              }}
              transition="all 0.3s ease"
            >
              立即咨询
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesPage;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  HStack,
  Container
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: '首页', href: '#home' },
    { label: '服务', href: '/services', isRoute: true },
    { label: '案例', href: '#cases' },
    { label: '联系我们', href: '#contact' }
  ];

  const scrollToSection = (href, isRoute = false) => {
    // 关闭移动端抽屉菜单
    onClose();
    
    // 处理路由跳转（如 /services 页面）
    if (isRoute) {
      navigate(href);
      // 跳转到新路由后滚动到顶部
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }
    
    // 处理锚点跳转逻辑（适配 HashRouter）
    const currentHash = window.location.hash;
    // 解析当前路径：/#/services -> '/services' 或 /#/ -> '/'
    const currentPath = currentHash.replace(/^#/, '').split('?')[0] || '/';
    
    // 如果当前不在首页，需要先跳转到首页
    if (currentPath !== '/' && currentPath !== '') {
      navigate('/');
      
      // 使用 requestAnimationFrame 确保 DOM 渲染完成后再滚动
      const scrollToTarget = () => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (href === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // 如果元素未找到，延迟重试一次
          setTimeout(() => {
            const retryElement = document.querySelector(href);
            if (retryElement) {
              retryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }
      };
      
      // 等待路由切换完成
      setTimeout(() => {
        requestAnimationFrame(scrollToTarget);
      }, 200);
      return;
    }
    
    // 已经在首页，直接滚动到目标位置
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`[Navbar] 锚点元素未找到: ${href}`);
    }
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      bg={scrolled ? 'white' : 'transparent'}
      bgGradient={scrolled ? 'none' : 'linear(to-r, red.500, red.700)'}
      backdropFilter={scrolled ? 'blur(10px)' : 'none'}
      shadow={scrolled ? 'md' : 'none'}
      transition="all 0.3s ease"
    >
      <Container maxW="1200px">
        <Flex
          h="70px"
          align="center"
          justify="space-between"
          px={{ base: 4, md: 0 }}
        >
          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="extrabold"
            color={scrolled ? 'red.600' : 'white'}
            letterSpacing="tight"
            transition="color 0.3s ease"
            cursor="pointer"
            onClick={() => scrollToSection('#home')}
          >
            新媒体运营
          </Text>

          <HStack
            spacing={8}
            display={{ base: 'none', md: 'flex' }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                color={scrolled ? 'gray.700' : 'white'}
                fontWeight="medium"
                _hover={{
                  color: scrolled ? 'red.600' : 'red.100',
                  transform: 'translateY(-2px)'
                }}
                _active={{
                  transform: 'translateY(0)'
                }}
                transition="all 0.2s ease"
                onClick={() => scrollToSection(item.href, item.isRoute)}
              >
                {item.label}
              </Button>
            ))}
            <Button
              size="md"
              bgGradient="linear(to-r, red.500, red.700)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, red.600, red.800)',
                transform: 'translateY(-2px)',
                shadow: 'lg'
              }}
              _active={{
                transform: 'translateY(0)'
              }}
              transition="all 0.2s ease"
              fontWeight="bold"
              onClick={() => scrollToSection('#contact')}
            >
              立即咨询
            </Button>
          </HStack>

          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            color={scrolled ? 'red.600' : 'white'}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            aria-label="打开菜单"
            fontSize="24px"
          />
        </Flex>
      </Container>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            bgGradient="linear(to-r, red.500, red.700)"
            color="white"
          >
            菜单
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  justifyContent="flex-start"
                  py={6}
                  px={6}
                  fontSize="lg"
                  fontWeight="medium"
                  color="gray.700"
                  _hover={{
                    bg: 'red.50',
                    color: 'red.600'
                  }}
                  onClick={() => scrollToSection(item.href, item.isRoute)}
                  borderRadius="0"
                >
                  {item.label}
                </Button>
              ))}
              <Button
                bgGradient="linear(to-r, red.500, red.700)"
                color="white"
                py={6}
                px={6}
                fontSize="lg"
                fontWeight="bold"
                _hover={{
                  bgGradient: 'linear(to-r, red.600, red.800)'
                }}
                onClick={() => scrollToSection('#contact')}
                borderRadius="0"
                m={4}
              >
                立即咨询
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
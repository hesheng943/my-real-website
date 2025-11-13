import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Flex,
  Link,
  Image
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, LockIcon } from '@chakra-ui/icons';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
    
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          console.log('[AdminLogin] 检测到已登录，跳转到管理后台');
          const timer = setTimeout(() => {
            navigate('/admin/content', { replace: true });
          }, 100);
          return () => clearTimeout(timer);
        } else {
          console.log('[AdminLogin] 未登录，显示登录表单');
        }
      } catch (error) {
        console.error('[AdminLogin] 检查认证失败:', error);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      toast({
        title: '登录失败',
        description: '请输入用户名和密码',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('[AdminLogin] 发起登录请求', { username: trimmedUsername });
      
      const requestPayload = {
        username: trimmedUsername,
        password: trimmedPassword
      };

      const response = await axios.post('/api/admin/login', requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000,
        validateStatus: (status) => status < 500
      });

      console.log('[AdminLogin] 收到响应', { 
        status: response.status, 
        data: response.data 
      });

      if (response.data && response.data.success) {
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminUsername', response.data.data.username);
        
        setUsername('');
        setPassword('');
        setShowPassword(false);
        
        toast({
          title: '登录成功',
          description: `欢迎回来，${response.data.data.username}！`,
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top'
        });

        setTimeout(() => {
          navigate('/admin/content', { replace: true });
        }, 500);
      } else {
        toast({
          title: '登录失败',
          description: response.data?.message || '用户名或密码错误',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      console.error('[AdminLogin] 登录失败', error);
      
      let errorTitle = '登录失败';
      let errorMessage = '请稍后重试或联系管理员';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时，请检查网络连接后重试';
      } else if (error.response) {
        const { status, data } = error.response;
        console.error('[AdminLogin] 服务器响应错误', { status, data });
        
        if (status === 401) {
          errorMessage = data?.message || '用户名或密码错误，请检查后重试';
        } else if (status === 400) {
          errorTitle = '参数错误';
          errorMessage = data?.message || data?.error || '请求参数格式不正确，请刷新页面重试';
          
          if (data?.param_error || data?.message_cannot_convert) {
            errorMessage = '系统无法解析登录信息，请清除浏览器缓存后重试';
          }
        } else if (status === 500) {
          errorMessage = '服务器内部错误，请稍后重试或联系技术支持';
        } else {
          errorMessage = data?.message || `服务器错误 (状态码: ${status})`;
        }
      } else if (error.request) {
        errorMessage = '无法连接到服务器，请检查网络连接或稍后重试';
      } else {
        errorMessage = error.message || '未知错误，请刷新页面后重试';
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, red.500, red.700, red.900)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgImage="url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1600')"
        bgSize="cover"
        bgPosition="center"
        opacity="0.1"
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <Box
          bg="white"
          p={{ base: 6, md: 10 }}
          borderRadius="2xl"
          shadow="2xl"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={6} align="stretch">
            <VStack spacing={2}>
              <Box
                bg="red.50"
                p={4}
                borderRadius="full"
                mb={2}
              >
                <LockIcon boxSize={8} color="red.500" />
              </Box>
              <Heading
                as="h1"
                size="xl"
                bgGradient="linear(to-r, red.600, red.800)"
                bgClip="text"
                textAlign="center"
              >
                管理后台登录
              </Heading>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                新媒体运营管理系统
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    用户名
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiUser color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="请输入用户名"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      focusBorderColor="red.500"
                      size="lg"
                      autoComplete="off"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    密码
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="请输入密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      focusBorderColor="red.500"
                      size="lg"
                      autoComplete="off"
                    />
                    <InputRightElement>
                      <IconButton
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? '隐藏密码' : '显示密码'}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Box
                  w="full"
                  p={3}
                  bg="blue.50"
                  borderRadius="md"
                  border="1px"
                  borderColor="blue.200"
                >
                  <Text fontSize="xs" color="blue.700" textAlign="center">
                    💡 默认账号：<Text as="span" fontWeight="bold">admin</Text> / <Text as="span" fontWeight="bold">123456</Text>
                  </Text>
                </Box>

                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  bgGradient="linear(to-r, red.500, red.700)"
                  color="white"
                  _hover={{
                    bgGradient: 'linear(to-r, red.600, red.800)',
                    transform: 'translateY(-2px)',
                    shadow: 'lg'
                  }}
                  _active={{
                    transform: 'translateY(0)',
                    shadow: 'md'
                  }}
                  isLoading={isLoading}
                  loadingText="登录中..."
                  fontWeight="bold"
                  transition="all 0.3s ease"
                >
                  登录
                </Button>

                <Flex justify="center" w="full">
                  <Button
                    variant="link"
                    fontSize="sm"
                    color="red.600"
                    _hover={{ textDecoration: 'underline' }}
                    onClick={() => navigate('/')}
                  >
                    返回主站
                  </Button>
                </Flex>
              </VStack>
            </form>
          </VStack>
        </Box>

        <Text fontSize="xs" color="whiteAlpha.800" textAlign="center" mt={4}>
          © 2025 新媒体运营管理系统 By HAISNAP
        </Text>
      </Container>
    </Box>
  );
};

export default AdminLogin;
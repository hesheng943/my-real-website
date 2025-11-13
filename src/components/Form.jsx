import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiPhone, FiBriefcase, FiMessageSquare } from 'react-icons/fi';
import useStore from '../utils/store';

const FormComponent = () => {
  const { submitForm, loading, error } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, '姓名至少2个字符')
      .max(20, '姓名不能超过20个字符')
      .required('请输入您的姓名'),
    phone: Yup.string()
      .matches(/^1[3-9]\d{9}$/, '请输入有效的手机号码')
      .required('请输入您的手机号码'),
    industry: Yup.string()
      .max(100, '行业类目不能超过100个字符')
      .nullable(),
    message: Yup.string()
      .max(500, '留言内容不能超过500个字符')
      .nullable()
  });

  const initialValues = {
    name: '',
    phone: '',
    industry: '',
    message: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    try {
      console.log('[Form] 开始提交表单');
      console.log('[Form] 表单数据:', JSON.stringify(values, null, 2));
      
      // 先验证必填字段
      if (!values.name || !values.name.trim()) {
        const errorMsg = '请输入您的姓名';
        console.error('[Form] 验证失败:', errorMsg);
        toast({
          title: '提交失败',
          description: errorMsg,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        setFieldError('name', errorMsg);
        return;
      }

      if (!values.phone || !values.phone.trim()) {
        const errorMsg = '请输入您的手机号码';
        console.error('[Form] 验证失败:', errorMsg);
        toast({
          title: '提交失败',
          description: errorMsg,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        setFieldError('phone', errorMsg);
        return;
      }
      
      // 更新store中的表单数据
      console.log('[Form] 更新store数据');
      useStore.getState().updateFormData('name', values.name.trim());
      useStore.getState().updateFormData('phone', values.phone.trim());
      useStore.getState().updateFormData('industry', values.industry ? values.industry.trim() : '');
      useStore.getState().updateFormData('message', values.message ? values.message.trim() : '');
      
      // 调用store中的提交方法
      console.log('[Form] 调用submitForm');
      const result = await submitForm();
      
      console.log('[Form] 提交结果:', JSON.stringify(result, null, 2));
      
      if (result && result.success) {
        console.log('[Form] ✅ 提交成功');
        toast({
          title: '提交成功',
          description: result.message || '我们会尽快与您联系！',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
        resetForm();
        onClose();
      } else {
        const errorMessage = result?.message || error?.form || '提交失败，请稍后重试';
        console.error('[Form] ❌ 提交失败:', errorMessage);
        console.error('[Form] 完整错误对象:', result);
        
        toast({
          title: '提交失败',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
        
        // 如果是字段相关错误，设置到对应字段
        if (errorMessage.includes('姓名')) {
          setFieldError('name', errorMessage);
        } else if (errorMessage.includes('手机')) {
          setFieldError('phone', errorMessage);
        }
      }
    } catch (err) {
      console.error('[Form] ❌ 捕获异常:');
      console.error('[Form] - 错误类型:', err.name);
      console.error('[Form] - 错误消息:', err.message);
      console.error('[Form] - 错误堆栈:', err.stack);
      
      toast({
        title: '提交失败',
        description: err.message || '网络错误，请检查网络连接后重试',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      console.log('[Form] 提交流程结束');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Box
        as="section"
        id="contact"
        py={{ base: 16, md: 24 }}
        px={{ base: 4, md: 8 }}
        bg="white"
      >
        <Box maxW="1200px" mx="auto" textAlign="center">
          <Heading
            as="h2"
            size={{ base: 'xl', md: '2xl' }}
            mb={4}
            bgGradient="linear(to-r, red.600, red.800)"
            bgClip="text"
            fontWeight="extrabold"
          >
            开启您的品牌增长之旅
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.600"
            mb={8}
            maxW="600px"
            mx="auto"
          >
            填写表单，我们的专业团队将在24小时内与您联系，为您量身定制新媒体运营方案
          </Text>
          <Button
            size="lg"
            bgGradient="linear(to-r, red.500, red.700)"
            color="white"
            _hover={{
              bgGradient: 'linear(to-r, red.600, red.800)',
              transform: 'translateY(-2px)',
              shadow: 'xl'
            }}
            _active={{
              transform: 'translateY(0)',
              shadow: 'lg'
            }}
            transition="all 0.3s ease"
            px={8}
            py={6}
            fontSize="lg"
            fontWeight="bold"
            onClick={onOpen}
          >
            立即咨询
          </Button>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent
          mx={{ base: 0, md: 4 }}
          my={{ base: 0, md: 4 }}
          borderRadius={{ base: 0, md: 'xl' }}
          shadow="2xl"
        >
          <ModalHeader
            bgGradient="linear(to-r, red.500, red.700)"
            color="white"
            borderTopRadius={{ base: 0, md: 'xl' }}
            py={6}
          >
            <Heading size="md">留下您的联系方式</Heading>
            <Text fontSize="sm" fontWeight="normal" mt={2} opacity={0.9}>
              我们将为您提供专业的新媒体运营方案
            </Text>
          </ModalHeader>
          <ModalCloseButton color="white" top={6} right={6} />
          <ModalBody py={8} px={{ base: 6, md: 8 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <VStack spacing={5} align="stretch">
                    <Field name="name">
                      {({ field }) => (
                        <FormControl isInvalid={errors.name && touched.name} isRequired>
                          <FormLabel color="gray.700" fontWeight="medium">
                            姓名
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={FiUser} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              {...field}
                              placeholder="请输入您的姓名"
                              focusBorderColor="red.500"
                            />
                          </InputGroup>
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="phone">
                      {({ field }) => (
                        <FormControl isInvalid={errors.phone && touched.phone} isRequired>
                          <FormLabel color="gray.700" fontWeight="medium">
                            手机号码
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={FiPhone} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="请输入您的手机号码"
                              focusBorderColor="red.500"
                            />
                          </InputGroup>
                          <FormErrorMessage>{errors.phone}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="industry">
                      {({ field }) => (
                        <FormControl isInvalid={errors.industry && touched.industry}>
                          <FormLabel color="gray.700" fontWeight="medium">
                            行业类目
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={FiBriefcase} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              {...field}
                              placeholder="请输入您的行业类目"
                              focusBorderColor="red.500"
                            />
                          </InputGroup>
                          <FormErrorMessage>{errors.industry}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="message">
                      {({ field }) => (
                        <FormControl isInvalid={errors.message && touched.message}>
                          <FormLabel color="gray.700" fontWeight="medium">
                            留言内容
                          </FormLabel>
                          <InputGroup>
                            <Textarea
                              {...field}
                              placeholder="请告诉我们您的需求..."
                              rows={4}
                              focusBorderColor="red.500"
                              resize="vertical"
                            />
                          </InputGroup>
                          <FormErrorMessage>{errors.message}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

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
                      isLoading={isSubmitting || loading.form}
                      loadingText="提交中..."
                      mt={4}
                      fontWeight="bold"
                      transition="all 0.3s ease"
                    >
                      提交咨询
                    </Button>

                    <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
                      提交即表示您同意我们的隐私政策，我们承诺保护您的个人信息安全
                    </Text>
                  </VStack>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormComponent;
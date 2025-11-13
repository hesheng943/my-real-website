import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Spinner,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  VStack,
  HStack,
  Text,
  IconButton,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { EditIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

const ContentManagement = () => {
  const [contents, setContents] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState(null);
  const [editingCase, setEditingCase] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCaseOpen, onOpen: onCaseOpen, onClose: onCaseClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: '未登录',
          description: '请先登录管理后台',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        return;
      }

      const [contentRes, caseRes] = await Promise.all([
        axios.get('/api/admin/content', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/cases', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (contentRes.data && contentRes.data.success) {
        setContents(contentRes.data.data || []);
      } else {
        setContents([]);
      }

      if (caseRes.data && caseRes.data.success) {
        setCases(caseRes.data.data || []);
      } else {
        setCases([]);
      }
    } catch (error) {
      console.error('[ContentManagement] 加载数据失败:', error);
      setContents([]);
      setCases([]);
      
      toast({
        title: '加载失败',
        description: error.response?.data?.message || '获取数据失败',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditContent = (content) => {
    setEditingContent({
      ...content,
      metadata: JSON.stringify(content.metadata || {}, null, 2)
    });
    onOpen();
  };

  const handleAddContent = () => {
    setEditingContent({
      section: '',
      title: '',
      content: '',
      metadata: '{}',
      is_active: true
    });
    onOpen();
  };

  const handleSaveContent = async () => {
    if (!editingContent) return;

    const trimmedSection = editingContent.section?.trim();
    if (!trimmedSection) {
      toast({
        title: '保存失败',
        description: '区块标识不能为空',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: '未登录',
          description: '请先登录管理后台',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        return;
      }

      let metadata = {};
      try {
        metadata = JSON.parse(editingContent.metadata || '{}');
      } catch (e) {
        toast({
          title: '保存失败',
          description: 'metadata格式不正确，请输入有效的JSON',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        return;
      }

      const response = await axios.post(
        '/api/admin/content',
        {
          section: trimmedSection,
          title: editingContent.title?.trim() || '',
          content: editingContent.content?.trim() || '',
          metadata,
          is_active: editingContent.is_active !== false
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data && response.data.success) {
        toast({
          title: '保存成功',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
        fetchData();
        onClose();
      } else {
        toast({
          title: '保存失败',
          description: response.data?.message || '保存内容失败',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      console.error('[ContentManagement] 保存内容失败:', error);
      toast({
        title: '保存失败',
        description: error.response?.data?.message || '保存内容失败',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const handleEditCase = (caseItem) => {
    setEditingCase({
      ...caseItem,
      metrics: JSON.stringify(caseItem.metrics || {}, null, 2)
    });
    onCaseOpen();
  };

  const handleAddCase = () => {
    setEditingCase({
      title: '',
      description: '',
      platform: '',
      image_url: '',
      metrics: '{}',
      display_order: 0,
      is_active: true
    });
    onCaseOpen();
  };

  const handleSaveCase = async () => {
    if (!editingCase) return;

    const trimmedTitle = editingCase.title?.trim();
    if (!trimmedTitle) {
      toast({
        title: '保存失败',
        description: '案例标题不能为空',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: '未登录',
          description: '请先登录管理后台',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        return;
      }

      let metrics = {};
      try {
        metrics = JSON.parse(editingCase.metrics || '{}');
      } catch (e) {
        toast({
          title: '保存失败',
          description: 'metrics格式不正确，请输入有效的JSON',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        return;
      }

      const url = editingCase.id 
        ? `/api/admin/cases/${editingCase.id}`
        : '/api/admin/cases';
      const method = editingCase.id ? 'put' : 'post';

      const response = await axios[method](
        url,
        {
          title: trimmedTitle,
          description: editingCase.description?.trim() || '',
          platform: editingCase.platform?.trim() || '',
          image_url: editingCase.image_url?.trim() || '',
          metrics,
          display_order: parseInt(editingCase.display_order) || 0,
          is_active: editingCase.is_active !== false
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data && response.data.success) {
        toast({
          title: '保存成功',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
        fetchData();
        onCaseClose();
      } else {
        toast({
          title: '保存失败',
          description: response.data?.message || '保存案例失败',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      console.error('[ContentManagement] 保存案例失败:', error);
      toast({
        title: '保存失败',
        description: error.response?.data?.message || '保存案例失败',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm('确定要删除此案例吗？')) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: '未登录',
          description: '请先登录管理后台',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        return;
      }

      const response = await axios.delete(`/api/admin/cases/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        toast({
          title: '删除成功',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
        fetchData();
      } else {
        toast({
          title: '删除失败',
          description: response.data?.message || '删除案例失败',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      console.error('[ContentManagement] 删除案例失败:', error);
      toast({
        title: '删除失败',
        description: error.response?.data?.message || '删除案例失败',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <Spinner size="xl" color="red.500" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box bg={bgColor} p={8} borderRadius="lg" shadow="sm">
      <Heading size="lg" color="red.600" mb={6}>网站内容管理</Heading>

      <Accordion allowMultiple defaultIndex={[0, 1]}>
        <AccordionItem border="1px" borderColor={borderColor} borderRadius="md" mb={4}>
          <h2>
            <AccordionButton 
              _expanded={{ bg: 'red.50', color: 'red.600' }}
              borderRadius="md"
              py={4}
            >
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="md">
                网站内容配置
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} pt={4}>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color="gray.600" fontSize="sm">管理网站各区块的动态内容</Text>
              <Button
                colorScheme="red"
                size="sm"
                leftIcon={<AddIcon />}
                onClick={handleAddContent}
              >
                新增内容
              </Button>
            </Flex>

            <Box overflowX="auto" borderRadius="md" border="1px" borderColor={borderColor}>
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>区块标识</Th>
                    <Th>标题</Th>
                    <Th>内容</Th>
                    <Th>状态</Th>
                    <Th textAlign="center">操作</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contents.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={8}>
                        <Text color="gray.500">暂无数据</Text>
                      </Td>
                    </Tr>
                  ) : (
                    contents.map((content) => (
                      <Tr key={content.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <Badge colorScheme="blue">{content.section}</Badge>
                        </Td>
                        <Td fontWeight="medium" maxW="200px" isTruncated>
                          {content.title || '-'}
                        </Td>
                        <Td maxW="300px" isTruncated fontSize="sm" color="gray.600">
                          {content.content || '-'}
                        </Td>
                        <Td>
                          <Badge colorScheme={content.is_active ? 'green' : 'gray'}>
                            {content.is_active ? '启用' : '禁用'}
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          <Tooltip label="编辑">
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEditContent(content)}
                              aria-label="编辑内容"
                            />
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="1px" borderColor={borderColor} borderRadius="md">
          <h2>
            <AccordionButton 
              _expanded={{ bg: 'red.50', color: 'red.600' }}
              borderRadius="md"
              py={4}
            >
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="md">
                案例管理
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} pt={4}>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color="gray.600" fontSize="sm">管理网站展示的成功案例</Text>
              <Button
                colorScheme="red"
                size="sm"
                leftIcon={<AddIcon />}
                onClick={handleAddCase}
              >
                新增案例
              </Button>
            </Flex>

            <Box overflowX="auto" borderRadius="md" border="1px" borderColor={borderColor}>
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>标题</Th>
                    <Th>平台</Th>
                    <Th>排序</Th>
                    <Th>状态</Th>
                    <Th textAlign="center">操作</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cases.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={8}>
                        <Text color="gray.500">暂无数据</Text>
                      </Td>
                    </Tr>
                  ) : (
                    cases.map((caseItem) => (
                      <Tr key={caseItem.id} _hover={{ bg: 'gray.50' }}>
                        <Td fontWeight="medium" maxW="200px" isTruncated>
                          {caseItem.title}
                        </Td>
                        <Td>
                          <Badge colorScheme="purple">{caseItem.platform}</Badge>
                        </Td>
                        <Td>{caseItem.display_order}</Td>
                        <Td>
                          <Badge colorScheme={caseItem.is_active ? 'green' : 'gray'}>
                            {caseItem.is_active ? '显示' : '隐藏'}
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          <HStack spacing={2} justify="center">
                            <Tooltip label="编辑">
                              <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEditCase(caseItem)}
                                aria-label="编辑案例"
                              />
                            </Tooltip>
                            <Tooltip label="删除">
                              <IconButton
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDeleteCase(caseItem.id)}
                                aria-label="删除案例"
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader 
            bgGradient="linear(to-r, red.500, red.700)" 
            color="white"
            borderTopRadius="md"
          >
            编辑内容
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6}>
            {editingContent && (
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">区块标识</FormLabel>
                  <Input
                    value={editingContent.section || ''}
                    onChange={(e) => setEditingContent({ ...editingContent, section: e.target.value })}
                    placeholder="如: hero, services"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">标题</FormLabel>
                  <Input
                    value={editingContent.title || ''}
                    onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">内容</FormLabel>
                  <Textarea
                    value={editingContent.content || ''}
                    onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                    rows={4}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">元数据 (JSON格式)</FormLabel>
                  <Textarea
                    value={editingContent.metadata || '{}'}
                    onChange={(e) => setEditingContent({ ...editingContent, metadata: e.target.value })}
                    rows={6}
                    fontFamily="monospace"
                    fontSize="sm"
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm" fontWeight="medium">启用状态</FormLabel>
                  <Switch
                    isChecked={editingContent.is_active !== false}
                    onChange={(e) => setEditingContent({ ...editingContent, is_active: e.target.checked })}
                    colorScheme="red"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button colorScheme="red" onClick={handleSaveContent}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isCaseOpen} onClose={onCaseClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader
            bgGradient="linear(to-r, red.500, red.700)" 
            color="white"
            borderTopRadius="md"
          >
            {editingCase?.id ? '编辑案例' : '新增案例'}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6}>
            {editingCase && (
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">案例标题</FormLabel>
                  <Input
                    value={editingCase.title || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">案例描述</FormLabel>
                  <Textarea
                    value={editingCase.description || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, description: e.target.value })}
                    rows={3}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">平台名称</FormLabel>
                  <Input
                    value={editingCase.platform || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, platform: e.target.value })}
                    placeholder="如: 小红书, 抖音"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">图片URL</FormLabel>
                  <Input
                    value={editingCase.image_url || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">数据指标 (JSON格式)</FormLabel>
                  <Textarea
                    value={editingCase.metrics || '{}'}
                    onChange={(e) => setEditingCase({ ...editingCase, metrics: e.target.value })}
                    rows={4}
                    fontFamily="monospace"
                    fontSize="sm"
                    placeholder='{"fans": "50万+", "exposure": "1000万+"}'
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">排序序号</FormLabel>
                  <Input
                    type="number"
                    value={editingCase.display_order || 0}
                    onChange={(e) => setEditingCase({ ...editingCase, display_order: e.target.value })}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm" fontWeight="medium">显示状态</FormLabel>
                  <Switch
                    isChecked={editingCase.is_active !== false}
                    onChange={(e) => setEditingCase({ ...editingCase, is_active: e.target.checked })}
                    colorScheme="red"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCaseClose}>
              取消
            </Button>
            <Button colorScheme="red" onClick={handleSaveCase}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContentManagement;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Spinner,
  Flex,
  Heading,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
  VStack,
  HStack,
  IconButton,
  Tooltip,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon, ViewIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import axios from 'axios';

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const statusColors = {
    new: 'red',
    contacted: 'yellow',
    qualified: 'blue',
    converted: 'green',
    closed: 'gray'
  };

  const statusLabels = {
    new: '新客户',
    contacted: '已联系',
    qualified: '已确认',
    converted: '已转化',
    closed: '已关闭'
  };

  useEffect(() => {
    fetchLeads();
  }, [currentPage, statusFilter]);

  const fetchLeads = async () => {
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

      const response = await axios.get('/api/admin/leads', {
        params: {
          page: currentPage,
          limit: 20,
          status: statusFilter
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setLeads(response.data.data.leads || []);
        setTotalCount(response.data.data.total || 0);
        setTotalPages(Math.ceil((response.data.data.total || 0) / (response.data.data.limit || 20)));
      } else {
        setLeads([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('[LeadsManagement] 获取留咨数据失败:', error);
      setLeads([]);
      setTotalCount(0);
      setTotalPages(1);
      
      toast({
        title: '加载失败',
        description: error.response?.data?.message || '获取留咨数据失败',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
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

      const response = await axios.put(
        `/api/admin/leads/${leadId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.success) {
        toast({
          title: '更新成功',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
        fetchLeads();
      } else {
        toast({
          title: '更新失败',
          description: response.data?.message || '更新状态失败',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      console.error('[LeadsManagement] 更新状态失败:', error);
      toast({
        title: '更新失败',
        description: error.response?.data?.message || '更新状态失败',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const viewLeadDetails = (lead) => {
    setSelectedLead(lead);
    onOpen();
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.industry && lead.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Shanghai'
      });
    } catch (error) {
      return '-';
    }
  };

  return (
    <Box bg={bgColor} p={8} borderRadius="lg" shadow="sm">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="red.600">客户留咨管理</Heading>
        <Button
          colorScheme="red"
          onClick={fetchLeads}
          isLoading={loading}
          size="md"
        >
          刷新数据
        </Button>
      </Flex>

      <Flex gap={4} mb={6} flexDirection={{ base: 'column', md: 'row' }}>
        <InputGroup maxW={{ base: 'full', md: '400px' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="搜索姓名、手机号或行业..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
          />
        </InputGroup>

        <Select
          maxW={{ base: 'full', md: '200px' }}
          placeholder="筛选状态"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          bg="white"
        >
          <option value="new">新客户</option>
          <option value="contacted">已联系</option>
          <option value="qualified">已确认</option>
          <option value="converted">已转化</option>
          <option value="closed">已关闭</option>
        </Select>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" h="400px">
          <Spinner size="xl" color="red.500" thickness="4px" />
        </Flex>
      ) : (
        <>
          <Box overflowX="auto" borderRadius="md" border="1px" borderColor={borderColor}>
            <Table variant="simple" size="md">
              <Thead bg="gray.50">
                <Tr>
                  <Th>姓名</Th>
                  <Th>手机号</Th>
                  <Th>行业类目</Th>
                  <Th>状态</Th>
                  <Th>提交时间</Th>
                  <Th textAlign="center">操作</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredLeads.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={8}>
                      <Text color="gray.500">暂无数据</Text>
                    </Td>
                  </Tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <Tr key={lead.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                      <Td fontWeight="medium">{lead.name}</Td>
                      <Td>{lead.phone}</Td>
                      <Td>{lead.industry || '-'}</Td>
                      <Td>
                        <Select
                          size="sm"
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          w="130px"
                          borderRadius="md"
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td fontSize="sm" color="gray.600">
                        {formatDate(lead.created_at)}
                      </Td>
                      <Td textAlign="center">
                        <Tooltip label="查看详情" placement="top">
                          <IconButton
                            icon={<ViewIcon />}
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => viewLeadDetails(lead)}
                            aria-label="查看详情"
                          />
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>

          <Flex 
            justify="space-between" 
            align="center" 
            mt={6} 
            flexDirection={{ base: 'column', md: 'row' }} 
            gap={4}
          >
            <Text color="gray.600" fontSize="sm">
              共 <Text as="span" fontWeight="bold" color="red.600">{totalCount}</Text> 条记录
              {statusFilter && ` (当前筛选: ${statusLabels[statusFilter]})`}
            </Text>
            <HStack spacing={2}>
              <IconButton
                icon={<ChevronLeftIcon />}
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                isDisabled={currentPage === 1}
                aria-label="上一页"
              />
              <Text px={4} fontSize="sm" fontWeight="medium">
                {currentPage} / {totalPages || 1}
              </Text>
              <IconButton
                icon={<ChevronRightIcon />}
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                isDisabled={currentPage === totalPages || totalPages === 0}
                aria-label="下一页"
              />
            </HStack>
          </Flex>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader 
            bgGradient="linear(to-r, red.500, red.700)" 
            color="white"
            borderTopRadius="md"
          >
            客户详情
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6}>
            {selectedLead && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                    姓名
                  </Text>
                  <Text fontSize="md">{selectedLead.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                    手机号
                  </Text>
                  <Text fontSize="md">{selectedLead.phone}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                    行业类目
                  </Text>
                  <Text fontSize="md">{selectedLead.industry || '未填写'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                    留言内容
                  </Text>
                  <Text 
                    fontSize="md" 
                    whiteSpace="pre-wrap" 
                    bg="gray.50" 
                    p={3} 
                    borderRadius="md"
                    minH="60px"
                  >
                    {selectedLead.message || '无'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                    来源
                  </Text>
                  <Badge colorScheme="purple" fontSize="sm">
                    {selectedLead.source || 'website'}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                    当前状态
                  </Text>
                  <Badge 
                    colorScheme={statusColors[selectedLead.status]} 
                    fontSize="sm"
                    px={3}
                    py={1}
                  >
                    {statusLabels[selectedLead.status]}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={1}>
                    提交时间
                  </Text>
                  <Text fontSize="md">{formatDate(selectedLead.created_at)}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              关闭
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LeadsManagement;
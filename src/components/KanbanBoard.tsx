import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  loadIssuePositions,
  setIssues,
  setStars,
  updateIssuePosition,
} from '../store/issuesSlice';
import { fetchRepoIssues, fetchRepoStars } from '../api/githubApi';
import { Issue, IssueStatus } from '../types/types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { formatNumber } from '../utils/formatNumber';
import KanbanColumn from './KanbanColumn';
import githubIcon from '../assets/github.svg';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  useColorMode,
  useToast
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const KanbanBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const { issues, stars, positions } = useSelector(
    (state: RootState) => state.issues
  );
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const isValidGitHubRepo = (url: string) => {
    const githubRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+$/;
    return githubRegex.test(url);
  };

  const handleLoad = () => {
    if (!isValidGitHubRepo(repoUrl)) {
      toast({
        title: 'Invalid GitHub URL',
        description:
          'Please enter a valid GitHub repository URL (https://github.com/github-name/repo-name).',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    loadIssues();
    loadStars();
    setIsLoaded(true);
  };

  const loadIssues = async () => {
    if (!repoUrl) {
      console.error('Repo URL is required');
      return;
    }
    try {
      const rawIssues = await fetchRepoIssues(repoUrl);
      const mappedIssues = rawIssues.map((issue: Issue) => ({
        id: issue.id,
        title: issue.title,
        state: issue.state,
        assignee: issue.assignee,
        comments: issue.comments,
        created_at: issue.created_at,
        user: issue.user,
      }));

      const initialPositions = { ...(positions[repoUrl] || {}) };

      mappedIssues.forEach((issue: Issue, index: number) => {
        if (!initialPositions[issue.id]) {
          let column: IssueStatus;

          if (issue.state === 'closed') {
            column = 'Done';
          } else if (issue.assignee) {
            column = 'In Progress';
          } else {
            column = 'ToDo';
          }

          initialPositions[issue.id] = { column, index };

          dispatch(
            updateIssuePosition({
              repoUrl,
              id: issue.id,
              column,
              index,
            })
          );
        }
      });

      dispatch(setIssues(mappedIssues));
      dispatch(loadIssuePositions(repoUrl));
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    }
  };

  const loadStars = async () => {
    try {
      const stars = await fetchRepoStars(repoUrl);
      dispatch(setStars(stars));
    } catch (error) {
      console.error('Failed to fetch stars:', error);
    }
  };

  const moveIssue = (
    draggedId: number,
    fromIndex: number,
    toIndex: number,
    fromColumn: IssueStatus,
    toColumn: IssueStatus
  ) => {
    const draggedIssue = issues.find((issue) => issue.id === draggedId);
    if (!draggedIssue) return;

    const updatedPositions: Record<
      number,
      { column: IssueStatus; index: number }
    > = {
      ...(positions[repoUrl] || {}),
    };

    const columns: Record<IssueStatus, Issue[]> = {
      ToDo: [],
      'In Progress': [],
      Done: [],
    };

    issues.forEach((issue) => {
      const col = positions[repoUrl]?.[issue.id]?.column || 'ToDo';
      columns[col as IssueStatus].push(issue);
    });

    const [movedIssue] = columns[fromColumn].splice(fromIndex, 1);
    columns[toColumn].splice(toIndex, 0, movedIssue);

    (Object.keys(columns) as Array<IssueStatus>).forEach((column) => {
      columns[column].forEach((issue, index) => {
        updatedPositions[issue.id] = { column, index };
      });
    });

    dispatch(
      setIssues([...columns.ToDo, ...columns['In Progress'], ...columns.Done])
    );
    dispatch(
      updateIssuePosition({
        repoUrl,
        id: draggedId,
        column: toColumn,
        index: toIndex,
      })
    );

    localStorage.setItem(
      `issuePositions-${repoUrl}`,
      JSON.stringify(updatedPositions)
    );
  };

  useEffect(() => {
    if (repoUrl) {
      dispatch(loadIssuePositions(repoUrl));
    }
  }, [dispatch, repoUrl]);

  return (
    <Box maxW="1200px" mx="auto" p="6">
      <Flex justify="center" align="center" mb="6" position="relative">
        <Heading as="h1" size="lg" textAlign="center">
          Kanban Board
        </Heading>
        <IconButton
          position="absolute"
          right="0"
          aria-label="Toggle theme"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          colorScheme="blue"
        />
      </Flex>
      <Flex gap="4" mb="2" p="4">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <img
              src={githubIcon}
              alt="GitHub Icon"
              width="20px"
              height="20px"
            />
          </InputLeftElement>
          <Input
            variant="filled"
            placeholder="Enter GitHub Repo URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 2px #4299E1' }}
            transition="0.2s ease-in-out"
          />
        </InputGroup>
        <Button
          colorScheme="blue"
          onClick={handleLoad}
          _hover={{ transform: 'scale(1.05)' }}
          transition="0.2s ease-in-out"
        >
          Load Issues
        </Button>
      </Flex>
      <DndProvider backend={HTML5Backend}>
        <Box p="4">
          {isLoaded && repoUrl && repoUrl.includes('github.com/') && (
            <Flex align="center" mb="4" gap="4">
              <Flex gap="2" align="center" fontSize="lg">
                <Link
                  href={`https://github.com/${repoUrl.split('github.com/')[1].split('/')[0]}`}
                  isExternal
                  fontWeight="bold"
                  color="blue.500"
                  _hover={{ textDecoration: 'underline' }}
                >
                  {repoUrl
                    .split('github.com/')[1]
                    .split('/')[0]
                    .charAt(0)
                    .toUpperCase() +
                    repoUrl.split('github.com/')[1].split('/')[0].slice(1)}
                </Link>
                <Text>{'>'}</Text>
                <Link
                  href={`https://github.com/${repoUrl.split('github.com/')[1]}`}
                  isExternal
                  fontWeight="bold"
                  color="blue.500"
                  _hover={{ textDecoration: 'underline' }}
                >
                  {repoUrl
                    .split('github.com/')[1]
                    .split('/')[1]
                    .charAt(0)
                    .toUpperCase() +
                    repoUrl.split('github.com/')[1].split('/')[1].slice(1)}
                </Link>
              </Flex>
              <Text fontSize="lg" fontWeight="bold">
                {' '}
                ⭐ {formatNumber(stars)} stars{' '}
              </Text>
            </Flex>
          )}
          <Flex gap="4" wrap="wrap">
            {['ToDo', 'In Progress', 'Done'].map((column) => (
              <Box
                key={column}
                flex="1"
                minW="300px"
                borderRadius="md"
                minH="400px"
              >
                <KanbanColumn
                  key={column}
                  column={column as IssueStatus}
                  issues={issues.filter(
                    (issue) => positions[repoUrl]?.[issue.id]?.column === column
                  )}
                  moveIssue={moveIssue}
                />
              </Box>
            ))}
          </Flex>
        </Box>
      </DndProvider>
    </Box>
  );
};

export default KanbanBoard;

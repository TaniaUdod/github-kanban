import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IssueCardProps, IssueStatus, ItemType } from '../types/types';
import { calculateDaysAgo } from '../utils/calculateDaysAgo';
import { Badge, Box, Heading, HStack, Text } from '@chakra-ui/react';

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  index,
  column,
  moveIssue,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.ISSUE,
    item: { id: issue.id, index, fromColumn: column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.ISSUE,
    hover: (draggedItem: {
      id: number;
      index: number;
      fromColumn: IssueStatus;
    }) => {
      if (draggedItem.id !== issue.id && draggedItem.fromColumn === column) {
        const newIndex = index;
        if (draggedItem.index !== newIndex) {
          moveIssue(
            draggedItem.id,
            draggedItem.index,
            newIndex,
            draggedItem.fromColumn,
            column
          );
          draggedItem.index = newIndex;
        }
      }
    },
  });

  drag(drop(ref));

  return (
    <Box
      ref={ref}
      opacity={isDragging ? 0.5 : 1}
      bg="white"
      p={4}
      my={2}
      borderRadius="md"
      boxShadow="md"
      cursor="grab"
    >
      <Heading size="sm" mb={2}>
        {issue.title}
      </Heading>
      <Text fontSize="sm">
        #{issue.id} opened {calculateDaysAgo(issue.created_at)} days ago
      </Text>
      <HStack spacing={2} mt={2}>
        <Badge colorScheme="blue">{issue.user?.login}</Badge>
        <Text fontWeight="bold" alignSelf="center">
          |
        </Text>
        <Badge colorScheme="gray">Comments: {issue.comments}</Badge>
      </HStack>
    </Box>
  );
};

export default IssueCard;

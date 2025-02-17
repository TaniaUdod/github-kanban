import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { IssueStatus, ItemType, KanbanColumnProps } from '../types/types';
import IssueCard from './IssueCard';
import { Text, VStack } from '@chakra-ui/react';

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  issues,
  moveIssue,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemType.ISSUE,
    drop: (draggedItem: {
      id: number;
      index: number;
      fromColumn: IssueStatus;
    }) => {
      if (draggedItem.fromColumn !== column) {
        moveIssue(
          draggedItem.id,
          draggedItem.index,
          issues.length,
          draggedItem.fromColumn,
          column
        );
        draggedItem.fromColumn = column;
      }
    },
  });

  drop(ref);

  return (
    <VStack
      ref={ref}
      flex={1}
      p={4}
      bg="gray.100"
      borderRadius="md"
      w="100%"
      align="stretch"
    >
      <Text fontSize="lg" fontWeight="bold" textAlign="center">
        {column}
      </Text>
      {issues.map((issue, index) => (
        <IssueCard
          key={`${issue.id}-${column}`}
          issue={issue}
          index={index}
          column={column}
          moveIssue={moveIssue}
        />
      ))}
    </VStack>
  );
};

export default KanbanColumn;

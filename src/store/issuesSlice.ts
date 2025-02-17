import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Issue, IssueStatus } from '../types/types';

interface IssuesState {
  issues: Issue[];
  stars: number;
  positions: Record<
    string,
    Record<string | number, { column: IssueStatus; index: number }>
  >;
}

const initialState: IssuesState = {
  issues: [],
  stars: 0,
  positions: {},
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setIssues(state, action: PayloadAction<Issue[]>) {
      state.issues = action.payload;
    },

    setStars(state, action: PayloadAction<number>) {
      state.stars = action.payload;
    },

    updateIssuePosition(
      state,
      action: PayloadAction<{
        repoUrl: string;
        id: string | number;
        column: IssueStatus;
        index: number;
      }>
    ) {
      const { repoUrl, id, column, index } = action.payload;

      if (!state.positions[repoUrl]) {
        state.positions[repoUrl] = {};
      }

      state.positions[repoUrl][id] = { column, index };

      localStorage.setItem(
        `issuePositions-${repoUrl}`,
        JSON.stringify(state.positions[repoUrl])
      );
    },

    loadIssuePositions(state, action: PayloadAction<string>) {
      const repoUrl = action.payload;
      const savedPositions = localStorage.getItem(`issuePositions-${repoUrl}`);

      if (savedPositions) {
        try {
          const parsedPositions = JSON.parse(savedPositions) as Record<
            string | number,
            { column: IssueStatus; index: number }
          >;

          state.positions[repoUrl] = parsedPositions;

          state.issues = [...state.issues].sort(
            (a, b) =>
              (parsedPositions[a.id]?.index ?? 0) -
              (parsedPositions[b.id]?.index ?? 0)
          );
        } catch (error) {
          console.error('Error parsing issue positions:', error);
          state.positions[repoUrl] = {};
        }
      } else {
        state.positions[repoUrl] = {};
      }
    },
  },
});

export const { setIssues, setStars, updateIssuePosition, loadIssuePositions } =
  issuesSlice.actions;
export const issuesReducer = issuesSlice.reducer;

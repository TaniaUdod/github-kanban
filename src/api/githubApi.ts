import axios from 'axios';

export const fetchRepoIssues = async (repoUrl: string) => {
  const repoPath = repoUrl.replace('https://github.com/', '');
  const response = await axios.get(
    `https://api.github.com/repos/${repoPath}/issues?state=all`
  );
  return response.data;
};

export const fetchRepoStars = async (repoUrl: string) => {
  const repoPath = repoUrl.replace('https://github.com/', '');
  const response = await axios.get(`https://api.github.com/repos/${repoPath}`);
  return response.data.stargazers_count;
};

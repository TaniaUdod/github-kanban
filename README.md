# GitHub Kanban

A simple and interactive Kanban Board for managing GitHub repository issues. Users can fetch issues from any public GitHub repository and organize them into three columns: "To Do", "In Progress", and "Done". The board supports drag-and-drop functionality and persists issue positions using LocalStorage.

## 🚀 Features

- Load GitHub repository issues dynamically
- Drag and drop issues between "To Do", "In Progress", and "Done" columns
- Store issue positions persistently using LocalStorage
- Display repository star count
- Responsive and modern UI using Chakra UI

## 🛠️ Technologies Used

- **React** with **TypeScript**
- **Redux Toolkit** for state management
- **react-dnd** for drag-and-drop functionality
- **Chakra UI** for styling and UI components
- **GitHub API** for fetching repository issues and stars

## 📦 Installation

1. Clone this repository:
```bash
git clone https://github.com/TaniaUdod/github-kanban.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm run dev
```

### Live Demo
You can view the live demo of the project at [Demo Link](https://taniaudod.github.io/github-kanban/).

## 🔧 Usage

1. Enter a valid GitHub repository URL (e.g., https://github.com/facebook/react).
2. Click "Load Issues" to fetch issues from the repository.
3. Drag and drop issues between the columns:
- **ToDo** (open issues with no assignee)
- **In Progress** (open issues assigned to someone)
- **Done** (closed issues)
4. The board automatically saves positions in LocalStorage.
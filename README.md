# Chronos - Workflow Management Suite

Chronos is a professional task management and workflow tracking platform designed with high information density, low latency interaction, and a modern clean design. Powered by Node.js, Express, and React, Chronos offers a highly interactive experience for organizing day-to-day tasks, projecting milestones on a project timeline, and auditing progress with statistical analytics.

## Features

- **Constellation Canvas Background**: An interactive network layout on the landing page that dynamically responds to cursor movement.
- **Active Task Stream**: Create, edit, search, filter, and sort tasks with high responsiveness. Update task status inline using simple interactive controls.
- **Milestone Archive View**: Archive completed milestones dynamically, with quick-restore checkboxes and permanent deletion tools.
- **Statistical Analytics**: Priority distribution graphs, status counters, and work completion rating calculators.
- **Local Memory Store**: Highly responsive in-memory database store, running with zero external database engine dependencies.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: Local In-Memory Store

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or above recommended)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Avenger11764/Task-tracker.git
   cd Task-tracker
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

To run the full stack locally:

1. **Start the Express API Server**:
   ```bash
   cd backend
   npm start
   ```
   The API will be available at `http://localhost:5000`.

2. **Start the Frontend Dev Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

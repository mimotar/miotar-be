// Define user type
interface User {
  userId: number;
}

// Extend the Socket interface to include the user type
declare module 'socket.io' {
  interface Socket {
    user: User;
  }
}

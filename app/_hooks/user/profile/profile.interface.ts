export interface IProfile {
  _id: string;
  email: string;
  successCount: number;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
  lastLoggedIn: string;
  bio: string;
  profileImage: string;
  username: string;
  followersCount: number;
  followingCount: number;
  isCurrentUser: boolean;
  isFollowing: boolean;
  followingUs: boolean;
  walletAddress: string;
  balance?: string;
}

export interface IMiniProfile {
  _id: string;
  username: string;
  bio: string;
  profileImage: string;
  isFollowing: boolean;
  followingUs: boolean;
  isCurrentUser: boolean;
}

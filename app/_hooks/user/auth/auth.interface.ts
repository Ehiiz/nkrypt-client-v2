export interface IUser {
  id: string;
  email: string;
  username: string;
  deleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  profileImage: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  completedSetup: boolean;
}

export interface IRequestAuth {
  email: string;
  password: string;
}

export interface IRequestAuthResetPassword extends IRequestAuth {
  code: string;
}

export interface IRequestAuthAccountVerification
  extends Pick<IRequestAuth, "email"> {
  code: string;
}

export type IRequestAuthEmailVerification = Pick<IRequestAuth, "email">;

export interface IRequestCompleteSetup {
  username: string;
  bio: string;
  profileImage: string;
}

//Response

export interface IResponseAuthSignup {
  email: string;
}

export interface IResponseAuthLogin {
  token: string;
  user: IStudent;
  completedSetup?: boolean | null;
}

export interface IResponseAuthEmailVerification
  extends Omit<IRequestAuthResetPassword, "password"> {
  status: boolean;
}

export type IResponseAuthAccountVerification = IResponseAuthEmailVerification;

export interface IResponseAuthResetPassword {
  verified: boolean;
}

export type IResponseAuthCompleteSetup = Omit<IResponseAuthLogin, "token">;

//Others
export interface IStudent {
  _id: string;
  email: string;
  phoneNumber?: string;
  courseList: string[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  middleName: string;
  profileImageUrl: string;
  studentInfo?: {
    dateOfBirth: string;
    institution: string;
    matricNumber: string;
  };
  completedSetup: boolean;
}

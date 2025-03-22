export enum KryptTypeEnum {
  NO_LOCK = "no lock",
  PASSCODE = "passcode",
  QUIZ = "quiz",
  MULTPLE_CHOICE = "multiple_choice",
}

export interface IRequestCreateKrypt {
  title: string;
  description: string;
  content: string[];
  type: KryptTypeEnum;
  draft: boolean;
  questions: {
    question: string;
    answers: string;
    options: string;
    index: number;
  }[];
}

export interface IKryptsReponse {
  krypts: IReponseFormattedKrypt[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IResponseCreateKrypt {
  title: string;
  description: string;
  content: string[];
  successCount: number;
  failureCount: number;
  commentCount: number;
  type: KryptTypeEnum;
  creator: string;
  draft: boolean;
  deleted: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IResponseUnlockKrypt {
  success: boolean;
  message: string;
}

export interface IReponseFormattedKrypt {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  successCount: number;
  failureCount: number;
  commentCount: number;
  type: KryptTypeEnum;
  createdAt: string;
  updatedAt: string;
  draft?: boolean;
  isOwner?: boolean;
  isDekrypted?: boolean;
  hasAccess?: boolean;
  creatorName: string;
  creatorId: string;
  creatorImage: string;
}

export interface IResponseFormattedUnlockedKrypt {
  id: string;
  title: string;
  description: string;
  content: string[];
  successCount: number;
  failureCount: number;
  commentCount: number;
  creatorName: string;
  creatorId: string;
  creatorImage: string;
  createdAt?: string;
}

export interface IComment {
  _id: string;
  createdAt: string;
  updatedAt: string;
  commenterId: string;
  commenterName: string;
  commenterImage: string;
}

export interface IRequestComment {
  comment: string;
}

export interface IRequestPublishKrypt {
  draft: boolean;
}

export interface IRequestUnlockKrypt {
  answers: string[];
}

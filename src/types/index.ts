export type user = {
  // status 0 as disabled for some time
  // status 1 normal
  status: 0 | 1;
  // if userTimeout is > 0 status is 0
  // userTimeout is checked for every request of the current user
  userTimeout: number | string;
  sessionID: string;
  fileSizeContained: number;
};

export type file = {
  expiration: number | string;
  ownerId: string;
  fileBuffer: ArrayBufferLike;
};

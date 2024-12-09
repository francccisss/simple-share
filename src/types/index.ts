export type user = {
  // status 0 as disabled for some time
  // status 1 normal
  status: 0 | 1;
  userTimeout: number | string;
  sessionID: string;
  fileSizeContained: number;
};

export type file = {
  expiration: number | string;
  ownerID: string;
  fileBuffer: Buffer;
  fileID: string;
};

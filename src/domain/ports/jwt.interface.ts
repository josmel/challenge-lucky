export interface UserInfo {
  username: string;
  userid: string;
}

export interface SecurityJwt {
  sign(data: UserInfo): Promise<string | object>;
  verify(token: string): UserInfo;
}

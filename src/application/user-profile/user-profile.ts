export class UserProfile {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly address: AddressInfo,
  ) {}
}

export class AddressInfo {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly country: string,
  ) {}
}

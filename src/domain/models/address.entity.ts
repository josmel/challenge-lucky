export class Address {
  id: string;
  street: string;
  cityid: string;

  constructor(id: string, street: string, cityid: string) {
    this.id = id;
    this.street = street;
    this.cityid = cityid;
  }
}

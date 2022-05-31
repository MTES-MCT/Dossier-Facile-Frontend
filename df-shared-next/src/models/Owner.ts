export class Owner {
  id?: number;
  name?: string;
  rentCost?: number;
  owner!: {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

import { faker } from "@faker-js/faker";

/**
 * Represents a user's authentication credentials
 * @interface User
 * @property {string} username - The user's username
 * @property {string} password - The user's password
 * @property {string} serviceId - The service identifier
 */
interface User {
  username: string;
  password: string;
  serviceId: string;
}

/**
 * Mock user data with randomly generated credentials
 * Used for testing authentication flows
 */
export const user: User = {
  username: faker.internet.username(),
  password: faker.internet.password(),
  serviceId: faker.string.nanoid(10),
};
